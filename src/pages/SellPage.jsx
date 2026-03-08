import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Upload, X, CheckCircle2, Plus, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { upsertUserProfile, insertProduct, uploadProductImage } from '../lib/supabase'
import AuthModal from '../components/AuthModal'

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML']
const YEARS = ['1', '2', '3', '4']
const CATEGORIES = ['electronics', 'books', 'clothing', 'furniture', 'sports', 'other']

export default function SellPage() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)
  const [step, setStep] = useState('type')
  const [sellerType, setSellerType] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [productLoading, setProductLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const [profileForm, setProfileForm] = useState({ username: '', contact_number: '', whatsapp_number: '', email: '', year: '', department: '', city: '', occupation: '' })
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', category: '' })

  useEffect(() => {
    if (!user) { setShowAuth(true); return }
    if (profile?.user_type) { setSellerType(profile.user_type); setStep('product') }
  }, [user, profile])

  const handleTypeSelect = (type) => { setSellerType(type); setStep('profile') }

  const handleProfileSubmit = async () => {
    setError('')
    if (!profileForm.username || !profileForm.contact_number || !profileForm.whatsapp_number) { setError('Please fill in all required fields'); return }
    setProfileLoading(true)
    const data = { id: user.id, username: profileForm.username, contact_number: profileForm.contact_number, whatsapp_number: profileForm.whatsapp_number, email: profileForm.email || user.email || '', user_type: sellerType, ...(sellerType === 'student' ? { year: profileForm.year, department: profileForm.department } : { city: profileForm.city, occupation: profileForm.occupation }) }
    const { error: err } = await upsertUserProfile(data)
    setProfileLoading(false)
    if (err) { setError(err.message); return }
    await refreshProfile()
    setStep('product')
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const MAX_IMAGES = 3
    const MAX_SIZE_BYTES = 3 * 1024 * 1024

    const oversized = files.filter(f => f.size > MAX_SIZE_BYTES)
    if (oversized.length > 0) {
      setError('Each image must be under 3MB. Please choose a smaller image.')
      return
    }
    if (images.length + files.length > MAX_IMAGES) {
      setError('You can only upload up to 3 images per product.')
      return
    }
    setError('')
    setImages((p) => [...p, ...files])
    files.forEach((file) => { const r = new FileReader(); r.onload = (ev) => setImagePreviews((p) => [...p, ev.target.result]); r.readAsDataURL(file) })
  }

  const removeImage = (idx) => { setImages((p) => p.filter((_, i) => i !== idx)); setImagePreviews((p) => p.filter((_, i) => i !== idx)) }

  const handleProductSubmit = async () => {
    setError('')
    if (!productForm.name || !productForm.price) { setError('Product name and price are required'); return }
    setProductLoading(true)
    const uploadedUrls = []
    for (const file of images) { const { url } = await uploadProductImage(file, user.id); if (url) uploadedUrls.push(url) }
    const { error: err } = await insertProduct({ seller_id: user.id, name: productForm.name, description: productForm.description, price: Number(productForm.price), category: productForm.category || 'other', images: uploadedUrls, is_active: true })
    setProductLoading(false)
    if (err) { setError(err.message); return }
    setStep('done')
  }

  const pf = (k) => (e) => setProfileForm((p) => ({ ...p, [k]: e.target.value }))
  const pr = (k) => (e) => setProductForm((p) => ({ ...p, [k]: e.target.value }))

  const stepLabels = { type: 'Seller Type', profile: 'Your Details', product: 'Product Info' }
  const stepNums = ['type', 'profile', 'product']
  const stepIdx = stepNums.indexOf(step)

  if (showAuth && !user) return <AuthModal onClose={() => navigate('/')} onSuccess={() => setShowAuth(false)} />

  return (
    <div className="max-w-lg mx-auto">
      {step !== 'done' && (
        <>
          {/* Back */}
          <button onClick={() => step === 'type' ? navigate('/') : setStep(stepNums[stepIdx - 1])} className="flex items-center gap-2 text-gray-600 font-body text-sm mb-5 hover:text-gray-900 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>

          {/* Step bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-body text-gray-400">Step {stepIdx + 1} of 3</p>
              <p className="text-xs font-body font-medium text-gray-600">{stepLabels[step]}</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-purple-600 h-1.5 rounded-full transition-all duration-500" style={{width: `${((stepIdx + 1) / 3) * 100}%`}} />
            </div>
          </div>
        </>
      )}

      {/* STEP: TYPE */}
      {step === 'type' && (
        <div className="section-card animate-fade-up p-6">
      <h1 className="font-display font-bold text-gray-900 text-xl mb-1">Are you an <span className="sr-only">Asansol Engineering College </span>AEC Student?</h1>
          <p className="text-gray-500 text-sm font-body mb-6">This helps us categorize your listing appropriately</p>
          <div className="space-y-3">
            <button onClick={() => handleTypeSelect('student')} className={`w-full flex items-center px-4 py-3.5 rounded-xl border-2 transition-all ${sellerType === 'student' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
              <span className="font-body font-medium text-gray-800 text-sm">Yes, I'm an AEC Student</span>
            </button>
            <button onClick={() => handleTypeSelect('external')} className={`w-full flex items-center px-4 py-3.5 rounded-xl border-2 transition-all ${sellerType === 'external' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
              <span className="font-body font-medium text-gray-800 text-sm">No, I'm an External User</span>
            </button>
          </div>
          <button onClick={() => sellerType && setStep('profile')} disabled={!sellerType} className={`mt-5 btn-primary ${!sellerType ? 'opacity-40 cursor-not-allowed' : ''}`}>
            Continue
          </button>
        </div>
      )}

      {/* STEP: PROFILE */}
      {step === 'profile' && (
        <div className="section-card animate-fade-up p-6">
          <h2 className="font-display font-bold text-gray-900 text-xl mb-1">{sellerType === 'student' ? 'Student Details' : 'Your Details'}</h2>
          <p className="text-gray-500 text-sm font-body mb-5">Set up your seller profile</p>
          {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="label">{sellerType === 'student' ? 'Username *' : 'Full Name *'}</label>
              <input className="input" placeholder={sellerType === 'student' ? 'Your username' : 'Your full name'} value={profileForm.username} onChange={pf('username')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Contact *</label><input className="input" placeholder="Phone" value={profileForm.contact_number} onChange={pf('contact_number')} /></div>
              <div><label className="label">WhatsApp *</label><input className="input" placeholder="WhatsApp" value={profileForm.whatsapp_number} onChange={pf('whatsapp_number')} /></div>
            </div>
            <div><label className="label">Email</label><input className="input" type="email" placeholder="your@email.com" value={profileForm.email} onChange={pf('email')} /></div>
            {sellerType === 'student' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Department</label>
                  <select className="input" value={profileForm.department} onChange={pf('department')}>
                    <option value="">Select dept</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Year</label>
                  <select className="input" value={profileForm.year} onChange={pf('year')}>
                    <option value="">Select year</option>
                    {YEARS.map((y) => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">City</label><input className="input" placeholder="Your city" value={profileForm.city} onChange={pf('city')} /></div>
                <div><label className="label">Occupation</label><input className="input" placeholder="Optional" value={profileForm.occupation} onChange={pf('occupation')} /></div>
              </div>
            )}
          </div>
          <button onClick={handleProfileSubmit} disabled={profileLoading} className="btn-primary mt-5">
            {profileLoading ? <Loader2 size={16} className="animate-spin" /> : null} Save & Continue
          </button>
        </div>
      )}

      {/* STEP: PRODUCT */}
      {step === 'product' && (
        <div className="section-card animate-fade-up p-6">
          <h2 className="font-display font-bold text-gray-900 text-xl mb-1">List a Product</h2>
          <p className="text-gray-500 text-sm font-body mb-5">Add your item to the marketplace</p>
          {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">{error}</div>}
          <div className="space-y-4">
            <div><label className="label">Product Name *</label><input className="input" placeholder="What are you selling?" value={productForm.name} onChange={pr('name')} /></div>
            <div><label className="label">Description</label><textarea className="input resize-none" rows={3} placeholder="Describe your product..." value={productForm.description} onChange={pr('description')} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Price (₹) *</label><input className="input" type="number" placeholder="0" value={productForm.price} onChange={pr('price')} /></div>
              <div>
                <label className="label">Category</label>
                <select className="input" value={productForm.category} onChange={pr('category')}>
                  <option value="">Select</option>
                  {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Product Images</label>
              <div className="flex flex-wrap gap-2">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center">
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-400 flex flex-col items-center justify-center cursor-pointer transition-colors group bg-gray-50">
                    <Plus size={18} className="text-gray-400 group-hover:text-purple-500" />
                    <span className="text-gray-300 text-[9px] mt-1 group-hover:text-purple-400">Add</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                  </label>
                )}
                <p className="w-full text-xs text-gray-400 mt-1">Max 3 images · 3MB each</p>
              </div>
            </div>
          </div>
          <button onClick={handleProductSubmit} disabled={productLoading} className="btn-primary mt-5">
            {productLoading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {productLoading ? 'Uploading...' : 'List Product'}
          </button>
        </div>
      )}

      {/* DONE */}
      {step === 'done' && (
        <div className="section-card text-center py-12 p-6 animate-scale-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <h2 className="font-display font-bold text-gray-900 text-2xl mb-2">Product Listed!</h2>
          <p className="text-gray-500 font-body text-sm mb-6">Your item is now live on the marketplace.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStep('product'); setProductForm({ name: '', description: '', price: '', category: '' }); setImages([]); setImagePreviews([]) }} className="btn-outline flex-1 max-w-[140px]">List Another</button>
            <button onClick={() => navigate('/')} className="btn-primary flex-1 max-w-[160px]">View Marketplace</button>
          </div>
        </div>
      )}
    </div>
  )
}

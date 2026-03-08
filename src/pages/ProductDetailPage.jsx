import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, User, Calendar, Building2, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase, toggleLike, isLiked, logWhatsappClick } from '../lib/supabase'

export default function ProductDetailPage({ onRequireAuth }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('products')
        .select('*, users(username, user_type, department, year, whatsapp_number, contact_number, city)')
        .eq('id', id)
        .single()
      setProduct(data)
      setLoading(false)
      if (user && data) {
        isLiked(user.id, data.id).then(setLiked)
      }
    }
    fetch()
  }, [id, user])

  const handleLike = async () => {
    if (!user) { onRequireAuth?.(); return }
    await toggleLike(user.id, product.id)
    setLiked((p) => !p)
  }

  const handleWhatsApp = async () => {
    if (!user) { onRequireAuth?.(); return }
    const seller = product.users
    const buyerName = profile?.username || user.email || 'Buyer'
    const userType = profile?.user_type === 'student' ? 'AEC Student' : 'External User'
    const year = profile?.year ? `\nYear: ${profile.year}` : ''
    const dept = profile?.department ? `\nDepartment: ${profile.department}` : ''
    const message = `Hello, I am interested in the item: ${product.name}\nBuyer Name: ${buyerName}\nUser Type: ${userType}${year}${dept}`
    const waNumber = seller?.whatsapp_number?.replace(/\D/g, '')
    if (waNumber) {
      await logWhatsappClick(user.id, product.id, product.seller_id)
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank')
    }
  }

  if (loading) return (
    <div className="space-y-4 animate-pulse2">
      <div className="w-24 h-8 bg-gray-200 rounded-xl" />
      <div className="w-full bg-gray-200 rounded-2xl" style={{aspectRatio:'4/3'}} />
      <div className="h-6 bg-gray-200 rounded-xl w-2/3" />
      <div className="h-10 bg-gray-200 rounded-xl w-1/3" />
    </div>
  )

  if (!product) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Product not found</p>
      <button onClick={() => navigate('/')} className="mt-4 text-purple-600 font-medium">← Back to Marketplace</button>
    </div>
  )

  const seller = product.users
  const images = product.images || []

  return (
    <div className="pb-24">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 font-body text-sm mb-4 hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Image Carousel */}
      <div className="relative w-full bg-gray-100 rounded-2xl overflow-hidden mb-4" style={{aspectRatio:'4/3'}}>
        {images.length > 0 ? (
          <>
            <img src={images[imgIndex]} alt={product.name} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                  <ChevronLeft size={16} className="text-gray-700" />
                </button>
                <button onClick={() => setImgIndex((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                  <ChevronRight size={16} className="text-gray-700" />
                </button>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {images.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIndex ? 'bg-gray-900' : 'bg-gray-400'}`} />)}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
        )}
      </div>

      {/* Title & Price */}
      <div className="flex items-start justify-between mb-2">
        <h1 className="font-display font-bold text-gray-900 text-2xl leading-tight flex-1 pr-4">{product.name}</h1>
        <button onClick={handleLike} className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:border-rose-300 transition-colors mt-1">
          <Heart size={18} className={liked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
        </button>
      </div>

      {/* Tags */}
      {(product.category || product.condition) && (
        <div className="flex gap-2 mb-3">
          {product.condition && <span className="badge-tag">{product.condition}</span>}
          {product.category && <span className="badge-tag capitalize">{product.category}</span>}
        </div>
      )}

      {/* Price */}
      <p className="font-display font-bold text-gray-900 text-3xl mb-5">
        ₹{Number(product.price).toLocaleString('en-IN')}
      </p>

      {/* Description */}
      {product.description && (
        <div className="section-card">
          <h2 className="font-display font-semibold text-gray-900 text-sm mb-2">Description</h2>
          <p className="text-gray-600 text-sm font-body leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Seller Details */}
      <div className="section-card">
        <h2 className="font-display font-semibold text-gray-900 text-sm mb-3">Seller Details</h2>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <User size={15} className="text-gray-500" />
            </div>
            <div>
              <p className="font-body font-semibold text-gray-900 text-sm">{seller?.username || 'Unknown'}</p>
              <p className="text-gray-400 text-xs">
                {seller?.user_type === 'student' ? 'AEC Student' : 'External Seller'}
              </p>
            </div>
          </div>

          {seller?.user_type === 'student' && seller?.year && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Calendar size={15} className="text-gray-500" />
              </div>
              <p className="font-body text-gray-700 text-sm">
                {seller.year}{seller.year === '1' ? 'st' : seller.year === '2' ? 'nd' : seller.year === '3' ? 'rd' : 'th'} Year
              </p>
            </div>
          )}

          {seller?.user_type === 'student' && seller?.department && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Building2 size={15} className="text-gray-500" />
              </div>
              <p className="font-body text-gray-700 text-sm">{seller.department}</p>
            </div>
          )}

          {seller?.user_type === 'external' && seller?.city && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Building2 size={15} className="text-gray-500" />
              </div>
              <p className="font-body text-gray-700 text-sm">{seller.city}</p>
            </div>
          )}

          {seller?.contact_number && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Phone size={15} className="text-gray-500" />
              </div>
              <p className="font-body text-gray-700 text-sm">+91 {seller.contact_number}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky WhatsApp Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100" style={{boxShadow:'0 -4px 20px rgba(0,0,0,0.08)'}}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2.5 bg-gray-900 hover:bg-gray-800 text-white font-body font-semibold py-3.5 rounded-2xl transition-all active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Contact Seller on WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

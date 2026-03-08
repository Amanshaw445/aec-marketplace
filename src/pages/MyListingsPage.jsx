import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Package, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserProducts, deleteProduct } from '../lib/supabase'

export default function MyListingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/'); return }
    getUserProducts(user.id).then(({ data }) => { setProducts(data || []); setLoading(false) })
  }, [user])

  const handleDelete = async (id) => {
    if (!confirm('Remove this listing?')) return
    await deleteProduct(id)
    setProducts((p) => p.filter((item) => item.id !== id))
  }

  if (!user) return null

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 font-body text-sm hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
          <Package size={20} className="text-purple-600" />
        </div>
        <div>
          <h1 className="font-display font-bold text-gray-900 text-xl">My Listings</h1>
          <p className="text-gray-400 text-sm font-body">{products.length} products listed</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-4 flex gap-4 animate-pulse2">
              <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2"><div className="h-4 bg-gray-100 rounded w-2/3" /><div className="h-3 bg-gray-100 rounded w-1/3" /></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="font-display font-semibold text-gray-500 text-lg">No listings yet</h3>
          <p className="text-gray-400 text-sm font-body mt-1">Start selling something today</p>
          <button onClick={() => navigate('/sell')} className="mt-6 bg-gray-900 text-white font-body font-semibold px-6 py-2.5 rounded-xl">List a Product</button>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="card p-4 flex gap-4 items-center">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                <p className="text-gray-900 font-display font-bold text-base mt-0.5">₹{Number(product.price).toLocaleString('en-IN')}</p>
                <p className="text-gray-400 text-xs font-body capitalize">{product.category} · {new Date(product.created_at).toLocaleDateString('en-IN')}</p>
              </div>
              <button onClick={() => handleDelete(product.id)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors group shrink-0">
                <Trash2 size={16} className="text-gray-300 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

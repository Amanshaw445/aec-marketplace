import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getLikes } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

export default function LikedPage({ onRequireAuth }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [liked, setLiked] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/'); return }
    getLikes(user.id).then(({ data }) => { setLiked(data || []); setLoading(false) })
  }, [user])

  if (!user) return null

  return (
    <div className="space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 font-body text-sm hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
          <Heart size={20} className="text-rose-500 fill-rose-500" />
        </div>
        <div>
          <h1 className="font-display font-bold text-gray-900 text-xl">Liked Items</h1>
          <p className="text-gray-400 text-sm font-body">{liked.length} saved items</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card animate-pulse2">
              <div className="bg-gray-100" style={{aspectRatio:'4/3'}} />
              <div className="p-4 space-y-3"><div className="h-4 bg-gray-100 rounded w-3/4" /><div className="h-8 bg-gray-100 rounded" /></div>
            </div>
          ))}
        </div>
      ) : liked.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🤍</div>
          <h3 className="font-display font-semibold text-gray-500 text-lg">No liked items yet</h3>
          <p className="text-gray-400 text-sm font-body mt-1">Browse the marketplace and save items you love</p>
          <button onClick={() => navigate('/')} className="mt-6 bg-gray-900 text-white font-body font-semibold px-6 py-2.5 rounded-xl">Browse Marketplace</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {liked.map((item) => (
            <ProductCard key={item.id} product={item.products} onRequireAuth={onRequireAuth} likedByDefault={true} />
          ))}
        </div>
      )}
    </div>
  )
}

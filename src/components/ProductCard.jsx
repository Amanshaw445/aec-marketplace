import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toggleLike, isLiked } from '../lib/supabase'

export default function ProductCard({ product, onRequireAuth, likedByDefault = false }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [liked, setLiked] = useState(likedByDefault)
  const [likeLoading, setLikeLoading] = useState(false)

  const seller = product.users
  const images = product.images || []

  useEffect(() => {
    if (user && !likedByDefault) {
      isLiked(user.id, product.id).then(setLiked)
    }
  }, [user, product.id, likedByDefault])

  const handleLike = async (e) => {
    e.stopPropagation()
    if (!user) { onRequireAuth?.(); return }
    setLikeLoading(true)
    await toggleLike(user.id, product.id)
    setLiked((prev) => !prev)
    setLikeLoading(false)
  }

  return (
    <div className="card cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
      {/* Image */}
      <div className="relative w-full bg-gray-100" style={{aspectRatio:'4/3'}}>
        {images.length > 0 ? (
          <img src={images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
        )}
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform active:scale-90"
        >
          <Heart size={15} className={liked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="font-display font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="font-display font-bold text-gray-900 text-lg mb-1">
          ₹{Number(product.price).toLocaleString('en-IN')}
        </p>
        {product.description && (
          <p className="text-gray-500 text-xs font-body line-clamp-2 leading-relaxed mb-2">
            {product.description}
          </p>
        )}
        {/* Seller */}
        <div className="border-t border-gray-100 pt-2.5 mt-2">
          <p className="font-body font-medium text-gray-800 text-xs">{seller?.username || 'Unknown'}</p>
          <p className="text-gray-400 text-xs mt-0.5">
            {seller?.user_type === 'student'
              ? `${seller?.year ? seller.year + (seller.year === '1' ? 'st' : seller.year === '2' ? 'nd' : seller.year === '3' ? 'rd' : 'th') + ' Year' : ''} ${seller?.year && seller?.department ? '· ' : ''}${seller?.department || ''}`
              : seller?.city || 'External Seller'}
          </p>
        </div>
      </div>
    </div>
  )
}

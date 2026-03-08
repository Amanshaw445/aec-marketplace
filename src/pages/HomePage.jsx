import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../lib/supabase'

const CATEGORIES = ['all', 'electronics', 'books', 'clothing', 'furniture', 'sports', 'other']

export default function HomePage({ onRequireAuth }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const filters = {}
    if (category !== 'all') filters.category = category
    if (search.trim()) filters.search = search.trim()
    const { data } = await getProducts(filters)
    setProducts(data || [])
    setLoading(false)
  }, [category, search])

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products, categories, sellers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10 pr-10 bg-white"
          style={{boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={14} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-body font-medium capitalize transition-all ${
              category === cat
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed heading */}
      {!loading && (
        <div>
         <h1 className="font-display font-bold text-gray-900 text-lg">Marketplace Feed</h1>
          <p className="text-gray-400 text-sm font-body">{products.length} product{products.length !== 1 ? 's' : ''} available</p>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card animate-pulse2">
              <div className="bg-gray-100" style={{aspectRatio:'4/3'}} />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                <div className="h-6 bg-gray-100 rounded-lg w-1/3" />
                <div className="h-3 bg-gray-100 rounded-lg w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🛍️</div>
          <h3 className="font-display font-semibold text-gray-500 text-lg">No products found</h3>
          <p className="text-gray-400 text-sm font-body mt-1">{search ? 'Try a different search' : 'Be the first to list something!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product, i) => (
            <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 50, 300)}ms`, animationFillMode: 'both' }}>
              <ProductCard product={product} onRequireAuth={() => onRequireAuth?.()} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

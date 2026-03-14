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
    <div className="max-w-2xl lg:max-w-7xl mx-auto px-4 space-y-6 lg:space-y-10 py-4 lg:py-8">
      
      {/* Search & Category Header */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, categories, sellers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-11 pr-10 bg-white lg:h-12 lg:text-base border-gray-200 focus:border-purple-500 transition-all"
            style={{boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full">
              <X size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs lg:text-sm font-medium capitalize transition-all ${
                category === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-100'
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Heading */}
      {!loading && (
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display font-bold text-xl lg:text-3xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Marketplace Feed
            </h1>
            <p className="text-gray-400 text-sm mt-1">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
          </div>
        </div>
      )}

      {/* Responsive Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="bg-gray-100 aspect-[4/3]" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-6 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 lg:py-32">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="font-display font-semibold text-gray-900 text-lg lg:text-xl">No products found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, i) => (
            <div 
              key={product.id} 
              className="animate-fade-up" 
              style={{ animationDelay: `${Math.min(i * 50, 400)}ms`, animationFillMode: 'both' }}
            >
              <ProductCard product={product} onRequireAuth={() => onRequireAuth?.()} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
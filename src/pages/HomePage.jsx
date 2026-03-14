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
    /* Responsive Padding-Top: 
       pt-[80px] for mobile/tablet to clear the fixed nav.
       md:pt-6 for desktop where the nav might be static or top-aligned.
    */
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-6 pt-[80px] md:pt-6 pb-20">
      
      {/* Search Bar Container */}
      <div className="relative max-w-2xl mx-auto md:mx-0">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products, categories, sellers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-12 pr-10 bg-white w-full border-gray-200 h-12 rounded-xl"
          style={{boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}
        />
        {search && (
          <button 
            onClick={() => setSearch('')} 
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={16} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Category filter - Scrollbar Hidden */}
      <div className="relative">
        <div 
          className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth" 
          style={{
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
          }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .no-scrollbar::-webkit-scrollbar { display: none; }
          `}} />
          
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-5 py-2 rounded-full text-xs font-body font-medium capitalize transition-all border ${
                category === cat
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                  : 'bg-white text-gray-500 hover:bg-gray-100 border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feed heading */}
      {!loading && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h1 className="font-display font-bold text-2xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Marketplace Feed
              <span className="sr-only"> at Asansol Engineering College (AEC)</span>
            </h1>
            <p className="text-gray-400 text-sm font-body">
              Showing {products.length} {products.length === 1 ? 'item' : 'items'} in Asansol
            </p>
          </div>
        </div>
      )}

      {/* Grid Section - UPDATED FOR RESPONSIVENESS */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gray-100 aspect-[4/3]" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-100 rounded-lg w-3/4" />
                <div className="h-7 bg-gray-100 rounded-lg w-1/4" />
                <div className="h-4 bg-gray-100 rounded-lg w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="font-display font-semibold text-gray-600 text-xl">No products found</h3>
          <p className="text-gray-400 text-md font-body mt-2">
            {search ? `We couldn't find anything for "${search}"` : 'Be the first to list something in this category!'}
          </p>
        </div>
      ) : (
        /* GRID LOGIC: 
           grid-cols-1: Mobile (1 card per row)
           md:grid-cols-2: Tablets (2 cards per row)
           lg:grid-cols-3: Desktop (3 cards per row) 
        */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <div 
              key={product.id} 
              className="animate-fade-up" 
              style={{ 
                animationDelay: `${Math.min(i * 50, 400)}ms`, 
                animationFillMode: 'both' 
              }}
            >
              <ProductCard 
                product={product} 
                onRequireAuth={() => onRequireAuth?.()} 
              />
            </div>
          ))}
        </div>
      )}  
    </div>
  )
}
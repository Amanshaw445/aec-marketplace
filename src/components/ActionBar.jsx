import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Tag } from 'lucide-react'

export default function ActionBar() {
  const location = useLocation()
  const isBuy = location.pathname === '/' || location.pathname.startsWith('/product')
  const isSell = location.pathname === '/sell'

  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-white border-b border-gray-100" style={{boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
      <div className="max-w-2xl mx-auto px-4 h-[50px] flex items-center gap-2">
        <Link to="/" className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${isBuy ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
          <ShoppingBag size={18} />
        </Link>
        <Link to="/sell" className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${isSell ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
          <Tag size={18} />
        </Link>
      </div>
    </div>
  )
}

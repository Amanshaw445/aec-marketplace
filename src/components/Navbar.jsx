import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Menu, X, User, ListOrdered, LogOut, Info, PlusCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { signOut } from '../lib/supabase'

export default function Navbar({ onRequireAuth }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const handleLiked = () => {
    if (!user) onRequireAuth(() => navigate('/liked'))
    else navigate('/liked')
  }

  const handleSell = () => {
    if (!user) onRequireAuth(() => navigate('/sell'))
    else navigate('/sell')
  }

  const handleLogout = async () => {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-14 lg:h-20 flex items-center transition-all duration-300" style={{boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
        {/* Container: max-w-2xl on mobile, max-w-7xl on desktop */}
        <div className="w-full max-w-2xl lg:max-w-7xl mx-auto px-4 flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            {/* Hamburger - Hidden on Desktop */}
            <button onClick={() => setMenuOpen(true)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
              <Menu size={20} className="text-gray-600" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5 shrink-0">
              <span className="font-display font-bold text-base lg:text-xl text-purple-600 tracking-tight">AEC Marketplace</span>
            </Link>

            {/* Desktop Horizontal Nav - Visible only on lg+ */}
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">Home</Link>
              <button onClick={handleSell} className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">Sell</button>
              <button onClick={handleLiked} className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">Liked</button>
              {user && (
                <Link to="/my-listings" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">My Listings</Link>
              )}
              <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">About</Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 lg:gap-3">
            {/* Desktop Sell Button (Primary CTA) */}
            <button 
              onClick={handleSell}
              className="hidden lg:flex items-center gap-2 bg-purple-50 text-purple-600 hover:bg-purple-100 px-4 py-2 rounded-xl transition-colors font-semibold text-sm mr-2"
            >
              <PlusCircle size={18} />
              Sell Item
            </button>

            <button onClick={handleLiked} className="w-9 h-9 lg:w-11 lg:h-11 flex items-center justify-center rounded-lg lg:rounded-xl hover:bg-gray-100 transition-colors">
              <Heart size={20} className="text-gray-600 hover:text-rose-500 transition-colors" />
            </button>

            {user ? (
              <div className="hidden lg:flex items-center gap-3 pl-2 ml-2 border-l border-gray-100">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{profile?.username || 'User'}</p>
                  <button onClick={handleLogout} className="text-[11px] font-bold text-red-500 uppercase tracking-wider hover:underline">Logout</button>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <User size={20} className="text-purple-600" />
                </div>
              </div>
            ) : (
              <button onClick={() => onRequireAuth()} className="ml-1 bg-gray-900 hover:bg-gray-800 text-white font-body font-semibold text-sm px-4 lg:px-6 py-1.5 lg:py-2.5 rounded-lg lg:rounded-xl transition-colors">
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Drawer - Stay as is, but it will only be triggerable on mobile/tablet */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="relative w-72 bg-white h-full flex flex-col shadow-2xl animate-fade-right">
            {/* ... rest of your drawer code exactly as it was ... */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <span className="font-display font-bold text-gray-900 text-lg">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            {/* Profile Section (Drawer) */}
            <div className="p-5 border-b border-gray-100">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center">
                    <User size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-gray-900 text-sm">{profile?.username || user.email || 'User'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{profile?.user_type === 'student' ? 'AEC Student' : 'User'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <p className="font-body font-medium text-gray-400 text-sm">Not logged in</p>
                </div>
              )}
            </div>
            <div className="flex-1 p-4 space-y-1">
              <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50">
                <span className="text-sm font-medium">Home</span>
              </Link>
              {user && (
                <Link to="/my-listings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50">
                  <ListOrdered size={18} />
                  <span className="text-sm">My Listings</span>
                </Link>
              )}
              <Link to="/about" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50">
                <Info size={18} />
                <span className="text-sm">About</span>
              </Link>
              {user && (
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600">
                  <LogOut size={18} />
                  <span className="text-sm">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
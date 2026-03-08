import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Menu, X, User, ListOrdered, LogOut, Info } from 'lucide-react'
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

  const handleLogout = async () => {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100" style={{boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Hamburger */}
          <button onClick={() => setMenuOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <Menu size={20} className="text-gray-600" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5">
            <span className="font-display font-bold text-base text-purple-600 tracking-tight">AEC Marketplace</span>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-1">
            <button onClick={handleLiked} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
              <Heart size={20} className="text-gray-600 hover:text-rose-500 transition-colors" />
            </button>
            {!user && (
              <button onClick={() => onRequireAuth()} className="ml-1 bg-gray-900 hover:bg-gray-800 text-white font-body font-semibold text-sm px-4 py-1.5 rounded-lg transition-colors">
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="relative w-72 bg-white h-full flex flex-col shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <span className="font-display font-bold text-gray-900 text-lg">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-5 border-b border-gray-100">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center">
                    <User size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-gray-900 text-sm">{profile?.username || user.email || user.phone || 'User'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {profile?.user_type === 'student' ? <span className="text-blue-600">AEC Student</span> : profile?.user_type === 'external' ? <span className="text-amber-600">External User</span> : 'Logged in'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-body font-medium text-gray-400 text-sm">Not logged in</p>
                    <p className="text-xs text-gray-400 mt-0.5">Login to access all features</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 space-y-1">
              {user && (
                <>
                  <Link to="/my-listings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <ListOrdered size={18} className="text-gray-400 group-hover:text-gray-700" />
                    <span className="font-body text-gray-600 group-hover:text-gray-900 text-sm">My Listings</span>
                  </Link>
                  <Link to="/about" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <Info size={18} className="text-gray-400 group-hover:text-gray-700" />
                    <span className="font-body text-gray-600 group-hover:text-gray-900 text-sm">About</span>
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors group">
                    <LogOut size={18} className="text-gray-400 group-hover:text-red-500" />
                    <span className="font-body text-gray-600 group-hover:text-red-500 text-sm">Logout</span>
                  </button>
                </>
              )}
            </div>

            <div className="p-5 border-t border-gray-100">  <div className="p-5 border-t border-gray-100">
              <p className="text-xs text-gray-300 mt-0.5">Academic Exchange Center – Buy & Sell within Campus</p>
              <p className="text-xs text-gray-300 mt-0.5">
              Developed and managed by{" "}
            <a href="https://amanshaw.live" target="_blank" rel="noopener noreferrer"className="text-blue-400 hover:text-blue-300 underline">
                Aman Shaw
            </a>
            </p>
            </div>
            <p className="text-xs text-gray-400">AEC Marketplace v1.3</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

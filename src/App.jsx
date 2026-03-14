import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import ActionBar from './components/ActionBar'
import HomePage from './pages/HomePage'
import SellPage from './pages/SellPage'
import LikedPage from './pages/LikedPage'
import MyListingsPage from './pages/MyListingsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AboutPage from './pages/AboutPage'
import AuthModal from './components/AuthModal'
import { supabase } from './lib/supabase'

export default function App() {
  const [authModal, setAuthModal] = useState(false)
  const [authCallback, setAuthCallback] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        if (window.location.hash.includes('access_token')) {
          navigate('/', { replace: true })
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [navigate])

  const requireAuth = (cb) => {
    setAuthCallback(() => cb)
    setAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onRequireAuth={requireAuth} />
      <ActionBar />

      <main className="pt-16 lg:pt-20 pb-8 px-4 lg:px-8 max-w-2xl lg:max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<HomePage onRequireAuth={requireAuth} />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/liked" element={<LikedPage onRequireAuth={requireAuth} />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage onRequireAuth={requireAuth} />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      {authModal && (
        <AuthModal
          onClose={() => setAuthModal(false)}
          onSuccess={() => {
            setAuthModal(false)
            if (authCallback) { authCallback(); setAuthCallback(null) }
          }}
        />
      )}
    </div>
  )
}

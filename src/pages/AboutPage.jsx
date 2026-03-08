import { ArrowLeft, ShoppingBag, Shield, Zap, Users, MessageCircle, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="font-display font-bold text-gray-900 text-lg">About</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} className="text-white" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-2">AEC Marketplace</h2>
          <p className="text-purple-100 text-sm leading-relaxed">
            A student-first platform to buy and sell second-hand goods in Asansol — no middlemen, no fees, just direct WhatsApp contact.
          </p>
          <div className="mt-4 inline-block bg-white/20 rounded-full px-4 py-1.5 text-xs font-medium">
            Version 1.0 · Asansol, West Bengal
          </div>
        </div>

        {/* What is this */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-display font-bold text-gray-900 text-base mb-3">What is AEC Marketplace?</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            AEC Marketplace is a free peer-to-peer buy & sell platform built for students and locals in Asansol. List your old laptops, mobiles, books, electronics, cycles and more — or find great deals from people nearby.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mt-3">
            Think of it as OLX — but built specifically for the Asansol community, with a cleaner experience and direct WhatsApp contact.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-display font-bold text-gray-900 text-base mb-4">Why use AEC Marketplace?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                <Zap size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="font-body font-semibold text-gray-800 text-sm">100% Free</p>
                <p className="text-gray-400 text-xs mt-0.5">No listing fees, no commissions. Buy and sell for free.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <MessageCircle size={16} className="text-green-600" />
              </div>
              <div>
                <p className="font-body font-semibold text-gray-800 text-sm">Direct WhatsApp Contact</p>
                <p className="text-gray-400 text-xs mt-0.5">Connect with sellers instantly — no waiting for replies on the platform.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Users size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="font-body font-semibold text-gray-800 text-sm">Students & Locals Both Welcome</p>
                <p className="text-gray-400 text-xs mt-0.5">Open to AEC students and external users from Asansol and nearby areas.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <Shield size={16} className="text-red-500" />
              </div>
              <div>
                <p className="font-body font-semibold text-gray-800 text-sm">Secure Login</p>
                <p className="text-gray-400 text-xs mt-0.5">Login via Google or Email magic link — no passwords to remember.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Heart size={16} className="text-amber-500" />
              </div>
              <div>
                <p className="font-body font-semibold text-gray-800 text-sm">Save Favourites</p>
                <p className="text-gray-400 text-xs mt-0.5">Like products and find them later in your saved list.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-display font-bold text-gray-900 text-base mb-3">What can you buy & sell?</h3>
          <div className="flex flex-wrap gap-2">
            {['📱 Mobiles', '💻 Laptops', '📚 Books', '🔌 Electronics', '🚲 Cycles', '👕 Clothing', '🪑 Furniture', '🎒 Bags', '📝 Notes', '🔧 Tools', '🎮 Gaming', '🛏️ Hostel Items'].map((cat) => (
              <span key={cat} className="bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-display font-bold text-gray-900 text-base mb-4">How it works</h3>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Create an account', desc: 'Sign up with Google or your email in seconds.' },
              { step: '2', title: 'List your item', desc: 'Add photos, set a price and post your listing for free.' },
              { step: '3', title: 'Get contacted', desc: 'Buyers reach you directly on WhatsApp — no delays.' },
              { step: '4', title: 'Meet & deal', desc: 'Meet in person, inspect the item and complete the deal.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{item.step}</span>
                </div>
                <div>
                  <p className="font-body font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center py-2">
          <p className="text-xs text-gray-400">Made with ❤️ for Asansol</p>
          <p className="text-xs text-gray-300 mt-1">© 2025 AEC Marketplace · All rights reserved</p>
        </div>

      </div>
    </div>
  )
}

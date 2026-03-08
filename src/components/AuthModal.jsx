import { useState } from 'react'
import { X, Mail, Loader2, ChevronRight, CheckCircle2 } from 'lucide-react'
import { sendEmailOTP, signInWithGoogle } from '../lib/supabase'

export default function AuthModal({ onClose, onSuccess }) {
  const [step, setStep] = useState('options')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendEmail = async () => {
    setError('')
    if (!email || !email.includes('@')) { setError('Enter a valid email address'); return }
    setLoading(true)
    const { error } = await sendEmailOTP(email)
    setLoading(false)
    if (error) { setError(error.message); return }
    setStep('sent')
  }

  const handleGoogle = async () => {
    setLoading(true)
    const { error } = await signInWithGoogle()
    if (error) { setError(error.message); setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <X size={16} className="text-gray-400" />
        </button>

        {/* Options */}
        {step === 'options' && (
          <>
            <div className="mb-6">
              <h1 className="font-display font-bold text-gray-900 text-xl">Login to continue <span className="sr-only">to AEC Marketplace Asansol</span></h1>
              <p className="text-gray-500 text-sm font-body mt-1">Connect with sellers and save your favourite items</p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-body">{error}</div>
            )}

            <div className="space-y-3">
              <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-body font-semibold px-4 py-3 rounded-xl transition-all active:scale-95">
                {loading ? <Loader2 size={18} className="animate-spin" /> : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </button>

              <div className="relative flex items-center">
                <div className="flex-1 border-t border-gray-100" />
                <span className="px-3 text-gray-400 text-xs font-body">or</span>
                <div className="flex-1 border-t border-gray-100" />
              </div>

              <button onClick={() => setStep('email')} className="w-full flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-3 rounded-xl transition-all active:scale-95">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mail size={15} className="text-purple-600" />
                </div>
                <span className="font-body font-medium text-gray-700 text-sm flex-1 text-left">Continue with Email</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>
          </>
        )}

        {/* Email input */}
        {step === 'email' && (
          <>
            <div className="mb-6">
              <h2 className="font-display font-bold text-gray-900 text-xl">Enter your email</h2>
              <p className="text-gray-500 text-sm font-body mt-1">We'll send you a login link — no password needed</p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-body">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendEmail()}
                  autoFocus
                />
              </div>
              <button onClick={handleSendEmail} disabled={loading} className="btn-primary">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                {loading ? 'Sending...' : 'Send Login Link'}
              </button>
              <button onClick={() => setStep('options')} className="w-full text-gray-400 text-sm font-body hover:text-gray-600 transition-colors">
                ← Back
              </button>
            </div>
          </>
        )}

        {/* Sent confirmation */}
        {step === 'sent' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h2 className="font-display font-bold text-gray-900 text-xl mb-2">Check your inbox!</h2>
            <p className="text-gray-500 text-sm font-body leading-relaxed mb-1">
              We sent a login link to
            </p>
            <p className="font-display font-semibold text-purple-600 text-sm mb-5">{email}</p>
            <div className="bg-gray-50 rounded-xl p-4 text-left mb-5">
              <p className="text-gray-500 text-xs font-body leading-relaxed">
                📬 Open the email and click <strong className="text-gray-700">"Continue to AEC Marketplace"</strong> — you'll be logged in automatically.
              </p>
            </div>
            <button
              onClick={() => { setStep('email'); setEmail('') }}
              className="text-gray-400 text-sm font-body hover:text-gray-600 transition-colors"
            >
              ← Use a different email
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Header() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuth = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setAuthError('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setShowAuthModal(false)
        setEmail('')
        setPassword('')
      }
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error)
  }

  const resetAuthForm = () => {
    setEmail('')
    setPassword('')
    setAuthError('')
    setAuthLoading(false)
  }

  const openAuthModal = (signUp = false) => {
    setIsSignUp(signUp)
    setShowAuthModal(true)
    resetAuthForm()
  }

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b border-peach-200 rounded-b-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-slate-700">
              Fluence Notes
            </h1>
            <div className="animate-pulse bg-peach-100 h-8 w-20 rounded-full"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-peach-200 rounded-b-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-slate-700">
              Fluence Notes
            </h1>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              {user ? (
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="hidden sm:block text-sm text-slate-600 truncate max-w-[120px] md:max-w-none">
                    {user.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="bg-peach-300 hover:bg-peach-400 text-black px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors shadow-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 md:space-x-2">
                  <button
                    onClick={() => openAuthModal(false)}
                    className="bg-green-200 hover:bg-green-300 text-slate-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors shadow-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal(true)}
                    className="bg-peach-300 hover:bg-peach-400 text-black px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors shadow-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-700">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-peach-200 rounded-full focus:outline-none focus:ring-2 focus:ring-peach-300 focus:border-transparent text-black placeholder-gray-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-peach-200 rounded-full focus:outline-none focus:ring-2 focus:ring-peach-300 focus:border-transparent text-black placeholder-gray-500"
                  placeholder="••••••••"
                />
              </div>

              {authError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-full">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-peach-300 hover:bg-peach-400 text-black py-2 rounded-full font-medium transition-colors disabled:opacity-50"
              >
                {authLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
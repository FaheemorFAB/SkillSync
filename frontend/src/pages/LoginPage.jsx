import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Rocket, Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from '../lib/toast.js'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect')

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await signIn(form)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    toast.success('Welcome back!')
    // Navigation handled by App.jsx route guard
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A0F1E' }}>
      {/* Background orbs */}
      <div className="orb orb-purple fixed" style={{ top: '-100px', left: '-200px', opacity: 0.4, pointerEvents: 'none' }} />
      <div className="orb orb-blue fixed" style={{ bottom: '-100px', right: '-100px', opacity: 0.3, pointerEvents: 'none' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
              <Rocket size={20} color="white" />
            </div>
            <span className="font-bold text-xl text-white">SkillSync</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        {/* Form card */}
        <div className="card p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg mb-6 text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-group">
              <label className="input-label">Email address</label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary w-full btn-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <p className="text-xs text-indigo-400 font-semibold mb-3">🚀 Demo Accounts (no setup needed)</p>
            <div className="space-y-1.5 text-xs text-gray-400">
              <div>Applicant: <span className="text-indigo-300 font-mono">demo@applicant.com</span> / <span className="font-mono">Demo123!</span></div>
              <div>Company: <span className="text-cyan-300 font-mono">demo@company.com</span> / <span className="font-mono">Demo123!</span></div>
              <div>Employee: <span className="text-green-300 font-mono">demo@employee.com</span> / <span className="font-mono">Demo123!</span></div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}

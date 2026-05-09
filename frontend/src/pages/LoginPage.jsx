import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Rocket, AlertCircle } from 'lucide-react'
import toast from '../lib/toast.jsx'
import { GoogleLogin } from '@react-oauth/google'

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)

    const { data, error } = await signInWithGoogle(credentialResponse.credential)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    toast.success('Welcome back!')
    // Navigation handled by App.jsx route guard
  }

  const handleGoogleError = () => {
    setError('Google authentication failed.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
              <Rocket size={20} color="white" />
            </div>
            <span className="font-bold text-xl text-slate-900">SkillSync</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500 text-sm">Sign in to your account</p>
        </div>

        {/* Form card */}
        <div className="card p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg mb-6 text-sm"
              style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <div className="flex justify-center mt-6">
            {loading ? (
              <span className="flex items-center gap-2 text-slate-500 font-medium">
                <span className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_blue"
                shape="rectangular"
                text="signin_with"
                size="large"
                width="100%"
              />
            )}
          </div>

          {/* Demo accounts */}
          <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs text-blue-600 font-semibold mb-3">🚀 Demo Accounts (no setup needed)</p>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div>Applicant: <span className="text-slate-900 font-mono font-medium">demo@applicant.com</span> / <span className="font-mono text-slate-900 font-medium">Demo123!</span></div>
              <div>Company: <span className="text-slate-900 font-mono font-medium">demo@company.com</span> / <span className="font-mono text-slate-900 font-medium">Demo123!</span></div>
              <div>Employee: <span className="text-slate-900 font-mono font-medium">demo@employee.com</span> / <span className="font-mono text-slate-900 font-medium">Demo123!</span></div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}

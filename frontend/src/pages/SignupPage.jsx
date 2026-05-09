import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Rocket, AlertCircle, User, Building2,
  Users, CheckCircle
} from 'lucide-react'
import toast from '../lib/toast.jsx'
import { GoogleLogin } from '@react-oauth/google'

const ROLES = [
  {
    id: 'applicant',
    label: 'Applicant',
    desc: 'Take challenges, prove your skills, get hired',
    icon: User,
    color: '#2563EB',
  },
  {
    id: 'company',
    label: 'Company',
    desc: 'Post challenges, hire verified talent',
    icon: Building2,
    color: '#0891B2',
  },
  {
    id: 'employee',
    label: 'Employee',
    desc: 'Showcase skills for internal advancement',
    icon: Users,
    color: '#059669',
  },
]

const SKILLS_LIST = [
  'React', 'TypeScript', 'Python', 'FastAPI', 'Node.js', 'PostgreSQL',
  'Docker', 'Kubernetes', 'AWS', 'Machine Learning', 'Flutter', 'Swift',
  'Cybersecurity', 'Rust', 'Go', 'Redis', 'MongoDB', 'GraphQL'
]

export default function SignupPage() {
  const [searchParams] = useSearchParams()
  const { signInWithGoogle } = useAuth()
  const [role, setRole] = useState(searchParams.get('role') || 'applicant')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    
    if (role === 'company' && !companyName.trim()) {
      setError('Please enter your company name')
      return
    }

    setLoading(true)

    const { data, error } = await signInWithGoogle(
      credentialResponse.credential, 
      role, 
      role === 'company' ? companyName : null
    )

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    toast.success('Account created successfully!')
    // App.jsx will automatically redirect
  }

  const handleGoogleError = () => {
    setError('Google authentication failed.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
              <Rocket size={20} color="white" />
            </div>
            <span className="font-bold text-xl text-slate-900">SkillSync</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500 text-sm">Join the skills-based hiring revolution</p>
        </div>


        <div className="card p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg mb-5 text-sm"
              style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

            <div className="animate-fade-in">
              {/* Role Selection */}
              <div className="form-group">
                <label className="input-label mb-3">I am joining as...</label>
                <div className="space-y-3">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      id={`role-${r.id}`}
                      onClick={() => setRole(r.id)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left bg-white"
                      style={{
                        borderColor: role === r.id ? r.color : '#E2E8F0',
                        background: role === r.id ? `${r.color}10` : 'white',
                      }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${r.color}18` }}>
                        <r.icon size={18} style={{ color: r.color }} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{r.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{r.desc}</div>
                      </div>
                      {role === r.id && (
                        <CheckCircle size={18} className="ml-auto flex-shrink-0" style={{ color: r.color }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {role === 'company' && (
                <div className="form-group">
                  <label className="input-label">Company Name</label>
                  <input
                    id="signup-company"
                    type="text"
                    className="input"
                    placeholder="Acme Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              )}

              <div className="mt-8">
                {loading ? (
                  <div className="flex justify-center p-4">
                    <span className="flex items-center gap-2 text-slate-500 font-medium">
                      <span className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                      Creating account...
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap={false}
                      theme="filled_blue"
                      shape="rectangular"
                      text="signup_with"
                      size="large"
                      width="100%"
                    />
                  </div>
                )}
              </div>
            </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

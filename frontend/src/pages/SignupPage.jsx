import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Rocket, Eye, EyeOff, AlertCircle, User, Building2,
  Users, CheckCircle, ChevronRight, Code2, Brain, Cloud, Shield, Database
} from 'lucide-react'
import toast from '../lib/toast.js'

const ROLES = [
  {
    id: 'applicant',
    label: 'Applicant',
    desc: 'Take challenges, prove your skills, get hired',
    icon: User,
    color: '#6366F1',
  },
  {
    id: 'company',
    label: 'Company',
    desc: 'Post challenges, hire verified talent',
    icon: Building2,
    color: '#06B6D4',
  },
  {
    id: 'employee',
    label: 'Employee',
    desc: 'Showcase skills for internal advancement',
    icon: Users,
    color: '#10B981',
  },
]

const SKILLS_LIST = [
  'React', 'TypeScript', 'Python', 'FastAPI', 'Node.js', 'PostgreSQL',
  'Docker', 'Kubernetes', 'AWS', 'Machine Learning', 'Flutter', 'Swift',
  'Cybersecurity', 'Rust', 'Go', 'Redis', 'MongoDB', 'GraphQL'
]

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [step, setStep] = useState(1)
  const [role, setRole] = useState(searchParams.get('role') || 'applicant')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    bio: '',
    skills: [],
    sector: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const toggleSkill = (skill) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter(s => s !== skill)
        : [...f.skills, skill]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { data, error } = await signUp({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      role,
      companyName: form.companyName,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    toast.success('Account created! Please check your email to confirm.')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#0A0F1E' }}>
      <div className="orb orb-purple fixed" style={{ top: '-100px', right: '-100px', opacity: 0.35 }} />
      <div className="orb orb-violet fixed" style={{ bottom: '-100px', left: '-100px', opacity: 0.3 }} />

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
              <Rocket size={20} color="white" />
            </div>
            <span className="font-bold text-xl text-white">SkillSync</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400 text-sm">Join the skills-based hiring revolution</p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${s <= step ? 'text-indigo-400' : 'text-gray-600'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  ${s < step ? 'bg-indigo-500 text-white' : s === step ? 'border-2 border-indigo-500 text-indigo-400' : 'border-2 border-gray-700 text-gray-600'}`}>
                  {s < step ? <CheckCircle size={14} /> : s}
                </div>
                <span className="text-xs font-medium hidden sm:block">
                  {s === 1 ? 'Account Details' : 'Your Profile'}
                </span>
              </div>
              {s < 2 && <div className={`flex-1 h-px ${step > 1 ? 'bg-indigo-500' : 'bg-gray-800'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="card p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg mb-5 text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
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
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left"
                      style={{
                        borderColor: role === r.id ? r.color : 'rgba(255,255,255,0.08)',
                        background: role === r.id ? `${r.color}10` : 'transparent',
                      }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${r.color}18` }}>
                        <r.icon size={18} style={{ color: r.color }} />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{r.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{r.desc}</div>
                      </div>
                      {role === r.id && (
                        <CheckCircle size={18} className="ml-auto flex-shrink-0" style={{ color: r.color }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Full Name</label>
                <input
                  id="signup-fullname"
                  type="text"
                  className="input"
                  placeholder="Alex Johnson"
                  value={form.fullName}
                  onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))}
                  required
                />
              </div>

              {role === 'company' && (
                <div className="form-group">
                  <label className="input-label">Company Name</label>
                  <input
                    id="signup-company"
                    type="text"
                    className="input"
                    placeholder="Acme Corp"
                    value={form.companyName}
                    onChange={(e) => setForm(f => ({ ...f, companyName: e.target.value }))}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="input-label">Email Address</label>
                <input
                  id="signup-email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="input-label">Password</label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPass ? 'text' : 'password'}
                      className="input pr-10"
                      placeholder="Min 6 chars"
                      value={form.password}
                      onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                      required
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="input-label">Confirm Password</label>
                  <input
                    id="signup-confirm"
                    type="password"
                    className="input"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                id="signup-next"
                className="btn btn-primary w-full btn-lg"
                onClick={() => {
                  if (!form.fullName || !form.email || !form.password) {
                    setError('Please fill all required fields')
                    return
                  }
                  setError('')
                  setStep(2)
                }}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="animate-fade-in">
              <div className="form-group">
                <label className="input-label">Bio (optional)</label>
                <textarea
                  id="signup-bio"
                  className="input"
                  placeholder="Tell us about yourself..."
                  value={form.bio}
                  onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3}
                />
              </div>

              {(role === 'applicant' || role === 'employee') && (
                <div className="form-group">
                  <label className="input-label">Select Your Skills (choose all that apply)</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {SKILLS_LIST.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          form.skills.includes(skill)
                            ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                            : 'border-white/10 text-gray-500 hover:border-indigo-500/40 hover:text-gray-300'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  {form.skills.length > 0 && (
                    <p className="text-xs text-indigo-400 mt-2">{form.skills.length} skill(s) selected</p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary flex-1"
                >
                  Back
                </button>
                <button
                  id="signup-submit"
                  type="submit"
                  className="btn btn-primary flex-1 btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <><Rocket size={16} /> Create Account</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

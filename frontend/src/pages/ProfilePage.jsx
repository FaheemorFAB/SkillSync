import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import toast from '../lib/toast.jsx'
import { User, Camera, Save, Plus, X, Loader2, Github, Linkedin, Globe } from 'lucide-react'

const SKILLS_LIST = ['React', 'TypeScript', 'Python', 'FastAPI', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Machine Learning', 'Flutter', 'Swift', 'Cybersecurity', 'Rust', 'Go', 'Redis', 'MongoDB', 'GraphQL', 'Vue.js', 'Next.js', 'TensorFlow', 'PyTorch']

export default function ProfilePage() {
  const { profile, updateProfile } = useAuth()
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    website_url: profile?.website_url || '',
    linkedin_url: profile?.linkedin_url || '',
    github_url: profile?.github_url || '',
    skills: profile?.skills || [],
    sector: profile?.sector || '',
    company_name: profile?.company_name || '',
  })
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)

  const toggleSkill = (s) => setForm(f => ({ ...f, skills: f.skills.includes(s) ? f.skills.filter(sk => sk !== s) : [...f.skills, s] }))
  const addCustomSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm(f => ({ ...f, skills: [...f.skills, skillInput.trim()] }))
      setSkillInput('')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await updateProfile(form)
    setSaving(false)
    if (error) toast.error('Failed to save: ' + error.message)
    else toast.success('Profile updated!')
  }

  const roleColor = { applicant: '#6366F1', company: '#06B6D4', employee: '#10B981' }[profile?.role] || '#6366F1'

  return (
    <div>
      <div className="page-header">
        <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your information and verified skills</p>
      </div>

      <form onSubmit={handleSave} className="page-body max-w-2xl space-y-8">
        {/* Avatar + basic */}
        <div className="card p-6 flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <img
              src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(form.full_name || 'User')}&backgroundColor=6366f1`}
              alt="avatar"
              className="w-20 h-20 rounded-2xl border-2 border-slate-200"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: roleColor }}>
              <Camera size={13} color="white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-900">{form.full_name || 'Your Name'}</h2>
              <span className="badge" style={{ background: `${roleColor}18`, color: roleColor, border: `1px solid ${roleColor}30` }}>
                {profile?.role}
              </span>
            </div>
            <p className="text-sm text-slate-500">{profile?.email}</p>
          </div>
        </div>

        {/* Personal info */}
        <section className="space-y-5">
          <h2 className="font-bold text-slate-900">Personal Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label className="input-label">Full Name</label>
              <input id="p-name" type="text" className="input" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
            </div>
            {profile?.role === 'company' && (
              <div className="form-group">
                <label className="input-label">Company Name</label>
                <input id="p-company" type="text" className="input" value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="input-label">Bio</label>
            <textarea id="p-bio" className="input" rows={3} placeholder="Tell us about yourself..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
          </div>

          <div className="space-y-3">
            {[
              { id: 'p-github', icon: Github, label: 'GitHub URL', key: 'github_url', placeholder: 'https://github.com/username' },
              { id: 'p-linkedin', icon: Linkedin, label: 'LinkedIn URL', key: 'linkedin_url', placeholder: 'https://linkedin.com/in/username' },
              { id: 'p-website', icon: Globe, label: 'Website', key: 'website_url', placeholder: 'https://yoursite.com' },
            ].map(field => (
              <div key={field.key} className="form-group mb-0">
                <label className="input-label">{field.label}</label>
                <div className="relative">
                  <field.icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input id={field.id} type="url" className="input pl-9" placeholder={field.placeholder} value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills (applicant + employee) */}
        {(profile?.role === 'applicant' || profile?.role === 'employee') && (
          <section className="space-y-4">
            <h2 className="font-bold text-slate-900">Skills</h2>

            <div className="flex gap-2">
              <input className="input flex-1" placeholder="Add custom skill..." value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())} />
              <button type="button" onClick={addCustomSkill} className="btn btn-secondary btn-sm"><Plus size={14} /></button>
            </div>

            <div className="flex flex-wrap gap-2">
              {SKILLS_LIST.map(s => (
                <button key={s} type="button" onClick={() => toggleSkill(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.skills.includes(s) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-slate-700'}`}>
                  {s}
                </button>
              ))}
            </div>

            {form.skills.filter(s => !SKILLS_LIST.includes(s)).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.skills.filter(s => !SKILLS_LIST.includes(s)).map(s => (
                  <span key={s} className="skill-tag flex items-center gap-1.5">
                    {s}
                    <button type="button" onClick={() => toggleSkill(s)}><X size={10} /></button>
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs text-slate-500">{form.skills.length} skill(s) selected</p>
          </section>
        )}

        <button id="profile-save" type="submit" className="btn btn-primary btn-lg w-full" disabled={saving}>
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Profile</>}
        </button>
      </form>
    </div>
  )
}

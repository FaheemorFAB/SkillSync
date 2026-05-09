import React, { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import toast from '../lib/toast.jsx'
import { User, Camera, Save, Plus, X, Loader2, Github, Linkedin, Globe, Edit2 } from 'lucide-react'

const SKILLS_LIST = ['React', 'TypeScript', 'Python', 'FastAPI', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Machine Learning', 'Flutter', 'Swift', 'Cybersecurity', 'Rust', 'Go', 'Redis', 'MongoDB', 'GraphQL', 'Vue.js', 'Next.js', 'TensorFlow', 'PyTorch']

export default function ProfilePage() {
  const { profile, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    avatar_url: profile?.avatar_url || '',
    bio: profile?.bio || '',
    website_url: profile?.website_url || '',
    linkedin_url: profile?.linkedin_url || '',
    github_url: profile?.github_url || '',
    skills: profile?.skills || [],
    sector: profile?.sector || '',
    company_name: profile?.company_name || '',
    experience_years: profile?.experience_years || 0,
  })
  const [skillInput, setSkillInput] = useState('')
  const [showDefaultSkills, setShowDefaultSkills] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const fileInputRef = useRef(null)

  const toggleSkill = (s) => setForm(f => ({ ...f, skills: f.skills.includes(s) ? f.skills.filter(sk => sk !== s) : [...f.skills, s] }))
  const addCustomSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm(f => ({ ...f, skills: [...f.skills, skillInput.trim()] }))
      setSkillInput('')
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 256
          const MAX_HEIGHT = 256
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
          setForm(f => ({ ...f, avatar_url: dataUrl }))
        }
        img.src = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    // Add any pending custom skill in the input if user forgot to press plus
    let finalForm = { ...form }
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      finalForm.skills = [...form.skills, skillInput.trim()]
      setSkillInput('')
      setForm(finalForm)
    }

    // experience_years doesn't exist in the 'profiles' database table, so sending it causes Supabase to throw an error.
    // We strip it out here so the rest of the profile can save successfully.
    const { experience_years, ...payloadToSave } = finalForm;

    setSaving(true)
    setIsEditing(false) // Optimistically hide the form
    
    const { error } = await updateProfile(payloadToSave)
    setSaving(false)
    
    if (error) {
      console.error("Profile save error:", error)
      toast.error('Failed to save: ' + (error.message || JSON.stringify(error)))
      setIsEditing(true) // Show the form again if there was an error
    } else {
      toast.success('Profile updated!')
    }
  }

  const roleColor = { applicant: '#6366F1', company: '#06B6D4', employee: '#10B981' }[profile?.role] || '#6366F1'

  const ProfileCard = () => (
    <div className="card p-6 bg-white border-slate-200 shadow-sm relative overflow-hidden w-full max-w-md mx-auto">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-24 opacity-90 z-0" style={{ background: 'linear-gradient(135deg, #F59E0B, #DC2626)' }}></div>
      
      <div className="relative z-10 flex flex-col items-center text-center mt-6">
        <img
          src={form.avatar_url || profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(form.full_name || 'User')}&backgroundColor=f59e0b`}
          alt="avatar"
          className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover mb-4 bg-white"
        />
        <h4 className="font-bold text-xl text-slate-900 leading-tight">{form.full_name || 'Your Name'}</h4>
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full mt-2 mb-3 inline-block shadow-sm">
          {profile?.role || 'Applicant'}
        </span>
        
        {profile?.role === 'company' && form.company_name && (
          <p className="text-sm text-slate-700 font-semibold mb-1">{form.company_name}</p>
        )}
        {form.experience_years > 0 && (
          <p className="text-xs text-slate-500 font-medium mb-4 bg-slate-50 px-2 py-1 rounded-md">{form.experience_years} years experience</p>
        )}
      </div>

      {form.bio && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><User size={14}/> ABOUT</h5>
          <p className="text-base text-slate-600 leading-relaxed">{form.bio}</p>
        </div>
      )}

      {(form.github_url || form.linkedin_url || form.website_url) && (
        <div className="mt-5 pt-5 border-t border-slate-100">
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Globe size={14}/> LINKS</h5>
          <div className="flex gap-4">
            {form.github_url && <a href={form.github_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors"><Github size={24}/></a>}
            {form.linkedin_url && <a href={form.linkedin_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors"><Linkedin size={24}/></a>}
            {form.website_url && <a href={form.website_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors"><Globe size={24}/></a>}
          </div>
        </div>
      )}

      {form.skills && form.skills.length > 0 && (
        <div className="mt-5 pt-5 border-t border-slate-100">
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">SKILLS</h5>
          <div className="flex flex-wrap gap-2">
            {form.skills.map(s => (
              <span key={s} className="px-3 py-1.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-md text-sm font-semibold shadow-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {!isEditing && (
        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          <button onClick={() => setIsEditing(true)} className="btn btn-secondary w-full">
            <Edit2 size={16}/> Edit Profile
          </button>
        </div>
      )}
      {isEditing && (
        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          <span className="text-xs text-slate-400">Live Preview</span>
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="page-header flex justify-between items-end pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 bg-amber-50 text-amber-600 border border-amber-200">
            <User size={12} />
            Account Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            Your <span className="gradient-text-gold">Profile</span>
          </h1>
          <p className="text-slate-500 text-base">Manage your personal information and verified skills</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary btn-sm shadow-sm hidden md:flex mb-2">
            <Edit2 size={14}/> Edit Profile
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="mt-8 flex justify-center">
          <ProfileCard />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="page-body space-y-8">
              {/* Avatar + basic */}
              <div className="card p-6 flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <img
                    src={form.avatar_url || profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(form.full_name || 'User')}&backgroundColor=6366f1`}
                    alt="avatar"
                    className="w-20 h-20 rounded-2xl border-2 border-slate-200 object-cover bg-white"
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div 
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-md"
                    style={{ background: roleColor }}
                    onClick={() => fileInputRef.current?.click()}
                  >
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

                {(profile?.role === 'applicant' || profile?.role === 'employee') && (
                  <div className="form-group">
                    <label className="input-label">Years of Experience</label>
                    <input 
                      id="p-experience" 
                      type="number" 
                      min="0" 
                      max="50" 
                      className="input" 
                      value={form.experience_years} 
                      onChange={e => setForm(f => ({ ...f, experience_years: parseInt(e.target.value) || 0 }))} 
                    />
                  </div>
                )}
              </section>

              {/* Skills (applicant + employee) */}
              {(profile?.role === 'applicant' || profile?.role === 'employee') && (
                <section className="space-y-4">
                  <h2 className="font-bold text-slate-900">Skills</h2>

                  <div className="flex gap-2 relative">
                    <input 
                      className="input flex-1" 
                      placeholder="Type custom skill and press Enter..." 
                      value={skillInput} 
                      onChange={e => setSkillInput(e.target.value)} 
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (skillInput.trim()) addCustomSkill()
                        }
                      }} 
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        if (skillInput.trim()) {
                          addCustomSkill()
                        } else {
                          setShowDefaultSkills(!showDefaultSkills)
                        }
                      }} 
                      className="btn btn-secondary btn-sm"
                      title="Add typed skill or pick from default list"
                    >
                      <Plus size={14} />
                    </button>

                    {/* Dropdown for default skills */}
                    {showDefaultSkills && (
                      <div className="absolute top-full right-0 mt-2 p-4 bg-white rounded-xl shadow-xl border border-slate-200 z-10 w-full max-w-md">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-bold text-slate-800">Suggested Skills</span>
                          <button type="button" onClick={() => setShowDefaultSkills(false)} className="text-slate-400 hover:text-slate-600"><X size={14}/></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {SKILLS_LIST.map(s => (
                            <button key={s} type="button" onClick={() => toggleSkill(s)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.skills.includes(s) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-slate-700'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Display selected skills */}
                  {form.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.skills.map(s => (
                        <span key={s} className="skill-tag flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-100 shadow-sm transition-all hover:bg-indigo-100">
                          {s}
                          <button type="button" onClick={() => toggleSkill(s)} className="text-indigo-400 hover:text-indigo-600 transition-colors"><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-slate-500">{form.skills.length} skill(s) selected</p>
                </section>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary btn-lg flex-1">
                  Cancel
                </button>
                <button id="profile-save" type="submit" className="btn btn-primary btn-lg flex-1" disabled={saving}>
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Profile</>}
                </button>
              </div>
            </form>
          </div>

          {/* --- Mini Dashboard Preview --- */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24">
              <ProfileCard />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

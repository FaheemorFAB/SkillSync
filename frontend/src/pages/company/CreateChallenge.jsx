import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import toast from '../../lib/toast.jsx'
import { Rocket, Sparkles, Code2, Brain, Cloud, Shield, Database, Plus, X, Loader2 } from 'lucide-react'

const SECTORS = [
  { id: 'web_dev', label: 'Web Development', icon: Code2, color: '#6366F1', subs: ['Frontend', 'Backend', 'Fullstack'] },
  { id: 'data_ai', label: 'Data Science & AI', icon: Brain, color: '#8B5CF6', subs: ['Machine Learning', 'Data Engineering', 'Generative AI'] },
  { id: 'cloud_devops', label: 'Cloud & DevOps', icon: Cloud, color: '#06B6D4', subs: ['Infrastructure', 'Docker/K8s', 'Cloud Architecture'] },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: Shield, color: '#EF4444', subs: ['Penetration Testing', 'Security Auditing', 'Threat Intelligence'] },
  { id: 'mobile_dev', label: 'Mobile Development', icon: Database, color: '#10B981', subs: ['Cross-Platform', 'Native iOS', 'Native Android'] },
]

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function CreateChallengePage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '', description: '', sector: '', sub_sector: '',
    difficulty: 'Medium', time_limit_mins: 60,
    round2_problem: '', round3_scenario: '',
    skills_required: [],
  })
  const [skillInput, setSkillInput] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedSector = SECTORS.find(s => s.id === form.sector)

  const addSkill = () => {
    if (skillInput.trim() && !form.skills_required.includes(skillInput.trim())) {
      setForm(f => ({ ...f, skills_required: [...f.skills_required, skillInput.trim()] }))
      setSkillInput('')
    }
  }

  const removeSkill = (skill) => setForm(f => ({ ...f, skills_required: f.skills_required.filter(s => s !== skill) }))

  const generateWithAI = async () => {
    if (!aiPrompt.trim() || !form.sector) {
      toast.error('Please select a sector and describe the problem first')
      return
    }
    setAiGenerating(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/generate-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector: form.sector, problem_description: aiPrompt, difficulty: form.difficulty }),
      })
      if (!res.ok) throw new Error('Backend unavailable')
      const data = await res.json()
      setForm(f => ({
        ...f,
        title: data.title || f.title,
        round2_problem: data.round2_problem || f.round2_problem,
        round3_scenario: data.round3_scenario || f.round3_scenario,
      }))
      toast.success('AI generated your challenge content!')
    } catch {
      // Mock AI fallback
      setForm(f => ({
        ...f,
        title: f.title || `${form.sector?.replace('_', ' ')} Challenge`,
        round2_problem: `${aiPrompt}\n\nImplement a solution that handles edge cases and follows best practices for ${form.sector} development.`,
        round3_scenario: `You've inherited a legacy ${form.sector?.replace('_', ' ')} system. ${aiPrompt}. Provide a comprehensive solution with architecture decisions, code examples, and migration strategy.`,
      }))
      toast.success('Challenge content generated (demo mode)')
    } finally {
      setAiGenerating(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.sector || !form.difficulty) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      const payload = { ...form, company_id: user?.id || null, is_active: true }
      const { error } = await supabase.from('challenges').insert(payload)
      if (error) throw error
      toast.success('Challenge posted successfully!')
      navigate('/company/challenges')
    } catch (err) {
      toast.error('Failed to create challenge: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="text-2xl font-bold text-white">Create Challenge</h1>
        <p className="text-gray-400 text-sm mt-1">Use AI to auto-generate test content from your problem description</p>
      </div>

      <form onSubmit={handleSubmit} className="page-body max-w-3xl space-y-8">
        {/* AI Generator */}
        <div className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} style={{ color: '#818CF8' }} />
            <span className="font-semibold text-indigo-300 text-sm">AI Problem Creator</span>
            <span className="badge badge-live text-xs">Powered by Gemini 2.5</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">Describe your business problem and let AI generate test questions</p>
          <textarea
            className="input mb-3"
            rows={3}
            placeholder="e.g., We need to find candidates who can optimize slow database queries in our e-commerce platform..."
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
          />
          <button type="button" onClick={generateWithAI} disabled={aiGenerating} className="btn btn-primary btn-sm">
            {aiGenerating ? (
              <><Loader2 size={14} className="animate-spin" /> Generating...</>
            ) : (
              <><Sparkles size={14} /> Generate with AI</>
            )}
          </button>
        </div>

        {/* Basic info */}
        <section className="space-y-5">
          <h2 className="font-bold text-white">Challenge Details</h2>

          <div className="form-group">
            <label className="input-label">Title <span className="text-red-400">*</span></label>
            <input id="ch-title" type="text" className="input" placeholder="e.g., Build a Real-Time Dashboard" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>

          <div className="form-group">
            <label className="input-label">Description</label>
            <textarea id="ch-desc" className="input" rows={3} placeholder="What skill are you testing for?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="form-group">
            <label className="input-label">Sector <span className="text-red-400">*</span></label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SECTORS.map(s => (
                <button key={s.id} type="button" onClick={() => setForm(f => ({ ...f, sector: s.id, sub_sector: '' }))}
                  className="sector-card text-left p-3"
                  style={{ borderColor: form.sector === s.id ? s.color : 'rgba(255,255,255,0.07)', background: form.sector === s.id ? `${s.color}10` : '' }}>
                  <s.icon size={18} style={{ color: s.color }} className="mb-2" />
                  <p className="text-xs font-semibold text-white">{s.label}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedSector && (
            <div className="form-group">
              <label className="input-label">Sub-sector</label>
              <div className="flex gap-2 flex-wrap">
                {selectedSector.subs.map(s => (
                  <button key={s} type="button" onClick={() => setForm(f => ({ ...f, sub_sector: s }))}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                    style={{ borderColor: form.sub_sector === s ? selectedSector.color : 'rgba(255,255,255,0.1)', background: form.sub_sector === s ? `${selectedSector.color}15` : 'transparent', color: form.sub_sector === s ? selectedSector.color : '#9CA3AF' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="input-label">Difficulty</label>
              <select id="ch-difficulty" className="select" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label className="input-label">Time Limit (minutes)</label>
              <input id="ch-time" type="number" className="input" min={15} max={180} value={form.time_limit_mins} onChange={e => setForm(f => ({ ...f, time_limit_mins: Number(e.target.value) }))} />
            </div>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label className="input-label">Required Skills</label>
            <div className="flex gap-2 mb-3">
              <input className="input flex-1" placeholder="e.g., React" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <button type="button" onClick={addSkill} className="btn btn-secondary btn-sm"><Plus size={14} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skills_required.map(sk => (
                <span key={sk} className="skill-tag flex items-center gap-1.5">
                  {sk}
                  <button type="button" onClick={() => removeSkill(sk)}><X size={11} /></button>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Round content */}
        <section className="space-y-5">
          <h2 className="font-bold text-white">Round Content (AI-filled or manual)</h2>
          <p className="text-xs text-gray-500">Round 1 (Aptitude MCQs) are auto-generated by AI when a candidate starts. Configure rounds 2 &amp; 3 below.</p>

          <div className="form-group">
            <label className="input-label">Round 2 — Technical Problem</label>
            <textarea id="ch-r2" className="input font-mono text-sm" rows={5} placeholder="Describe the coding problem..." value={form.round2_problem} onChange={e => setForm(f => ({ ...f, round2_problem: e.target.value }))} />
          </div>

          <div className="form-group">
            <label className="input-label">Round 3 — Industry Scenario</label>
            <textarea id="ch-r3" className="input" rows={5} placeholder="Describe the real-world scenario..." value={form.round3_scenario} onChange={e => setForm(f => ({ ...f, round3_scenario: e.target.value }))} />
          </div>
        </section>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/company/challenges')} className="btn btn-secondary flex-1">Cancel</button>
          <button id="create-submit" type="submit" disabled={loading} className="btn btn-primary flex-1 btn-lg">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Posting...</> : <><Rocket size={16} /> Post Challenge</>}
          </button>
        </div>
      </form>
    </div>
  )
}

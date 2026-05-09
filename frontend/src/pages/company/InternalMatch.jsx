import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { GitBranch, Users, Zap, CheckCircle, Star, Video } from 'lucide-react'
import toast from '../../lib/toast.jsx'

const MOCK_EMPLOYEES = [
  { id: '1', name: 'Sarah Chen', skills: ['React', 'TypeScript', 'WebSockets', 'CSS'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', role: 'employee', bio: 'Frontend Lead' },
  { id: '2', name: 'Tom Bradley', skills: ['FastAPI', 'Python', 'PostgreSQL', 'Redis'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom', role: 'employee', bio: 'Backend Engineer' },
  { id: '3', name: 'Mia Wong', skills: ['React', 'Node.js', 'MongoDB', 'Docker'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia', role: 'employee', bio: 'Fullstack Developer' },
  { id: '4', name: 'Carlos Vega', skills: ['Python', 'TensorFlow', 'Kubernetes', 'AWS'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', role: 'employee', bio: 'ML Engineer' },
]

const MOCK_CHALLENGES = [
  { id: '1', title: 'Build a Real-Time Dashboard', skills_required: ['React', 'TypeScript', 'WebSockets'] },
  { id: '2', title: 'FastAPI Microservice Architecture', skills_required: ['FastAPI', 'PostgreSQL', 'Docker'] },
]

function calcMatch(empSkills, reqSkills) {
  if (!reqSkills?.length) return 0
  const matched = reqSkills.filter(s => empSkills.some(e => e.toLowerCase() === s.toLowerCase()))
  return Math.round((matched.length / reqSkills.length) * 100)
}

export default function InternalMatchPage() {
  const [searchParams] = useSearchParams()
  const preselect = searchParams.get('challenge')
  const [selectedChallenge, setSelectedChallenge] = useState(preselect || '1')
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES)
  const [challenges, setChallenges] = useState(MOCK_CHALLENGES)

  const challenge = challenges.find(c => c.id === selectedChallenge)
  const matches = employees.map(emp => ({
    ...emp,
    matchScore: calcMatch(emp.skills, challenge?.skills_required || []),
    matchedSkills: (challenge?.skills_required || []).filter(s => emp.skills.some(e => e.toLowerCase() === s.toLowerCase())),
  })).sort((a, b) => b.matchScore - a.matchScore)

  return (
    <div>
      <div className="page-header">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <GitBranch size={22} style={{ color: '#8B5CF6' }} /> Internal Match Engine
        </h1>
        <p className="text-slate-500 text-sm mt-1">Compare job requirements against your team's verified skill profiles</p>
      </div>

      <div className="page-body space-y-6">
        {/* Challenge selector */}
        <div className="card-flat p-5">
          <label className="input-label mb-2">Select Challenge to Match Against</label>
          <select className="select" value={selectedChallenge} onChange={e => setSelectedChallenge(e.target.value)}>
            {challenges.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          {challenge && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="text-xs text-slate-500">Required skills:</span>
              {challenge.skills_required.map(s => <span key={s} className="skill-tag">{s}</span>)}
            </div>
          )}
        </div>

        {/* Match results */}
        <div className="space-y-3">
          {matches.map((emp, i) => (
            <div key={emp.id} className={`card p-5 flex items-center gap-4 ${emp.matchScore >= 80 ? 'border-green-500/30' : emp.matchScore >= 50 ? 'border-yellow-500/20' : ''}`}>
              {/* Rank */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: i === 0 ? 'linear-gradient(135deg,#F59E0B,#EF4444)' : '#E2E8F0', color: i === 0 ? 'white' : '#64748B' }}>
                #{i + 1}
              </div>

              <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full border border-slate-200 flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900">{emp.name}</h3>
                  <span className="text-xs text-slate-500">{emp.bio}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {emp.skills.map(s => (
                    <span key={s} className={`skill-tag ${emp.matchedSkills.includes(s) ? '' : 'opacity-40'}`}
                      style={emp.matchedSkills.includes(s) ? { borderColor: '#10B981', color: '#059669', background: '#ECFDF5' } : {}}>
                      {emp.matchedSkills.includes(s) && <CheckCircle size={10} />} {s}
                    </span>
                  ))}
                </div>
                <div className="progress-bar w-48">
                  <div className="progress-fill" style={{
                    width: `${emp.matchScore}%`,
                    background: emp.matchScore >= 80 ? 'linear-gradient(90deg,#10B981,#06B6D4)' : emp.matchScore >= 50 ? 'linear-gradient(90deg,#F59E0B,#EF4444)' : 'rgba(239,68,68,0.5)'
                  }} />
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-3xl font-black mb-1" style={{
                  color: emp.matchScore >= 80 ? '#10B981' : emp.matchScore >= 50 ? '#F59E0B' : '#EF4444'
                }}>
                  {emp.matchScore}%
                </div>
                <p className="text-xs text-slate-500">{emp.matchedSkills.length}/{challenge?.skills_required?.length || 0} skills</p>
              </div>

              {emp.matchScore >= 60 && (
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button className="btn btn-success btn-sm gap-2" onClick={() => toast.success(`Nominated ${emp.name} for ${challenge.title}`)}>
                    <Zap size={12} /> Nominate
                  </button>
                  <button className="btn btn-secondary btn-sm gap-2" onClick={() => toast.success(`Interview scheduled for ${emp.name}`)}>
                    <Video size={12} /> Interview
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Trophy, Star, TrendingUp, Target, Briefcase, Award, Zap, ArrowRight, GitBranch } from 'lucide-react'

const MOCK_MATCHES = [
  { id: '1', challenge: 'Build a Real-Time Dashboard', company: 'TechCorp', matchScore: 92, matchedSkills: ['React', 'TypeScript', 'WebSockets'], status: 'pending' },
  { id: '2', challenge: 'FastAPI Microservice', company: 'StartupXYZ', matchScore: 78, matchedSkills: ['Python', 'FastAPI'], status: 'shortlisted' },
]

export default function EmployeeDashboard() {
  const { profile } = useAuth()
  const [matches, setMatches] = useState(MOCK_MATCHES)

  return (
    <div>
      <div className="page-header">
        <h1 className="text-2xl font-bold text-slate-900">
          Hello, {profile?.full_name?.split(' ')[0] || 'Employee'} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Your internal opportunity matches</p>
      </div>

      <div className="page-body space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Your Skills', value: profile?.skills?.length || 0, icon: Star, color: '#6366F1' },
            { label: 'Matches Found', value: matches.length, icon: GitBranch, color: '#8B5CF6' },
            { label: 'Shortlisted', value: matches.filter(m => m.status === 'shortlisted').length, icon: Trophy, color: '#10B981' },
            { label: 'Avg Match %', value: `${Math.round(matches.reduce((a, m) => a + m.matchScore, 0) / (matches.length || 1))}%`, icon: TrendingUp, color: '#06B6D4' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm">{s.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
              </div>
              <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Internal matches */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <GitBranch size={18} style={{ color: '#8B5CF6' }} /> Internal Opportunity Matches
          </h2>

          {matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map(m => (
                <div key={m.id} className="card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900">{m.challenge}</h3>
                        <span className="badge" style={{
                          background: m.status === 'shortlisted' ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.12)',
                          color: m.status === 'shortlisted' ? '#10B981' : '#818CF8'
                        }}>{m.status}</span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3">{m.company}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {m.matchedSkills.map(s => <span key={s} className="skill-tag" style={{ borderColor: '#10B981', color: '#6EE7B7', background: 'rgba(16,185,129,0.08)' }}>{s}</span>)}
                      </div>
                      <div className="progress-bar w-56">
                        <div className="progress-fill" style={{ width: `${m.matchScore}%`, background: 'linear-gradient(90deg,#10B981,#06B6D4)' }} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-3xl font-black text-green-500">{m.matchScore}%</div>
                      <p className="text-xs text-slate-500">Match Score</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12 text-slate-500">
              <Target size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No matches yet. Update your skills profile to get matched.</p>
              <Link to="/employee/profile" className="btn btn-primary btn-sm mt-4">Update Skills</Link>
            </div>
          )}
        </section>

        {/* Skills */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Your Verified Skills</h2>
            <Link to="/employee/profile" className="btn btn-secondary btn-sm">Edit <ArrowRight size={13} /></Link>
          </div>
          {profile?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
            </div>
          ) : (
            <div className="card p-6 text-center text-slate-500">
              <p className="text-sm">No skills listed yet.</p>
              <Link to="/employee/profile" className="btn btn-primary btn-sm mt-3">Add Skills</Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

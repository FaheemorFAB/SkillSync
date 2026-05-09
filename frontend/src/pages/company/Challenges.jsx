import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Plus, Edit2, Trash2, Users, BarChart2, Zap, Eye } from 'lucide-react'
import toast from '../../lib/toast.jsx'

const MOCK = [
  { id: '1', title: 'Build a Real-Time Dashboard', sector: 'web_dev', difficulty: 'Hard', applicant_count: 142, is_active: true },
  { id: '2', title: 'FastAPI Microservice Architecture', sector: 'web_dev', difficulty: 'Hard', applicant_count: 98, is_active: true },
  { id: '3', title: 'ML Model Deployment Pipeline', sector: 'data_ai', difficulty: 'Medium', applicant_count: 44, is_active: false },
]

export default function CompanyChallengesPage() {
  const { profile } = useAuth()
  const [challenges, setChallenges] = useState(MOCK)

  const toggleActive = async (id, current) => {
    const { error } = await supabase.from('challenges').update({ is_active: !current }).eq('id', id).eq('company_id', profile?.id)
    if (!error) setChallenges(cs => cs.map(c => c.id === id ? { ...c, is_active: !current } : c))
    else toast.error('Could not update (no real Supabase connected)')
    toast.success(`Challenge ${!current ? 'activated' : 'paused'}`)
    setChallenges(cs => cs.map(c => c.id === id ? { ...c, is_active: !current } : c))
  }

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Challenges</h1>
            <p className="text-gray-400 text-sm mt-1">{challenges.length} challenges posted</p>
          </div>
          <Link to="/company/challenges/create" className="btn btn-primary">
            <Plus size={16} /> New Challenge
          </Link>
        </div>
      </div>

      <div className="page-body">
        <div className="space-y-4">
          {challenges.map(ch => (
            <div key={ch.id} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-white">{ch.title}</h3>
                    <span className={`badge badge-${ch.difficulty?.toLowerCase()}`}>{ch.difficulty}</span>
                    <span className="badge" style={{
                      background: ch.is_active ? 'rgba(16,185,129,0.12)' : 'rgba(107,114,128,0.12)',
                      color: ch.is_active ? '#10B981' : '#9CA3AF'
                    }}>
                      {ch.is_active ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users size={11} /> {ch.applicant_count} applicants</span>
                    <span className="flex items-center gap-1"><BarChart2 size={11} /> {ch.sector?.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/company/matches?challenge=${ch.id}`} className="btn btn-secondary btn-sm gap-2">
                    <Zap size={12} /> Match
                  </Link>
                  <button onClick={() => toggleActive(ch.id, ch.is_active)}
                    className={`btn btn-sm ${ch.is_active ? 'btn-secondary' : 'btn-success'}`}>
                    {ch.is_active ? 'Pause' : 'Activate'}
                  </button>
                  <Link to="/company/challenges/create" className="btn btn-secondary btn-sm">
                    <Edit2 size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

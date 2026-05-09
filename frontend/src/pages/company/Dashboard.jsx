import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Plus, Users, Trophy, TrendingUp, Briefcase, Video, ArrowRight, Clock, Zap, Star } from 'lucide-react'

const MOCK_STATS = { challenges: 3, applicants: 284, topScore: 985, openRooms: 2 }
const MOCK_CHALLENGES = [
  { id: '1', title: 'Build a Real-Time Dashboard', sector: 'web_dev', difficulty: 'Hard', applicant_count: 142, is_active: true, created_at: '2026-05-08' },
  { id: '2', title: 'FastAPI Microservice Architecture', sector: 'web_dev', difficulty: 'Hard', applicant_count: 98, is_active: true, created_at: '2026-05-06' },
  { id: '3', title: 'ML Model Deployment', sector: 'data_ai', difficulty: 'Medium', applicant_count: 44, is_active: false, created_at: '2026-05-01' },
]
const MOCK_TOP = [
  { name: 'Alex Johnson', score: 985, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', challenge: 'Real-Time Dashboard', rank: 1 },
  { name: 'James Liu', score: 920, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', challenge: 'FastAPI Microservice', rank: 2 },
  { name: 'Priya Sharma', score: 878, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', challenge: 'ML Model Deployment', rank: 3 },
]
const MOCK_EMPLOYEES = [
  { name: 'Sarah Chen', role: 'Senior Data Scientist', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { name: 'Mike Peters', role: 'DevOps Lead', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
]

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 text-sm">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div className="stat-number" style={{ color }}>{value}</div>
    </div>
  )
}

export default function CompanyDashboard() {
  const { profile } = useAuth()
  const [challenges, setChallenges] = useState(MOCK_CHALLENGES)
  const [stats, setStats] = useState(MOCK_STATS)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('challenges').select('*').eq('company_id', profile?.id)
      if (data?.length) setChallenges(data)
    }
    if (profile?.id) load()
  }, [profile])

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {profile?.company_name || 'Company'} Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">Manage your challenges and top talent</p>
          </div>
          <Link to="/company/challenges/create" className="btn btn-primary">
            <Plus size={16} /> Post Challenge
          </Link>
        </div>
      </div>

      <div className="page-body space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Briefcase} label="Active Challenges" value={stats.challenges} color="#6366F1" />
          <StatCard icon={Users} label="Total Applicants" value={stats.applicants} color="#06B6D4" />
          <StatCard icon={Trophy} label="Top Score" value={stats.topScore} color="#F59E0B" />
          <StatCard icon={Video} label="Interview Rooms" value={stats.openRooms} color="#10B981" />
        </div>

        {/* Top candidates */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Trophy size={18} style={{ color: '#F59E0B' }} /> Top Candidates
            </h2>
            <Link to="/leaderboard" className="btn btn-secondary btn-sm">Full Leaderboard <ArrowRight size={13} /></Link>
          </div>
          <div className="space-y-3">
            {MOCK_TOP.map(c => (
              <div key={c.name} className="lb-row top-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-slate-900"
                  style={{ background: c.rank === 1 ? 'linear-gradient(135deg,#F59E0B,#EF4444)' : c.rank === 2 ? 'linear-gradient(135deg,#9CA3AF,#6B7280)' : 'linear-gradient(135deg,#CD7F32,#92400E)' }}>
                  #{c.rank}
                </div>
                <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.challenge}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg gradient-text">{c.score}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 justify-end"><Star size={9} className="text-yellow-500" /> pts</p>
                </div>
                <Link to="/company/interviews" className="btn btn-secondary btn-sm hidden md:flex gap-2">
                  <Video size={13} /> Interview
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* My challenges */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900">My Challenges</h2>
            <Link to="/company/challenges" className="btn btn-secondary btn-sm">Manage <ArrowRight size={13} /></Link>
          </div>
          <div className="space-y-3">
            {challenges.map(ch => (
              <div key={ch.id} className="card p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm">{ch.title}</h3>
                    <span className={`badge badge-${ch.difficulty?.toLowerCase()}`}>{ch.difficulty}</span>
                    {!ch.is_active && <span className="badge" style={{ background: '#F1F5F9', color: '#64748B' }}>Closed</span>}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <Users size={11} /> {ch.applicant_count} applicants
                    <Clock size={11} className="ml-2" /> {new Date(ch.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/company/matches?challenge=${ch.id}`} className="btn btn-secondary btn-sm">
                    <Zap size={12} /> Match
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Employees */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users size={18} style={{ color: '#06B6D4' }} /> Our Employees
            </h2>
            <Link to="/company/matches" className="btn btn-secondary btn-sm">Nominate <ArrowRight size={13} /></Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {MOCK_EMPLOYEES.map(emp => (
              <div key={emp.name} className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: '#06B6D4' }}>
                <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900">{emp.name}</h3>
                  <p className="text-sm text-slate-500">{emp.role}</p>
                </div>
                <span className="badge bg-green-100 text-green-700 border-green-200">{emp.status}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Post Challenge', icon: Plus, to: '/company/challenges/create', color: '#6366F1' },
              { label: 'Internal Match', icon: TrendingUp, to: '/company/matches', color: '#8B5CF6' },
              { label: 'Interview Rooms', icon: Video, to: '/company/interviews', color: '#06B6D4' },
              { label: 'Leaderboard', icon: Trophy, to: '/leaderboard', color: '#F59E0B' },
            ].map(a => (
              <Link key={a.label} to={a.to} className="card p-4 text-center hover:scale-105 transition-transform">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                  style={{ background: `${a.color}15` }}>
                  <a.icon size={18} style={{ color: a.color }} />
                </div>
                <p className="text-xs font-medium text-slate-700">{a.label}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

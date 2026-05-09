import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import {
  Briefcase, Trophy, Target, TrendingUp, Clock, CheckCircle,
  Zap, ArrowRight, Star, Code2, Brain, Cloud, Shield, Database, Flame, Video
} from 'lucide-react'

const SECTOR_COLORS = {
  web_dev: '#6366F1', data_ai: '#8B5CF6', cloud_devops: '#06B6D4',
  cybersecurity: '#EF4444', mobile_dev: '#10B981',
}
const SECTOR_LABELS = {
  web_dev: 'Web Dev', data_ai: 'Data & AI', cloud_devops: 'Cloud/DevOps',
  cybersecurity: 'Cybersecurity', mobile_dev: 'Mobile Dev',
}
const SECTOR_ICONS = {
  web_dev: Code2, data_ai: Brain, cloud_devops: Cloud,
  cybersecurity: Shield, mobile_dev: Database,
}

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 text-sm">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18` }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div className="stat-number" style={{ color }}>{value}</div>
      {sub && <p className="stat-label">{sub}</p>}
    </div>
  )
}

export default function ApplicantDashboard() {
  const { profile } = useAuth()
  const [challenges, setChallenges] = useState([])
  const [mySubmissions, setMySubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [globalRank, setGlobalRank] = useState('—')
  const [bestScore, setBestScore] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch active challenges
      const { data: cData } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .limit(4)
        .order('created_at', { ascending: false })

      // Fetch my submissions
      const { data: sData } = await supabase
        .from('submissions')
        .select('*, challenges(title, sector, difficulty)')
        .order('created_at', { ascending: false })
        .limit(5)

      if (cData) setChallenges(cData)
      if (sData) {
        setMySubmissions(sData)
        const best = Math.max(...sData.map(s => s.total_score || 0), 0)
        setBestScore(best)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Use mock data if no real data
  const displayChallenges = challenges.length > 0 ? challenges : [
    { id: '1', title: 'Build a Real-Time Dashboard', sector: 'web_dev', difficulty: 'Hard', time_limit_mins: 75, skills_required: ['React', 'WebSockets'] },
    { id: '2', title: 'ML Model Deployment Pipeline', sector: 'data_ai', difficulty: 'Medium', time_limit_mins: 60, skills_required: ['Python', 'MLflow'] },
    { id: '3', title: 'Kubernetes Security Hardening', sector: 'cloud_devops', difficulty: 'Hard', time_limit_mins: 90, skills_required: ['K8s', 'Docker'] },
    { id: '4', title: 'Penetration Testing Challenge', sector: 'cybersecurity', difficulty: 'Hard', time_limit_mins: 120, skills_required: ['Kali Linux', 'Python'] },
  ]

  const displaySubmissions = mySubmissions.length > 0 ? mySubmissions : [
    { id: '1', total_score: 850, current_round: 3, status: 'completed', challenges: { title: 'FastAPI Microservice Architecture', sector: 'web_dev', difficulty: 'Hard' } },
    { id: '2', total_score: 0, current_round: 1, status: 'in_progress', challenges: { title: 'ML Pipeline Challenge', sector: 'data_ai', difficulty: 'Medium' } },
  ]

  const completedCount = displaySubmissions.filter(s => s.status === 'completed').length
  const inProgressCount = displaySubmissions.filter(s => s.status === 'in_progress').length

  const mockInterviews = [
    { id: 1, company: 'TechNova', role: 'Full Stack Engineer', type: 'Interview Now', status: 'pending', date: 'Today' },
    { id: 2, company: 'DataSphere', role: 'ML Engineer', type: 'Scheduled', status: 'upcoming', date: 'Tomorrow, 10:00 AM' }
  ]

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Challenger'} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">Ready to prove your skills today?</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <span className="text-xs text-slate-500">Live Rankings Active</span>
          </div>
        </div>
      </div>

      <div className="page-body space-y-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Trophy} label="Global Rank" value={globalRank} color="#F59E0B" sub="Updated live" />
          <StatCard icon={Star} label="Best Score" value={bestScore || '—'} color="#6366F1" sub="All time" />
          <StatCard icon={CheckCircle} label="Completed" value={completedCount} color="#10B981" sub="Challenges" />
          <StatCard icon={Target} label="In Progress" value={inProgressCount} color="#06B6D4" sub="Active tests" />
        </div>

        {/* Available Challenges */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Flame size={18} style={{ color: '#EF4444' }} />
              Open Challenges
            </h2>
            <Link to="/app/challenges" className="btn btn-secondary btn-sm gap-2">
              View all <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {displayChallenges.map((ch) => {
              const SectorIcon = SECTOR_ICONS[ch.sector] || Code2
              const sectorColor = SECTOR_COLORS[ch.sector] || '#6366F1'
              return (
                <div key={ch.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${sectorColor}18` }}>
                        <SectorIcon size={18} style={{ color: sectorColor }} />
                      </div>
                      <div>
                        <span className="text-xs font-medium" style={{ color: sectorColor }}>
                          {SECTOR_LABELS[ch.sector]}
                        </span>
                      </div>
                    </div>
                    <span className={`badge badge-${ch.difficulty?.toLowerCase()}`}>{ch.difficulty}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 mb-2">{ch.title}</h3>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(ch.skills_required || []).slice(0, 3).map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock size={12} />
                      {ch.time_limit_mins} min
                    </div>
                    <Link
                      to={`/exam/${ch.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <Zap size={13} />
                      Start Challenge
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* My Submissions */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <TrendingUp size={18} style={{ color: '#6366F1' }} />
            My Attempts
          </h2>

          <div className="card-flat overflow-hidden">
            {displaySubmissions.length > 0 ? (
              <div className="divide-y divide-slate-200">
                {displaySubmissions.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: sub.status === 'completed' ? '#10B981' : sub.status === 'in_progress' ? '#F59E0B' : '#EF4444' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{sub.challenges?.title}</p>
                      <p className="text-xs text-slate-500">
                        Round {sub.current_round}/3 · {sub.challenges?.difficulty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{sub.total_score || 0} <span className="text-xs text-slate-500 font-normal">pts</span></p>
                      <span className={`text-xs ${sub.status === 'completed' ? 'text-green-400' : sub.status === 'in_progress' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {sub.status === 'completed' ? '✓ Completed' : sub.status === 'in_progress' ? '⟳ In Progress' : '✗ Disqualified'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Briefcase size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No challenges attempted yet</p>
                <Link to="/app/challenges" className="btn btn-primary btn-sm mt-4">
                  Browse Challenges
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Interviews & Jobs */}
        <section className="mt-8 mb-4">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Video size={18} style={{ color: '#06B6D4' }} />
            Interview Invites & Jobs
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {mockInterviews.map((inv) => (
              <div key={inv.id} className="card p-5 border-blue-100 bg-blue-50/30 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900">{inv.company}</h3>
                    <p className="text-sm text-slate-600">{inv.role}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${inv.type === 'Interview Now' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
                    {inv.type}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
                  <span className="text-xs font-medium text-slate-500">{inv.date}</span>
                  <button className="btn btn-primary btn-sm shadow-sm gap-1.5">
                    <Video size={13} />
                    Join Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills summary */}
        {profile?.skills?.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Your Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

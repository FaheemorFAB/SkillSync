import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  Trophy, Star, TrendingUp, Rocket, Filter, Search,
  Medal, Crown, Zap, RefreshCw, Video
} from 'lucide-react'

const MOCK_DATA = [
  { id: 1, name: 'Alex Johnson', score: 985, sector: 'web_dev', challenge: 'Build a Real-Time Dashboard', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', skills: ['React', 'TypeScript', 'WebSockets'], global_rank: 1, difficulty: 'Hard' },
  { id: 2, name: 'Sarah Chen', score: 942, sector: 'data_ai', challenge: 'ML Model Deployment Pipeline', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', skills: ['Python', 'MLflow', 'Docker'], global_rank: 2, difficulty: 'Medium' },
  { id: 3, name: 'Mike Peters', score: 890, sector: 'cloud_devops', challenge: 'Kubernetes Security Hardening', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', skills: ['Kubernetes', 'Docker', 'Security'], global_rank: 3, difficulty: 'Hard' },
  { id: 4, name: 'Elena Rodriguez', score: 855, sector: 'cybersecurity', challenge: 'Penetration Testing Challenge', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', skills: ['Kali Linux', 'Python', 'OWASP'], global_rank: 4, difficulty: 'Hard' },
  { id: 5, name: 'James Liu', score: 823, sector: 'web_dev', challenge: 'FastAPI Microservice Architecture', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', skills: ['FastAPI', 'PostgreSQL', 'Redis'], global_rank: 5, difficulty: 'Hard' },
  { id: 6, name: 'Priya Sharma', score: 790, sector: 'data_ai', challenge: 'ML Model Deployment Pipeline', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', skills: ['TensorFlow', 'Python', 'MLOps'], global_rank: 6, difficulty: 'Medium' },
  { id: 7, name: 'Omar Hassan', score: 756, sector: 'cloud_devops', challenge: 'Kubernetes Security Hardening', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar', skills: ['AWS', 'Terraform', 'Helm'], global_rank: 7, difficulty: 'Hard' },
  { id: 8, name: 'Yuki Tanaka', score: 720, sector: 'web_dev', challenge: 'Build a Real-Time Dashboard', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki', skills: ['Vue.js', 'Node.js', 'MongoDB'], global_rank: 8, difficulty: 'Hard' },
]

const SECTOR_LABELS = {
  web_dev: 'Web Dev',
  mobile_dev: 'Mobile',
  data_ai: 'Data & AI',
  cloud_devops: 'Cloud/DevOps',
  cybersecurity: 'Cybersecurity',
  all: 'All Sectors',
}

const SECTOR_COLORS = {
  web_dev: '#2563EB',
  data_ai: '#0891B2',
  cloud_devops: '#059669',
  cybersecurity: '#DC2626',
  mobile_dev: '#D97706',
}

function RankBadge({ rank }) {
  if (rank === 1) return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm"
      style={{ background: 'linear-gradient(135deg, #F59E0B, #DC2626)' }}>
      <Crown size={18} />
    </div>
  )
  if (rank === 2) return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
      style={{ background: 'linear-gradient(135deg, #94A3B8, #64748B)', color: 'white' }}>
      #{rank}
    </div>
  )
  if (rank === 3) return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
      style={{ background: 'linear-gradient(135deg, #D97706, #92400E)', color: 'white' }}>
      #{rank}
    </div>
  )
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-slate-500 bg-slate-100 border border-slate-200">
      #{rank}
    </div>
  )
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState(MOCK_DATA)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [pulsingId, setPulsingId] = useState(null)

  // Subscribe to real-time leaderboard updates
  useEffect(() => {
    const channel = supabase
      .channel('leaderboard-realtime')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'submissions',
      }, (payload) => {
        console.log('Leaderboard update:', payload)
        setLastUpdate(new Date())
        setPulsingId(payload.new?.applicant_id)
        setTimeout(() => setPulsingId(null), 2000)
        // In production: refetch leaderboard data here
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const filtered = entries.filter(e => {
    const matchSector = filter === 'all' || e.sector === filter
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.challenge.toLowerCase().includes(search.toLowerCase())
    return matchSector && matchSearch
  })

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
              <Rocket size={16} color="white" />
            </div>
            <span className="font-bold text-lg text-slate-900">SkillSync</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Join Free</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 bg-amber-50 text-amber-600 border border-amber-200">
            <Trophy size={12} />
            Global Rankings
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            Talent <span className="gradient-text-gold">Leaderboard</span>
          </h1>
          <p className="text-slate-500">Real-time rankings of verified skill assessments</p>
        </div>

        {/* Live indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <span className="text-sm text-slate-500">
              Live · Updated {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
          <button
            onClick={() => setLastUpdate(new Date())}
            className="btn btn-secondary btn-sm gap-2"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="lb-search"
              type="text"
              className="input pl-9"
              placeholder="Search by name or challenge..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            id="lb-filter"
            className="select sm:w-48"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {Object.entries(SECTOR_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Top 3 podium */}
        {filter === 'all' && search === '' && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[MOCK_DATA[1], MOCK_DATA[0], MOCK_DATA[2]].map((entry, i) => {
              const positions = [2, 1, 3]
              const heights = ['h-28', 'h-36', 'h-24']
              const colors = [
                'linear-gradient(135deg, #94A3B8, #64748B)',
                'linear-gradient(135deg, #F59E0B, #DC2626)',
                'linear-gradient(135deg, #D97706, #92400E)',
              ]
              return (
                <div key={entry.id} className={`flex flex-col items-center ${i === 1 ? 'order-first md:order-none' : ''}`}>
                  <img src={entry.avatar} alt={entry.name}
                    className="w-14 h-14 rounded-full mb-2 border-2 bg-white"
                    style={{ borderColor: SECTOR_COLORS[entry.sector] || '#2563EB' }} />
                  <p className="text-xs font-semibold text-slate-900 text-center truncate max-w-full px-2">{entry.name}</p>
                  <p className="text-xs text-slate-500 mb-2">{entry.score} pts</p>
                  <div className={`w-full ${heights[i]} rounded-t-xl flex items-center justify-center text-white font-black text-xl`}
                    style={{ background: colors[i] }}>
                    #{positions[i]}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Leaderboard table */}
        <div className="card-flat overflow-hidden bg-white">
          <div className="border-b border-slate-200 px-5 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">{filtered.length} Participants</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter size={11} />
              {SECTOR_LABELS[filter]}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.map((entry) => (
              <div
                key={entry.id}
                className={`lb-row mx-4 my-2 ${entry.global_rank <= 3 ? 'top-3' : ''} ${pulsingId === entry.id ? 'animate-glow' : ''}`}
              >
                <RankBadge rank={entry.global_rank} />

                <img src={entry.avatar} alt={entry.name}
                  className="w-11 h-11 rounded-full border border-slate-200 bg-slate-50" />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{entry.name}</p>
                  <p className="text-xs text-slate-500 truncate">{entry.challenge}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {entry.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="skill-tag text-xs px-2 py-0">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="hidden md:block">
                  <span className="badge" style={{
                    background: `${SECTOR_COLORS[entry.sector]}18`,
                    color: SECTOR_COLORS[entry.sector],
                    border: `1px solid ${SECTOR_COLORS[entry.sector]}30`
                  }}>
                    {SECTOR_LABELS[entry.sector]}
                  </span>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-black" style={{
                    background: entry.global_rank <= 3 ? 'linear-gradient(135deg, #F59E0B, #DC2626)' : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {entry.score}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-xs text-slate-500 mt-0.5">
                    <Star size={10} className="text-amber-500" />
                    points
                  </div>
                </div>

                {entry.global_rank <= 3 && (
                  <button className="btn btn-secondary btn-sm hidden md:flex gap-2">
                    <Video size={13} />
                    Interview
                  </button>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                <Trophy size={40} className="mx-auto mb-3 opacity-30" />
                <p>No results found</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/signup?role=applicant" className="btn btn-primary btn-lg shadow-md">
            <Zap size={16} />
            Join the Leaderboard
          </Link>
        </div>
      </div>
    </div>
  )
}

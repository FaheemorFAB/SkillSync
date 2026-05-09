import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  Search, Filter, Clock, Zap, Code2, Brain, Cloud, Shield, Database,
  ChevronRight, BarChart2, Users
} from 'lucide-react'

const SECTORS = [
  { id: 'all', label: 'All Sectors', icon: BarChart2, color: '#6366F1' },
  { id: 'web_dev', label: 'Web Dev', icon: Code2, color: '#6366F1' },
  { id: 'data_ai', label: 'Data & AI', icon: Brain, color: '#8B5CF6' },
  { id: 'cloud_devops', label: 'Cloud/DevOps', icon: Cloud, color: '#06B6D4' },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: Shield, color: '#EF4444' },
  { id: 'mobile_dev', label: 'Mobile', icon: Database, color: '#10B981' },
]

const MOCK_CHALLENGES = [
  { id: '1', title: 'Build a Real-Time Dashboard', sector: 'web_dev', difficulty: 'Hard', time_limit_mins: 75, skills_required: ['React', 'TypeScript', 'WebSockets'], applicant_count: 142 },
  { id: '2', title: 'ML Model Deployment Pipeline', sector: 'data_ai', difficulty: 'Medium', time_limit_mins: 60, skills_required: ['Python', 'MLflow', 'Docker'], applicant_count: 89 },
  { id: '3', title: 'Kubernetes Security Hardening', sector: 'cloud_devops', difficulty: 'Hard', time_limit_mins: 90, skills_required: ['Kubernetes', 'Docker', 'Helm'], applicant_count: 67 },
  { id: '4', title: 'Penetration Testing Challenge', sector: 'cybersecurity', difficulty: 'Hard', time_limit_mins: 120, skills_required: ['Kali Linux', 'Burp Suite', 'Python'], applicant_count: 55 },
  { id: '5', title: 'FastAPI Microservice Architecture', sector: 'web_dev', difficulty: 'Hard', time_limit_mins: 90, skills_required: ['FastAPI', 'PostgreSQL', 'Docker'], applicant_count: 98 },
  { id: '6', title: 'Flutter Cross-Platform App', sector: 'mobile_dev', difficulty: 'Medium', time_limit_mins: 75, skills_required: ['Flutter', 'Dart', 'Firebase'], applicant_count: 43 },
  { id: '7', title: 'Generative AI Chatbot', sector: 'data_ai', difficulty: 'Medium', time_limit_mins: 60, skills_required: ['Python', 'LangChain', 'OpenAI'], applicant_count: 134 },
  { id: '8', title: 'AWS Infrastructure as Code', sector: 'cloud_devops', difficulty: 'Hard', time_limit_mins: 90, skills_required: ['Terraform', 'AWS', 'CloudFormation'], applicant_count: 52 },
]

const SECTOR_COLORS = {
  web_dev: '#6366F1', data_ai: '#8B5CF6', cloud_devops: '#06B6D4',
  cybersecurity: '#EF4444', mobile_dev: '#10B981',
}

export default function ChallengesPage() {
  const [activeSector, setActiveSector] = useState('all')
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (data && data.length > 0) setChallenges(data)
    else setChallenges(MOCK_CHALLENGES)
    setLoading(false)
  }

  const filtered = challenges.filter(ch => {
    const matchSector = activeSector === 'all' || ch.sector === activeSector
    const matchDiff = difficulty === 'all' || ch.difficulty === difficulty
    const matchSearch = ch.title.toLowerCase().includes(search.toLowerCase()) ||
      (ch.skills_required || []).some(s => s.toLowerCase().includes(search.toLowerCase()))
    return matchSector && matchDiff && matchSearch
  })

  return (
    <div>
      <div className="page-header">
        <h1 className="text-2xl font-bold text-white">Industry Challenges</h1>
        <p className="text-gray-400 text-sm mt-1">
          {challenges.length} open challenges across {SECTORS.length - 1} sectors
        </p>
      </div>

      <div className="page-body space-y-6">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              id="challenges-search"
              type="text"
              className="input pl-9"
              placeholder="Search challenges or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            id="challenges-difficulty"
            className="select sm:w-44"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Sector pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SECTORS.map((sector) => (
            <button
              key={sector.id}
              id={`sector-${sector.id}`}
              onClick={() => setActiveSector(sector.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border whitespace-nowrap text-sm font-medium transition-all flex-shrink-0"
              style={{
                borderColor: activeSector === sector.id ? sector.color : 'rgba(255,255,255,0.08)',
                background: activeSector === sector.id ? `${sector.color}15` : 'transparent',
                color: activeSector === sector.id ? sector.color : '#9CA3AF',
              }}
            >
              <sector.icon size={14} />
              {sector.label}
            </button>
          ))}
        </div>

        {/* Challenge grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="card p-6 space-y-3">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-8 w-full mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((ch) => {
              const sectorColor = SECTOR_COLORS[ch.sector] || '#6366F1'
              const SectorObj = SECTORS.find(s => s.id === ch.sector)
              const SectorIcon = SectorObj?.icon || Code2

              return (
                <div key={ch.id} className="card p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${sectorColor}15` }}>
                        <SectorIcon size={18} style={{ color: sectorColor }} />
                      </div>
                      <div>
                        <p className="text-xs font-medium" style={{ color: sectorColor }}>
                          {SectorObj?.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <Users size={10} />
                          {ch.applicant_count || 0} applicants
                        </p>
                      </div>
                    </div>
                    <span className={`badge badge-${ch.difficulty?.toLowerCase()}`}>{ch.difficulty}</span>
                  </div>

                  <h3 className="font-bold text-white text-base mb-3 leading-snug">{ch.title}</h3>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(ch.skills_required || []).map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>

                  {/* Round info */}
                  <div className="flex items-center gap-3 mb-4 p-3 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    {['Aptitude', 'Technical', 'Industry'].map((r, i) => (
                      <React.Fragment key={r}>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">R{i+1}</div>
                          <div className="text-xs font-medium text-gray-300">{r}</div>
                        </div>
                        {i < 2 && <ChevronRight size={12} className="text-gray-700" />}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock size={12} />
                      {ch.time_limit_mins} min total
                    </div>
                    <Link
                      to={`/exam/${ch.id}`}
                      id={`start-${ch.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <Zap size={13} />
                      Start
                    </Link>
                  </div>
                </div>
              )
            })}

            {filtered.length === 0 && !loading && (
              <div className="col-span-2 text-center py-16 card">
                <Filter size={36} className="mx-auto mb-3 text-gray-700" />
                <p className="text-gray-500">No challenges match your filters</p>
                <button onClick={() => { setActiveSector('all'); setSearch(''); setDifficulty('all') }}
                  className="btn btn-secondary btn-sm mt-4">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

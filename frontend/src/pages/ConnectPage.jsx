import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Search, Users as UsersIcon, User as UserIcon, Github, Linkedin, Globe, ExternalLink } from 'lucide-react'

export default function ConnectPage() {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      // Fetch all profiles except current user
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id || '')
        .order('full_name')
      
      if (data) setProfiles(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    p.role?.toLowerCase().includes(search.toLowerCase()) ||
    p.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )



  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="page-header mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <UsersIcon size={20} />
          </div>
          Connect & Network
        </h1>
        <p className="text-slate-500">Search for peers, applicants, or companies and explore their professional profiles.</p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, role, or skills..."
          className="input pl-12 py-4 shadow-sm text-lg"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map(p => (
            <div key={p.id} className="card p-5 flex flex-col hover:border-blue-300 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <img 
                  src={p.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${p.full_name || 'User'}&backgroundColor=0ea5e9`} 
                  alt={p.full_name}
                  className="w-14 h-14 rounded-full border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{p.full_name}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">{p.role}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-5 flex-1 content-start">
                {p.skills?.slice(0, 4).map(s => (
                  <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium border border-slate-200">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                {p.social_links?.github && (
                  <a href={p.social_links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200">
                    <Github size={16} />
                    <span className="flex-1 truncate">GitHub</span>
                    <ExternalLink size={14} className="text-slate-400" />
                  </a>
                )}
                {p.social_links?.linkedin && (
                  <a href={p.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200">
                    <Linkedin size={16} />
                    <span className="flex-1 truncate">LinkedIn</span>
                    <ExternalLink size={14} className="text-slate-400" />
                  </a>
                )}
                {p.social_links?.website && (
                  <a href={p.social_links.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200">
                    <Globe size={16} />
                    <span className="flex-1 truncate">Website</span>
                    <ExternalLink size={14} className="text-slate-400" />
                  </a>
                )}
                
                {(!p.social_links || (!p.social_links.github && !p.social_links.linkedin && !p.social_links.website)) && (
                  <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">No social links provided</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {filteredProfiles.length === 0 && (
            <div className="col-span-full text-center py-16 text-slate-500">
              <UserIcon size={48} className="mx-auto mb-4 opacity-20" />
              <p>No profiles found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

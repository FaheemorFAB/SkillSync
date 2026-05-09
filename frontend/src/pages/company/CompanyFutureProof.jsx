import React, { useState } from 'react'
import { Lightbulb, Rocket, Brain, Loader2, ArrowRight, Server, Briefcase } from 'lucide-react'
import toast from '../../lib/toast.jsx'

export default function CompanyFutureProof() {
  const [formData, setFormData] = useState({ sector: 'web_dev', tech_stack: '', business_challenge: '' })
  const [loading, setLoading] = useState(false)
  const [strategy, setStrategy] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.tech_stack || !formData.business_challenge) {
      toast.error('Please fill out all fields.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/future-proof-strategy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to fetch strategy')
      
      const data = await res.json()
      setStrategy(data.strategy)
      toast.success('Innovation strategy generated successfully.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate strategy. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="page-header mb-8 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="text-blue-600" /> Innovation Strategy AI
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Future-proof your organization with AI-driven architectural blueprints.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card p-6 border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Briefcase size={18} className="text-blue-600" /> Organization Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Industry Sector</label>
              <select className="select bg-slate-50" value={formData.sector} onChange={e => setFormData({ ...formData, sector: e.target.value })}>
                <option value="web_dev">Web Development</option>
                <option value="data_ai">Data Science & AI</option>
                <option value="cloud_devops">Cloud & DevOps</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="mobile_dev">Mobile Development</option>
              </select>
            </div>
            
            <div>
              <label className="input-label">Current Tech Stack</label>
              <textarea 
                className="input bg-slate-50" 
                placeholder="e.g., Monolithic Node.js backend, React frontend, AWS EC2..."
                value={formData.tech_stack}
                onChange={e => setFormData({ ...formData, tech_stack: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <label className="input-label">Core Business Challenge</label>
              <textarea 
                className="input bg-slate-50" 
                placeholder="e.g., Struggling to scale our database, slow deployment times, legacy UI..."
                value={formData.business_challenge}
                onChange={e => setFormData({ ...formData, business_challenge: e.target.value })}
                rows={3}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full shadow-md" disabled={loading}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Generating Blueprint...</> : <><Brain size={16} /> Generate Strategy</>}
            </button>
          </form>
        </div>

        <div>
          <div className="card p-6 border-slate-200 shadow-sm h-full flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Rocket size={18} className="text-blue-600" /> Strategic Blueprint
            </h2>
            
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <Loader2 size={32} className="animate-spin text-blue-500 mb-4" />
                <p className="font-medium">Analyzing architecture constraints...</p>
                <p className="text-xs mt-1">Our AI is formulating an innovation roadmap.</p>
              </div>
            ) : strategy ? (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex-1">
                <h3 className="font-bold text-blue-900 mb-3 text-sm uppercase tracking-wider">Actionable Recommendations</h3>
                <div className="space-y-3 text-sm text-blue-800 font-medium leading-relaxed whitespace-pre-wrap">
                  {strategy}
                </div>
                <div className="mt-6 flex justify-end">
                   <button onClick={() => toast.success('Blueprint copied to clipboard')} className="btn btn-sm bg-white text-blue-600 border border-blue-200 shadow-sm hover:bg-blue-50">
                     Copy to Clipboard
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center">
                <Server size={40} className="mb-4 text-slate-300 opacity-50" />
                <p className="font-medium">No blueprint generated yet.</p>
                <p className="text-sm mt-1 max-w-[200px]">Fill out your organization profile to receive AI-driven strategic advice.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

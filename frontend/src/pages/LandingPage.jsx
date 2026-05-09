import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Rocket, Trophy, Shield, Zap, Users, Code2, Database, Cloud,
  Brain, ChevronRight, Star, CheckCircle, TrendingUp, ArrowRight, Lock, Video, Lightbulb
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const SECTORS = [
  { icon: Code2, name: 'Web Development', color: '#2563EB', desc: 'Frontend, Backend & Fullstack' },
  { icon: Brain, name: 'Data Science & AI', color: '#1D4ED8', desc: 'ML, Data Eng & GenAI' },
  { icon: Cloud, name: 'Cloud & DevOps', color: '#0891B2', desc: 'IaC, Docker/K8s & Architecture' },
  { icon: Shield, name: 'Cybersecurity', color: '#DC2626', desc: 'PenTest, Auditing & Threat Intel' },
  { icon: Database, name: 'Mobile Dev', color: '#059669', desc: 'Flutter, React Native & Native' },
]

const ROUNDS = [
  {
    num: 1,
    name: 'Strategic Aptitude',
    desc: 'AI-generated logic, pattern recognition & critical thinking assessment.',
    color: '#2563EB',
    icon: Brain,
    detail: '20 adaptive MCQs · 30 min'
  },
  {
    num: 2,
    name: 'Technical Innovation',
    desc: 'Core syntax & problem-solving challenges via live code execution.',
    color: '#1D4ED8',
    icon: Code2,
    detail: 'Execution-focused · 45 min'
  },
  {
    num: 3,
    name: 'Future-Proof Scenario',
    desc: 'Real-world domain-specific scenario solving. Prove your vision.',
    color: '#0891B2',
    icon: Lightbulb,
    detail: 'Open-ended · 60 min'
  },
]

const STATS = [
  { label: 'Active Innovators', value: '12,400+' },
  { label: 'Future-Ready Orgs', value: '340+' },
  { label: 'Skills Verified', value: '98,000+' },
  { label: 'Avg ROI Increase', value: '32%' },
]

export default function LandingPage() {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* === NAVBAR === */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-600 text-white shadow-md">
              <Rocket size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">SkillSync</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/leaderboard" className="nav-link font-medium">Leaderboard</Link>
            <a href="#how-it-works" className="nav-link font-medium">Methodology</a>
            <a href="#sectors" className="nav-link font-medium">Sectors</a>
          </div>

          <div className="flex items-center gap-3">
            {profile ? (
              <Link 
                to={profile.role === 'company' ? '/company/dashboard' : profile.role === 'employee' ? '/employee/dashboard' : '/app/dashboard'} 
                className="btn btn-primary btn-sm shadow-md"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-sm shadow-md">
                  Get Started <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* === HERO === */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 bg-gradient-to-b from-slate-50 to-blue-50/50">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
            <Lightbulb size={14} />
            The Future Belongs to Those Who Innovate Today
            <span className="live-dot ml-1" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Future-Proof Your Business.<br />
            <span className="text-blue-600">Hire for Tomorrow.</span>
          </h1>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Stop relying on outdated credentials. Connect to elite talent through <strong className="text-slate-900">verified problem-solving</strong> and AI-driven skill assessment. 
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/signup?role=company" className="btn btn-primary btn-lg shadow-lg">
              <Users size={18} />
              Future-Proof My Team
            </Link>
            <Link to="/signup?role=applicant" className="btn btn-secondary btn-lg bg-white border-slate-300 shadow-sm">
              <Rocket size={18} className="text-blue-600" />
              Prove My Skills
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-blue-600 mb-1 tracking-tight">{s.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section id="how-it-works" className="py-24 relative bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 bg-blue-50 text-blue-700 uppercase tracking-wider">
              Methodology
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Assessment That <span className="text-blue-600">Drives Innovation</span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto font-medium">
              We replace static resumes with a 3-round architecture designed to reveal true problem-solving capabilities and strategic vision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ROUNDS.map((round, i) => (
              <div key={round.num} className="card p-8 relative overflow-hidden group hover:border-blue-300">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 font-black text-xl bg-blue-100 text-blue-700">
                  {round.num}
                </div>

                <div className="badge mb-4 bg-slate-100 text-slate-700 border-slate-200">
                  Phase {round.num}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">{round.name}</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{round.desc}</p>

                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                  <round.icon size={14} />
                  {round.detail}
                </div>

                {/* Connector arrow */}
                {i < ROUNDS.length - 1 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden md:block text-slate-300">
                    <ChevronRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === SECTORS === */}
      <section id="sectors" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Innovation <span className="text-blue-600">Sectors</span>
            </h2>
            <p className="text-slate-600 font-medium">Recruit visionary talent across specialized domains.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SECTORS.map((sector) => (
              <Link
                key={sector.name}
                to="/signup?role=applicant"
                className="sector-card group relative overflow-hidden bg-white hover:bg-blue-50"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-slate-100 group-hover:bg-blue-100 transition-colors">
                  <sector.icon size={22} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 text-center mb-1">{sector.name}</h3>
                <p className="text-xs text-slate-500 text-center leading-relaxed">{sector.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === ANTI-CHEAT FEATURE === */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="badge badge-live mb-6 border-emerald-200">
                <Shield size={11} />
                Enterprise-Grade Security
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                Integrity You Can<br /><span className="text-blue-600">Trust</span>
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                Our behavioral monitoring system goes beyond simple blocking — it analyzes patterns to ensure the talent you hire is truly capable of the innovation they claim.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Lock, text: 'Strict environment lockdown & tracking' },
                  { icon: Shield, text: 'Tab-switch & focus-loss prevention' },
                  { icon: Brain, text: 'AI-driven anomaly detection' },
                  { icon: CheckCircle, text: 'Secure code-execution sandboxing' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-600">
                      <Icon size={15} />
                    </div>
                    <span className="text-slate-700 font-medium text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual mockup */}
            <div className="card p-6 shadow-xl border-slate-200">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-800">Integrity Monitor</span>
                <span className="badge badge-live text-xs">
                  <span className="live-dot" style={{ width: '6px', height: '6px' }} />
                  Active
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Focus Events', value: 'Normal', color: '#059669', pct: 100 },
                  { label: 'Code Execution', value: 'Sandboxed', color: '#059669', pct: 100 },
                  { label: 'Typing Rhythm', value: 'Consistent', color: '#D97706', pct: 85 },
                  { label: 'Copy Attempts', value: '0 detected', color: '#059669', pct: 100 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1.5 font-semibold">
                      <span className="text-slate-500 uppercase tracking-wider text-[10px]">{item.label}</span>
                      <span style={{ color: item.color }}>{item.value}</span>
                    </div>
                    <div className="progress-bar bg-slate-100">
                      <div className="progress-fill" style={{
                        width: `${item.pct}%`,
                        background: item.color
                      }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-3 rounded-lg text-sm flex items-center gap-2 font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <CheckCircle size={16} />
                Audit Passed: Verified Candidate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === FOR COMPANIES === */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Built for <span className="text-blue-600">Forward-Thinking Leaders</span>
            </h2>
            <p className="text-slate-600 font-medium">Equip your organization with the tools to innovate and adapt.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Lightbulb,
                color: '#2563EB',
                title: 'Future-Proof Strategy AI',
                desc: 'Input your tech stack and get tailored AI blueprints on how your organization can remain relevant and innovate today.'
              },
              {
                icon: Brain,
                color: '#1D4ED8',
                title: 'AI Challenge Creator',
                desc: 'Describe a business hurdle. Our AI generates a comprehensive 3-round assessment to find the exact problem-solver you need.'
              },
              {
                icon: Users,
                color: '#0891B2',
                title: 'Internal Innovation Match',
                desc: 'Compare new challenges against your existing team\'s verified skill profiles to uncover hidden talent within your own ranks.'
              },
            ].map((feat) => (
              <div key={feat.title} className="card p-8 bg-white hover:border-blue-300 transition-all shadow-sm">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-blue-50 text-blue-600">
                  <feat.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA BANNER === */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="card p-12 bg-blue-600 text-white border-none shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-blue-500 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 p-32 bg-blue-700 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/3"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                Ready to Innovate Today?
              </h2>
              <p className="text-blue-100 mb-10 text-lg font-medium max-w-2xl mx-auto">
                Join the enterprise platforms replacing outdated hiring with verified, future-proof skill validation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup?role=company" className="btn bg-white text-blue-700 hover:bg-slate-50 btn-lg shadow-lg font-bold">
                  <Users size={18} />
                  Future-Proof My Organization
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="border-t border-slate-200 py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600 text-white">
                  <Rocket size={16} />
                </div>
                <span className="font-bold text-slate-900 text-lg tracking-tight">SkillSync</span>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Empowering businesses to innovate today by hiring for tomorrow.
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Innovation Strategy', 'AI Challenges', 'Leaderboard', 'Security'] },
              { title: 'Enterprise', links: ['Future-Proofing', 'Internal Match', 'Analytics', 'Pricing'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-slate-900 text-sm mb-4 uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map(link => (
                    <li key={link}>
                      <Link to="/" className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-sm font-medium text-slate-400">
            © 2026 SkillSync Enterprise. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

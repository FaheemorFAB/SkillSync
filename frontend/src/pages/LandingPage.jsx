import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Rocket, Trophy, Shield, Zap, Users, Code2, Database, Cloud,
  Brain, ChevronRight, Star, CheckCircle, TrendingUp, ArrowRight, Lock
} from 'lucide-react'

const SECTORS = [
  { icon: Code2, name: 'Web Development', color: '#6366F1', desc: 'Frontend, Backend & Fullstack' },
  { icon: Brain, name: 'Data Science & AI', color: '#8B5CF6', desc: 'ML, Data Eng & GenAI' },
  { icon: Cloud, name: 'Cloud & DevOps', color: '#06B6D4', desc: 'IaC, Docker/K8s & Architecture' },
  { icon: Shield, name: 'Cybersecurity', color: '#EF4444', desc: 'PenTest, Auditing & Threat Intel' },
  { icon: Database, name: 'Mobile Dev', color: '#10B981', desc: 'Flutter, React Native & Native' },
]

const ROUNDS = [
  {
    num: 1,
    name: 'Aptitude',
    desc: 'AI-generated logic, pattern recognition & EQ assessment',
    color: '#6366F1',
    icon: Brain,
    detail: '20 adaptive MCQs · 30 min'
  },
  {
    num: 2,
    name: 'Technical',
    desc: 'Core syntax & algorithm challenges via live code execution',
    color: '#8B5CF6',
    icon: Code2,
    detail: 'LeetCode-style · 45 min'
  },
  {
    num: 3,
    name: 'Industry Problem',
    desc: 'Real-world domain-specific scenario solving',
    color: '#06B6D4',
    icon: Rocket,
    detail: 'Open-ended · 60 min'
  },
]

const STATS = [
  { label: 'Active Candidates', value: '12,400+' },
  { label: 'Companies Hiring', value: '340+' },
  { label: 'Skills Verified', value: '98,000+' },
  { label: 'Avg Salary Increase', value: '32%' },
]

export default function LandingPage() {
  return (
    <div style={{ background: '#0A0F1E', minHeight: '100vh' }}>
      {/* === NAVBAR === */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
              <Rocket size={18} color="white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">SkillSync</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#sectors" className="nav-link">Sectors</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* === HERO === */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background orbs */}
        <div className="orb orb-purple" style={{ top: '-100px', left: '-200px', opacity: 0.6 }} />
        <div className="orb orb-blue" style={{ bottom: '0', right: '-100px', opacity: 0.5 }} />
        <div className="orb orb-violet" style={{ top: '40%', left: '40%', transform: 'translate(-50%, -50%)', opacity: 0.3 }} />

        {/* Grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#A5B4FC' }}>
            <Zap size={14} />
            Skills-Based Hiring Platform
            <span className="live-dot ml-1" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Bypass Degree Inflation.<br />
            <span className="gradient-text">Prove Your Skill.</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect to roles through <strong className="text-white">verified problem-solving</strong> and AI-driven skill assessment.
            Stop submitting resumes. Start solving problems.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/signup?role=applicant" className="btn btn-primary btn-lg">
              <Rocket size={18} />
              Start as Applicant
            </Link>
            <Link to="/signup?role=company" className="btn btn-secondary btn-lg">
              <Users size={18} />
              Hire Talent
            </Link>
            <Link to="/leaderboard" className="btn btn-secondary btn-lg">
              <Trophy size={18} />
              View Leaderboard
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black gradient-text mb-1">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs">
          <span>Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-gray-700 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-indigo-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
              style={{ background: 'rgba(99,102,241,0.1)', color: '#818CF8' }}>
              The 3-Round System
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Assessment That <span className="gradient-text">Actually Works</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Each round is designed to reveal a different dimension of your ability — beyond what any resume can show.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ROUNDS.map((round, i) => (
              <div key={round.num} className="card p-8 relative overflow-hidden group">
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ background: round.color }} />

                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 font-black text-xl text-white"
                  style={{ background: `linear-gradient(135deg, ${round.color}, ${round.color}aa)` }}>
                  {round.num}
                </div>

                <div className="badge mb-4" style={{ background: `${round.color}18`, color: round.color, border: `1px solid ${round.color}30` }}>
                  Round {round.num}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{round.name}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{round.desc}</p>

                <div className="flex items-center gap-2 text-xs font-medium"
                  style={{ color: round.color }}>
                  <round.icon size={13} />
                  {round.detail}
                </div>

                {/* Connector arrow */}
                {i < ROUNDS.length - 1 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                    <ChevronRight size={24} style={{ color: round.color }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === SECTORS === */}
      <section id="sectors" className="py-24" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              5 Industry <span className="gradient-text">Sectors</span>
            </h2>
            <p className="text-gray-400">Find challenges specific to your domain expertise</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SECTORS.map((sector) => (
              <Link
                key={sector.name}
                to="/signup?role=applicant"
                className="sector-card group relative overflow-hidden"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl"
                  style={{ background: sector.color }} />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${sector.color}18` }}>
                  <sector.icon size={22} style={{ color: sector.color }} />
                </div>
                <h3 className="font-bold text-sm text-white text-center mb-1">{sector.name}</h3>
                <p className="text-xs text-gray-500 text-center leading-relaxed">{sector.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === ANTI-CHEAT FEATURE === */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="badge badge-live mb-6">
                <Shield size={11} />
                SkillSync Anti-Cheat
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                AI-Powered<br /><span className="gradient-text">Integrity Monitoring</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Our behavioral monitoring system goes beyond simple blocking —
                it analyzes patterns to ensure fair assessments for everyone.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Lock, text: 'Fullscreen enforcement with violation tracking' },
                  { icon: Shield, text: 'Tab-switch & focus-loss detection' },
                  { icon: Brain, text: 'Behavioral anomaly scoring' },
                  { icon: CheckCircle, text: 'Copy-paste prevention in exam zone' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(16,185,129,0.12)' }}>
                      <Icon size={15} style={{ color: '#10B981' }} />
                    </div>
                    <span className="text-gray-300 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual mockup */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white">Integrity Monitor</span>
                <span className="badge badge-live text-xs">
                  <span className="live-dot" style={{ width: '6px', height: '6px' }} />
                  Active
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Focus Events', value: 'Normal', color: '#10B981', pct: 100 },
                  { label: 'Mouse Movement', value: 'Natural', color: '#10B981', pct: 88 },
                  { label: 'Typing Rhythm', value: 'Consistent', color: '#F59E0B', pct: 76 },
                  { label: 'Copy Attempts', value: '0 detected', color: '#10B981', pct: 100 },
                  { label: 'Tab Switches', value: '0 violations', color: '#10B981', pct: 100 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{item.label}</span>
                      <span style={{ color: item.color }} className="font-medium">{item.value}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                        width: `${item.pct}%`,
                        background: `linear-gradient(90deg, ${item.color}88, ${item.color})`
                      }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg text-xs flex items-center gap-2 font-medium"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                <CheckCircle size={14} />
                Integrity Score: 96/100 — Excellent
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === FOR COMPANIES === */}
      <section className="py-24" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Built for <span className="gradient-text">Forward-Thinking Companies</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                color: '#6366F1',
                title: 'AI Problem Creator',
                desc: 'Describe a business problem and let our AI generate relevant, sector-specific test questions automatically.'
              },
              {
                icon: Users,
                color: '#06B6D4',
                title: 'Internal Match Engine',
                desc: 'Instantly compare job requirements against your existing team\'s verified skill profiles to find internal candidates.'
              },
              {
                icon: Video,
                color: '#10B981',
                title: 'Integrated Interview Room',
                desc: '1-click Jitsi Meet video interviews with top leaderboard candidates — no Zoom account needed.'
              },
            ].map((feat) => (
              <div key={feat.title} className="card p-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${feat.color}18` }}>
                  <feat.icon size={22} style={{ color: feat.color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA BANNER === */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="card p-12 relative overflow-hidden">
            <div className="orb orb-purple absolute" style={{ top: '-50%', left: '-20%', opacity: 0.4 }} />
            <div className="orb orb-blue absolute" style={{ bottom: '-50%', right: '-20%', opacity: 0.3 }} />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Ready to <span className="gradient-text">Prove Your Worth?</span>
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Join thousands of professionals replacing résumés with results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup?role=applicant" className="btn btn-primary btn-lg">
                  <Rocket size={18} />
                  Start Your Journey
                </Link>
                <Link to="/signup?role=company" className="btn btn-secondary btn-lg">
                  <Users size={18} />
                  Post a Challenge
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                  <Rocket size={14} color="white" />
                </div>
                <span className="font-bold text-white">SkillSync</span>
              </div>
              <p className="text-sm text-gray-500">
                The skills-based hiring platform that bypasses degree inflation.
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Challenges', 'Leaderboard', 'Interview Room', 'Sectors'] },
              { title: 'Company', links: ['Post Challenge', 'Internal Match', 'Analytics', 'Pricing'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-white text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}>
                      <Link to="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-6 text-center text-xs text-gray-600">
            © 2026 SkillSync · FutureProof. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

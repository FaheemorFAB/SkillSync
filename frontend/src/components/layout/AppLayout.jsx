import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard, Trophy, Briefcase, Video, Users, Settings,
  LogOut, Menu, X, Rocket, Plus, Target, Shield, ChevronRight,
  Bell, Search, UserCircle, Zap, BarChart3, GitBranch
} from 'lucide-react'
import toast from '../../lib/toast.jsx'

const navConfig = {
  applicant: [
    { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/app/challenges', icon: Briefcase, label: 'Challenges' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard', external: true },
    { to: '/app/profile', icon: UserCircle, label: 'Profile' },
  ],
  company: [
    { to: '/company/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/company/challenges', icon: Briefcase, label: 'My Challenges' },
    { to: '/company/challenges/create', icon: Plus, label: 'Create Challenge' },
    { to: '/company/matches', icon: GitBranch, label: 'Internal Match' },
    { to: '/company/interviews', icon: Video, label: 'Interview Rooms' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard', external: true },
    { to: '/company/profile', icon: UserCircle, label: 'Profile' },
  ],
  employee: [
    { to: '/employee/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard', external: true },
    { to: '/employee/profile', icon: UserCircle, label: 'Profile' },
  ],
}

const roleColors = {
  applicant: '#6366F1',
  company: '#06B6D4',
  employee: '#10B981',
}

const roleLabels = {
  applicant: 'Applicant',
  company: 'Company',
  employee: 'Employee',
}

export default function AppLayout({ role }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
    navigate('/')
  }

  const nav = navConfig[role] || navConfig.applicant
  const accentColor = roleColors[role] || '#6366F1'

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #8B5CF6)` }}>
            <Rocket size={16} color="white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">SkillSync</span>
        </Link>
      </div>

      {/* Role Badge */}
      <div className="px-6 py-3">
        <span className="badge" style={{
          background: `${accentColor}18`,
          color: accentColor,
          border: `1px solid ${accentColor}30`
        }}>
          <Zap size={10} />
          {roleLabels[role]}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.includes('create') ? false : true}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `nav-link w-full ${isActive ? 'active' : ''}`
            }
            style={({ isActive }) => isActive ? { color: accentColor, background: `${accentColor}18` } : {}}
          >
            <item.icon size={17} />
            <span className="flex-1">{item.label}</span>
            {item.external && <ChevronRight size={13} className="text-gray-600" />}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-white/5">
        {profile && (
          <div className="flex items-center gap-3 mb-3 p-2 rounded-10 hover:bg-white/5 transition-colors cursor-pointer rounded-lg"
            onClick={() => navigate(`/${role === 'applicant' ? 'app' : role}/profile`)}>
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.full_name || 'User')}&backgroundColor=6366f1`}
              alt={profile.full_name}
              className="w-9 h-9 rounded-full border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{profile.full_name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{profile.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="nav-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </>
  )

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-90 md:hidden"
          style={{ zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`sidebar md:hidden ${sidebarOpen ? 'open' : ''}`} style={{ zIndex: 200 }}>
        <div className="flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)} className="btn btn-secondary btn-sm">
            <X size={16} />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top bar */}
        <div className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-3 flex items-center justify-between">
          <button
            className="md:hidden btn btn-secondary btn-sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={16} />
          </button>

          <div className="flex-1 md:flex-none" />

          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <span className="live-dot"></span>
              Live
            </div>

            <button className="btn btn-secondary btn-sm">
              <Bell size={15} />
            </button>

            <img
              src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=6366f1`}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-white/10 cursor-pointer"
              onClick={() => navigate(`/${role === 'applicant' ? 'app' : role}/profile`)}
            />
          </div>
        </div>

        {/* Page content */}
        <Outlet />
      </div>
    </div>
  )
}

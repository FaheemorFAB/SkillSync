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
    { to: '/app/connect', icon: Users, label: 'Connect' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard', external: true },
    { to: '/app/profile', icon: UserCircle, label: 'Profile' },
  ],
  company: [
    { to: '/company/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/company/challenges', icon: Briefcase, label: 'My Challenges' },
    { to: '/company/challenges/create', icon: Plus, label: 'Create Challenge' },
    { to: '/company/matches', icon: GitBranch, label: 'Internal Match' },
    { to: '/company/future-proof', icon: Zap, label: 'Innovation Strategy' },
    { to: '/company/interviews', icon: Video, label: 'Interview Rooms' },
    { to: '/company/connect', icon: Users, label: 'Connect' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard', external: true },
    { to: '/company/profile', icon: UserCircle, label: 'Profile' },
  ],
  employee: [
    { to: '/employee/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/employee/connect', icon: Users, label: 'Connect' },
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
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [showAllNotifications, setShowAllNotifications] = useState(false)

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to SkillSync', message: 'Your profile has been created successfully. Explore the platform and start verifying your skills.', time: 'Just now', unread: true },
    { id: 2, title: 'New Challenge Available', message: 'A new coding challenge matches your skills. Check out the latest technical assessments to boost your rating.', time: '2 hours ago', unread: false },
  ])

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
  }

  const handleNotificationClick = (notif) => {
    setNotifications(notifications.map(n => n.id === notif.id ? { ...n, unread: false } : n))
    setSelectedNotification(notif)
    setShowNotifications(false)
  }

  const handleViewAll = () => {
    setShowAllNotifications(true)
    setShowNotifications(false)
  }

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
      <div className="p-6 border-b border-slate-200">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #2563EB)` }}>
            <Rocket size={16} color="white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">SkillSync</span>
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
      <div className="p-4 border-t border-slate-200">
        {profile && (
          <div className="flex items-center gap-3 mb-3 p-2 rounded-10 hover:bg-slate-50 transition-colors cursor-pointer rounded-lg"
            onClick={() => navigate(`/${role === 'applicant' ? 'app' : role}/profile`)}>
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.full_name || 'User')}&backgroundColor=2563eb`}
              alt={profile.full_name}
              className="w-9 h-9 rounded-full border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{profile.full_name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{profile.email}</p>
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
          className="fixed inset-0 bg-slate-900/40 z-90 md:hidden"
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
        <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <button
            className="md:hidden btn btn-secondary btn-sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={16} />
          </button>

          <div className="flex-1 md:flex-none" />

          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
              <span className="live-dot"></span>
              Live
            </div>

            <div className="relative">
              <button 
                className="btn btn-secondary btn-sm relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={15} />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-semibold text-sm text-slate-800">Notifications</h3>
                    <button 
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${notif.unread ? 'bg-blue-50/30' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-medium ${notif.unread ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h4>
                            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">{notif.time}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{notif.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-sm text-slate-500 flex flex-col items-center">
                        <Bell size={24} className="text-slate-300 mb-2" />
                        No new notifications
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-slate-100 text-center bg-slate-50">
                    <button 
                      className="text-xs text-slate-600 hover:text-slate-900 font-medium w-full py-1"
                      onClick={handleViewAll}
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <img
              src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=2563eb`}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-slate-200 cursor-pointer"
              onClick={() => navigate(`/${role === 'applicant' ? 'app' : role}/profile`)}
            />
          </div>
        </div>

        {/* Page content */}
        <Outlet />
      </div>

      {/* --- Notification Modals --- */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm" onClick={() => setSelectedNotification(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg">{selectedNotification.title}</h3>
              <button onClick={() => setSelectedNotification(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1 rounded-md transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <span className="text-xs text-slate-400 mb-4 block font-medium tracking-wide uppercase">{selectedNotification.time}</span>
              <p className="text-slate-700 leading-relaxed text-base">{selectedNotification.message}</p>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button className="btn btn-primary shadow-sm" onClick={() => setSelectedNotification(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showAllNotifications && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm" onClick={() => setShowAllNotifications(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Bell size={16} />
                </div>
                All Notifications
              </h3>
              <button onClick={() => setShowAllNotifications(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1 rounded-md transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {notifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`p-5 rounded-xl border ${notif.unread ? 'bg-blue-50/30 border-blue-200 shadow-sm' : 'bg-white border-slate-200'} cursor-pointer hover:shadow-md hover:border-blue-300 transition-all`} 
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-semibold ${notif.unread ? 'text-blue-900' : 'text-slate-800'}`}>{notif.title}</h4>
                    <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-md ml-4">{notif.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{notif.message}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button className="btn btn-secondary shadow-sm" onClick={markAllAsRead}>Mark all as read</button>
              <button className="btn btn-primary shadow-sm" onClick={() => setShowAllNotifications(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

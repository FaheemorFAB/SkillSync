import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ApplicantDashboard from './pages/applicant/Dashboard'
import CompanyDashboard from './pages/company/Dashboard'
import EmployeeDashboard from './pages/employee/Dashboard'
import ChallengesPage from './pages/applicant/Challenges'
import ExamPage from './pages/applicant/ExamPage'
import LeaderboardPage from './pages/LeaderboardPage'
import CompanyChallengesPage from './pages/company/Challenges'
import CreateChallengePage from './pages/company/CreateChallenge'
import InterviewRoomsPage from './pages/company/InterviewRooms'
import InternalMatchPage from './pages/company/InternalMatch'
import CompanyFutureProof from './pages/company/CompanyFutureProof'
import ProfilePage from './pages/ProfilePage'
import ConnectPage from './pages/ConnectPage'
import NotFound from './pages/NotFound'

// Layout
import AppLayout from './components/layout/AppLayout'

// Loading screen
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-t-2 border-purple-500 animate-spin" style={{animationDirection:'reverse', animationDuration:'0.8s'}}></div>
        </div>
        <p className="text-slate-500 text-sm font-medium">Loading SkillSync...</p>
      </div>
    </div>
  )
}

// Protected route wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Redirect to their dashboard
    const roleMap = { applicant: '/app/dashboard', company: '/company/dashboard', employee: '/employee/dashboard' }
    return <Navigate to={roleMap[profile.role] || '/'} replace />
  }

  return children
}

// Public only route (redirects if logged in)
function PublicRoute({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (user && profile) {
    const roleMap = { applicant: '/app/dashboard', company: '/company/dashboard', employee: '/employee/dashboard' }
    return <Navigate to={roleMap[profile.role] || '/app/dashboard'} replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />

      <Route path="/login" element={
        <PublicRoute><LoginPage /></PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute><SignupPage /></PublicRoute>
      } />

      {/* Applicant routes */}
      <Route path="/app" element={
        <ProtectedRoute allowedRoles={['applicant']}>
          <AppLayout role="applicant" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<ApplicantDashboard />} />
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="connect" element={<ConnectPage />} />
        <Route index element={<Navigate to="dashboard" />} />
      </Route>

      {/* Exam route (standalone - no sidebar) */}
      <Route path="/exam/:challengeId" element={
        <ProtectedRoute allowedRoles={['applicant']}>
          <ExamPage />
        </ProtectedRoute>
      } />

      {/* Company routes */}
      <Route path="/company" element={
        <ProtectedRoute allowedRoles={['company']}>
          <AppLayout role="company" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="challenges" element={<CompanyChallengesPage />} />
        <Route path="challenges/create" element={<CreateChallengePage />} />
        <Route path="interviews" element={<InterviewRoomsPage />} />
        <Route path="matches" element={<InternalMatchPage />} />
        <Route path="future-proof" element={<CompanyFutureProof />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="connect" element={<ConnectPage />} />
        <Route index element={<Navigate to="dashboard" />} />
      </Route>

      {/* Employee routes */}
      <Route path="/employee" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <AppLayout role="employee" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="connect" element={<ConnectPage />} />
        <Route index element={<Navigate to="dashboard" />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

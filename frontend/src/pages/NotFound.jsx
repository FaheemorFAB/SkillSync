import React from 'react'
import { Link } from 'react-router-dom'
import { Rocket, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="text-center">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary btn-lg">
          <Home size={18} /> Back to Home
        </Link>
      </div>
    </div>
  )
}

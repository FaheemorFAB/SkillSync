import React from 'react'
import { Link } from 'react-router-dom'
import { Rocket, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A0F1E' }}>
      <div className="text-center">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary btn-lg">
          <Home size={18} /> Back to Home
        </Link>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-primary">FutureProof</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/challenges" className="text-foreground hover:text-primary transition-colors">
              Challenges
            </Link>
            <Link href="/leaderboard" className="text-foreground hover:text-primary transition-colors">
              Leaderboard
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">Profile</Link>
                </Button>
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border pt-4">
            <Link
              href="/challenges"
              className="block px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Challenges
            </Link>
            <Link
              href="/leaderboard"
              className="block px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Leaderboard
            </Link>
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="pt-2 space-y-2 border-t border-border">
              {!isAuthenticated ? (
                <>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/profile">Profile</Link>
                  </Button>
                  <Button className="w-full" variant="outline">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

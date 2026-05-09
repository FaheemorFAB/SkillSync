'use client'

import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, TrendingUp, Users, Zap } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Discover Your True Potential
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              FutureProof is an advanced talent assessment platform featuring adaptive 3-round testing, real-time leaderboards, and intelligent matching for forward-thinking companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="min-w-32">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="min-w-32">
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Why Choose FutureProof?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform combines cutting-edge assessment technology with intuitive design
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-shadow">
                <Zap className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Adaptive Testing
                </h3>
                <p className="text-sm text-muted-foreground">
                  3-round system that adapts to your performance in real-time
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-shadow">
                <TrendingUp className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Live Leaderboards
                </h3>
                <p className="text-sm text-muted-foreground">
                  Track your rank and compete with talent globally in real-time
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-shadow">
                <Users className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Smart Matching
                </h3>
                <p className="text-sm text-muted-foreground">
                  Companies discover top talent aligned with their specific needs
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-shadow">
                <CheckCircle className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Fair Assessment
                </h3>
                <p className="text-sm text-muted-foreground">
                  Anti-cheat technology ensures integrity across all evaluations
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals proving their skills on FutureProof
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Start Your Journey</Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-foreground mb-4">FutureProof</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced talent assessment and matching platform
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">For Applicants</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/challenges" className="text-muted-foreground hover:text-foreground transition-colors">Challenges</Link></li>
                  <li><Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">Leaderboard</Link></li>
                  <li><Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">For Companies</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Enterprise</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2026 FutureProof. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}

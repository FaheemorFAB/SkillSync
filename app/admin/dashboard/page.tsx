'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BarChart3, Users, Eye, Mail, CheckCircle, XCircle, FileText, Download, Plus, MoreHorizontal } from 'lucide-react'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'assessments'>('overview')
  const [searchTerm, setSearchTerm] = useState('')

  const candidates = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', score: 287, status: 'qualified', sector: 'Technology', date: '2 hours ago' },
    { id: 2, name: 'Sarah Chen', email: 'sarah@example.com', score: 285, status: 'qualified', sector: 'Finance', date: '4 hours ago' },
    { id: 3, name: 'Marcus Williams', email: 'marcus@example.com', score: 283, status: 'qualified', sector: 'Technology', date: '6 hours ago' },
    { id: 4, name: 'Emily Rodriguez', email: 'emily@example.com', score: 180, status: 'review', sector: 'Healthcare', date: '1 day ago' },
    { id: 5, name: 'David Park', email: 'david@example.com', score: 120, status: 'rejected', sector: 'Technology', date: '2 days ago' },
  ]

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const qualifiedCount = candidates.filter(c => c.status === 'qualified').length
  const reviewCount = candidates.filter(c => c.status === 'review').length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'qualified':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'review':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-card border-b border-border py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage candidates, assessments, and track hiring progress
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="border border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Candidates</p>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-foreground">248</div>
                  <Users className="w-8 h-8 text-primary opacity-30" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Qualified</p>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-green-600">{qualifiedCount}</div>
                  <CheckCircle className="w-8 h-8 text-green-600 opacity-30" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Under Review</p>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-yellow-600">{reviewCount}</div>
                  <FileText className="w-8 h-8 text-yellow-600 opacity-30" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Avg Score</p>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-primary">74.2</div>
                  <BarChart3 className="w-8 h-8 text-primary opacity-30" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            {(['overview', 'candidates', 'assessments'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest candidate submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {candidates.slice(0, 5).map((candidate, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-medium text-foreground">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground">{candidate.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadge(candidate.status)}`}>
                            {candidate.status}
                          </span>
                          <span className="text-sm font-semibold text-primary">{candidate.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Score Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { range: '250-300', count: 12, color: 'bg-green-500' },
                        { range: '200-249', count: 28, color: 'bg-blue-500' },
                        { range: '150-199', count: 45, color: 'bg-yellow-500' },
                        { range: '100-149', count: 92, color: 'bg-orange-500' },
                        { range: '0-99', count: 71, color: 'bg-red-500' },
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{item.range}</span>
                            <span className="font-semibold text-foreground">{item.count}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.count / 92) * 100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Candidates by Sector</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { sector: 'Technology', count: 89, percent: 36 },
                        { sector: 'Finance', count: 64, percent: 26 },
                        { sector: 'Consulting', count: 48, percent: 19 },
                        { sector: 'Healthcare', count: 32, percent: 13 },
                        { sector: 'E-Commerce', count: 15, percent: 6 },
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-center text-sm mb-1">
                            <span className="text-foreground">{item.sector}</span>
                            <span className="font-semibold text-primary">{item.count}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percent}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Candidates Tab */}
          {activeTab === 'candidates' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Candidate
                </Button>
              </div>

              <Card className="border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="text-left px-4 sm:px-6 py-4 font-semibold text-foreground text-sm">Name</th>
                        <th className="hidden sm:table-cell text-left px-4 sm:px-6 py-4 font-semibold text-foreground text-sm">Sector</th>
                        <th className="text-right px-4 sm:px-6 py-4 font-semibold text-foreground text-sm">Score</th>
                        <th className="text-center px-4 sm:px-6 py-4 font-semibold text-foreground text-sm">Status</th>
                        <th className="text-right px-4 sm:px-6 py-4 font-semibold text-foreground text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates.map(candidate => (
                        <tr key={candidate.id} className="border-b border-border hover:bg-muted/50 transition-colors last:border-b-0">
                          <td className="px-4 sm:px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{candidate.name}</p>
                              <p className="text-xs text-muted-foreground sm:hidden">{candidate.email}</p>
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-muted-foreground">
                            {candidate.sector}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-right">
                            <p className="font-bold text-primary">{candidate.score}</p>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadge(candidate.status)}`}>
                              {candidate.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-right">
                            <button className="p-1 hover:bg-muted rounded transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Assessments Tab */}
          {activeTab === 'assessments' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Assessment
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Full Stack Development', candidates: 156, avg: 82, created: '3 weeks ago' },
                  { name: 'Financial Analysis', candidates: 124, avg: 78, created: '2 weeks ago' },
                  { name: 'Healthcare System Design', candidates: 98, avg: 85, created: '1 week ago' },
                ].map((assessment, idx) => (
                  <Card key={idx} className="border border-border">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Assessment</p>
                          <p className="font-semibold text-foreground">{assessment.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Candidates</p>
                          <p className="font-semibold text-foreground">{assessment.candidates}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Avg Score</p>
                          <p className="font-semibold text-primary">{assessment.avg}</p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

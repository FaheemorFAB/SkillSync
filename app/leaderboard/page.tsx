'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, TrendingUp, Medal, Zap, Filter } from 'lucide-react'

const mockLeaderboardData = [
  { rank: 1, name: 'Alex Johnson', score: 287, sector: 'Technology', avatar: '🎯', change: 0 },
  { rank: 2, name: 'Sarah Chen', score: 285, sector: 'Finance', avatar: '📈', change: 1 },
  { rank: 3, name: 'Marcus Williams', score: 283, sector: 'Technology', avatar: '⚡', change: 2 },
  { rank: 4, name: 'Emily Rodriguez', score: 280, sector: 'Healthcare', avatar: '🏥', change: -1 },
  { rank: 5, name: 'David Park', score: 278, sector: 'Technology', avatar: '💻', change: 3 },
  { rank: 6, name: 'Jessica Lee', score: 276, sector: 'Consulting', avatar: '💼', change: -2 },
  { rank: 7, name: 'James Smith', score: 274, sector: 'Finance', avatar: '💰', change: 0 },
  { rank: 8, name: 'Priya Patel', score: 272, sector: 'E-Commerce', avatar: '🛒', change: 1 },
  { rank: 9, name: 'Robert Taylor', score: 270, sector: 'Technology', avatar: '🚀', change: -3 },
  { rank: 10, name: 'Lisa Anderson', score: 268, sector: 'Healthcare', avatar: '⚕️', change: 2 },
]

export default function LeaderboardPage() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const [timeFrame, setTimeFrame] = useState<'all-time' | 'monthly' | 'weekly'>('all-time')

  const sectors = ['Technology', 'Finance', 'Healthcare', 'Consulting', 'E-Commerce']
  
  const filteredData = selectedSector
    ? mockLeaderboardData.filter(item => item.sector === selectedSector)
    : mockLeaderboardData

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Medal className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />
    return null
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-card border-b border-border py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-primary" />
                  Global Leaderboard
                </h1>
                <p className="text-muted-foreground">
                  Track top performers across all challenges in real-time
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Participants</p>
                    <div className="text-3xl font-bold text-foreground">24,582</div>
                  </div>
                  <Zap className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tests Completed</p>
                    <div className="text-3xl font-bold text-foreground">58,734</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Average Score</p>
                    <div className="text-3xl font-bold text-foreground">72.4</div>
                  </div>
                  <Trophy className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6 border border-border">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Time Frame */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Time Frame
                  </label>
                  <div className="flex gap-2">
                    {(['all-time', 'monthly', 'weekly'] as const).map(frame => (
                      <Button
                        key={frame}
                        variant={timeFrame === frame ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTimeFrame(frame)}
                        className="capitalize"
                      >
                        {frame === 'all-time' ? 'All Time' : frame === 'monthly' ? 'Monthly' : 'Weekly'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Sector Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Sector
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedSector === null ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSector(null)}
                    >
                      All Sectors
                    </Button>
                    {sectors.map(sector => (
                      <Button
                        key={sector}
                        variant={selectedSector === sector ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedSector(sector)}
                      >
                        {sector}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Table */}
          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left px-4 sm:px-6 py-4 font-semibold text-foreground text-sm">Rank</th>
                    <th className="text-left px-4 sm:px-6 py-4 font-semibold text-foreground text-sm">Name</th>
                    <th className="hidden sm:table-cell text-left px-4 sm:px-6 py-4 font-semibold text-foreground text-sm">Sector</th>
                    <th className="text-right px-4 sm:px-6 py-4 font-semibold text-foreground text-sm">Score</th>
                    <th className="text-right px-4 sm:px-6 py-4 font-semibold text-foreground text-sm">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((entry, index) => (
                    <tr
                      key={entry.rank}
                      className="border-b border-border hover:bg-muted/50 transition-colors last:border-b-0"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getMedalIcon(entry.rank)}
                          <span className="text-lg font-bold text-foreground min-w-8">
                            {entry.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{entry.avatar}</div>
                          <div>
                            <div className="font-semibold text-foreground">{entry.name}</div>
                            <div className="text-xs text-muted-foreground sm:hidden">{entry.sector}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-muted-foreground">
                        {entry.sector}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="text-lg font-bold text-primary">{entry.score}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className={`text-sm font-semibold flex items-center justify-end gap-1 ${
                          entry.change > 0 ? 'text-green-600' : entry.change < 0 ? 'text-red-600' : 'text-muted-foreground'
                        }`}>
                          {entry.change > 0 ? '↑' : entry.change < 0 ? '↓' : '→'}
                          {Math.abs(entry.change)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="p-8 text-center">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                <p className="text-muted-foreground">No results found for the selected filters</p>
              </div>
            )}
          </Card>

          {/* Your Rank Card */}
          <Card className="mt-8 border border-border bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Current Rank</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-primary">127</span>
                    <span className="text-sm text-muted-foreground">out of 24,582</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Your Score</p>
                  <div className="text-3xl font-bold text-foreground">245</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}

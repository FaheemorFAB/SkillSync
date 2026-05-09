'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Zap, Clock, Users, TrendingUp, Filter, X } from 'lucide-react'

const sectors = [
  { id: 'tech', name: 'Technology', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'finance', name: 'Finance', color: 'bg-green-50 text-green-700 border-green-200' },
  { id: 'healthcare', name: 'Healthcare', color: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'consulting', name: 'Consulting', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'ecommerce', name: 'E-Commerce', color: 'bg-orange-50 text-orange-700 border-orange-200' },
]

const mockChallenges = [
  {
    id: 1,
    title: 'Full Stack Development Challenge',
    sector: 'tech',
    difficulty: 'Advanced',
    duration: '120 mins',
    participants: 1234,
    topScore: 95,
    description: 'Build a scalable web application with modern tech stack',
    rounds: '3 Rounds'
  },
  {
    id: 2,
    title: 'Financial Analysis Challenge',
    sector: 'finance',
    difficulty: 'Intermediate',
    duration: '90 mins',
    participants: 856,
    topScore: 88,
    description: 'Analyze market data and provide investment recommendations',
    rounds: '3 Rounds'
  },
  {
    id: 3,
    title: 'Healthcare System Design',
    sector: 'healthcare',
    difficulty: 'Advanced',
    duration: '120 mins',
    participants: 645,
    topScore: 92,
    description: 'Design a patient management system for a hospital',
    rounds: '3 Rounds'
  },
  {
    id: 4,
    title: 'Management Consulting Case',
    sector: 'consulting',
    difficulty: 'Intermediate',
    duration: '60 mins',
    participants: 523,
    topScore: 89,
    description: 'Solve a complex business strategy problem',
    rounds: '3 Rounds'
  },
  {
    id: 5,
    title: 'E-Commerce Platform Challenge',
    sector: 'ecommerce',
    difficulty: 'Intermediate',
    duration: '100 mins',
    participants: 734,
    topScore: 91,
    description: 'Build and optimize an e-commerce platform',
    rounds: '3 Rounds'
  },
  {
    id: 6,
    title: 'Advanced AI Implementation',
    sector: 'tech',
    difficulty: 'Expert',
    duration: '150 mins',
    participants: 342,
    topScore: 94,
    description: 'Implement machine learning models for real-world problems',
    rounds: '3 Rounds'
  },
]

const difficultyColors = {
  'Beginner': 'bg-green-50 text-green-700 border border-green-200',
  'Intermediate': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  'Advanced': 'bg-orange-50 text-orange-700 border border-orange-200',
  'Expert': 'bg-red-50 text-red-700 border border-red-200',
}

export default function ChallengesPage() {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const toggleSector = (sectorId: string) => {
    setSelectedSectors(prev =>
      prev.includes(sectorId) ? prev.filter(s => s !== sectorId) : [...prev, sectorId]
    )
  }

  const filteredChallenges = mockChallenges.filter(challenge => {
    const matchesSector = selectedSectors.length === 0 || selectedSectors.includes(challenge.sector)
    const matchesDifficulty = !selectedDifficulty || challenge.difficulty === selectedDifficulty
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSector && matchesDifficulty && matchesSearch
  })

  const clearFilters = () => {
    setSelectedSectors([])
    setSelectedDifficulty(null)
    setSearchTerm('')
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-card border-b border-border py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Challenges</h1>
            <p className="text-muted-foreground">
              Prove your skills across {mockChallenges.length} challenges across multiple sectors
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Sector Filter */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Sectors
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {sectors.map(sector => (
                      <button
                        key={sector.id}
                        onClick={() => toggleSector(sector.id)}
                        className={`w-full text-left px-3 py-2 rounded-md border transition-colors ${
                          selectedSectors.includes(sector.id)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        <span className="text-sm font-medium">{sector.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Difficulty</h3>
                  <div className="space-y-2">
                    {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(difficulty => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)}
                        className={`w-full text-left px-3 py-2 rounded-md border transition-colors ${
                          selectedDifficulty === difficulty
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        <span className="text-sm font-medium">{difficulty}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedSectors.length > 0 || selectedDifficulty) && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearFilters}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                Showing {filteredChallenges.length} of {mockChallenges.length} challenges
              </div>

              {/* Challenge Cards */}
              <div className="space-y-4">
                {filteredChallenges.length > 0 ? (
                  filteredChallenges.map(challenge => {
                    const sector = sectors.find(s => s.id === challenge.sector)
                    return (
                      <Link key={challenge.id} href={`/challenges/${challenge.id}`}>
                        <Card className="border border-border hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-6">
                            <div className="grid md:grid-cols-3 gap-4">
                              {/* Left Section */}
                              <div className="md:col-span-2">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${sector?.color}`}>
                                    {sector?.name}
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[challenge.difficulty as keyof typeof difficultyColors]}`}>
                                    {challenge.difficulty}
                                  </span>
                                  <span className="px-2 py-1 rounded text-xs font-medium bg-primary text-primary-foreground">
                                    {challenge.rounds}
                                  </span>
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                  {challenge.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {challenge.description}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {challenge.duration}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {challenge.participants.toLocaleString()} participants
                                  </div>
                                </div>
                              </div>

                              {/* Right Section */}
                              <div className="md:col-span-1 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4">
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">Top Score</div>
                                  <div className="flex items-center gap-1 mb-4">
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                    <span className="text-xl font-bold text-primary">{challenge.topScore}</span>
                                    <span className="text-sm text-muted-foreground">/100</span>
                                  </div>
                                </div>
                                <Button className="w-full mt-auto">
                                  Start Challenge
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })
                ) : (
                  <Card className="border border-border">
                    <CardContent className="p-12 text-center">
                      <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No challenges found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your filters or search term
                      </p>
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

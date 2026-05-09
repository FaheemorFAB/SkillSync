'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Clock, CheckCircle, ChevronRight } from 'lucide-react'

type RoundType = 'aptitude' | 'technical' | 'problem'
type TestStatus = 'not-started' | 'in-progress' | 'completed'

const rounds = [
  {
    id: 'aptitude',
    name: 'Round 1: Aptitude',
    description: 'Test your logical reasoning and analytical skills',
    duration: 30,
    questions: 20,
    emoji: '🧠'
  },
  {
    id: 'technical',
    name: 'Round 2: Technical',
    description: 'Demonstrate your technical knowledge in the chosen domain',
    duration: 45,
    questions: 25,
    emoji: '💻'
  },
  {
    id: 'problem',
    name: 'Round 3: Problem Solving',
    description: 'Solve real-world complex problems using your expertise',
    duration: 60,
    questions: 3,
    emoji: '🚀'
  },
]

export default function TestInterfacePage() {
  const [currentRound, setCurrentRound] = useState<RoundType | null>(null)
  const [testStatus, setTestStatus] = useState<TestStatus>('not-started')
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [roundScores, setRoundScores] = useState<{ [key: string]: number | null }>({
    aptitude: null,
    technical: null,
    problem: null,
  })

  // Timer effect
  useEffect(() => {
    if (testStatus !== 'in-progress' || !currentRound) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitRound()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [testStatus, currentRound])

  const startRound = (roundId: RoundType) => {
    setCurrentRound(roundId)
    setTestStatus('in-progress')
    const roundDuration = rounds.find(r => r.id === roundId)?.duration || 30
    setTimeRemaining(roundDuration * 60)
    setCurrentQuestion(0)
    setAnswers({})
  }

  const handleSubmitRound = () => {
    if (!currentRound) return
    const score = Math.floor(Math.random() * 40 + 60) // Mock score between 60-100
    setRoundScores(prev => ({ ...prev, [currentRound]: score }))
    setTestStatus('completed')
  }

  const proceedToNextRound = () => {
    const currentIndex = rounds.findIndex(r => r.id === currentRound)
    if (currentIndex < rounds.length - 1) {
      setCurrentRound(null)
      setTestStatus('not-started')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Not Started View
  if (testStatus === 'not-started' && currentRound === null) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <section className="bg-card border-b border-border py-8 sm:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Full Stack Development Challenge
              </h1>
              <p className="text-muted-foreground">
                Complete all 3 rounds to unlock your potential score
              </p>
            </div>
          </section>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Progress Overview */}
            <Card className="mb-8 border border-border">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rounds.map((round, index) => {
                    const score = roundScores[round.id as RoundType]
                    const isCompleted = score !== null
                    return (
                      <div
                        key={round.id}
                        className="flex items-start gap-4 p-4 border border-border rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-primary" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-muted-foreground flex items-center justify-center text-xs font-semibold text-muted-foreground">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-foreground">{round.name}</h3>
                          <p className="text-sm text-muted-foreground">{round.description}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          {isCompleted ? (
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Score</div>
                              <div className="text-2xl font-bold text-primary">{score}</div>
                            </div>
                          ) : (
                            <Button
                              onClick={() => startRound(round.id as RoundType)}
                              disabled={index > 0 && roundScores[rounds[index - 1].id as RoundType] === null}
                            >
                              {index === 0 ? 'Start' : 'Locked'}
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Test Completion */}
            {Object.values(roundScores).every(score => score !== null) && (
              <Card className="border border-border bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Test Completed!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {rounds.map((round, index) => (
                      <div key={round.id} className="text-center p-4 bg-card rounded-lg border border-border">
                        <div className="text-2xl mb-2">{round.emoji}</div>
                        <div className="text-xs text-muted-foreground mb-2">Round {index + 1}</div>
                        <div className="text-3xl font-bold text-primary mb-2">
                          {roundScores[round.id as RoundType]}
                        </div>
                        <div className="text-xs text-muted-foreground">/100</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Final Score</div>
                        <div className="text-4xl font-bold text-primary">
                          {Math.round((Object.values(roundScores).reduce((a, b) => (a || 0) + (b || 0)) as number) / 3)}
                        </div>
                      </div>
                      <Button size="lg">View Results</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </>
    )
  }

  // In Progress View
  if (testStatus === 'in-progress' && currentRound) {
    const round = rounds.find(r => r.id === currentRound)
    const mockQuestions = [
      {
        id: 1,
        text: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(n log n)'],
        type: 'multiple-choice'
      },
      {
        id: 2,
        text: 'Which of the following is NOT a Python data structure?',
        options: ['List', 'Tuple', 'Hash', 'Dictionary'],
        type: 'multiple-choice'
      },
      {
        id: 3,
        text: 'What does REST stand for?',
        options: ['Representational State Transfer', 'Remote External Service Terminal', 'Rapid Exchange Service Tool', 'Real-time Event Streaming Transport'],
        type: 'multiple-choice'
      },
    ]

    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          {/* Header with Timer */}
          <div className="sticky top-16 z-40 bg-card border-b border-border">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{round?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {round?.questions}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Time Remaining</div>
                  <div className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-destructive' : 'text-primary'}`}>
                    {formatTime(timeRemaining)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Question */}
              <div className="lg:col-span-3">
                <Card className="border border-border">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-foreground mb-6">
                      {mockQuestions[currentQuestion % mockQuestions.length].text}
                    </h3>
                    <div className="space-y-3 mb-8">
                      {mockQuestions[currentQuestion % mockQuestions.length].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion]: option }))}
                          className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${
                            answers[currentQuestion] === option
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                              answers[currentQuestion] === option
                                ? 'border-primary bg-primary'
                                : 'border-border'
                            }`}>
                              {answers[currentQuestion] === option && (
                                <CheckCircle className="w-4 h-4 text-primary-foreground" />
                              )}
                            </div>
                            <span className="text-foreground">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSubmitRound}
                  >
                    Submit Round
                  </Button>
                  <Button
                    onClick={() => setCurrentQuestion(Math.min((round?.questions || 1) - 1, currentQuestion + 1))}
                    disabled={currentQuestion === (round?.questions || 1) - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* Progress Sidebar */}
              <div className="lg:col-span-1">
                <Card className="border border-border sticky top-32">
                  <CardHeader>
                    <CardTitle className="text-sm">Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: round?.questions || 20 }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentQuestion(idx)}
                          className={`aspect-square rounded-md border transition-colors text-xs font-medium ${
                            currentQuestion === idx
                              ? 'bg-primary text-primary-foreground border-primary'
                              : answers[idx]
                              ? 'bg-primary/20 border-primary text-primary'
                              : 'bg-muted border-border text-muted-foreground hover:border-primary/50'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  // Completed View
  if (testStatus === 'completed' && currentRound) {
    const round = rounds.find(r => r.id === currentRound)
    const score = roundScores[currentRound]
    const currentIndex = rounds.findIndex(r => r.id === currentRound)
    const isLastRound = currentIndex === rounds.length - 1

    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex items-center justify-center min-h-screen">
            <Card className="border border-border w-full">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {round?.name} Complete!
                </h2>
                <p className="text-muted-foreground mb-8">
                  You&apos;ve successfully completed this round
                </p>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 mb-8">
                  <div className="text-sm text-muted-foreground mb-2">Your Score</div>
                  <div className="text-5xl font-bold text-primary mb-2">{score}</div>
                  <div className="text-sm text-muted-foreground">/100</div>
                </div>

                {!isLastRound && (
                  <div className="mb-6">
                    <p className="text-muted-foreground mb-4">
                      Ready for the next round? {rounds[currentIndex + 1]?.name}
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => startRound(rounds[currentIndex + 1].id as RoundType)}
                    >
                      Proceed to {rounds[currentIndex + 1]?.name.split(':')[1].trim()}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setCurrentRound(null)
                    setTestStatus('not-started')
                  }}
                >
                  Back to Overview
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    )
  }
}

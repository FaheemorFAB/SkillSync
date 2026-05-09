'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AlertCircle, Mail, MapPin, Briefcase, Award, TrendingUp, Edit2, Check, X } from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    location: 'San Francisco, CA',
    sector: 'Technology',
    bio: 'Full-stack developer passionate about building scalable systems',
    company: 'Tech Innovations Inc.',
  })

  const [tempData, setTempData] = useState(userData)

  const handleEdit = () => {
    setIsEditing(true)
    setTempData(userData)
  }

  const handleSave = () => {
    setUserData(tempData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTempData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-card border-b border-border py-8 sm:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account and view your assessment history
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="md:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="border border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEdit}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">First Name</label>
                          <Input
                            name="firstName"
                            value={tempData.firstName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Last Name</label>
                          <Input
                            name="lastName"
                            value={tempData.lastName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <Input
                          name="email"
                          type="email"
                          value={tempData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Location</label>
                        <Input
                          name="location"
                          value={tempData.location}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Company</label>
                        <Input
                          name="company"
                          value={tempData.company}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Bio</label>
                        <textarea
                          name="bio"
                          value={tempData.bio}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleSave} className="gap-2">
                          <Check className="w-4 h-4" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancel} className="gap-2">
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">First Name</p>
                          <p className="font-medium text-foreground">{userData.firstName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Name</p>
                          <p className="font-medium text-foreground">{userData.lastName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email Address</p>
                          <p className="font-medium text-foreground">{userData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium text-foreground">{userData.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Briefcase className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Company</p>
                          <p className="font-medium text-foreground">{userData.company}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Bio</p>
                        <p className="text-foreground">{userData.bio}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Stats */}
            <div className="md:col-span-1 space-y-6">
              {/* Quick Stats */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Global Rank</p>
                    <p className="text-3xl font-bold text-primary">127</p>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                    <p className="text-3xl font-bold text-primary">245</p>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Tests Completed</p>
                    <p className="text-3xl font-bold text-primary">8</p>
                  </div>
                </CardContent>
              </Card>

              {/* Sector Badge */}
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Sector</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="px-3 py-2 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-center font-medium">
                    {userData.sector}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Performance */}
          <Card className="mt-8 border border-border">
            <CardHeader>
              <CardTitle>Recent Performance</CardTitle>
              <CardDescription>Your last 5 challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Full Stack Development', score: 87, date: '2 days ago' },
                  { name: 'Financial Analysis', score: 82, date: '5 days ago' },
                  { name: 'Healthcare System Design', score: 91, date: '1 week ago' },
                  { name: 'Management Consulting Case', score: 79, date: '10 days ago' },
                  { name: 'E-Commerce Platform', score: 85, date: '12 days ago' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">{item.score}</span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="mt-8 border border-border">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Unlock badges by completing challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: '🏆', label: 'First Challenge', earned: true },
                  { icon: '⚡', label: 'Speed Runner', earned: true },
                  { icon: '🎯', label: 'Perfect Score', earned: true },
                  { icon: '🔥', label: 'Streak Master', earned: false },
                  { icon: '💡', label: 'Problem Solver', earned: false },
                  { icon: '🚀', label: 'Top 10', earned: false },
                  { icon: '💪', label: 'Consistency', earned: false },
                  { icon: '⭐', label: 'Hall of Fame', earned: false },
                ].map((badge, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                      badge.earned
                        ? 'bg-primary/5 border-primary'
                        : 'bg-muted/30 border-border opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <p className="text-xs text-center font-medium text-foreground">{badge.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="mt-8 border border-border">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Privacy</p>
                  <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Change Password</p>
                  <p className="text-sm text-muted-foreground">Update your security credentials</p>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                </div>
                <Button variant="outline" size="sm">Delete</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  MapPin, 
  DollarSign, 
  Code, 
  FileText, 
  Upload,
  Edit,
  Calendar
} from 'lucide-react'
import { ProfileFormModal } from '@/components/profile-form-modal'
import { User as UserType, ProfileFormData } from '@/types'
import { formatDate } from '@/lib/utils'

// Mock user data - in real app, this would come from API
const mockUser: UserType = {
  _id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  location: 'San Francisco, CA',
  expectedCTC: '$120,000 - $150,000',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
  resumeUrl: 'https://example.com/resume.pdf',
  createdAt: new Date('2024-01-15')
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Simulate API call
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        // In real app: const response = await fetch('/api/profile')
        // const data = await response.json()
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay
        setUser(mockUser)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleProfileUpdate = async (updatedProfile: Partial<UserType>) => {
    if (user) {
      try {
        const response = await fetch('/api/profile', { 
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProfile) 
        })
        const data = await response.json()
        
        if (data.success) {
          setUser(data.data)
        } else {
          console.error('Failed to update profile:', data.error)
        }
      } catch (error) {
        console.error('Failed to update profile:', error)
      }
    }
  }

  const handleProfileCreate = async (newProfile: ProfileFormData) => {
    try {
      const response = await fetch('/api/profile', { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProfile) 
      })
      const data = await response.json()
      
      if (data.success) {
        setUser(data.data)
      } else {
        console.error('Failed to create profile:', data.error)
      }
    } catch (error) {
      console.error('Failed to create profile:', error)
    }
  }

  const handleResumeUpload = async (file: File) => {
    try {
      // In real app: const formData = new FormData(); formData.append('resume', file)
      // const response = await fetch('/api/profile/resume', { method: 'POST', body: formData })
      console.log('Uploading resume:', file.name)
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (user) {
        setUser({
          ...user,
          resumeUrl: `https://example.com/resumes/${file.name}`,
          createdAt: new Date()
        })
      }
    } catch (error) {
      console.error('Failed to upload resume:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Create Your Profile</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get started by creating your professional profile. This will help us match you with the right job opportunities.
          </p>
          <Button onClick={() => setIsModalOpen(true)} size="lg">
            <User className="mr-2 h-5 w-5" />
            Create Profile
          </Button>
        </motion.div>

        <ProfileFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={null}
          onUpdate={handleProfileUpdate}
          onCreate={handleProfileCreate}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your professional information and resume
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your professional details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg">{user.name}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg">{user.email}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg">{user.location}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Expected CTC</label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg">{user.expectedCTC}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      <Code className="mr-1 h-3 w-3" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(user.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resume Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resume
              </CardTitle>
              <CardDescription>
                Upload and manage your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.resumeUrl ? (
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium">Current Resume</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user.resumeUrl.split('/').pop()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {formatDate(user.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(user.resumeUrl, '_blank')}
                    >
                      View Resume
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = '.pdf,.doc,.docx'
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) handleResumeUpload(file)
                        }
                        input.click()
                      }}
                    >
                      <Upload className="mr-1 h-3 w-3" />
                      Replace
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No resume uploaded yet
                  </p>
                  <Button 
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = '.pdf,.doc,.docx'
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (file) handleResumeUpload(file)
                      }
                      input.click()
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Resume
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ProfileFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />
    </div>
  )
}

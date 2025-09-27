'use client'

import { useState, useEffect, useRef } from 'react'
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
  Calendar,
  UserPlus,
  Users,
  ChevronDown
} from 'lucide-react'
import { ProfileFormModal } from '@/components/profile-form-modal'
import { CreateUserModal } from '@/components/create-user-modal'
import { User as UserType } from '@/types'
import { formatDate } from '@/lib/utils'

// Mock users data - in real app, this would come from API
const mockUsers: UserType[] = [
  {
  _id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  location: 'San Francisco, CA',
  expectedCTC: '$120,000 - $150,000',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
  resumeUrl: 'https://example.com/resume.pdf',
  createdAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    location: 'New York, NY',
    expectedCTC: '$100,000 - $130,000',
    skills: ['Vue.js', 'JavaScript', 'CSS', 'HTML', 'Git'],
    resumeUrl: 'https://example.com/jane-resume.pdf',
    createdAt: new Date('2024-01-10')
  }
]

export default function ProfilePage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  const [showUserSelector, setShowUserSelector] = useState(false)
  const userSelectorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/users')
        const data = await response.json()
        
        if (data.success) {
          setUsers(data.data)
          if (data.data.length > 0) {
            setCurrentUser(data.data[0]) // Set first user as default
          }
        } else {
          // Fallback to mock data if API fails
          setUsers(mockUsers)
          if (mockUsers.length > 0) {
            setCurrentUser(mockUsers[0])
          }
        }
      } catch (error) {
        console.error('Failed to fetch users:', error)
        // Fallback to mock data
        setUsers(mockUsers)
        if (mockUsers.length > 0) {
          setCurrentUser(mockUsers[0])
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Close user selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userSelectorRef.current && !userSelectorRef.current.contains(event.target as Node)) {
        setShowUserSelector(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleProfileUpdate = (updatedProfile: Partial<UserType>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedProfile }
      setCurrentUser(updatedUser)
      setUsers(prev => prev.map(u => u._id === currentUser._id ? updatedUser : u))
    }
  }

  const handleUserCreate = async (userData: any) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setUsers(prev => [...prev, data.data])
        setCurrentUser(data.data)
      } else {
        console.error('Failed to create user:', data.error)
        // Fallback to local creation for demo
        const newUser: UserType = {
          _id: Date.now().toString(),
          ...userData,
          resumeUrl: '',
          createdAt: new Date()
        }
        setUsers(prev => [...prev, newUser])
        setCurrentUser(newUser)
      }
    } catch (error) {
      console.error('Failed to create user:', error)
      // Fallback to local creation for demo
      const newUser: UserType = {
        _id: Date.now().toString(),
        ...userData,
        resumeUrl: '',
        createdAt: new Date()
      }
      setUsers(prev => [...prev, newUser])
      setCurrentUser(newUser)
    }
  }

  const handleUserSelect = (selectedUser: UserType) => {
    setCurrentUser(selectedUser)
    setShowUserSelector(false)
  }

  const handleResumeUpload = async (file: File) => {
    try {
      // In real app: const formData = new FormData(); formData.append('resume', file)
      // const response = await fetch('/api/profile/resume', { method: 'POST', body: formData })
      console.log('Uploading resume:', file.name)
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          resumeUrl: `https://example.com/resumes/${file.name}`,
          createdAt: new Date()
        }
        setCurrentUser(updatedUser)
        setUsers(prev => prev.map(u => u._id === currentUser._id ? updatedUser : u))
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

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Users Found</h2>
        <p className="text-muted-foreground mb-6">
          No user profiles available. Create a new user to get started.
        </p>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Create First User
        </Button>
        
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleUserCreate}
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
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
          <Button onClick={() => setIsEditModalOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
        </div>
      </motion.div>

      {/* User Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Current User</p>
                  <p className="text-lg font-semibold">{currentUser.name}</p>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
              </div>
              <div className="relative" ref={userSelectorRef}>
                <Button
                  variant="outline"
                  onClick={() => setShowUserSelector(!showUserSelector)}
                  className="flex items-center gap-2"
                >
                  Switch User
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                {showUserSelector && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-background border rounded-md shadow-lg z-10">
                    <div className="p-2">
                      <p className="text-sm font-medium text-muted-foreground mb-2 px-2">Select User</p>
                      {users.map((user) => (
                        <button
                          key={user._id}
                          onClick={() => handleUserSelect(user)}
                          className={`w-full text-left p-2 rounded hover:bg-accent ${
                            user._id === currentUser._id ? 'bg-accent' : ''
                          }`}
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
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
                    <span className="text-lg">{currentUser.name}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg">{currentUser.email}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg">{currentUser.location}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Expected CTC</label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg">{currentUser.expectedCTC}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills.map((skill, index) => (
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
                  <span>{formatDate(currentUser.createdAt)}</span>
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
              {currentUser.resumeUrl ? (
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium">Current Resume</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.resumeUrl.split('/').pop()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {formatDate(currentUser.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(currentUser.resumeUrl, '_blank')}
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
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={currentUser}
        onUpdate={handleProfileUpdate}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleUserCreate}
      />
    </div>
  )
}

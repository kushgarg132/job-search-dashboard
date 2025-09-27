'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import { User, ProfileFormData } from '@/types'

interface ProfileFormModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onUpdate: (updatedProfile: Partial<User>) => void
  onCreate?: (newProfile: ProfileFormData) => void
}

export function ProfileFormModal({ isOpen, onClose, user, onUpdate, onCreate }: ProfileFormModalProps) {
  const isCreateMode = !user
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    expectedCTC: user?.expectedCTC || '',
    skills: user ? [...user.skills] : []
  })
  const [newSkill, setNewSkill] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isCreateMode && onCreate) {
        // Create new profile
        const response = await fetch('/api/profile', { 
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData) 
        })
        const data = await response.json()
        
        if (data.success) {
          onCreate(formData)
        } else {
          console.error('Failed to create profile:', data.error)
        }
      } else {
        // Update existing profile
        const response = await fetch('/api/profile', { 
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData) 
        })
        const data = await response.json()
        
        if (data.success) {
          onUpdate(formData)
        } else {
          console.error('Failed to update profile:', data.error)
        }
      }
      onClose()
    } catch (error) {
      console.error(`Failed to ${isCreateMode ? 'create' : 'update'} profile:`, error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isCreateMode ? 'Create Profile' : 'Edit Profile'}</DialogTitle>
          <DialogDescription>
            {isCreateMode 
              ? 'Create your professional profile to get started with job searching.'
              : 'Update your professional information and skills.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, State"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="expectedCTC" className="text-sm font-medium">
                Expected CTC
              </label>
              <Input
                id="expectedCTC"
                value={formData.expectedCTC}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedCTC: e.target.value }))}
                placeholder="$80,000 - $100,000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Skills</label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a skill"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddSkill}
                disabled={!newSkill.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (isCreateMode ? 'Creating...' : 'Saving...') 
                : (isCreateMode ? 'Create Profile' : 'Save Changes')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

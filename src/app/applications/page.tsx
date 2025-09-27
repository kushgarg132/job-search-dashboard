'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Calendar,
  Building2,
  Briefcase,
  Filter,
  Eye
} from 'lucide-react'
import { Application, ApplicationFilters, Job } from '@/types'
import { formatDate } from '@/lib/utils'

// Mock data
const mockApplications: Application[] = [
  {
    _id: '1',
    userId: 'user1',
    jobId: 'job1',
    resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
    status: 'Applied',
    appliedAt: new Date('2024-01-20')
  },
  {
    _id: '2',
    userId: 'user1',
    jobId: 'job2',
    resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
    status: 'Shortlisted',
    appliedAt: new Date('2024-01-18')
  },
  {
    _id: '3',
    userId: 'user1',
    jobId: 'job3',
    resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
    status: 'Rejected',
    appliedAt: new Date('2024-01-15')
  },
  {
    _id: '4',
    userId: 'user1',
    jobId: 'job4',
    resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
    status: 'Applied',
    appliedAt: new Date('2024-01-12')
  },
  {
    _id: '5',
    userId: 'user1',
    jobId: 'job5',
    resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
    status: 'Shortlisted',
    appliedAt: new Date('2024-01-10')
  }
]

const mockJobs: Job[] = [
  {
    _id: 'job1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120,000 - $160,000',
    description: 'Senior Frontend Developer position...',
    url: 'https://techcorp.com/careers/senior-frontend-dev',
    postedAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-20')
  },
  {
    _id: 'job2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$90,000 - $130,000',
    description: 'Full Stack Engineer position...',
    url: 'https://startupxyz.com/careers/full-stack-engineer',
    postedAt: new Date('2024-01-18'),
    createdAt: new Date('2024-01-18')
  },
  {
    _id: 'job3',
    title: 'React Developer',
    company: 'Digital Agency Co.',
    location: 'New York, NY',
    salary: '$80,000 - $110,000',
    description: 'React Developer position...',
    url: 'https://digitalagency.com/careers/react-dev',
    postedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15')
  },
  {
    _id: 'job4',
    title: 'Frontend Architect',
    company: 'Enterprise Solutions',
    location: 'Austin, TX',
    salary: '$140,000 - $180,000',
    description: 'Frontend Architect position...',
    url: 'https://enterprise.com/careers/frontend-architect',
    postedAt: new Date('2024-01-12'),
    createdAt: new Date('2024-01-12')
  },
  {
    _id: 'job5',
    title: 'UI/UX Developer',
    company: 'Design Studio',
    location: 'Los Angeles, CA',
    salary: '$70,000 - $95,000',
    description: 'UI/UX Developer position...',
    url: 'https://designstudio.com/careers/ui-ux-dev',
    postedAt: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10')
  }
]

const statusOptions = ['All', 'Applied', 'Shortlisted', 'Rejected']

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<ApplicationFilters>({
    status: 'All'
  })
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table')

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true)
      try {
        // In real app: const response = await fetch('/api/applications')
        // const data = await response.json()
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay
        setApplications(mockApplications)
        setFilteredApplications(mockApplications)
      } catch (error) {
        console.error('Failed to fetch applications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [])

  useEffect(() => {
    let filtered = applications

    if (filters.status !== 'All') {
      filtered = filtered.filter(app => app.status === filters.status)
    }

    setFilteredApplications(filtered)
  }, [applications, filters])

  const getJobDetails = (jobId: string) => {
    return mockJobs.find(job => job._id === jobId)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'default'
      case 'Shortlisted':
        return 'success'
      case 'Rejected':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusCounts = () => {
    const counts = {
      Applied: 0,
      Shortlisted: 0,
      Rejected: 0,
      Total: applications.length
    }
    
    applications.forEach(app => {
      counts[app.status as keyof typeof counts]++
    })
    
    return counts
  }

  const statusCounts = getStatusCounts()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
        <div className="h-16 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
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
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground">
            Track your job applications and their status
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <Eye className="mr-2 h-4 w-4" />
            Table
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Timeline
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{statusCounts.Total}</div>
            <div className="text-sm text-muted-foreground">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.Applied}</div>
            <div className="text-sm text-muted-foreground">Applied</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{statusCounts.Shortlisted}</div>
            <div className="text-sm text-muted-foreground">Shortlisted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{statusCounts.Rejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Applications List */}
      {viewMode === 'table' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application, index) => {
                  const job = getJobDetails(application.jobId)
                  if (!job) return null

                  return (
                    <TableRow key={application._id}>
                      <TableCell className="font-medium">{job.company}</TableCell>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{formatDate(application.appliedAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(application.resumeUrl, '_blank')}
                        >
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(application.status)}>
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(job.url, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {filteredApplications.map((application, index) => {
            const job = getJobDetails(application.jobId)
            if (!job) return null

            return (
              <motion.div
                key={application._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{job.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{job.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Applied on {formatDate(application.appliedAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(application.status)}>
                          {application.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(job.url, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(application.resumeUrl, '_blank')}
                      >
                        <FileText className="mr-1 h-3 w-3" />
                        View Resume
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {filteredApplications.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No applications found</h3>
          <p className="text-muted-foreground mb-6">
            {filters.status === 'All' 
              ? "You haven't applied to any jobs yet. Start browsing jobs to apply!"
              : `No applications with status "${filters.status}" found.`
            }
          </p>
          <Button asChild>
            <a href="/jobs">Browse Jobs</a>
          </Button>
        </motion.div>
      )}
    </div>
  )
}

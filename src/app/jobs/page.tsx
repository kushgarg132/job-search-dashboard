'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock,
  ExternalLink,
  FileText,
  Send
} from 'lucide-react'
import { Job, JobFilters } from '@/types'
import { JobDetailsModal } from '@/components/job-details-modal'
import { formatCurrency, getDaysAgo } from '@/lib/utils'

// Mock job data
const mockJobs: Job[] = [
  {
    _id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120,000 - $160,000',
    description: 'We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining our web applications using React, TypeScript, and modern frontend technologies. The ideal candidate will have 5+ years of experience in frontend development and a strong understanding of modern JavaScript frameworks.',
    url: 'https://techcorp.com/careers/senior-frontend-dev',
    postedAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-20')
  },
  {
    _id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$90,000 - $130,000',
    description: 'Join our fast-growing startup as a Full Stack Engineer. You will work on both frontend and backend systems, building scalable web applications. We use React, Node.js, and AWS. This is a great opportunity to work with cutting-edge technologies and make a real impact.',
    url: 'https://startupxyz.com/careers/full-stack-engineer',
    postedAt: new Date('2024-01-18'),
    createdAt: new Date('2024-01-18')
  },
  {
    _id: '3',
    title: 'React Developer',
    company: 'Digital Agency Co.',
    location: 'New York, NY',
    salary: '$80,000 - $110,000',
    description: 'We are seeking a talented React Developer to join our creative team. You will work on various client projects, building responsive and interactive web applications. Experience with React, Redux, and modern CSS frameworks is required.',
    url: 'https://digitalagency.com/careers/react-dev',
    postedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15')
  },
  {
    _id: '4',
    title: 'Frontend Architect',
    company: 'Enterprise Solutions',
    location: 'Austin, TX',
    salary: '$140,000 - $180,000',
    description: 'Lead our frontend architecture and development team. You will be responsible for designing scalable frontend systems, mentoring junior developers, and driving technical decisions. Strong experience with React, TypeScript, and modern build tools required.',
    url: 'https://enterprise.com/careers/frontend-architect',
    postedAt: new Date('2024-01-12'),
    createdAt: new Date('2024-01-12')
  },
  {
    _id: '5',
    title: 'UI/UX Developer',
    company: 'Design Studio',
    location: 'Los Angeles, CA',
    salary: '$70,000 - $95,000',
    description: 'Combine your design and development skills as a UI/UX Developer. You will work closely with our design team to implement beautiful, user-friendly interfaces. Experience with React, Figma, and modern CSS is essential.',
    url: 'https://designstudio.com/careers/ui-ux-dev',
    postedAt: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10')
  },
  {
    _id: '6',
    title: 'JavaScript Developer',
    company: 'Web Solutions Ltd.',
    location: 'Chicago, IL',
    salary: '$75,000 - $100,000',
    description: 'Join our development team as a JavaScript Developer. You will work on various web projects using vanilla JavaScript, React, and Node.js. This is a great opportunity for someone looking to grow their skills in modern web development.',
    url: 'https://websolutions.com/careers/js-dev',
    postedAt: new Date('2024-01-08'),
    createdAt: new Date('2024-01-08')
  }
]

const roles = ['All', 'Frontend', 'Backend', 'Full Stack', 'UI/UX', 'DevOps']
const locations = ['All', 'San Francisco, CA', 'New York, NY', 'Remote', 'Austin, TX', 'Los Angeles, CA', 'Chicago, IL']
const salaryRanges = ['All', '$50K - $80K', '$80K - $120K', '$120K - $160K', '$160K+']

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    role: 'All',
    location: 'All',
    salary: 'All'
  })

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true)
      try {
        // In real app: const response = await fetch('/api/jobs')
        // const data = await response.json()
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay
        setJobs(mockJobs)
        setFilteredJobs(mockJobs)
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  useEffect(() => {
    let filtered = jobs

    if (filters.search) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.role !== 'All') {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(filters.role.toLowerCase())
      )
    }

    if (filters.location !== 'All') {
      filtered = filtered.filter(job => 
        job.location === filters.location || 
        (filters.location === 'Remote' && job.location === 'Remote')
      )
    }

    if (filters.salary !== 'All') {
      filtered = filtered.filter(job => {
        const salary = job.salary
        const range = filters.salary
        
        if (range === '$50K - $80K') {
          return salary.includes('$50') || salary.includes('$60') || salary.includes('$70')
        } else if (range === '$80K - $120K') {
          return salary.includes('$80') || salary.includes('$90') || salary.includes('$100') || salary.includes('$110')
        } else if (range === '$120K - $160K') {
          return salary.includes('$120') || salary.includes('$130') || salary.includes('$140') || salary.includes('$150')
        } else if (range === '$160K+') {
          return salary.includes('$160') || salary.includes('$170') || salary.includes('$180')
        }
        return true
      })
    }

    setFilteredJobs(filtered)
  }, [jobs, filters])

  const handleApply = async (job: Job) => {
    try {
      // In real app: const response = await fetch('/api/apply', { method: 'POST', body: JSON.stringify({ jobId: job._id }) })
      console.log('Applying to job:', job.title)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Open external job URL
      window.open(job.url, '_blank')
    } catch (error) {
      console.error('Failed to apply:', error)
    }
  }

  const handleGenerateResume = async (job: Job) => {
    try {
      // In real app: const response = await fetch('/api/custom-resume', { method: 'POST', body: JSON.stringify({ jobId: job._id }) })
      console.log('Generating custom resume for job:', job.title)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real app, this would return a file URL
      const resumeUrl = `https://example.com/custom-resumes/${job._id}-resume.pdf`
      window.open(resumeUrl, '_blank')
    } catch (error) {
      console.error('Failed to generate resume:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
        <div className="h-16 bg-muted animate-pulse rounded" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold">Job Feed</h1>
        <p className="text-muted-foreground">
          Discover your next career opportunity
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies, or keywords..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={filters.role} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.salary} onValueChange={(value) => setFilters(prev => ({ ...prev, salary: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select salary range" />
                  </SelectTrigger>
                  <SelectContent>
                    {salaryRanges.map(range => (
                      <SelectItem key={range} value={range}>{range}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <p className="text-muted-foreground">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </p>
      </motion.div>

      {/* Job Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            whileHover={{ y: -5 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
                    <CardDescription className="text-base font-medium">{job.company}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getDaysAgo(job.postedAt)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {job.description}
                </p>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setSelectedJob(job)}
                  >
                    <Briefcase className="mr-1 h-3 w-3" />
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleApply(job)}
                  >
                    <Send className="mr-1 h-3 w-3" />
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters
          </p>
        </motion.div>
      )}

      <JobDetailsModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onApply={handleApply}
        onGenerateResume={handleGenerateResume}
      />
    </div>
  )
}

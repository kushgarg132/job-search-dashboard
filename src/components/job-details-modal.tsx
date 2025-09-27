'use client'

import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink,
  FileText,
  Send,
  Building2
} from 'lucide-react'
import { Job } from '@/types'
import { getDaysAgo } from '@/lib/utils'

interface JobDetailsModalProps {
  job: Job | null
  onClose: () => void
  onApply: (job: Job) => void
  onGenerateResume: (job: Job) => void
}

export function JobDetailsModal({ job, onClose, onApply, onGenerateResume }: JobDetailsModalProps) {
  if (!job) return null

  return (
    <Dialog open={!!job} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl">{job.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5" />
                {job.company}
              </DialogDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {getDaysAgo(job.postedAt)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{job.salary}</span>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Job Description</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              onClick={() => onGenerateResume(job)}
              variant="outline"
              className="flex-1"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Custom Resume
            </Button>
            <Button 
              onClick={() => onApply(job)}
              className="flex-1"
            >
              <Send className="mr-2 h-4 w-4" />
              Apply Now
            </Button>
            <Button 
              onClick={() => window.open(job.url, '_blank')}
              variant="outline"
              className="flex-1"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Original
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

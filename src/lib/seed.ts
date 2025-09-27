import { JobService, UserService, ApplicationService } from './database'
import { validateEnvironment } from './config'

const sampleJobs = [
  {
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120,000 - $160,000',
    description: 'We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining our web applications using React, TypeScript, and modern frontend technologies. The ideal candidate will have 5+ years of experience in frontend development and a strong understanding of modern JavaScript frameworks.',
    url: 'https://techcorp.com/careers/senior-frontend-dev',
    postedAt: new Date('2024-01-20')
  },
  {
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$90,000 - $130,000',
    description: 'Join our fast-growing startup as a Full Stack Engineer. You will work on both frontend and backend systems, building scalable web applications. We use React, Node.js, and AWS. This is a great opportunity to work with cutting-edge technologies and make a real impact.',
    url: 'https://startupxyz.com/careers/full-stack-engineer',
    postedAt: new Date('2024-01-18')
  },
  {
    title: 'React Developer',
    company: 'Digital Agency Co.',
    location: 'New York, NY',
    salary: '$80,000 - $110,000',
    description: 'We are seeking a talented React Developer to join our creative team. You will work on various client projects, building responsive and interactive web applications. Experience with React, Redux, and modern CSS frameworks is required.',
    url: 'https://digitalagency.com/careers/react-dev',
    postedAt: new Date('2024-01-15')
  },
  {
    title: 'Frontend Architect',
    company: 'Enterprise Solutions',
    location: 'Austin, TX',
    salary: '$140,000 - $180,000',
    description: 'Lead our frontend architecture and development team. You will be responsible for designing scalable frontend systems, mentoring junior developers, and driving technical decisions. Strong experience with React, TypeScript, and modern build tools required.',
    url: 'https://enterprise.com/careers/frontend-architect',
    postedAt: new Date('2024-01-12')
  },
  {
    title: 'UI/UX Developer',
    company: 'Design Studio',
    location: 'Los Angeles, CA',
    salary: '$70,000 - $95,000',
    description: 'Combine your design and development skills as a UI/UX Developer. You will work closely with our design team to implement beautiful, user-friendly interfaces. Experience with React, Figma, and modern CSS is essential.',
    url: 'https://designstudio.com/careers/ui-ux-dev',
    postedAt: new Date('2024-01-10')
  },
  {
    title: 'JavaScript Developer',
    company: 'Web Solutions Ltd.',
    location: 'Chicago, IL',
    salary: '$75,000 - $100,000',
    description: 'Join our development team as a JavaScript Developer. You will work on various web projects using vanilla JavaScript, React, and Node.js. This is a great opportunity for someone looking to grow their skills in modern web development.',
    url: 'https://websolutions.com/careers/js-dev',
    postedAt: new Date('2024-01-08')
  }
]

const sampleApplications = [
  {
    userId: 'demo-user-1',
    jobId: 'job-1',
    resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
    status: 'Applied' as const
  },
  {
    userId: 'demo-user-1',
    jobId: 'job-2',
    resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
    status: 'Shortlisted' as const
  },
  {
    userId: 'demo-user-1',
    jobId: 'job-3',
    resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
    status: 'Rejected' as const
  }
]

export async function seedDatabase() {
  try {
    validateEnvironment()
    
    console.log('🌱 Starting database seeding...')
    
    // Seed jobs
    console.log('📝 Seeding jobs...')
    const createdJobs = []
    for (const job of sampleJobs) {
      const createdJob = await JobService.create(job)
      createdJobs.push(createdJob)
    }
    console.log(`✅ Created ${createdJobs.length} jobs`)
    
    // Update application job IDs to match created jobs
    const updatedApplications = sampleApplications.map((app, index) => ({
      ...app,
      jobId: createdJobs[index]?._id || `job-${index + 1}`
    }))
    
    // Seed applications
    console.log('📋 Seeding applications...')
    for (const application of updatedApplications) {
      await ApplicationService.create(application)
    }
    console.log(`✅ Created ${updatedApplications.length} applications`)
    
    console.log('🎉 Database seeding completed successfully!')
    
    return {
      jobs: createdJobs.length,
      applications: updatedApplications.length
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then((result) => {
      console.log('Seeding result:', result)
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seeding failed:', error)
      process.exit(1)
    })
}

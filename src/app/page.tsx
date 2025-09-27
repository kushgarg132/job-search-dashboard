'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Briefcase, 
  FileText, 
  TrendingUp,
  Search,
  Target
} from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: User,
    title: 'Profile Management',
    description: 'Create and manage your professional profile with skills, experience, and resume.',
    href: '/profile',
    color: 'bg-blue-500'
  },
  {
    icon: Search,
    title: 'Job Discovery',
    description: 'Search and filter through thousands of job opportunities tailored to your skills.',
    href: '/jobs',
    color: 'bg-green-500'
  },
  {
    icon: FileText,
    title: 'Application Tracking',
    description: 'Track your job applications and manage your job search progress efficiently.',
    href: '/applications',
    color: 'bg-purple-500'
  },
  {
    icon: Target,
    title: 'Smart Matching',
    description: 'Get personalized job recommendations based on your profile and preferences.',
    href: '/jobs',
    color: 'bg-orange-500'
  }
]

const stats = [
  { label: 'Active Jobs', value: '2,500+' },
  { label: 'Companies', value: '500+' },
  { label: 'Success Rate', value: '85%' },
  { label: 'User Satisfaction', value: '4.8/5' }
]

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Find Your Dream Job
          <span className="text-primary block">Faster & Smarter</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional job search dashboard with AI-powered matching, 
          application tracking, and personalized recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/jobs">
              <Briefcase className="mr-2 h-5 w-5" />
              Browse Jobs
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/profile">
              <User className="mr-2 h-5 w-5" />
              Create Profile
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold">Everything You Need</h2>
          <p className="text-muted-foreground mt-2">
            Powerful tools to streamline your job search process
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="w-full">
                    <Link href={feature.href}>
                      Get Started
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center space-y-6 py-12"
      >
        <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join thousands of professionals who have found their dream jobs using our platform.
        </p>
        <Button asChild size="lg">
          <Link href="/profile">
            <TrendingUp className="mr-2 h-5 w-5" />
            Start Your Journey
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}

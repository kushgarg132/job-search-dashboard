import { NextRequest, NextResponse } from 'next/server'
import { ApplicationService } from '@/lib/database'
import { validateEnvironment } from '@/lib/config'

// For demo purposes, using a fixed user ID
const DEMO_USER_ID = 'demo-user-1'

export async function POST(request: NextRequest) {
  try {
    validateEnvironment()
    
    const { jobId, resumeUrl } = await request.json()
    
    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      )
    }
    
    const application = await ApplicationService.create({
      userId: DEMO_USER_ID,
      jobId,
      resumeUrl: resumeUrl || 'https://example.com/default-resume.pdf',
      status: 'Applied'
    })
    
    return NextResponse.json({ 
      success: true, 
      data: application,
      message: 'Application submitted successfully' 
    })
  } catch (error) {
    console.error('Error applying to job:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to apply to job' },
      { status: 500 }
    )
  }
}

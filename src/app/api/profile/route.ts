import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/database'
import { validateEnvironment } from '@/lib/config'

// For demo purposes, using a fixed user ID
// In production, this would come from authentication
const DEMO_USER_ID = 'demo-user-1'

export async function GET() {
  try {
    validateEnvironment()
    
    let user = await UserService.findById(DEMO_USER_ID)
    
    // Create demo user if doesn't exist
    if (!user) {
      user = await UserService.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        location: 'San Francisco, CA',
        expectedCTC: '$120,000 - $150,000',
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
        resumeUrl: 'https://example.com/resume.pdf'
      })
    }
    
    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    validateEnvironment()
    
    const body = await request.json()
    const updatedUser = await UserService.update(DEMO_USER_ID, body)
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: updatedUser })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

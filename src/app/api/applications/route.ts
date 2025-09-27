import { NextRequest, NextResponse } from 'next/server'
import { ApplicationService } from '@/lib/database'
import { validateEnvironment } from '@/lib/config'

// For demo purposes, using a fixed user ID
// In production, this would come from authentication
const DEMO_USER_ID = 'demo-user-1'

export async function GET() {
  try {
    validateEnvironment()
    
    const applications = await ApplicationService.findByUserId(DEMO_USER_ID)
    
    return NextResponse.json({ success: true, data: applications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    validateEnvironment()
    
    const body = await request.json()
    const newApplication = await ApplicationService.create({
      ...body,
      userId: DEMO_USER_ID
    })
    
    return NextResponse.json({ success: true, data: newApplication })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create application' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/database'
import { validateEnvironment } from '@/lib/config'

export async function GET() {
  try {
    validateEnvironment()
    
    // Get all users - in a real app, you might want pagination
    const users = await UserService.findAll()
    
    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error('Error fetching users:', error)
    
    // If MongoDB is not available, return empty array
    if (error instanceof Error && error.message.includes('MONGODB_URI')) {
      return NextResponse.json({ success: true, data: [] })
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    validateEnvironment()
    
    const body = await request.json()
    const { name, email, location, expectedCTC, skills, resumeUrl } = body
    
    // Validate required fields
    if (!name || !email || !location || !expectedCTC) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check if user with email already exists
    const existingUser = await UserService.findByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    const newUser = await UserService.create({
      name,
      email,
      location,
      expectedCTC,
      skills: skills || [],
      resumeUrl: resumeUrl || ''
    })
    
    return NextResponse.json({ success: true, data: newUser })
  } catch (error) {
    console.error('Error creating user:', error)
    
    // If MongoDB is not available, return error to trigger fallback
    if (error instanceof Error && error.message.includes('MONGODB_URI')) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

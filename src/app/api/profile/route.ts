import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/database'
import { validateEnvironment } from '@/lib/config'

export async function GET(request: NextRequest) {
  try {
    validateEnvironment()
    
    // Get user ID from query parameters, or use first available user
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    let user
    
    if (userId) {
      user = await UserService.findById(userId)
    } else {
      // If no user ID provided, get the first user or create a default one
      const users = await UserService.findAll()
      if (users.length > 0) {
        user = users[0]
      } else {
        // Create a default user if none exist
        user = await UserService.create({
          name: 'John Doe',
          email: 'john.doe@example.com',
          location: 'San Francisco, CA',
          expectedCTC: '$120,000 - $150,000',
          skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
          resumeUrl: ''
        })
      }
    }
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
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
    
    // Get user ID from query parameters, or use first available user
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    let targetUserId = userId
    
    if (!targetUserId) {
      // If no user ID provided, get the first user
      const users = await UserService.findAll()
      if (users.length > 0) {
        targetUserId = users[0]._id
      } else {
        return NextResponse.json(
          { success: false, error: 'No user found to update' },
          { status: 404 }
        )
      }
    }
    
    const body = await request.json()
    const updatedUser = await UserService.update(targetUserId, body)
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found or failed to update' },
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

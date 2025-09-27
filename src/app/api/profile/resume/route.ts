import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/database'
import { uploadFileToDrive, validateGoogleDriveConfig } from '@/lib/google-drive'
import { uploadFileToLocal, validateLocalStorageConfig } from '@/lib/local-storage'
import { validateEnvironment } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    validateEnvironment()
    
    // Get user ID from query parameters, or use first available user
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    let targetUserId = userId
    let user
    
    if (targetUserId) {
      user = await UserService.findById(targetUserId)
    } else {
      // If no user ID provided, get the first user or create a default one
      const users = await UserService.findAll()
      if (users.length > 0) {
        user = users[0]
        targetUserId = user._id
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
        targetUserId = user._id
      }
    }
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Determine which storage method to use
    const useGoogleDrive = validateGoogleDriveConfig()
    const useLocalStorage = validateLocalStorageConfig()
    
    if (!useGoogleDrive && !useLocalStorage) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No storage method configured. Please set up Google Drive or local storage.' 
        },
        { status: 503 }
      )
    }

    // Parse the multipart form data
    const formData = await request.formData()
    const file = formData.get('resume') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only PDF and Word documents are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `resume_${targetUserId}_${timestamp}.${fileExtension}`

    let uploadResult: any
    let userUpdateData: any

    if (useGoogleDrive) {
      // Upload to Google Drive
      uploadResult = await uploadFileToDrive(
        fileBuffer,
        uniqueFileName,
        file.type
      )
      
      userUpdateData = {
        resumeUrl: uploadResult.webViewLink,
        resumeDriveId: uploadResult.fileId,
        resumeDrivePath: uploadResult.webContentLink,
        resumeFileName: uniqueFileName,
        resumeOriginalName: file.name,
        resumeUploadedAt: new Date()
      }
    } else {
      // Upload to local storage
      uploadResult = await uploadFileToLocal(
        fileBuffer,
        uniqueFileName
      )
      
      userUpdateData = {
        resumeUrl: uploadResult.webViewLink,
        resumeDriveId: '', // Not applicable for local storage
        resumeDrivePath: uploadResult.webContentLink,
        resumeFileName: uniqueFileName,
        resumeOriginalName: file.name,
        resumeUploadedAt: new Date()
      }
    }

    // Update user profile with file info
    const updatedUser = await UserService.update(targetUserId, userUpdateData)

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        user: updatedUser,
        fileInfo: {
          fileName: uniqueFileName,
          originalName: file.name,
          fileId: uploadResult.fileId || '',
          webViewLink: uploadResult.webViewLink,
          webContentLink: uploadResult.webContentLink,
          size: file.size,
          type: file.type,
          storageMethod: useGoogleDrive ? 'Google Drive' : 'Local Storage'
        }
      }
    })

  } catch (error) {
    console.error('Error uploading resume:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Google Drive')) {
        return NextResponse.json(
          { success: false, error: 'Failed to upload to Google Drive. Please try again.' },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to upload resume' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    validateEnvironment()
    
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')
    const userId = searchParams.get('userId')
    
    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'File ID is required' },
        { status: 400 }
      )
    }
    
    let targetUserId = userId
    
    if (!targetUserId) {
      // If no user ID provided, get the first user
      const users = await UserService.findAll()
      if (users.length > 0) {
        targetUserId = users[0]._id
      } else {
        return NextResponse.json(
          { success: false, error: 'No user found' },
          { status: 404 }
        )
      }
    }

    // Verify user exists
    const user = await UserService.findById(targetUserId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Import delete function dynamically to avoid errors if Google Drive is not configured
    const { deleteFileFromDrive } = await import('@/lib/google-drive')
    
    // Delete from Google Drive
    await deleteFileFromDrive(fileId)
    
    // Update user profile to remove resume info
    const updatedUser = await UserService.update(targetUserId, {
      resumeUrl: '',
      resumeDriveId: '',
      resumeDrivePath: '',
      resumeFileName: '',
      resumeOriginalName: '',
      resumeUploadedAt: null
    })

    return NextResponse.json({
      success: true,
      data: updatedUser
    })

  } catch (error) {
    console.error('Error deleting resume:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete resume' },
      { status: 500 }
    )
  }
}

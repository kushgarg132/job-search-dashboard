import { google } from 'googleapis'
import { Readable } from 'stream'

// Google Drive API configuration
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || 'your-folder-id'
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN

// Initialize Google Drive API with OAuth 2.0
function getDriveService() {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error('Google OAuth credentials not configured')
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'http://localhost:3000' // Redirect URI
  )

  oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
  })

  return google.drive({ version: 'v3', auth: oauth2Client })
}

// Upload file to Google Drive
export async function uploadFileToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ fileId: string; webViewLink: string; webContentLink: string }> {
  try {
    const drive = getDriveService()
    
    // Convert buffer to stream
    const fileStream = new Readable()
    fileStream.push(fileBuffer)
    fileStream.push(null)

    const fileMetadata = {
      name: fileName,
      parents: [GOOGLE_DRIVE_FOLDER_ID],
    }

    const media = {
      mimeType,
      body: fileStream,
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id,name,webViewLink,webContentLink',
    })

    if (!response.data.id) {
      throw new Error('Failed to upload file to Google Drive')
    }

    return {
      fileId: response.data.id,
      webViewLink: response.data.webViewLink || '',
      webContentLink: response.data.webContentLink || '',
    }
  } catch (error) {
    console.error('Error uploading to Google Drive:', error)
    throw new Error('Failed to upload file to Google Drive')
  }
}

// Delete file from Google Drive
export async function deleteFileFromDrive(fileId: string): Promise<void> {
  try {
    const drive = getDriveService()
    await drive.files.delete({ fileId })
  } catch (error) {
    console.error('Error deleting file from Google Drive:', error)
    throw new Error('Failed to delete file from Google Drive')
  }
}

// Get file info from Google Drive
export async function getFileInfo(fileId: string) {
  try {
    const drive = getDriveService()
    const response = await drive.files.get({
      fileId,
      fields: 'id,name,size,createdTime,webViewLink,webContentLink',
    })
    return response.data
  } catch (error) {
    console.error('Error getting file info from Google Drive:', error)
    throw new Error('Failed to get file info from Google Drive')
  }
}

// Validate Google Drive configuration
export function validateGoogleDriveConfig(): boolean {
  return !!(
    GOOGLE_CLIENT_ID &&
    GOOGLE_CLIENT_SECRET &&
    GOOGLE_REFRESH_TOKEN &&
    GOOGLE_DRIVE_FOLDER_ID &&
    GOOGLE_DRIVE_FOLDER_ID !== 'your-folder-id'
  )
}

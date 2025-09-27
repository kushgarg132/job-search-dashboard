import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Local storage configuration
const UPLOAD_DIR = join(process.cwd(), 'uploads', 'resumes')

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

// Upload file to local storage
export async function uploadFileToLocal(
  fileBuffer: Buffer,
  fileName: string
): Promise<{ filePath: string; webViewLink: string; webContentLink: string }> {
  try {
    await ensureUploadDir()
    
    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = fileName.split('.').pop()
    const uniqueFileName = `resume_${timestamp}.${fileExtension}`
    const filePath = join(UPLOAD_DIR, uniqueFileName)
    
    // Write file to disk
    await writeFile(filePath, fileBuffer)
    
    // Generate URLs (in production, these would be your domain)
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const webViewLink = `${baseUrl}/api/files/${uniqueFileName}`
    const webContentLink = `${baseUrl}/api/files/${uniqueFileName}`
    
    return {
      filePath,
      webViewLink,
      webContentLink
    }
  } catch (error) {
    console.error('Error uploading file locally:', error)
    throw new Error('Failed to upload file locally')
  }
}

// Delete file from local storage
export async function deleteFileFromLocal(filePath: string): Promise<void> {
  try {
    await unlink(filePath)
  } catch (error) {
    console.error('Error deleting local file:', error)
    throw new Error('Failed to delete local file')
  }
}

// Validate local storage configuration
export function validateLocalStorageConfig(): boolean {
  return true // Local storage is always available
}

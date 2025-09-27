// Database configuration
export const DATABASE_CONFIG = {
  name: 'job-search-dashboard',
  collections: {
    users: 'users',
    jobs: 'jobs',
    applications: 'applications'
  }
}

// Environment variables validation
export function validateEnvironment() {
  const requiredEnvVars = ['MONGODB_URI']
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }
}

// Google Drive environment variables validation
export function validateGoogleDriveEnvironment() {
  const requiredEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REFRESH_TOKEN',
    'GOOGLE_DRIVE_FOLDER_ID'
  ]
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required Google Drive environment variable: ${envVar}`)
    }
  }
}

// MongoDB connection string validation
export function getMongoUri(): string {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set')
  }
  return uri
}

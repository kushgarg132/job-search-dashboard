# Google Drive Integration Setup Guide

This guide will help you set up Google Drive integration for resume uploads in your job search dashboard using OAuth 2.0.

## Prerequisites

1. A Google Cloud Platform account
2. A Google Drive account
3. Node.js and npm installed

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click on it and press "Enable"

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields (App name, User support email, Developer contact)
   - Add your email to test users
4. For Application type, choose "Web application"
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
6. Click "Create"
7. Download the JSON file or copy the Client ID and Client Secret

## Step 3: Create a Google Drive Folder

1. Go to [Google Drive](https://drive.google.com/)
2. Create a new folder called "Job Search Resumes" (or any name you prefer)
3. Copy the folder ID from the URL (the long string after `/folders/`)

## Step 4: Get Refresh Token

1. **First, add your OAuth credentials to `.env.local`:**
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3000
   ```

2. **Run the token generation script:**
   ```bash
   node scripts/get-google-token.js
   ```

3. **Follow the prompts:**
   - The script will show you an authorization URL
   - Visit the URL and authorize the app
   - Copy the authorization code from the URL
   - Paste it back into the script
   - The script will generate your refresh token

## Step 5: Complete Environment Variables

Your `.env.local` file should now contain all the required variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-search-dashboard?retryWrites=true&w=majority

# Google Drive API Configuration (OAuth 2.0)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id
GOOGLE_REDIRECT_URI=http://localhost:3000
```

### Getting the Values:

1. **GOOGLE_CLIENT_ID**: From the OAuth 2.0 credentials in Google Cloud Console
2. **GOOGLE_CLIENT_SECRET**: From the OAuth 2.0 credentials in Google Cloud Console
3. **GOOGLE_REFRESH_TOKEN**: Generated using the script in Step 4
4. **GOOGLE_DRIVE_FOLDER_ID**: The folder ID you copied from Google Drive
5. **GOOGLE_REDIRECT_URI**: Should match your Google Cloud Console settings

## Step 6: Install Dependencies

Run the following command to install the required packages:

```bash
npm install
```

## Step 7: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to the Profile page
3. Try uploading a resume file (PDF or Word document)
4. Check your Google Drive folder to see if the file was uploaded
5. Check the MongoDB database to see if the user record was updated with Google Drive information

## Features

Once set up, the Google Drive integration provides:

- ✅ **Secure File Upload**: Files are uploaded directly to your Google Drive
- ✅ **File Management**: View, replace, and delete resumes
- ✅ **Metadata Storage**: Original filename, upload date, and Drive ID stored in MongoDB
- ✅ **File Validation**: Only PDF and Word documents are allowed
- ✅ **Size Limits**: 10MB maximum file size
- ✅ **Error Handling**: Graceful fallbacks and user-friendly error messages

## Troubleshooting

### Common Issues:

1. **"Google Drive not configured" error**:
   - Check that all environment variables are set correctly
   - Ensure the service account has access to the Drive folder

2. **"Failed to upload to Google Drive" error**:
   - Verify the service account has the correct permissions
   - Check that the Google Drive API is enabled
   - Ensure the private key is correctly formatted with \n characters

3. **"File too large" error**:
   - The current limit is 10MB. You can modify this in `/src/app/api/profile/resume/route.ts`

4. **"Invalid file type" error**:
   - Only PDF and Word documents are allowed
   - Supported types: `.pdf`, `.doc`, `.docx`

### Security Notes:

- Never commit the `.env.local` file to version control
- Keep your service account JSON file secure
- Regularly rotate your service account keys
- Consider using Google Cloud Secret Manager for production deployments

## API Endpoints

The integration adds the following API endpoints:

- `POST /api/profile/resume` - Upload resume to Google Drive
- `DELETE /api/profile/resume?fileId=<id>` - Delete resume from Google Drive

## Database Schema Updates

The User model now includes these additional fields:

```typescript
interface User {
  // ... existing fields
  resumeDriveId?: string;        // Google Drive file ID
  resumeDrivePath?: string;      // Google Drive download URL
  resumeFileName?: string;       // Generated filename in Drive
  resumeOriginalName?: string;   // Original uploaded filename
  resumeUploadedAt?: Date;       // Upload timestamp
}
```

## Next Steps

Consider implementing these additional features:

- [ ] Resume parsing and text extraction
- [ ] Automatic resume optimization for specific jobs
- [ ] Resume version history
- [ ] Bulk resume operations
- [ ] Resume sharing with employers
- [ ] Integration with job application tracking

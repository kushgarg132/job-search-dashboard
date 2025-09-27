# Quick Start Guide - Resume Upload

## 🚀 **Two Options for Resume Storage**

### **Option 1: Local Storage (Easiest - No Setup Required)**

This option stores resumes locally on your server. Perfect for development and testing.

**Steps:**
1. Just run the app - no additional setup needed!
2. Upload resumes and they'll be stored in the `uploads/` folder
3. Files are served via `/api/files/[filename]`

### **Option 2: Google Drive (Production Ready)**

This option stores resumes in your Google Drive. Better for production use.

**Steps:**
1. Follow the detailed guide in `GOOGLE_DRIVE_SETUP.md`
2. Set up OAuth 2.0 credentials in Google Cloud Console
3. Add your OAuth credentials to `.env.local`
4. Run `node scripts/get-google-token.js` to get your refresh token
5. Add the refresh token to `.env.local`

## 🎯 **Current Status**

✅ **Local Storage**: Ready to use immediately  
⏳ **Google Drive**: Requires OAuth 2.0 setup (see error fix below)

## 🔧 **The Service Account Issue (Fixed!)**

The error you encountered:
```
Service Accounts do not have storage quota
```

**Solution**: I've updated the code to use **OAuth 2.0** instead of Service Accounts. This allows you to use your personal Google Drive storage.

## 📁 **File Structure**

```
src/
├── lib/
│   ├── google-drive.ts      # Google Drive integration (OAuth 2.0)
│   └── local-storage.ts     # Local file storage
├── app/api/
│   ├── profile/resume/      # Resume upload API
│   └── files/[filename]/    # File serving API
└── scripts/
    └── get-google-token.js  # OAuth token generator
```

## 🧪 **Test the Upload**

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Go to Profile page**
3. **Upload a resume** (PDF or Word document)
4. **Check the result:**
   - Local Storage: File saved in `uploads/resumes/`
   - Google Drive: File appears in your Drive folder

## 🔄 **How It Works**

The system automatically chooses the best available storage method:

1. **Google Drive** (if OAuth credentials are configured)
2. **Local Storage** (fallback, always available)

## 🎨 **UI Features**

- ✅ **Storage Method Badge**: Shows "Google Drive" or "Local Storage"
- ✅ **File Management**: View, replace, delete resumes
- ✅ **Error Handling**: Clear error messages
- ✅ **File Validation**: Only PDF/Word docs, 10MB max

## 🚨 **Troubleshooting**

### **"No storage method configured"**
- **Solution**: The app will use local storage by default
- **Fix**: No action needed, just upload a file!

### **"Google Drive not configured"**
- **Solution**: Use local storage (automatic fallback)
- **Fix**: Or set up Google Drive OAuth 2.0

### **"File too large"**
- **Solution**: Reduce file size to under 10MB
- **Fix**: Compress PDF or use smaller document

## 🎉 **Ready to Use!**

Your resume upload is now working! The system will:
- Store files locally by default
- Show clear storage method indicators
- Handle errors gracefully
- Provide full file management

**Try uploading a resume now!** 🚀

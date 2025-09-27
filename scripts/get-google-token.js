const { google } = require('googleapis');
const readline = require('readline');
require('dotenv').config({ path: '.env.local' });

// Get OAuth 2.0 credentials from environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const scopes = [
  'https://www.googleapis.com/auth/drive.file'
];

async function getRefreshToken() {
  // Validate environment variables
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('❌ Error: Missing required environment variables!');
    console.log('\n📝 Please add these to your .env.local file:');
    console.log('GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com');
    console.log('GOOGLE_CLIENT_SECRET=your-client-secret');
    console.log('GOOGLE_REDIRECT_URI=http://localhost:3000 (optional)');
    process.exit(1);
  }

  console.log('🔑 Using credentials from .env.local file');
  console.log(`📱 Client ID: ${CLIENT_ID.substring(0, 20)}...`);
  console.log(`🔗 Redirect URI: ${REDIRECT_URI}\n`);

  // Generate the URL for OAuth consent
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  console.log('🌐 Authorize this app by visiting this URL:');
  console.log(authUrl);
  console.log('\n📋 After authorization, you\'ll be redirected to a page that may show an error.');
  console.log('🔍 Look at the URL bar - it will contain a "code" parameter.');
  console.log('📝 Copy the entire code value (it\'s a long string) and paste it below.\n');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('🔐 Enter the authorization code: ', async (code) => {
    try {
      console.log('\n⏳ Exchanging code for tokens...');
      const { tokens } = await oauth2Client.getToken(code);
      
      if (tokens.refresh_token) {
        console.log('\n✅ Success! Here\'s your refresh token:');
        console.log('─'.repeat(60));
        console.log(tokens.refresh_token);
        console.log('─'.repeat(60));
        
        console.log('\n📝 Add this to your .env.local file:');
        console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
        
        console.log('\n🎉 Setup complete! Your Google Drive integration is ready.');
        console.log('💡 You can now upload resumes to Google Drive.');
      } else {
        console.log('⚠️  No refresh token received. Make sure you selected "offline" access.');
        console.log('🔄 Try running the script again and ensure you complete the full authorization flow.');
      }
      
      rl.close();
    } catch (error) {
      console.error('\n❌ Error retrieving access token:', error.message);
      console.log('\n🔧 Troubleshooting:');
      console.log('• Make sure you copied the entire authorization code');
      console.log('• Check that your CLIENT_ID and CLIENT_SECRET are correct');
      console.log('• Ensure the redirect URI matches your Google Cloud Console settings');
      rl.close();
    }
  });
}

getRefreshToken();

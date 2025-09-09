const { google } = require('googleapis');

console.log('🔧 Manual Google OAuth Setup\n');

// You'll need to replace these with your actual credentials
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const REDIRECT_URI = 'http://localhost:3002/api/auth/google/callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generate the URL for OAuth consent
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  prompt: 'consent' // Force consent screen to get refresh token
});

console.log('📋 Follow these steps:');
console.log('1. Replace CLIENT_ID and CLIENT_SECRET in this script with your actual values');
console.log('2. Open this URL in your browser:');
console.log('\n' + authUrl + '\n');
console.log('3. Complete the OAuth flow');
console.log('4. Copy the "code" parameter from the redirect URL');
console.log('5. Run: node scripts/exchange-code.js YOUR_CODE_HERE');
console.log('\n💡 Make sure your OAuth consent screen is configured with:');
console.log('- Scopes: https://www.googleapis.com/auth/gmail.readonly');
console.log('- Test users: your email address');
console.log('- Redirect URI: http://localhost:3002/api/auth/google/callback');

const { google } = require('googleapis');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function setupOAuth() {
  console.log('🔧 Google OAuth Setup for Flight Deals Monitor\n');
  
  const clientId = await question('Enter your Google Client ID: ');
  const clientSecret = await question('Enter your Google Client Secret: ');
  const redirectUri = await question('Enter your redirect URI (default: http://localhost:3000/api/auth/google/callback): ') || 'http://localhost:3000/api/auth/google/callback';
  
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  
  // Generate the URL for OAuth consent
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });
  
  console.log('\n📋 Next steps:');
  console.log('1. Open this URL in your browser:');
  console.log(authUrl);
  console.log('\n2. Complete the OAuth flow and copy the authorization code');
  
  const authCode = await question('\nEnter the authorization code: ');
  
  try {
    const { tokens } = await oauth2Client.getToken(authCode);
    console.log('\n✅ Success! Your refresh token is:');
    console.log(tokens.refresh_token);
    console.log('\n📝 Add this to your .env.local file:');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
  } catch (error) {
    console.error('❌ Error getting tokens:', error.message);
  }
  
  rl.close();
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

setupOAuth().catch(console.error);

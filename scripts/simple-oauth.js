const { google } = require('googleapis');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function simpleOAuth() {
  console.log('🔧 Simple Google OAuth Setup\n');
  
  const clientId = await question('Enter your Google Client ID: ');
  const clientSecret = await question('Enter your Google Client Secret: ');
  
  // Use a simple redirect URI that should work
  const redirectUri = 'http://localhost:8080/callback';
  
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  
  // Generate the URL for OAuth consent
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    prompt: 'consent'
  });
  
  console.log('\n📋 IMPORTANT: First, add this redirect URI to your Google OAuth client:');
  console.log('http://localhost:8080/callback');
  console.log('\n1. Go to Google Cloud Console → APIs & Services → Credentials');
  console.log('2. Click your OAuth 2.0 Client ID');
  console.log('3. Add "http://localhost:8080/callback" to Authorized redirect URIs');
  console.log('4. Save the changes');
  
  await question('\nPress Enter after adding the redirect URI...');
  
  console.log('\n2. Now open this URL in your browser:');
  console.log(authUrl);
  console.log('\n3. Complete the OAuth flow');
  console.log('4. You\'ll be redirected to a localhost URL - copy the "code" parameter');
  
  const authCode = await question('\nEnter the authorization code: ');
  
  try {
    const { tokens } = await oauth2Client.getToken(authCode);
    console.log('\n✅ Success! Your refresh token is:');
    console.log(tokens.refresh_token);
    console.log('\n📝 Add this to your .env.local file:');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
  } catch (error) {
    console.error('❌ Error getting tokens:', error.message);
    console.log('\n💡 Make sure:');
    console.log('- You added the redirect URI to your OAuth client');
    console.log('- The authorization code is correct');
    console.log('- Your OAuth consent screen is configured');
  }
  
  rl.close();
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

simpleOAuth().catch(console.error);

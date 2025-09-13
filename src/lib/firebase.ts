import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // Changed to NEXT_PUBLIC
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all required config is present
const isConfigValid = firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId && 
  firebaseConfig.storageBucket && 
  firebaseConfig.messagingSenderId && 
  firebaseConfig.appId;

// Only initialize Firebase if we have the required config
const app = getApps().length === 0 && isConfigValid
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// Initialize Firebase Authentication and get a reference to the service
export const auth = app ? getAuth(app) : null;
export default app;

// Log configuration status in development
if (process.env.NODE_ENV === 'development' && !isConfigValid) {
  console.warn('Firebase Auth is not configured. Please set the following environment variables:');
  console.warn('- NEXT_PUBLIC_FIREBASE_API_KEY');
  console.warn('- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  console.warn('- NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  console.warn('- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
  console.warn('- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
  console.warn('- NEXT_PUBLIC_FIREBASE_APP_ID');
}

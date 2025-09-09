import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app: any = null;
let db: any = null;

function getFirebaseApp() {
  if (!app) {
    if (getApps().length > 0) {
      app = getApps()[0];
      console.log('🔥 Using existing Firebase app');
    } else {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
      
      console.log('🔥 Initializing Firebase app...');
      console.log('🔥 Project ID:', projectId ? 'Set' : 'Missing');
      console.log('🔥 Client Email:', clientEmail ? 'Set' : 'Missing');
      console.log('🔥 Private Key:', privateKey ? 'Set' : 'Missing');
      
      if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Firebase environment variables are not configured');
      }
      
      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('🔥 Firebase app initialized successfully');
    }
  }
  return app;
}

export function getFirestoreDB() {
  if (!db) {
    console.log('🔥 Getting Firestore database...');
    db = getFirestore(getFirebaseApp());
    console.log('🔥 Firestore database ready');
  }
  return db;
}

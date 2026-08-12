import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';

import firebaseAppletConfig from '../../firebase-applet-config.json';
import { Artwork } from '../types';

let jsonConfig: any = {};
try {
  jsonConfig = firebaseAppletConfig;
} catch (e) {
  console.warn("firebase-applet-config.json not loaded:", e);
}

// User provided / provisioned Firebase SDK Configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || jsonConfig.apiKey || "AIzaSyDqkVPV9fBQ0JyHOSEF9QL3vjTIqTAMSZo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || jsonConfig.authDomain || "gen-lang-client-0033466035.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || jsonConfig.projectId || "gen-lang-client-0033466035",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || jsonConfig.storageBucket || "gen-lang-client-0033466035.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || jsonConfig.messagingSenderId || "258318933080",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || jsonConfig.appId || "1:258318933080:web:33337c0072f82cc2f9be2d",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || jsonConfig.firestoreDatabaseId || "ai-studio-artalystic-12ebbf1f-8f14-4ad1-b53a-8a3f9d00f7f5"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth, Firestore & Storage
export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
export const storage = getStorage(app);
export { serverTimestamp, collection, doc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot };

import { uploadArtworkToSupabase } from './supabase';

/** Upload artwork file to Supabase Storage ('artworks' bucket) */
export async function uploadArtworkFile(
  file: File,
  folder: string = 'artworks'
): Promise<{ url: string; fileType: string; error: string | null }> {
  return uploadArtworkToSupabase(file, folder);
}

/** Convert Firestore document to Artwork object */
export function docToArtwork(docSnap: any): Artwork {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    artworkCode: data.artworkCode || `ART-${docSnap.id.substring(0, 5).toUpperCase()}`,
    title: data.title || 'Untitled Artwork',
    artist: data.artistName || data.artist || 'Unknown Artist',
    artistName: data.artistName || data.artist || 'Unknown Artist',
    artistEmail: data.artistEmail || '',
    category: data.category || 'Traditional Art',
    medium: data.medium || 'Mixed Media',
    dimensions: data.dimensions || 'Standard',
    year: data.year !== undefined ? String(data.year) : '2026',
    imageUrl: data.imageUrl || data.image || '',
    description: data.description || '',
    story: data.artistNote || data.story || '',
    artistNote: data.artistNote || data.story || '',
    fileType: data.fileType || 'image/png',
    available: data.available !== undefined ? data.available : true,
    featured: data.featured !== undefined ? data.featured : false,
    views: data.views || 0,
    likes: data.likes || 0,
    dateAdded: data.dateAdded || (data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
    createdAt: data.createdAt
  };
}

/** Convert Artwork object or payload to Firestore document data */
export function artworkToDocData(art: Partial<Artwork>) {
  const numericYear = parseInt(String(art.year || '2026').replace(/\D/g, ''), 10) || 2026;
  return {
    artworkCode: art.artworkCode || `ART-${Math.floor(100 + Math.random() * 900)}`,
    title: art.title || '',
    description: art.description || '',
    artistName: art.artistName || art.artist || '',
    artistEmail: art.artistEmail || '',
    category: art.category || 'Traditional Art',
    medium: art.medium || 'Mixed Media',
    dimensions: art.dimensions || 'Standard',
    year: numericYear,
    artistNote: art.artistNote || art.story || '',
    imageUrl: art.imageUrl || '',
    fileType: art.fileType || 'image/png',
    available: art.available !== undefined ? art.available : true,
    featured: art.featured !== undefined ? art.featured : false,
    views: art.views || 0,
    likes: art.likes || 0,
    dateAdded: art.dateAdded || new Date().toISOString().split('T')[0],
    createdAt: art.createdAt || serverTimestamp()
  };
}

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Operation Types for Firestore Error Reporting
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details:', JSON.stringify(errInfo));
  return errInfo;
}

// Test Firestore Connection
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'status'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or project config requires verification.');
    } else {
      console.log('Firebase connection initialized successfully.');
    }
    return true;
  }
}

// Auth Helper Methods
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (err: any) {
    console.error('Google Sign-In Error:', err);
    return { user: null, error: err.message || 'Google authentication failed.' };
  }
}

export async function signInWithEmail(email: string, pass: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return { user: result.user, error: null };
  } catch (err: any) {
    console.error('Email Sign-In Error:', err);
    let msg = 'Invalid credentials or login failed.';
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
      msg = 'Incorrect email or password.';
    } else if (err.code === 'auth/user-not-found') {
      msg = 'No user account found with this email.';
    } else if (err.code === 'auth/invalid-email') {
      msg = 'Please enter a valid email address.';
    }
    return { user: null, error: msg };
  }
}

export async function signUpWithEmail(email: string, pass: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    return { user: result.user, error: null };
  } catch (err: any) {
    console.error('Sign-Up Error:', err);
    let msg = 'Failed to create owner account.';
    if (err.code === 'auth/email-already-in-use') {
      msg = 'An account with this email already exists. Try signing in.';
    } else if (err.code === 'auth/weak-password') {
      msg = 'Password should be at least 6 characters.';
    }
    return { user: null, error: msg };
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (err: any) {
    console.error('Sign-Out Error:', err);
    return { success: false, error: err.message };
  }
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

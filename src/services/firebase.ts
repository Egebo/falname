import { initializeApp } from 'firebase/app';
import { initializeAuth, signInAnonymously, User } from 'firebase/auth';
// @ts-expect-error — getReactNativePersistence yalnızca RN tip girişinde tanımlı;
// Metro çalışma zamanında react-native girişini çözdüğü için runtime'da mevcut.
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Değerler .env dosyasından okunur (bkz. .env.example) — Firebase Console →
// Proje Ayarları → Genel → "Uygulamalarınız" → Web uygulaması bölümünden alınır.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// React Native'de oturumun kalıcı olması için AsyncStorage persistence gerekir
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

// Anonim giriş: kullanıcı hiçbir işlem yapmadan cihaza bağlı bir hesap açılır.
// Uygulama açılışında bir kez çağrılır; zaten girişliyse mevcut kullanıcıyı döner.
export function ensureSignedIn(): Promise<User> {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        signInAnonymously(auth)
          .then(cred => resolve(cred.user))
          .catch(reject);
      }
    });
  });
}

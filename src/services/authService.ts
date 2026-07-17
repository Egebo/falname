import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import {
  AuthCredential, GoogleAuthProvider, OAuthProvider, User,
  linkWithCredential, signInWithCredential, signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, ensureSignedIn } from './firebase';

// Firebase Console → Authentication → Sign-in method → Google →
// "Web SDK configuration" altındaki Web client ID buraya.
const GOOGLE_WEB_CLIENT_ID = 'BURAYA_YAPISTIR.apps.googleusercontent.com';

// Google/Apple girişleri native modül gerektirir; Expo Go'da kullanılamaz.
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export type AccountProvider = 'misafir' | 'google' | 'apple';

export function getAccountProvider(): AccountProvider {
  const u = auth.currentUser;
  if (!u || u.isAnonymous) return 'misafir';
  if (u.providerData.some(p => p.providerId === 'google.com')) return 'google';
  if (u.providerData.some(p => p.providerId === 'apple.com')) return 'apple';
  return 'misafir';
}

export function isSocialLoginAvailable(): boolean {
  return !isExpoGo;
}

// Misafir (anonim) hesabı sosyal hesaba yükseltir; böylece fal geçmişi korunur.
// Bu kimlik daha önce başka bir hesapta kullanıldıysa o hesaba giriş yapılır
// (misafir geçmişi eski hesapta kalmaz — yeni hesabın geçmişi yüklenir).
async function linkOrSignIn(credential: AuthCredential): Promise<User> {
  const current = await ensureSignedIn();
  try {
    const result = await linkWithCredential(current, credential);
    return result.user;
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === 'auth/credential-already-in-use' || code === 'auth/email-already-in-use') {
      const result = await signInWithCredential(auth, credential);
      return result.user;
    }
    throw e;
  }
}

export async function signInWithGoogle(): Promise<User> {
  if (isExpoGo) {
    throw new Error('Google ile giriş Expo Go\'da çalışmaz; development build gerekir.');
  }
  const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
  GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  const idToken = response.data?.idToken;
  if (!idToken) throw new Error('Google girişi iptal edildi.');
  return linkOrSignIn(GoogleAuthProvider.credential(idToken));
}

export async function signInWithApple(): Promise<User> {
  if (Platform.OS !== 'ios') {
    throw new Error('Apple ile giriş yalnızca iOS cihazlarda kullanılabilir.');
  }
  if (isExpoGo) {
    throw new Error('Apple ile giriş için development build gerekir.');
  }
  const AppleAuthentication = await import('expo-apple-authentication');
  const Crypto = await import('expo-crypto');

  // Replay saldırılarına karşı nonce: Apple'a SHA256 özeti, Firebase'e ham hali gider.
  const rawNonce = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );

  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });
  if (!appleCredential.identityToken) throw new Error('Apple girişi iptal edildi.');

  const provider = new OAuthProvider('apple.com');
  return linkOrSignIn(
    provider.credential({ idToken: appleCredential.identityToken, rawNonce }),
  );
}

// Çıkış: sosyal hesaptan çıkar, yeni bir misafir oturumu açar.
export async function signOutToGuest(): Promise<User> {
  await firebaseSignOut(auth);
  return ensureSignedIn();
}

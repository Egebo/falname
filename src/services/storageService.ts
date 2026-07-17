import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

const KEYS = {
  USER_PROFILE: 'user_profile',
  NOTIFICATION_TIME: 'notification_time',
};

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
}

export async function loadUserProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(KEYS.USER_PROFILE);
  return raw ? JSON.parse(raw) : null;
}

export async function saveNotificationTime(time: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.NOTIFICATION_TIME, time);
}

export async function loadNotificationTime(): Promise<string> {
  return (await AsyncStorage.getItem(KEYS.NOTIFICATION_TIME)) || '09:00';
}

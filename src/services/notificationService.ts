import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

// Expo Go (SDK 53+) artık expo-notifications'ın push token kaydını desteklemiyor;
// modülü import etmek bile hataya yol açıyor. Bu yüzden Expo Go'da modülü hiç yüklemiyoruz.
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let notificationsModule: typeof import('expo-notifications') | null = null;
let deviceModule: typeof import('expo-device') | null = null;

async function getNotifications() {
  if (isExpoGo) return null;
  if (!notificationsModule) {
    notificationsModule = await import('expo-notifications');
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }
  return notificationsModule;
}

async function getDevice() {
  if (!deviceModule) {
    deviceModule = await import('expo-device');
  }
  return deviceModule;
}

export async function requestNotificationPermission(): Promise<boolean> {
  const Notifications = await getNotifications();
  if (!Notifications) return false;
  const Device = await getDevice();
  if (!Device.isDevice) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyNotification(hour = 9, minute = 0): Promise<boolean> {
  const Notifications = await getNotifications();
  if (!Notifications) return false;

  // Mevcut bildirimleri iptal et
  await Notifications.cancelAllScheduledNotificationsAsync();

  const granted = await requestNotificationPermission();
  if (!granted) return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-horoscope', {
      name: 'Günlük Burç Yorumu',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔮 Günlük Burcun Hazır',
      body: 'Bugünün yorumunu görmek için dokun ✨',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      channelId: 'daily-horoscope',
      hour,
      minute,
    },
  });

  return true;
}

export async function cancelAllNotifications(): Promise<void> {
  const Notifications = await getNotifications();
  if (!Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

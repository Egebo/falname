import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import TabNavigator from './src/navigation/TabNavigator';
import { ensureSignedIn } from './src/services/firebase';

export default function App() {
  useEffect(() => {
    // Anonim oturum aç — fal geçmişi bu kimliğe bağlanır.
    // Başarısız olursa (offline vb.) uygulama çalışmaya devam eder;
    // geçmiş ekranı kendi hatasını gösterir.
    ensureSignedIn().catch(err => console.warn('Anonim giriş başarısız:', err));
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <TabNavigator />
    </NavigationContainer>
  );
}

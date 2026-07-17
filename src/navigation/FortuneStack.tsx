import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FortuneHubScreen from '../screens/FortuneHubScreen';
import PalmReadingScreen from '../screens/PalmReadingScreen';
import CoffeeReadingScreen from '../screens/CoffeeReadingScreen';
import ZodiacFortuneScreen from '../screens/ZodiacFortuneScreen';
import BirthChartScreen from '../screens/BirthChartScreen';
import FortuneHistoryScreen from '../screens/FortuneHistoryScreen';
import { FortuneStackParamList } from '../types';

const Stack = createNativeStackNavigator<FortuneStackParamList>();

export default function FortuneStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#12122A' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        headerBackTitle: 'Geri',
        contentStyle: { backgroundColor: '#0D0D1A' },
      }}
    >
      <Stack.Screen name="FalMenu" component={FortuneHubScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ElFali" component={PalmReadingScreen} options={{ title: '🤚 El Falı' }} />
      <Stack.Screen name="KahveFali" component={CoffeeReadingScreen} options={{ title: '☕ Kahve Falı' }} />
      <Stack.Screen name="BurcFali" component={ZodiacFortuneScreen} options={{ title: '🌟 Burç Falı' }} />
      <Stack.Screen name="DogumHaritasi" component={BirthChartScreen} options={{ title: '🌌 Doğum Haritası' }} />
      <Stack.Screen name="GecmisFallar" component={FortuneHistoryScreen} options={{ title: '🗂️ Geçmiş Fallarım' }} />
    </Stack.Navigator>
  );
}

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import NumerologyScreen from '../screens/NumerologyScreen';
import CompatibilityScreen from '../screens/CompatibilityScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FortuneStack from './FortuneStack';
import { RootTabParamList } from '../types';

const Tab = createBottomTabNavigator<RootTabParamList>();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.5 }}>
      {emoji}
    </Text>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#12122A',
          borderTopColor: '#2A2A40',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: '#7B61FF',
        tabBarInactiveTintColor: '#555',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Ana Sayfa"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔮" focused={focused} /> }}
      />
      <Tab.Screen
        name="Fallar"
        component={FortuneStack}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="✨" focused={focused} /> }}
      />
      <Tab.Screen
        name="Numeroloji"
        component={NumerologyScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔢" focused={focused} /> }}
      />
      <Tab.Screen
        name="Uyumluluk"
        component={CompatibilityScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💜" focused={focused} /> }}
      />
      <Tab.Screen
        name="Ayarlar"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, SafeAreaView,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { loadUserProfile } from '../services/storageService';
import { ZODIAC_SIGNS, ELEMENT_COLORS } from '../data/zodiacData';
import { getDailyHoroscope } from '../data/horoscopes';
import { DailyHoroscope, RootTabParamList, UserProfile, ZodiacSign } from '../types';

const DAYS_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

type Props = BottomTabScreenProps<RootTabParamList, 'Ana Sayfa'>;

export default function HomeScreen({ navigation }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);
  const [sign, setSign] = useState<ZodiacSign | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const dateStr = `${DAYS_TR[today.getDay()]}, ${today.getDate()} ${MONTHS_TR[today.getMonth()]} ${today.getFullYear()}`;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    loadData();
    return unsubscribe;
  }, []);

  async function loadData() {
    setLoading(true);
    const p = await loadUserProfile();
    if (p) {
      const s = ZODIAC_SIGNS.find(z => z.id === p.zodiacSign);
      setSign(s);
      setHoroscope(getDailyHoroscope(p.zodiacSign));
      setProfile(p);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#7B61FF" />
      </SafeAreaView>
    );
  }

  if (!profile || !horoscope) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.setupEmoji}>🔮</Text>
        <Text style={styles.setupTitle}>Hoş geldin!</Text>
        <Text style={styles.setupDesc}>Başlamak için burç bilgini gir.</Text>
        <TouchableOpacity
          style={styles.setupButton}
          onPress={() => navigation.navigate('Ayarlar')}
        >
          <Text style={styles.setupButtonText}>Kurulumu Başlat</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const elementColor = (sign && ELEMENT_COLORS[sign.element]) || '#7B61FF';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.dateText}>{dateStr}</Text>
          <Text style={styles.greeting}>Günün Yorumu</Text>
        </View>

        {/* Burç Kartı */}
        <View style={[styles.signCard, { borderColor: elementColor }]}>
          <Text style={styles.signEmoji}>{sign?.emoji}</Text>
          <Text style={styles.signName}>{sign?.name}</Text>
          <View style={[styles.elementBadge, { backgroundColor: elementColor + '30' }]}>
            <Text style={[styles.elementText, { color: elementColor }]}>
              {sign?.element} · {sign?.planet}
            </Text>
          </View>
        </View>

        {/* Yorum Kartları */}
        <InfoCard emoji="💕" label="Aşk" text={horoscope.love} color="#FF6B9D" />
        <InfoCard emoji="💼" label="Kariyer" text={horoscope.career} color="#7B61FF" />
        <InfoCard emoji="🌿" label="Sağlık" text={horoscope.health} color="#4CAF50" />

        {/* Şans */}
        <View style={styles.luckyRow}>
          <View style={styles.luckyCard}>
            <Text style={styles.luckyLabel}>Şans Sayın</Text>
            <Text style={styles.luckyValue}>{horoscope.lucky_number}</Text>
          </View>
          <View style={styles.luckyCard}>
            <Text style={styles.luckyLabel}>Şans Rengin</Text>
            <Text style={styles.luckyValue}>{horoscope.lucky_color}</Text>
          </View>
        </View>

        <Text style={styles.footer}>Yarın yeni yorum gelecek ✨</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

interface InfoCardProps {
  emoji: string;
  label: string;
  text: string;
  color: string;
}

function InfoCard({ emoji, label, text, color }: InfoCardProps) {
  return (
    <View style={[styles.infoCard, { borderLeftColor: color }]}>
      <Text style={styles.infoLabel}>{emoji} {label}</Text>
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  center: { flex: 1, backgroundColor: '#0D0D1A', justifyContent: 'center', alignItems: 'center', padding: 24 },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24 },
  dateText: { color: '#888', fontSize: 13 },
  greeting: { color: '#fff', fontSize: 26, fontWeight: '700', marginTop: 4 },
  signCard: {
    alignItems: 'center', backgroundColor: '#1A1A2E', borderRadius: 20,
    padding: 28, marginBottom: 20, borderWidth: 1.5,
  },
  signEmoji: { fontSize: 60 },
  signName: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 8 },
  elementBadge: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  elementText: { fontSize: 13, fontWeight: '600' },
  infoCard: {
    backgroundColor: '#1A1A2E', borderRadius: 14, padding: 16,
    marginBottom: 12, borderLeftWidth: 4,
  },
  infoLabel: { color: '#aaa', fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoText: { color: '#eee', fontSize: 15, lineHeight: 22 },
  luckyRow: { flexDirection: 'row', gap: 12, marginBottom: 24, marginTop: 4 },
  luckyCard: {
    flex: 1, backgroundColor: '#1A1A2E', borderRadius: 14,
    padding: 16, alignItems: 'center',
  },
  luckyLabel: { color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  luckyValue: { color: '#7B61FF', fontSize: 20, fontWeight: '700', marginTop: 6 },
  footer: { color: '#555', fontSize: 12, textAlign: 'center', marginTop: 8 },
  setupEmoji: { fontSize: 64, marginBottom: 16 },
  setupTitle: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 8 },
  setupDesc: { color: '#888', fontSize: 16, marginBottom: 32, textAlign: 'center' },
  setupButton: { backgroundColor: '#7B61FF', paddingHorizontal: 36, paddingVertical: 14, borderRadius: 28 },
  setupButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

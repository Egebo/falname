import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import { loadUserProfile } from '../services/storageService';
import { getLifePathNumber, LIFE_PATH_MEANINGS } from '../data/zodiacData';
import { LifePathMeaning, UserProfile } from '../types';

const PERSONAL_YEAR_MEANINGS: Record<number, string> = {
  1: 'Yeni başlangıçlar yılı. Tohum ekme zamanı.',
  2: 'Ortaklık ve sabır yılı. İlişkiler ön planda.',
  3: 'Yaratıcılık ve ifade yılı. Kendini göster.',
  4: 'Çalışma ve inşa yılı. Sağlam temeller kur.',
  5: 'Değişim ve özgürlük yılı. Yenilik kapıda.',
  6: 'Aile ve sorumluluk yılı. Dengeyi bul.',
  7: 'İçe dönüş ve araştırma yılı. Derinleş.',
  8: 'Güç ve başarı yılı. Hasat zamanı.',
  9: 'Tamamlanma yılı. Bırak ve dönüştür.',
};

function getPersonalYear(birthDate: string): number {
  const today = new Date();
  const [, month, day] = birthDate.split('-').map(Number);
  const digits = `${day}${month}${today.getFullYear()}`.split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

function getSoulNumber(birthDate: string): number {
  // Vowel sayısı — doğum tarihinin rakamlarından basit türetme
  const [, month, day] = birthDate.split('-').map(Number);
  const digits = `${day}${month}`.split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

export default function NumerologyScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lifePathNum, setLifePathNum] = useState<number | null>(null);
  const [personalYearNum, setPersonalYearNum] = useState<number | null>(null);
  const [soulNum, setSoulNum] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const p = await loadUserProfile();
    if (p?.birthDate) {
      setProfile(p);
      setLifePathNum(getLifePathNumber(p.birthDate));
      setPersonalYearNum(getPersonalYear(p.birthDate));
      setSoulNum(getSoulNumber(p.birthDate));
    }
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emoji}>🔢</Text>
        <Text style={styles.emptyText}>Doğum tarihin girilmemiş. Ayarlardan ekle.</Text>
      </SafeAreaView>
    );
  }

  const fallback: LifePathMeaning = { title: '?', desc: 'Hesaplanamadı.' };
  const lp = (lifePathNum !== null && LIFE_PATH_MEANINGS[lifePathNum]) || fallback;
  const pyDesc = (personalYearNum !== null && PERSONAL_YEAR_MEANINGS[personalYearNum]) || '—';
  const soulDesc = (soulNum !== null && LIFE_PATH_MEANINGS[soulNum]) || { title: '?', desc: '—' };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Numeroloji</Text>
        <Text style={styles.subtitle}>Sayılarla kaderini keşfet</Text>

        {/* Yaşam Yolu Sayısı */}
        <View style={[styles.card, { borderColor: '#7B61FF' }]}>
          <View style={styles.numCircle}>
            <Text style={styles.numText}>{lifePathNum}</Text>
          </View>
          <Text style={styles.cardLabel}>Yaşam Yolu Sayın</Text>
          <Text style={styles.cardTitle}>{lp.title}</Text>
          <Text style={styles.cardDesc}>{lp.desc}</Text>
        </View>

        {/* Kişisel Yıl */}
        <View style={[styles.card, { borderColor: '#FF6B9D' }]}>
          <View style={[styles.numCircle, { backgroundColor: '#FF6B9D22', borderColor: '#FF6B9D' }]}>
            <Text style={[styles.numText, { color: '#FF6B9D' }]}>{personalYearNum}</Text>
          </View>
          <Text style={styles.cardLabel}>Kişisel Yılın ({new Date().getFullYear()})</Text>
          <Text style={styles.cardDesc}>{pyDesc}</Text>
        </View>

        {/* Ruh Sayısı */}
        <View style={[styles.card, { borderColor: '#4CAF50' }]}>
          <View style={[styles.numCircle, { backgroundColor: '#4CAF5022', borderColor: '#4CAF50' }]}>
            <Text style={[styles.numText, { color: '#4CAF50' }]}>{soulNum}</Text>
          </View>
          <Text style={styles.cardLabel}>Ruh Sayın</Text>
          <Text style={styles.cardTitle}>{soulDesc.title}</Text>
          <Text style={styles.cardDesc}>{soulDesc.desc}</Text>
        </View>

        <Text style={styles.note}>
          * Numeroloji, doğum tarihine dayalı sembolik bir sistemdir. Eğlence amaçlıdır.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  center: { flex: 1, backgroundColor: '#0D0D1A', justifyContent: 'center', alignItems: 'center', padding: 24 },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 24 },
  card: {
    backgroundColor: '#1A1A2E', borderRadius: 20, padding: 24,
    marginBottom: 16, alignItems: 'center', borderWidth: 1.5,
  },
  numCircle: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 2,
    borderColor: '#7B61FF', backgroundColor: '#7B61FF22',
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  numText: { color: '#7B61FF', fontSize: 28, fontWeight: '800' },
  cardLabel: { color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 10 },
  cardDesc: { color: '#ccc', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  emoji: { fontSize: 56, marginBottom: 16 },
  emptyText: { color: '#888', fontSize: 15, textAlign: 'center' },
  note: { color: '#444', fontSize: 11, textAlign: 'center', marginTop: 16, lineHeight: 18 },
});

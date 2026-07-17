import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FortuneStackParamList } from '../types';

type Props = NativeStackScreenProps<FortuneStackParamList, 'FalMenu'>;

const FORTUNE_CARDS: {
  route: keyof FortuneStackParamList;
  emoji: string;
  title: string;
  desc: string;
  color: string;
}[] = [
  { route: 'ElFali', emoji: '🤚', title: 'El Falı', desc: 'Avucundaki çizgiler kaderini fısıldıyor', color: '#FF6B9D' },
  { route: 'KahveFali', emoji: '☕', title: 'Kahve Falı', desc: 'Fincanını ters çevir, telveni okuyalım', color: '#C08552' },
  { route: 'BurcFali', emoji: '🌟', title: 'Burç Falı', desc: 'Bu hafta yıldızlar senin için ne diyor?', color: '#7B61FF' },
  { route: 'DogumHaritasi', emoji: '🌌', title: 'Doğum Haritası', desc: 'Doğduğun anın gökyüzü haritası', color: '#4FC3F7' },
  { route: 'GecmisFallar', emoji: '🗂️', title: 'Geçmiş Fallarım', desc: 'Baktığın tüm fallar arşivinde', color: '#9E9E9E' },
];

export default function FortuneHubScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Fallar</Text>
        <Text style={styles.subtitle}>Merak ettiğin falı seç, kaderin perdesini arala</Text>

        {FORTUNE_CARDS.map(card => (
          <TouchableOpacity
            key={card.route}
            style={[styles.card, { borderColor: card.color }]}
            onPress={() => navigation.navigate(card.route)}
            activeOpacity={0.8}
          >
            <View style={[styles.emojiCircle, { backgroundColor: card.color + '22' }]}>
              <Text style={styles.emoji}>{card.emoji}</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDesc}>{card.desc}</Text>
            </View>
            <Text style={[styles.chevron, { color: card.color }]}>›</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.note}>* Tüm fallar eğlence amaçlıdır.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 24 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A2E', borderRadius: 18, padding: 18,
    marginBottom: 14, borderWidth: 1.5,
  },
  emojiCircle: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  emoji: { fontSize: 28 },
  cardText: { flex: 1 },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 3 },
  cardDesc: { color: '#999', fontSize: 12.5, lineHeight: 17 },
  chevron: { fontSize: 28, fontWeight: '300', marginLeft: 8 },
  note: { color: '#444', fontSize: 11, textAlign: 'center', marginTop: 12 },
});

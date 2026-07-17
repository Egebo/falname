import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { FortuneRecord } from '../services/fortuneHistoryService';

const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

// Paylaşım için görüntüye çevrilecek fal kartı. Ekran dışında render edilir,
// react-native-view-shot ile PNG'ye çekilir.
const FortuneShareCard = forwardRef<ViewShot, { record: FortuneRecord }>(
  function FortuneShareCard({ record }, ref) {
    const d = new Date(record.createdAt);
    const dateStr = `${d.getDate()} ${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}`;

    return (
      <ViewShot ref={ref} options={{ format: 'png', quality: 1 }} style={styles.card}>
        <View style={styles.inner}>
          <Text style={styles.emoji}>{record.emoji}</Text>
          <Text style={styles.title}>{record.title}</Text>
          <Text style={styles.date}>{dateStr}</Text>
          <View style={styles.divider} />
          <Text style={styles.content}>{record.content}</Text>
          <View style={styles.divider} />
          <Text style={styles.brand}>🔮 Falname</Text>
          <Text style={styles.disclaimer}>Eğlence amaçlıdır</Text>
        </View>
      </ViewShot>
    );
  },
);

export default FortuneShareCard;

const styles = StyleSheet.create({
  card: { width: 360, backgroundColor: '#0D0D1A' },
  inner: {
    margin: 16, backgroundColor: '#1A1A2E', borderRadius: 20,
    padding: 24, alignItems: 'center', borderWidth: 1.5, borderColor: '#7B61FF',
  },
  emoji: { fontSize: 48 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 8 },
  date: { color: '#888', fontSize: 12, marginTop: 4 },
  divider: { height: 1, alignSelf: 'stretch', backgroundColor: '#2A2A40', marginVertical: 14 },
  content: { color: '#ddd', fontSize: 13.5, lineHeight: 21 },
  brand: { color: '#7B61FF', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  disclaimer: { color: '#555', fontSize: 10, marginTop: 4 },
});

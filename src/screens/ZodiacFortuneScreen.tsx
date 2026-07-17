import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, FlatList,
} from 'react-native';
import { ZODIAC_SIGNS, ELEMENT_COLORS } from '../data/zodiacData';
import { getZodiacFortune } from '../data/zodiacFortuneData';
import { loadUserProfile } from '../services/storageService';
import { saveFortune } from '../services/fortuneHistoryService';
import { ZodiacSignId } from '../types';

export default function ZodiacFortuneScreen() {
  const [signId, setSignId] = useState<ZodiacSignId | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    // Profildeki burcu varsayılan olarak yükle
    loadUserProfile().then(p => {
      if (p?.zodiacSign) setSignId(prev => prev ?? p.zodiacSign);
    });
  }, []);

  const sign = ZODIAC_SIGNS.find(s => s.id === signId);
  const fortune = signId ? getZodiacFortune(signId) : null;
  const elementColor = sign ? ELEMENT_COLORS[sign.element] : '#7B61FF';

  useEffect(() => {
    if (!sign || !fortune || !signId) return;
    // Haftalık fal — aynı hafta + burç için tek kayıt (dedupe anahtarı)
    const week = Math.floor(Date.now() / (86400000 * 7));
    const content = [
      `🌟 Genel: ${fortune.genel}`,
      `💕 Aşk: ${fortune.ask}`,
      `💰 Para & Kariyer: ${fortune.para}`,
      `⚠️ Uyarı: ${fortune.uyari}`,
      `📅 Şanslı Gün: ${fortune.luckyDay}`,
    ].join('\n\n');
    saveFortune(
      {
        type: 'burc',
        emoji: '🌟',
        title: 'Burç Falı',
        summary: `${sign.name} — haftalık yorum`,
        content,
      },
      `burc-${signId}-${week}`,
    ).catch(() => { /* offline ise sessizce geç */ });
  }, [signId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Burç Falı</Text>
        <Text style={styles.subtitle}>Bu hafta yıldızlar ne fısıldıyor?</Text>

        <TouchableOpacity style={styles.picker} onPress={() => setPickerOpen(true)}>
          <Text style={styles.pickerEmoji}>{sign?.emoji || '🔮'}</Text>
          <Text style={styles.pickerName}>{sign?.name || 'Burcunu seç...'}</Text>
          <Text style={styles.pickerArrow}>▼</Text>
        </TouchableOpacity>

        {fortune && sign && (
          <>
            <View style={[styles.headerCard, { borderColor: elementColor }]}>
              <Text style={styles.headerEmoji}>{sign.emoji}</Text>
              <Text style={styles.headerName}>{sign.name}</Text>
              <Text style={[styles.headerElement, { color: elementColor }]}>
                {sign.element} · {sign.planet}
              </Text>
            </View>

            <FortuneCard emoji="🌟" label="Genel" text={fortune.genel} color="#7B61FF" />
            <FortuneCard emoji="💕" label="Aşk" text={fortune.ask} color="#FF6B9D" />
            <FortuneCard emoji="💰" label="Para & Kariyer" text={fortune.para} color="#4CAF50" />
            <FortuneCard emoji="⚠️" label="Haftanın Uyarısı" text={fortune.uyari} color="#FFC107" />

            <View style={styles.luckyDayCard}>
              <Text style={styles.luckyDayLabel}>Şanslı Günün</Text>
              <Text style={styles.luckyDayValue}>📅 {fortune.luckyDay}</Text>
            </View>
          </>
        )}

        {!signId && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderEmoji}>🌟</Text>
            <Text style={styles.placeholderText}>Burcunu seç, haftalık falını gör</Text>
          </View>
        )}

        <Text style={styles.note}>* Burç falı eğlence amaçlıdır. Her hafta yenilenir.</Text>
      </ScrollView>

      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <TouchableOpacity style={styles.overlay} onPress={() => setPickerOpen(false)} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Burç Seç</Text>
          <FlatList
            data={ZODIAC_SIGNS}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.signItem, item.id === signId && styles.signItemSel]}
                onPress={() => { setSignId(item.id); setPickerOpen(false); }}
              >
                <Text style={styles.signItemEmoji}>{item.emoji}</Text>
                <View>
                  <Text style={styles.signItemName}>{item.name}</Text>
                  <Text style={styles.signItemDate}>{item.dateRange}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function FortuneCard({ emoji, label, text, color }: {
  emoji: string; label: string; text: string; color: string;
}) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.cardLabel}>{emoji} {label}</Text>
      <Text style={styles.cardText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 20 },
  picker: {
    backgroundColor: '#1A1A2E', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderColor: '#2A2A40', marginBottom: 20,
  },
  pickerEmoji: { fontSize: 24, marginRight: 10 },
  pickerName: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '600' },
  pickerArrow: { color: '#555', fontSize: 10 },
  headerCard: {
    alignItems: 'center', backgroundColor: '#1A1A2E', borderRadius: 20,
    padding: 22, marginBottom: 16, borderWidth: 1.5,
  },
  headerEmoji: { fontSize: 48 },
  headerName: { color: '#fff', fontSize: 24, fontWeight: '700', marginTop: 6 },
  headerElement: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  card: {
    backgroundColor: '#1A1A2E', borderRadius: 14, padding: 16,
    marginBottom: 12, borderLeftWidth: 4,
  },
  cardLabel: { color: '#aaa', fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardText: { color: '#eee', fontSize: 14.5, lineHeight: 22 },
  luckyDayCard: {
    backgroundColor: '#1A1A2E', borderRadius: 14, padding: 16,
    alignItems: 'center', marginBottom: 8,
  },
  luckyDayLabel: { color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  luckyDayValue: { color: '#7B61FF', fontSize: 18, fontWeight: '700', marginTop: 6 },
  placeholder: { alignItems: 'center', marginTop: 50 },
  placeholderEmoji: { fontSize: 60, marginBottom: 14 },
  placeholderText: { color: '#555', fontSize: 15 },
  note: { color: '#444', fontSize: 11, textAlign: 'center', marginTop: 14 },
  overlay: { flex: 1, backgroundColor: '#00000080' },
  sheet: {
    backgroundColor: '#1A1A2E', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 20, paddingHorizontal: 16, maxHeight: '60%',
  },
  sheetTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16, paddingHorizontal: 4 },
  signItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 4 },
  signItemSel: { backgroundColor: '#7B61FF22' },
  signItemEmoji: { fontSize: 28, marginRight: 14 },
  signItemName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  signItemDate: { color: '#888', fontSize: 12, marginTop: 2 },
});

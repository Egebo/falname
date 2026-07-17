import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Modal, FlatList,
} from 'react-native';
import { ZODIAC_SIGNS, COMPATIBILITY_MATRIX, ELEMENT_COLORS } from '../data/zodiacData';
import { ZodiacSignId } from '../types';

function ScoreBar({ score }: { score: number }) {
  const color = score >= 8 ? '#4CAF50' : score >= 6 ? '#FFC107' : '#FF5252';
  return (
    <View style={styles.barBg}>
      <View style={[styles.barFill, { width: `${score * 10}%`, backgroundColor: color }]} />
    </View>
  );
}

interface SignPickerProps {
  selected: ZodiacSignId | null;
  onSelect: (id: ZodiacSignId) => void;
  label: string;
}

function SignPicker({ selected, onSelect, label }: SignPickerProps) {
  const [open, setOpen] = useState(false);
  const sign = ZODIAC_SIGNS.find(s => s.id === selected);

  return (
    <>
      <TouchableOpacity style={styles.picker} onPress={() => setOpen(true)}>
        <Text style={styles.pickerEmoji}>{sign?.emoji || '?'}</Text>
        <Text style={styles.pickerName}>{sign?.name || label}</Text>
        <Text style={styles.pickerArrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setOpen(false)} />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>{label} Seç</Text>
          <FlatList
            data={ZODIAC_SIGNS}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.modalItem, item.id === selected && styles.modalItemSelected]}
                onPress={() => { onSelect(item.id); setOpen(false); }}
              >
                <Text style={styles.modalItemEmoji}>{item.emoji}</Text>
                <View>
                  <Text style={styles.modalItemName}>{item.name}</Text>
                  <Text style={styles.modalItemDate}>{item.dateRange}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

export default function CompatibilityScreen() {
  const [sign1, setSign1] = useState<ZodiacSignId | null>(null);
  const [sign2, setSign2] = useState<ZodiacSignId | null>(null);

  const score = sign1 && sign2
    ? (COMPATIBILITY_MATRIX[sign1]?.[sign2] ?? 5)
    : null;

  const s1 = ZODIAC_SIGNS.find(s => s.id === sign1);
  const s2 = ZODIAC_SIGNS.find(s => s.id === sign2);

  const getScoreLabel = (s: number) => {
    if (s >= 9) return { label: 'Mükemmel Uyum ✨', color: '#4CAF50' };
    if (s >= 7) return { label: 'Güçlü Uyum 💫', color: '#8BC34A' };
    if (s >= 5) return { label: 'Orta Uyum 🤝', color: '#FFC107' };
    return { label: 'Zorlu Uyum 🌪️', color: '#FF5252' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Uyumluluk Testi</Text>
        <Text style={styles.subtitle}>İki burcu seç, uyumu gör</Text>

        <View style={styles.pickersRow}>
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>1. Burç</Text>
            <SignPicker selected={sign1} onSelect={setSign1} label="Burç" />
          </View>
          <Text style={styles.heartIcon}>💜</Text>
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>2. Burç</Text>
            <SignPicker selected={sign2} onSelect={setSign2} label="Burç" />
          </View>
        </View>

        {score !== null && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultEmojis}>{s1?.emoji} + {s2?.emoji}</Text>
              <Text style={styles.resultNames}>{s1?.name} & {s2?.name}</Text>
            </View>

            <Text style={styles.scoreNumber}>{score}/10</Text>
            <ScoreBar score={score} />
            <Text style={[styles.scoreLabel, { color: getScoreLabel(score).color }]}>
              {getScoreLabel(score).label}
            </Text>

            <View style={styles.elementRow}>
              <ElementBadge label={s1?.element} color={s1 ? ELEMENT_COLORS[s1.element] : undefined} />
              <ElementBadge label={s2?.element} color={s2 ? ELEMENT_COLORS[s2.element] : undefined} />
            </View>

            <Text style={styles.compatDesc}>
              {getCompatDesc(sign1, sign2, score)}
            </Text>
          </View>
        )}

        {!sign1 && !sign2 && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderEmoji}>🔮</Text>
            <Text style={styles.placeholderText}>İki burç seç ve uyumu keşfet</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ElementBadge({ label, color }: { label?: string; color?: string }) {
  if (!label) return null;
  return (
    <View style={[styles.elemBadge, { backgroundColor: color + '25', borderColor: color }]}>
      <Text style={[styles.elemText, { color }]}>{label}</Text>
    </View>
  );
}

function getCompatDesc(id1: ZodiacSignId | null, id2: ZodiacSignId | null, score: number): string {
  if (!id1 || !id2) return '';
  const s1 = ZODIAC_SIGNS.find(s => s.id === id1);
  const s2 = ZODIAC_SIGNS.find(s => s.id === id2);
  if (score >= 8) return `${s1?.name} ile ${s2?.name} arasındaki çekim güçlü. Birbirinizi tamamlıyorsunuz ve ortak hedeflerde uyum içinde ilerliyorsunuz.`;
  if (score >= 6) return `${s1?.name} ve ${s2?.name} arasında sağlam bir temel var. Farklılıklarınız ilişkiye renk katıyor.`;
  return `${s1?.name} ve ${s2?.name} arasında bazı gerginlikler olabilir. Empati ve sabır ilişkinizi güçlendirecek.`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 28 },
  pickersRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  pickerWrapper: { flex: 1 },
  pickerLabel: { color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  picker: {
    backgroundColor: '#1A1A2E', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#2A2A40',
  },
  pickerEmoji: { fontSize: 22, marginRight: 8 },
  pickerName: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '600' },
  pickerArrow: { color: '#555', fontSize: 10 },
  heartIcon: { fontSize: 28, marginTop: 22 },
  resultCard: {
    backgroundColor: '#1A1A2E', borderRadius: 20, padding: 24,
    alignItems: 'center', borderWidth: 1.5, borderColor: '#7B61FF',
  },
  resultHeader: { alignItems: 'center', marginBottom: 20 },
  resultEmojis: { fontSize: 44, marginBottom: 8 },
  resultNames: { color: '#ccc', fontSize: 15 },
  scoreNumber: { color: '#7B61FF', fontSize: 48, fontWeight: '800', marginBottom: 12 },
  barBg: { width: '100%', height: 8, backgroundColor: '#2A2A40', borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  barFill: { height: '100%', borderRadius: 4 },
  scoreLabel: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  elementRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  elemBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  elemText: { fontSize: 12, fontWeight: '600' },
  compatDesc: { color: '#ccc', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  placeholder: { alignItems: 'center', marginTop: 60 },
  placeholderEmoji: { fontSize: 64, marginBottom: 16 },
  placeholderText: { color: '#555', fontSize: 15, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: '#00000080' },
  modalSheet: {
    backgroundColor: '#1A1A2E', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 20, paddingHorizontal: 16, maxHeight: '60%',
  },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16, paddingHorizontal: 4 },
  modalItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 4 },
  modalItemSelected: { backgroundColor: '#7B61FF22' },
  modalItemEmoji: { fontSize: 28, marginRight: 14 },
  modalItemName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalItemDate: { color: '#888', fontSize: 12, marginTop: 2 },
});

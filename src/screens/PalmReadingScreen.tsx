import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import {
  PALM_LINES, LINE_CHOICES, PALM_READINGS, HAND_INTROS,
  getOverallPalmReading, PalmLineId,
} from '../data/palmData';
import { saveFortune } from '../services/fortuneHistoryService';
import { PalmLineChoice } from '../types';

type Hand = 'sol' | 'sag';

export default function PalmReadingScreen() {
  const [hand, setHand] = useState<Hand | null>(null);
  const [choices, setChoices] = useState<Partial<Record<PalmLineId, PalmLineChoice>>>({});
  const [showResult, setShowResult] = useState(false);

  const currentLineIndex = PALM_LINES.findIndex(l => !choices[l.id]);
  const allAnswered = currentLineIndex === -1;

  function selectChoice(lineId: PalmLineId, choice: PalmLineChoice) {
    setChoices(prev => ({ ...prev, [lineId]: choice }));
  }

  function reset() {
    setHand(null);
    setChoices({});
    setShowResult(false);
  }

  function revealResult() {
    setShowResult(true);
    if (!hand) return;
    const lines = PALM_LINES.map(
      l => `${l.emoji} ${l.name}: ${PALM_READINGS[l.id][choices[l.id]!]}`
    );
    lines.push(`✨ Genel Yorum: ${getOverallPalmReading(Object.values(choices) as PalmLineChoice[])}`);
    saveFortune({
      type: 'el',
      emoji: '🤚',
      title: 'El Falı',
      summary: `${hand === 'sol' ? 'Sol' : 'Sağ'} el okuması`,
      content: lines.join('\n\n'),
    }).catch(() => { /* offline ise sessizce geç — fal yine gösterilir */ });
  }

  // 1. Adım: El seçimi
  if (!hand) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.bigEmoji}>🤚</Text>
          <Text style={styles.stepTitle}>Hangi eline bakalım?</Text>
          <Text style={styles.stepDesc}>
            Sol el doğuştan gelen potansiyeli, sağ el kendi çizdiğin kaderi anlatır.
          </Text>
          <View style={styles.handRow}>
            <TouchableOpacity style={styles.handBtn} onPress={() => setHand('sol')}>
              <Text style={styles.handEmoji}>🫲</Text>
              <Text style={styles.handLabel}>Sol El</Text>
              <Text style={styles.handSub}>İç dünyam</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.handBtn} onPress={() => setHand('sag')}>
              <Text style={styles.handEmoji}>🫱</Text>
              <Text style={styles.handLabel}>Sağ El</Text>
              <Text style={styles.handSub}>Kaderim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // 3. Adım: Sonuç
  if (showResult && allAnswered) {
    const overall = getOverallPalmReading(Object.values(choices) as PalmLineChoice[]);
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>El Falın 🤚</Text>
          <Text style={styles.handIntro}>{HAND_INTROS[hand]}</Text>

          {PALM_LINES.map(line => (
            <View key={line.id} style={styles.resultCard}>
              <Text style={styles.resultLineTitle}>{line.emoji} {line.name}</Text>
              <Text style={styles.resultText}>
                {PALM_READINGS[line.id][choices[line.id]!]}
              </Text>
            </View>
          ))}

          <View style={[styles.resultCard, styles.overallCard]}>
            <Text style={styles.resultLineTitle}>✨ Genel Yorum</Text>
            <Text style={styles.resultText}>{overall}</Text>
          </View>

          <TouchableOpacity style={styles.againBtn} onPress={reset}>
            <Text style={styles.againBtnText}>Yeniden Bak</Text>
          </TouchableOpacity>
          <Text style={styles.note}>* El falı eğlence amaçlıdır.</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 2. Adım: Çizgi soruları
  const line = allAnswered ? PALM_LINES[PALM_LINES.length - 1] : PALM_LINES[currentLineIndex];
  const progress = allAnswered ? PALM_LINES.length : currentLineIndex;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        <Text style={styles.progress}>
          {Math.min(progress + 1, PALM_LINES.length)} / {PALM_LINES.length}
        </Text>
        {allAnswered ? (
          <>
            <Text style={styles.bigEmoji}>🔮</Text>
            <Text style={styles.stepTitle}>Avucun hazır!</Text>
            <Text style={styles.stepDesc}>Çizgilerin okunmayı bekliyor...</Text>
            <TouchableOpacity style={styles.revealBtn} onPress={revealResult}>
              <Text style={styles.revealBtnText}>Falımı Göster ✨</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.bigEmoji}>{line.emoji}</Text>
            <Text style={styles.stepTitle}>{line.name}</Text>
            <Text style={styles.stepDesc}>{line.question}</Text>
            {LINE_CHOICES.map(c => (
              <TouchableOpacity
                key={c.id}
                style={styles.choiceBtn}
                onPress={() => selectChoice(line.id, c.id)}
              >
                <Text style={styles.choiceLabel}>{c.label}</Text>
                <Text style={styles.choiceDesc}>{c.desc}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  centerContent: { flex: 1, justifyContent: 'center', padding: 24 },
  scroll: { padding: 20, paddingBottom: 40 },
  bigEmoji: { fontSize: 64, textAlign: 'center', marginBottom: 16 },
  stepTitle: { color: '#fff', fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  stepDesc: { color: '#999', fontSize: 15, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  progress: { color: '#7B61FF', fontSize: 13, fontWeight: '700', textAlign: 'center', marginBottom: 12, letterSpacing: 1 },
  handRow: { flexDirection: 'row', gap: 14 },
  handBtn: {
    flex: 1, backgroundColor: '#1A1A2E', borderRadius: 20, padding: 24,
    alignItems: 'center', borderWidth: 1.5, borderColor: '#2A2A40',
  },
  handEmoji: { fontSize: 44, marginBottom: 10 },
  handLabel: { color: '#fff', fontSize: 17, fontWeight: '700' },
  handSub: { color: '#888', fontSize: 12, marginTop: 4 },
  choiceBtn: {
    backgroundColor: '#1A1A2E', borderRadius: 14, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: '#2A2A40',
  },
  choiceLabel: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 3 },
  choiceDesc: { color: '#888', fontSize: 12.5 },
  revealBtn: {
    backgroundColor: '#7B61FF', borderRadius: 28, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  revealBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 8 },
  handIntro: { color: '#7B61FF', fontSize: 13, fontStyle: 'italic', marginBottom: 20, lineHeight: 19 },
  resultCard: {
    backgroundColor: '#1A1A2E', borderRadius: 16, padding: 18,
    marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#FF6B9D',
  },
  overallCard: { borderLeftColor: '#7B61FF', backgroundColor: '#1E1A33' },
  resultLineTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  resultText: { color: '#ccc', fontSize: 14, lineHeight: 21 },
  againBtn: {
    backgroundColor: '#2A2A40', borderRadius: 28, padding: 14,
    alignItems: 'center', marginTop: 10,
  },
  againBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  note: { color: '#444', fontSize: 11, textAlign: 'center', marginTop: 14 },
});

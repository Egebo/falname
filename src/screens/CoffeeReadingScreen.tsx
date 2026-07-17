import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Animated,
} from 'react-native';
import { COFFEE_SYMBOLS, CUP_REGIONS, COFFEE_CLOSINGS } from '../data/coffeeData';
import { saveFortune } from '../services/fortuneHistoryService';
import { CoffeeSymbol } from '../types';

type Phase = 'hazir' | 'bekliyor' | 'sonuc';

interface Reading {
  symbols: CoffeeSymbol[];
  closing: string;
}

function drawReading(): Reading {
  const pool = [...COFFEE_SYMBOLS];
  const symbols: CoffeeSymbol[] = [];
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    symbols.push(pool.splice(idx, 1)[0]);
  }
  const closing = COFFEE_CLOSINGS[Math.floor(Math.random() * COFFEE_CLOSINGS.length)];
  return { symbols, closing };
}

export default function CoffeeReadingScreen() {
  const [phase, setPhase] = useState<Phase>('hazir');
  const [reading, setReading] = useState<Reading | null>(null);
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase !== 'bekliyor') return;
    const anim = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1200, useNativeDriver: true })
    );
    anim.start();
    const timer = setTimeout(() => {
      anim.stop();
      const r = drawReading();
      setReading(r);
      setPhase('sonuc');
      const content = r.symbols
        .map((s, i) => `${s.emoji} ${s.name} (${CUP_REGIONS[i].name}): ${s.meaning}`)
        .concat(`🔮 Falcının Son Sözü: ${r.closing}`)
        .join('\n\n');
      saveFortune({
        type: 'kahve',
        emoji: '☕',
        title: 'Kahve Falı',
        summary: r.symbols.map(s => s.name).join(', '),
        content,
      }).catch(() => { /* offline ise sessizce geç */ });
    }, 3500);
    return () => { anim.stop(); clearTimeout(timer); };
  }, [phase]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  if (phase === 'hazir') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.bigEmoji}>☕</Text>
          <Text style={styles.title}>Kahve Falı</Text>
          <Text style={styles.desc}>
            Kahveni içtin mi? Fincanını tabağına ters kapat, niyetini tut ve soğumasını bekle.
            Hazır olduğunda fincanını aç.
          </Text>
          <TouchableOpacity style={styles.mainBtn} onPress={() => setPhase('bekliyor')}>
            <Text style={styles.mainBtnText}>Fincanı Ters Çevirdim 🙏</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'bekliyor') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Animated.Text style={[styles.bigEmoji, { transform: [{ rotate }] }]}>🌀</Animated.Text>
          <Text style={styles.title}>Telve şekilleniyor...</Text>
          <Text style={styles.desc}>Falcı fincanına bakıyor, sembolleri çözümlüyor 🔮</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultTitle}>Fincanında Görünenler ☕</Text>

        {reading?.symbols.map((sym, i) => (
          <View key={sym.id} style={styles.symbolCard}>
            <View style={styles.symbolHeader}>
              <Text style={styles.symbolEmoji}>{sym.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.symbolName}>{sym.name}</Text>
                <Text style={styles.regionText}>
                  {CUP_REGIONS[i].name} — {CUP_REGIONS[i].desc}
                </Text>
              </View>
            </View>
            <Text style={styles.symbolMeaning}>{sym.meaning}</Text>
          </View>
        ))}

        <View style={styles.closingCard}>
          <Text style={styles.closingTitle}>🔮 Falcının Son Sözü</Text>
          <Text style={styles.closingText}>{reading?.closing}</Text>
        </View>

        <TouchableOpacity
          style={styles.againBtn}
          onPress={() => { setReading(null); setPhase('hazir'); }}
        >
          <Text style={styles.againBtnText}>Yeni Fal Bak</Text>
        </TouchableOpacity>
        <Text style={styles.note}>* Kahve falı eğlence amaçlıdır.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 },
  scroll: { padding: 20, paddingBottom: 40 },
  bigEmoji: { fontSize: 72, marginBottom: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  desc: { color: '#999', fontSize: 15, textAlign: 'center', lineHeight: 23, marginBottom: 30 },
  mainBtn: { backgroundColor: '#C08552', borderRadius: 28, paddingHorizontal: 32, paddingVertical: 15 },
  mainBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resultTitle: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 20 },
  symbolCard: {
    backgroundColor: '#1A1A2E', borderRadius: 16, padding: 18,
    marginBottom: 12, borderWidth: 1, borderColor: '#3A2E24',
  },
  symbolHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  symbolEmoji: { fontSize: 36, marginRight: 12 },
  symbolName: { color: '#fff', fontSize: 17, fontWeight: '700' },
  regionText: { color: '#C08552', fontSize: 11.5, marginTop: 2 },
  symbolMeaning: { color: '#ccc', fontSize: 14, lineHeight: 21 },
  closingCard: {
    backgroundColor: '#241A2E', borderRadius: 16, padding: 18,
    marginBottom: 16, borderWidth: 1.5, borderColor: '#7B61FF',
  },
  closingTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  closingText: { color: '#ccc', fontSize: 14, lineHeight: 21, fontStyle: 'italic' },
  againBtn: { backgroundColor: '#2A2A40', borderRadius: 28, padding: 14, alignItems: 'center' },
  againBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  note: { color: '#444', fontSize: 11, textAlign: 'center', marginTop: 14 },
});

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput,
} from 'react-native';
import { computeBirthChart, ELEMENT_PERSONALITY, HOUSE_MEANINGS, BirthChart } from '../data/birthChartData';
import { ELEMENT_COLORS } from '../data/zodiacData';
import { loadUserProfile } from '../services/storageService';
import { saveFortune } from '../services/fortuneHistoryService';
import { Element } from '../types';

export default function BirthChartScreen() {
  const [birthDate, setBirthDate] = useState('');
  const [birthHour, setBirthHour] = useState('');
  const [chart, setChart] = useState<BirthChart | null>(null);

  useEffect(() => {
    loadUserProfile().then(p => {
      if (p?.birthDate) setBirthDate(p.birthDate);
    });
  }, []);

  const dateValid = /^\d{4}-\d{2}-\d{2}$/.test(birthDate);
  const hourNum = birthHour === '' ? null : parseInt(birthHour, 10);
  const hourValid = hourNum === null || (hourNum >= 0 && hourNum <= 23);

  function handleDateChange(text: string) {
    const clean = text.replace(/[^\d]/g, '');
    let formatted = clean;
    if (clean.length > 4) formatted = clean.slice(0, 4) + '-' + clean.slice(4);
    if (clean.length > 6) formatted = clean.slice(0, 4) + '-' + clean.slice(4, 6) + '-' + clean.slice(6, 8);
    setBirthDate(formatted.slice(0, 10));
    setChart(null);
  }

  function generate() {
    if (!dateValid || !hourValid) return;
    const result = computeBirthChart(birthDate, hourNum);
    setChart(result);

    const planetLines = result.placements.map(
      p => `${p.emoji} ${p.planet}: ${p.sign.emoji} ${p.sign.name}, ${p.house}. ev (${HOUSE_MEANINGS[p.house]})`
    );
    const content = [
      `☀️ Güneş: ${result.sun.name} · 🌙 Ay: ${result.moon.name} · ⬆️ Yükselen: ${result.ascendant.name}`,
      ELEMENT_PERSONALITY[result.dominantElement],
      ...planetLines,
    ].join('\n\n');
    // Aynı tarih+saat için tek kayıt
    saveFortune(
      {
        type: 'harita',
        emoji: '🌌',
        title: 'Doğum Haritası',
        summary: `${result.sun.name} güneşi, ${result.ascendant.name} yükseleni`,
        content,
      },
      `harita-${birthDate}-${hourNum ?? 12}`,
    ).catch(() => { /* offline ise sessizce geç */ });
  }

  const totalPlanets = chart ? chart.placements.length : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Doğum Haritası</Text>
        <Text style={styles.subtitle}>Doğduğun anın gökyüzü fotoğrafı</Text>

        <View style={styles.inputRow}>
          <View style={{ flex: 2 }}>
            <Text style={styles.label}>Doğum Tarihi</Text>
            <TextInput
              style={styles.input}
              value={birthDate}
              onChangeText={handleDateChange}
              placeholder="YYYY-AA-GG"
              placeholderTextColor="#555"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Saat (0-23)</Text>
            <TextInput
              style={styles.input}
              value={birthHour}
              onChangeText={t => { setBirthHour(t.replace(/[^\d]/g, '').slice(0, 2)); setChart(null); }}
              placeholder="12"
              placeholderTextColor="#555"
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.genBtn, (!dateValid || !hourValid) && styles.genBtnDisabled]}
          onPress={generate}
          disabled={!dateValid || !hourValid}
        >
          <Text style={styles.genBtnText}>Haritamı Çıkar 🌌</Text>
        </TouchableOpacity>

        {chart && (
          <>
            {/* Büyük Üçlü */}
            <Text style={styles.sectionTitle}>Büyük Üçlün</Text>
            <View style={styles.bigThreeRow}>
              <BigThreeCard label="Güneş" emoji="☀️" sign={chart.sun.name} signEmoji={chart.sun.emoji} desc="özün" />
              <BigThreeCard label="Ay" emoji="🌙" sign={chart.moon.name} signEmoji={chart.moon.emoji} desc="duyguların" />
              <BigThreeCard label="Yükselen" emoji="⬆️" sign={chart.ascendant.name} signEmoji={chart.ascendant.emoji} desc="dış imajın" />
            </View>

            {/* Element Dağılımı */}
            <Text style={styles.sectionTitle}>Element Dengen</Text>
            <View style={styles.elementCard}>
              {(Object.entries(chart.elementCounts) as [Element, number][]).map(([el, count]) => (
                <View key={el} style={styles.elementRow}>
                  <Text style={[styles.elementName, { color: ELEMENT_COLORS[el] }]}>{el}</Text>
                  <View style={styles.elementBarBg}>
                    <View
                      style={[styles.elementBarFill, {
                        width: `${(count / totalPlanets) * 100}%`,
                        backgroundColor: ELEMENT_COLORS[el],
                      }]}
                    />
                  </View>
                  <Text style={styles.elementCount}>{count}</Text>
                </View>
              ))}
              <Text style={styles.elementDesc}>{ELEMENT_PERSONALITY[chart.dominantElement]}</Text>
            </View>

            {/* Gezegen Konumları */}
            <Text style={styles.sectionTitle}>Gezegen Konumların</Text>
            {chart.placements.map(p => (
              <View key={p.planet} style={styles.planetCard}>
                <Text style={styles.planetEmoji}>{p.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planetName}>
                    {p.planet} <Text style={styles.planetSign}>{p.sign.emoji} {p.sign.name}</Text>
                  </Text>
                  <Text style={styles.planetDesc}>
                    {p.theme} — {p.house}. ev ({HOUSE_MEANINGS[p.house]})
                  </Text>
                </View>
              </View>
            ))}

            <Text style={styles.note}>
              * Basitleştirilmiş hesaplama kullanılır; Ay ve Yükselen yaklaşık değerdir.
              Kesin harita için doğum yeri ve dakikasıyla profesyonel hesaplama gerekir. Eğlence amaçlıdır.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function BigThreeCard({ label, emoji, sign, signEmoji, desc }: {
  label: string; emoji: string; sign: string; signEmoji: string; desc: string;
}) {
  return (
    <View style={styles.bigThreeCard}>
      <Text style={styles.bigThreeEmoji}>{emoji}</Text>
      <Text style={styles.bigThreeLabel}>{label}</Text>
      <Text style={styles.bigThreeSign}>{signEmoji} {sign}</Text>
      <Text style={styles.bigThreeDesc}>{desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 20 },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  label: { color: '#aaa', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  input: {
    backgroundColor: '#1A1A2E', color: '#fff', fontSize: 15,
    borderRadius: 12, padding: 13, borderWidth: 1, borderColor: '#2A2A40',
  },
  genBtn: {
    backgroundColor: '#4FC3F7', borderRadius: 28, padding: 15,
    alignItems: 'center', marginBottom: 8,
  },
  genBtnDisabled: { opacity: 0.35 },
  genBtnText: { color: '#0D0D1A', fontSize: 16, fontWeight: '800' },
  sectionTitle: {
    color: '#fff', fontSize: 17, fontWeight: '700',
    marginTop: 20, marginBottom: 12,
  },
  bigThreeRow: { flexDirection: 'row', gap: 10 },
  bigThreeCard: {
    flex: 1, backgroundColor: '#1A1A2E', borderRadius: 16,
    padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#2A2A40',
  },
  bigThreeEmoji: { fontSize: 24 },
  bigThreeLabel: { color: '#888', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 6 },
  bigThreeSign: { color: '#fff', fontSize: 13, fontWeight: '700', marginTop: 4, textAlign: 'center' },
  bigThreeDesc: { color: '#666', fontSize: 10, marginTop: 3 },
  elementCard: {
    backgroundColor: '#1A1A2E', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: '#2A2A40',
  },
  elementRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  elementName: { width: 60, fontSize: 13, fontWeight: '700' },
  elementBarBg: { flex: 1, height: 8, backgroundColor: '#2A2A40', borderRadius: 4, overflow: 'hidden', marginHorizontal: 10 },
  elementBarFill: { height: '100%', borderRadius: 4 },
  elementCount: { color: '#888', fontSize: 12, width: 16, textAlign: 'right' },
  elementDesc: { color: '#ccc', fontSize: 13.5, lineHeight: 20, marginTop: 8 },
  planetCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A2E', borderRadius: 14, padding: 14, marginBottom: 10,
  },
  planetEmoji: { fontSize: 26, marginRight: 12, width: 34, textAlign: 'center' },
  planetName: { color: '#fff', fontSize: 15, fontWeight: '700' },
  planetSign: { color: '#4FC3F7', fontWeight: '600' },
  planetDesc: { color: '#888', fontSize: 12, marginTop: 3, lineHeight: 17 },
  note: { color: '#444', fontSize: 11, textAlign: 'center', marginTop: 16, lineHeight: 17 },
});

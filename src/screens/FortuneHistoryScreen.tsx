import React, { useCallback, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import FortuneShareCard from '../components/FortuneShareCard';
import { FortuneRecord, deleteFortune, loadFortunes } from '../services/fortuneHistoryService';

const MONTHS_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

function formatDate(ms: number): string {
  const d = new Date(ms);
  return `${d.getDate()} ${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function FortuneHistoryScreen() {
  const [records, setRecords] = useState<FortuneRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [shareRecord, setShareRecord] = useState<FortuneRecord | null>(null);
  const shotRef = useRef<ViewShot>(null);

  function handleShare(record: FortuneRecord) {
    setShareRecord(record);
    // Kart ekran dışında render edilsin, sonra görüntüsü alınsın
    setTimeout(async () => {
      try {
        const uri = await shotRef.current?.capture?.();
        if (uri && (await Sharing.isAvailableAsync())) {
          await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Falını paylaş' });
        }
      } catch {
        Alert.alert('Hata', 'Paylaşım kartı oluşturulamadı.');
      } finally {
        setShareRecord(null);
      }
    }, 150);
  }

  const refresh = useCallback(() => {
    setLoading(true);
    setError(false);
    loadFortunes()
      .then(setRecords)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  function confirmDelete(record: FortuneRecord) {
    Alert.alert('Falı Sil', 'Bu fal kaydı silinsin mi?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () => {
          deleteFortune(record.id)
            .then(() => setRecords(prev => prev.filter(r => r.id !== record.id)))
            .catch(() => Alert.alert('Hata', 'Silinemedi, tekrar dene.'));
        },
      },
    ]);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#7B61FF" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyEmoji}>📡</Text>
        <Text style={styles.emptyText}>Geçmiş yüklenemedi. Bağlantını kontrol et.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={refresh}>
          <Text style={styles.retryBtnText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (records.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyEmoji}>🗂️</Text>
        <Text style={styles.emptyTitle}>Henüz fal geçmişin yok</Text>
        <Text style={styles.emptyText}>Baktığın fallar burada birikecek.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const expanded = expandedId === item.id;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setExpandedId(expanded ? null : item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
                </View>
                <TouchableOpacity onPress={() => handleShare(item)} hitSlop={10} style={{ marginRight: 14 }}>
                  <Text style={styles.deleteIcon}>📤</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(item)} hitSlop={10}>
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardSummary}>{item.summary}</Text>
              {expanded && <Text style={styles.cardContent}>{item.content}</Text>}
              <Text style={styles.expandHint}>{expanded ? '▲ Kapat' : '▼ Detay'}</Text>
            </TouchableOpacity>
          );
        }}
      />
      {/* Paylaşım kartı — ekran dışında render edilir, görüntüsü alınır */}
      {shareRecord && (
        <View style={styles.offscreen} pointerEvents="none">
          <FortuneShareCard ref={shotRef} record={shareRecord} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  center: { flex: 1, backgroundColor: '#0D0D1A', justifyContent: 'center', alignItems: 'center', padding: 24 },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#1A1A2E', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#2A2A40',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardEmoji: { fontSize: 28, marginRight: 12 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cardDate: { color: '#666', fontSize: 11, marginTop: 2 },
  deleteIcon: { fontSize: 16, opacity: 0.7 },
  cardSummary: { color: '#aaa', fontSize: 13, lineHeight: 19 },
  cardContent: { color: '#ddd', fontSize: 14, lineHeight: 21, marginTop: 10 },
  expandHint: { color: '#7B61FF', fontSize: 11, fontWeight: '600', marginTop: 10, textAlign: 'center' },
  emptyEmoji: { fontSize: 56, marginBottom: 14 },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 6 },
  emptyText: { color: '#888', fontSize: 14, textAlign: 'center' },
  retryBtn: { backgroundColor: '#2A2A40', borderRadius: 24, paddingHorizontal: 24, paddingVertical: 12, marginTop: 18 },
  retryBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  offscreen: { position: 'absolute', left: -9999, top: 0 },
});

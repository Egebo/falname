import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Modal, FlatList, TextInput, Alert,
} from 'react-native';
import { Platform } from 'react-native';
import { loadUserProfile, saveUserProfile } from '../services/storageService';
import { ZODIAC_SIGNS, getZodiacSign, getLifePathNumber } from '../data/zodiacData';
import { scheduleDailyNotification, cancelAllNotifications } from '../services/notificationService';
import {
  AccountProvider, getAccountProvider, isSocialLoginAvailable,
  signInWithApple, signInWithGoogle, signOutToGuest,
} from '../services/authService';
import { UserProfile, ZodiacSignId } from '../types';

export default function SettingsScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [signPickerOpen, setSignPickerOpen] = useState(false);
  const [selectedSign, setSelectedSign] = useState<ZodiacSignId | null>(null);
  const [saved, setSaved] = useState(false);
  const [notifHour, setNotifHour] = useState(9);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [account, setAccount] = useState<AccountProvider>('misafir');
  const [authBusy, setAuthBusy] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const p = await loadUserProfile();
    if (p) {
      setProfile(p);
      setNameInput(p.name || '');
      setBirthDate(p.birthDate || '');
      setSelectedSign(p.zodiacSign || null);
    }
    setAccount(getAccountProvider());
  }

  async function runAuthAction(action: () => Promise<unknown>) {
    setAuthBusy(true);
    try {
      await action();
      setAccount(getAccountProvider());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Bilinmeyen hata';
      Alert.alert('Giriş yapılamadı', msg);
    } finally {
      setAuthBusy(false);
    }
  }

  function handleDateChange(text: string) {
    // Otomatik tire ekleme: YYYY-AA-GG formatı
    const clean = text.replace(/[^\d]/g, '');
    let formatted = clean;
    if (clean.length > 4) formatted = clean.slice(0, 4) + '-' + clean.slice(4);
    if (clean.length > 6) formatted = clean.slice(0, 4) + '-' + clean.slice(4, 6) + '-' + clean.slice(6, 8);
    setBirthDate(formatted.slice(0, 10));

    if (clean.length === 8) {
      const year = parseInt(clean.slice(0, 4));
      const month = parseInt(clean.slice(4, 6));
      const day = parseInt(clean.slice(6, 8));
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const sign = getZodiacSign(day, month);
        setSelectedSign(sign);
      }
    }
  }

  async function handleSave() {
    if (!selectedSign) {
      Alert.alert('Eksik bilgi', 'Lütfen burcunu seç.');
      return;
    }
    const lifePathNumber = birthDate.replace(/\D/g, '').length === 8
      ? getLifePathNumber(birthDate)
      : null;

    const newProfile: UserProfile = {
      name: nameInput.trim(),
      birthDate,
      zodiacSign: selectedSign,
      lifePathNumber,
    };
    await saveUserProfile(newProfile);
    setProfile(newProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const sign = ZODIAC_SIGNS.find(s => s.id === selectedSign);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Ayarlar</Text>
        <Text style={styles.subtitle}>Profil bilgilerini gir</Text>

        {/* İsim */}
        <View style={styles.field}>
          <Text style={styles.label}>İsmin (opsiyonel)</Text>
          <TextInput
            style={styles.input}
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="Adın"
            placeholderTextColor="#555"
          />
        </View>

        {/* Doğum tarihi */}
        <View style={styles.field}>
          <Text style={styles.label}>Doğum Tarihin</Text>
          <TextInput
            style={styles.input}
            value={birthDate}
            onChangeText={handleDateChange}
            placeholder="YYYY-AA-GG  (örn. 1995-08-15)"
            placeholderTextColor="#555"
            keyboardType="numeric"
            maxLength={10}
          />
          {birthDate.replace(/\D/g, '').length === 8 && (
            <Text style={styles.hint}>
              Otomatik burç: {sign?.emoji} {sign?.name}
            </Text>
          )}
        </View>

        {/* Burç seçimi */}
        <View style={styles.field}>
          <Text style={styles.label}>Burcun</Text>
          <TouchableOpacity style={styles.signPicker} onPress={() => setSignPickerOpen(true)}>
            <Text style={styles.signPickerEmoji}>{sign?.emoji || '🔮'}</Text>
            <Text style={styles.signPickerName}>{sign?.name || 'Seç...'}</Text>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Bildirim */}
        <View style={styles.field}>
          <Text style={styles.label}>Günlük Bildirim</Text>
          <View style={styles.notifRow}>
            <TouchableOpacity
              style={[styles.notifToggle, notifEnabled && styles.notifToggleOn]}
              onPress={async () => {
                if (notifEnabled) {
                  await cancelAllNotifications();
                  setNotifEnabled(false);
                } else {
                  const ok = await scheduleDailyNotification(notifHour, 0);
                  setNotifEnabled(ok);
                }
              }}
            >
              <Text style={styles.notifToggleText}>{notifEnabled ? '🔔 Açık' : '🔕 Kapalı'}</Text>
            </TouchableOpacity>
            {notifEnabled && (
              <View style={styles.hourPicker}>
                <TouchableOpacity onPress={() => { const h = (notifHour - 1 + 24) % 24; setNotifHour(h); scheduleDailyNotification(h, 0); }}>
                  <Text style={styles.hourArrow}>◀</Text>
                </TouchableOpacity>
                <Text style={styles.hourText}>{String(notifHour).padStart(2, '0')}:00</Text>
                <TouchableOpacity onPress={() => { const h = (notifHour + 1) % 24; setNotifHour(h); scheduleDailyNotification(h, 0); }}>
                  <Text style={styles.hourArrow}>▶</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Hesap */}
        <View style={styles.field}>
          <Text style={styles.label}>Hesap</Text>
          {account === 'misafir' ? (
            <>
              <Text style={styles.accountStatus}>👤 Misafir olarak geziyorsun</Text>
              {isSocialLoginAvailable() ? (
                <View style={styles.authRow}>
                  <TouchableOpacity
                    style={styles.authBtn}
                    disabled={authBusy}
                    onPress={() => runAuthAction(signInWithGoogle)}
                  >
                    <Text style={styles.authBtnText}>Google ile Giriş</Text>
                  </TouchableOpacity>
                  {Platform.OS === 'ios' && (
                    <TouchableOpacity
                      style={[styles.authBtn, styles.appleBtn]}
                      disabled={authBusy}
                      onPress={() => runAuthAction(signInWithApple)}
                    >
                      <Text style={styles.authBtnText}> Apple ile Giriş</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <Text style={styles.accountHint}>
                  Google/Apple ile giriş, uygulamanın mağaza sürümünde aktif olacak.
                  Falların şimdilik bu cihaza bağlı misafir hesabında saklanıyor.
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.accountStatus}>
                {account === 'google' ? '🟢 Google hesabıyla girişlisin' : '🍎 Apple hesabıyla girişlisin'}
              </Text>
              <TouchableOpacity
                style={styles.signOutBtn}
                disabled={authBusy}
                onPress={() =>
                  Alert.alert('Çıkış', 'Misafir moduna dönülsün mü?', [
                    { text: 'Vazgeç', style: 'cancel' },
                    { text: 'Çıkış Yap', style: 'destructive', onPress: () => runAuthAction(signOutToGuest) },
                  ])
                }
              >
                <Text style={styles.signOutBtnText}>Çıkış Yap</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Kaydet */}
        <TouchableOpacity style={[styles.saveBtn, saved && styles.saveBtnDone]} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{saved ? '✓ Kaydedildi' : 'Kaydet'}</Text>
        </TouchableOpacity>

        {profile && (
          <View style={styles.profileBox}>
            <Text style={styles.profileTitle}>Mevcut Profil</Text>
            {profile.name ? <Text style={styles.profileRow}>👤 {profile.name}</Text> : null}
            <Text style={styles.profileRow}>🗓 {profile.birthDate || '—'}</Text>
            <Text style={styles.profileRow}>
              {ZODIAC_SIGNS.find(s => s.id === profile.zodiacSign)?.emoji} {ZODIAC_SIGNS.find(s => s.id === profile.zodiacSign)?.name}
            </Text>
            {profile.lifePathNumber && (
              <Text style={styles.profileRow}>🔢 Yaşam Yolu Sayısı: {profile.lifePathNumber}</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Burç Modal */}
      <Modal visible={signPickerOpen} transparent animationType="slide" onRequestClose={() => setSignPickerOpen(false)}>
        <TouchableOpacity style={styles.overlay} onPress={() => setSignPickerOpen(false)} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Burç Seç</Text>
          <FlatList
            data={ZODIAC_SIGNS}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.signItem, item.id === selectedSign && styles.signItemSel]}
                onPress={() => { setSelectedSign(item.id); setSignPickerOpen(false); }}
              >
                <Text style={styles.signItemEmoji}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.signItemName}>{item.name}</Text>
                  <Text style={styles.signItemDate}>{item.dateRange}</Text>
                </View>
                {item.id === selectedSign && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 28 },
  field: { marginBottom: 20 },
  label: { color: '#aaa', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  input: {
    backgroundColor: '#1A1A2E', color: '#fff', fontSize: 15,
    borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#2A2A40',
  },
  hint: { color: '#7B61FF', fontSize: 12, marginTop: 6 },
  signPicker: {
    backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#2A2A40',
  },
  signPickerEmoji: { fontSize: 24, marginRight: 10 },
  signPickerName: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '600' },
  arrow: { color: '#555', fontSize: 10 },
  saveBtn: {
    backgroundColor: '#7B61FF', borderRadius: 28, padding: 16,
    alignItems: 'center', marginTop: 8, marginBottom: 24,
  },
  saveBtnDone: { backgroundColor: '#4CAF50' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  profileBox: {
    backgroundColor: '#1A1A2E', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: '#2A2A40',
  },
  profileTitle: { color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  profileRow: { color: '#ccc', fontSize: 14, marginBottom: 6 },
  overlay: { flex: 1, backgroundColor: '#00000088' },
  sheet: {
    backgroundColor: '#1A1A2E', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 20, paddingHorizontal: 16, maxHeight: '65%',
  },
  sheetTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16, paddingHorizontal: 4 },
  signItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 4 },
  signItemSel: { backgroundColor: '#7B61FF22' },
  signItemEmoji: { fontSize: 28, marginRight: 14 },
  signItemName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  signItemDate: { color: '#888', fontSize: 12, marginTop: 2 },
  checkmark: { color: '#7B61FF', fontSize: 18, fontWeight: '700' },
  notifRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifToggle: {
    backgroundColor: '#1A1A2E', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 18,
    borderWidth: 1, borderColor: '#2A2A40',
  },
  notifToggleOn: { borderColor: '#7B61FF', backgroundColor: '#7B61FF22' },
  notifToggleText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  hourPicker: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1A1A2E', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#2A2A40' },
  accountStatus: { color: '#ccc', fontSize: 14, marginBottom: 10 },
  accountHint: { color: '#666', fontSize: 12, lineHeight: 18 },
  authRow: { flexDirection: 'row', gap: 10 },
  authBtn: {
    flex: 1, backgroundColor: '#1A1A2E', borderRadius: 12, padding: 13,
    alignItems: 'center', borderWidth: 1, borderColor: '#7B61FF',
  },
  appleBtn: { borderColor: '#fff' },
  authBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  signOutBtn: {
    backgroundColor: '#1A1A2E', borderRadius: 12, padding: 13,
    alignItems: 'center', borderWidth: 1, borderColor: '#FF5252', alignSelf: 'flex-start',
    paddingHorizontal: 24,
  },
  signOutBtnText: { color: '#FF5252', fontSize: 14, fontWeight: '600' },
  hourArrow: { color: '#7B61FF', fontSize: 16, fontWeight: '700' },
  hourText: { color: '#fff', fontSize: 16, fontWeight: '700', minWidth: 44, textAlign: 'center' },
});

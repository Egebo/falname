# Falname

Çok özellikli bir fal/kehanet uygulaması: haftalık burç yorumu, numeroloji, el falı, kahve falı, doğum haritası ve burç uyum testi tek bir uygulamada.

## Özellikler

- **Haftalık Burç Yorumu** — 12 burç için haftalık yorumlar
- **Numeroloji** — doğum tarihinden kişilik/kader sayısı hesaplama
- **El Falı & Kahve Falı** — rehberli, adım adım fal deneyimi
- **Doğum Haritası** — temel astrolojik doğum haritası bilgisi
- **Burç Uyumu** — iki burç arasında uyum kontrolü
- **Fal Geçmişi** — Firestore üzerinde saklanan geçmiş fallar
- **Bildirimler** — hatırlatma bildirimleri

## Teknoloji

- React Native + Expo (SDK 56), TypeScript
- React Navigation (bottom-tabs + native-stack)
- Firebase (anonim Auth + Firestore) — fal geçmişi senkronizasyonu
- AsyncStorage — yerel profil verisi
- expo-notifications

## Kurulum

```bash
npm install
cp .env.example .env   # Firebase Console'dan aldığın değerleri doldur
npx expo start
```

Firebase config değerleri: Firebase Console → Proje Ayarları → Genel → "Uygulamalarınız" → Web uygulaması.

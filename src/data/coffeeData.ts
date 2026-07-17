import { CoffeeSymbol } from '../types';

export const COFFEE_SYMBOLS: CoffeeSymbol[] = [
  { id: 'kus',      name: 'Kuş',       emoji: '🕊️', meaning: 'Yakında güzel bir haber alacaksın. Uzaktan gelen bir ses seni sevindirecek.' },
  { id: 'agac',     name: 'Ağaç',      emoji: '🌳', meaning: 'Hayatında köklenme ve huzur dönemi başlıyor. Emeklerin kalıcı olacak.' },
  { id: 'yol',      name: 'Yol',       emoji: '🛤️', meaning: 'Önünde yeni bir yolculuk var — fiziksel ya da ruhsal. Cesaretle ilerle.' },
  { id: 'kalp',     name: 'Kalp',      emoji: '❤️', meaning: 'Aşk kapıda. Kalbin yakında hızlanacak; işaretlere dikkat et.' },
  { id: 'yilan',    name: 'Yılan',     emoji: '🐍', meaning: 'Çevrende içten pazarlıklı biri olabilir. Sırlarını herkesle paylaşma.' },
  { id: 'dag',      name: 'Dağ',       emoji: '⛰️', meaning: 'Büyük bir hedefin var ve zirve göründü. Son bir gayret istiyor.' },
  { id: 'yildiz',   name: 'Yıldız',    emoji: '⭐', meaning: 'Şans senden yana. Dileklerinin gerçekleşmesi için doğru zaman.' },
  { id: 'balik',    name: 'Balık',     emoji: '🐟', meaning: 'Kısmet ve bereket geliyor. Maddi konularda rahatlama yakın.' },
  { id: 'anahtar',  name: 'Anahtar',   emoji: '🗝️', meaning: 'Uzun süredir kapalı olan bir kapı açılıyor. Beklediğin çözüm geliyor.' },
  { id: 'ay',       name: 'Hilal',     emoji: '🌙', meaning: 'Sezgilerin güçleniyor. Rüyalarına dikkat et; sana bir şey anlatıyorlar.' },
  { id: 'kopek',    name: 'Köpek',     emoji: '🐕', meaning: 'Sadık bir dostun her zaman yanında. Yalnız olmadığını unutma.' },
  { id: 'gemi',     name: 'Gemi',      emoji: '⛵', meaning: 'Uzaklardan bir misafir ya da haber geliyor. Ufkunda hareketlilik var.' },
  { id: 'cicek',    name: 'Çiçek',     emoji: '🌸', meaning: 'Mutluluk ve takdir seni bekliyor. Emeklerin fark edilecek.' },
  { id: 'goz',      name: 'Göz',       emoji: '👁️', meaning: 'Biri seni izliyor — kimi hayranlıkla, kimi kıskançlıkla. Nazara dikkat.' },
  { id: 'kelebek',  name: 'Kelebek',   emoji: '🦋', meaning: 'Hafif ve özgür bir döneme giriyorsun. Değişim sana çok yakışacak.' },
  { id: 'at',       name: 'At',        emoji: '🐎', meaning: 'Güçlü bir müttefik ya da beklenmedik bir destek yolda. Haber hızlı gelecek.' },
];

// Fincan bölgeleri — falda sembolün konumu anlamı etkiler
export const CUP_REGIONS = [
  { id: 'agiz', name: 'Fincanın Ağzı', desc: 'yakın gelecek (1-3 hafta)' },
  { id: 'orta', name: 'Fincanın Ortası', desc: 'orta vade (1-3 ay)' },
  { id: 'dip',  name: 'Fincanın Dibi', desc: 'uzak gelecek ve kalbin derinliği' },
] as const;

export const COFFEE_CLOSINGS = [
  'Fincanın geneli aydınlık; içindeki sıkıntılar tortuyla birlikte dibe çökmüş. Ferahlama yakın.',
  'Telvenin dağılımı hareketli bir döneme işaret ediyor. Sakin görünen sular derinden akıyor.',
  'Fincanının kenarları açık — kısmetin açık demektir. Beklediğin gelişme tahmininden erken gelecek.',
  'Tabağa yapışan fincan, tuttuğun bir dileğin kabul olacağının işareti. Niyetini taze tut.',
];

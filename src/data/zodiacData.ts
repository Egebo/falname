import { Element, LifePathMeaning, ZodiacSign, ZodiacSignId } from '../types';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: 'koc',      name: 'Koç',      emoji: '♈', dateRange: 'Mar 21 – Nis 19', element: 'Ateş',  planet: 'Mars' },
  { id: 'boga',     name: 'Boğa',     emoji: '♉', dateRange: 'Nis 20 – May 20', element: 'Toprak', planet: 'Venüs' },
  { id: 'ikizler',  name: 'İkizler',  emoji: '♊', dateRange: 'May 21 – Haz 20', element: 'Hava',  planet: 'Merkür' },
  { id: 'yengec',   name: 'Yengeç',   emoji: '♋', dateRange: 'Haz 21 – Tem 22', element: 'Su',    planet: 'Ay' },
  { id: 'aslan',    name: 'Aslan',    emoji: '♌', dateRange: 'Tem 23 – Ağu 22', element: 'Ateş',  planet: 'Güneş' },
  { id: 'basak',    name: 'Başak',    emoji: '♍', dateRange: 'Ağu 23 – Eyl 22', element: 'Toprak', planet: 'Merkür' },
  { id: 'terazi',   name: 'Terazi',   emoji: '♎', dateRange: 'Eyl 23 – Eki 22', element: 'Hava',  planet: 'Venüs' },
  { id: 'akrep',    name: 'Akrep',    emoji: '♏', dateRange: 'Eki 23 – Kas 21', element: 'Su',    planet: 'Plüton' },
  { id: 'yay',      name: 'Yay',      emoji: '♐', dateRange: 'Kas 22 – Ara 21', element: 'Ateş',  planet: 'Jüpiter' },
  { id: 'oglak',    name: 'Oğlak',    emoji: '♑', dateRange: 'Ara 22 – Oca 19', element: 'Toprak', planet: 'Satürn' },
  { id: 'kova',     name: 'Kova',     emoji: '♒', dateRange: 'Oca 20 – Şub 18', element: 'Hava',  planet: 'Uranüs' },
  { id: 'balik',    name: 'Balık',    emoji: '♓', dateRange: 'Şub 19 – Mar 20', element: 'Su',    planet: 'Neptün' },
];

// Uyumluluk matrisi (1-10 arası skor)
export const COMPATIBILITY_MATRIX: Record<ZodiacSignId, Record<ZodiacSignId, number>> = {
  koc:     { koc:5, boga:4, ikizler:8, yengec:4, aslan:9, basak:5, terazi:7, akrep:5, yay:9, oglak:4, kova:7, balik:6 },
  boga:    { koc:4, boga:7, ikizler:5, yengec:9, aslan:5, basak:9, terazi:8, akrep:7, yay:4, oglak:9, kova:4, balik:8 },
  ikizler: { koc:8, boga:5, ikizler:6, yengec:4, aslan:8, basak:6, terazi:9, akrep:4, yay:8, oglak:5, kova:9, balik:5 },
  yengec:  { koc:4, boga:9, ikizler:4, yengec:7, aslan:5, basak:8, terazi:5, akrep:9, yay:5, oglak:7, kova:5, balik:9 },
  aslan:   { koc:9, boga:5, ikizler:8, yengec:5, aslan:6, basak:5, terazi:8, akrep:4, yay:9, oglak:5, kova:6, balik:5 },
  basak:   { koc:5, boga:9, ikizler:6, yengec:8, aslan:5, basak:7, terazi:6, akrep:8, yay:5, oglak:9, kova:5, balik:7 },
  terazi:  { koc:7, boga:8, ikizler:9, yengec:5, aslan:8, basak:6, terazi:5, akrep:5, yay:8, oglak:6, kova:9, balik:6 },
  akrep:   { koc:5, boga:7, ikizler:4, yengec:9, aslan:4, basak:8, terazi:5, akrep:8, yay:5, oglak:8, kova:5, balik:9 },
  yay:     { koc:9, boga:4, ikizler:8, yengec:5, aslan:9, basak:5, terazi:8, akrep:5, yay:6, oglak:5, kova:8, balik:5 },
  oglak:   { koc:4, boga:9, ikizler:5, yengec:7, aslan:5, basak:9, terazi:6, akrep:8, yay:5, oglak:7, kova:6, balik:7 },
  kova:    { koc:7, boga:4, ikizler:9, yengec:5, aslan:6, basak:5, terazi:9, akrep:5, yay:8, oglak:6, kova:6, balik:6 },
  balik:   { koc:6, boga:8, ikizler:5, yengec:9, aslan:5, basak:7, terazi:6, akrep:9, yay:5, oglak:7, kova:6, balik:7 },
};

export const ELEMENT_COLORS: Record<Element, string> = {
  'Ateş':   '#FF6B35',
  'Toprak': '#7CB67F',
  'Hava':   '#6BAED6',
  'Su':     '#9B59B6',
};

// Doğum tarihine göre burç hesaplama
export function getZodiacSign(day: number, month: number): ZodiacSignId {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'koc';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'boga';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'ikizler';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'yengec';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'aslan';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'basak';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'terazi';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'akrep';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'yay';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'oglak';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'kova';
  return 'balik';
}

// Yaşam yolu sayısı hesaplama (Numeroloji)
export function getLifePathNumber(birthDate: string): number {
  const digits = birthDate.replace(/\D/g, '').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

export const LIFE_PATH_MEANINGS: Record<number, LifePathMeaning> = {
  1:  { title: 'Lider',         desc: 'Bağımsız, kararlı ve yenilikçisin. Yolunu kendin çizersin. Bu yıl cesur adımlar at.' },
  2:  { title: 'Diplomat',      desc: 'Hassas, uyumlu ve işbirlikçisin. İlişkiler bu dönemde ön plana çıkıyor.' },
  3:  { title: 'Yaratıcı',      desc: 'Neşeli, ifade gücü yüksek ve ilham vericisin. Sanatsal enerjin zirveye çıkıyor.' },
  4:  { title: 'Yapıcı',        desc: 'Güvenilir, disiplinli ve pratiksin. Sağlam temeller kurma zamanı.' },
  5:  { title: 'Özgür Ruh',     desc: 'Maceraperest, esnek ve meraklısın. Değişim sana kapı açıyor.' },
  6:  { title: 'Bakıcı',        desc: 'Sevgi dolu, sorumlu ve dengeli. Aile ve ev ön plana çıkıyor.' },
  7:  { title: 'Bilge',         desc: 'Analitik, sezgisel ve içe dönük. Derinlik arayışın seni aydınlatacak.' },
  8:  { title: 'Güç',           desc: 'Hırslı, otoriter ve başarı odaklı. Maddi kazanım kapıda.' },
  9:  { title: 'İnsancıl',      desc: 'Merhametli, idealist ve evrensel. Verme enerjin seni yükseltecek.' },
  11: { title: 'Aydınlanmış',   desc: 'Master sayı — yüksek sezgi ve ilham. Ruhsal uyanış dönemindesin.' },
  22: { title: 'Usta Yapıcı',   desc: 'Master sayı — büyük hayaller ve somut başarı. Potansiyelin sınırsız.' },
  33: { title: 'Üstat Öğretmen', desc: 'Master sayı — şefkat ve bilgelik zirvesi. Dünyaya ışık tutma zamanı.' },
};

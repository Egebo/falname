import { ZODIAC_SIGNS, getZodiacSign } from './zodiacData';
import { ZodiacSign, ZodiacSignId } from '../types';

export interface PlanetPlacement {
  planet: string;
  emoji: string;
  sign: ZodiacSign;
  house: number;
  theme: string;
}

export interface BirthChart {
  sun: ZodiacSign;
  moon: ZodiacSign;
  ascendant: ZodiacSign;
  placements: PlanetPlacement[];
  elementCounts: Record<string, number>;
  dominantElement: string;
}

const PLANET_THEMES: Record<string, string> = {
  'Güneş': 'kimliğin ve yaşam enerjin',
  'Ay': 'duyguların ve iç dünyan',
  'Merkür': 'iletişimin ve düşünce tarzın',
  'Venüs': 'aşk ve estetik anlayışın',
  'Mars': 'mücadele gücün ve tutkuların',
  'Jüpiter': 'şansın ve büyüme alanın',
  'Satürn': 'derslerin ve sorumlulukların',
};

const PLANET_EMOJIS: Record<string, string> = {
  'Güneş': '☀️', 'Ay': '🌙', 'Merkür': '☿', 'Venüs': '♀',
  'Mars': '♂', 'Jüpiter': '♃', 'Satürn': '♄',
};

export const SIGN_INDEX: Record<ZodiacSignId, number> = {
  koc: 0, boga: 1, ikizler: 2, yengec: 3, aslan: 4, basak: 5,
  terazi: 6, akrep: 7, yay: 8, oglak: 9, kova: 10, balik: 11,
};

function signAt(index: number): ZodiacSign {
  return ZODIAC_SIGNS[((index % 12) + 12) % 12];
}

// Basitleştirilmiş hesaplama: gerçek efemeris yerine doğum tarihinden
// deterministik olarak türetilen yaklaşık konumlar kullanılır.
// Güneş burcu gerçektir; Ay ~2.5 günde bir burç değiştirdiği için
// yıl içindeki gün sayısından yaklaşık tahmin edilir.
export function computeBirthChart(birthDate: string, birthHour: number | null): BirthChart {
  const [year, month, day] = birthDate.split('-').map(Number);
  const sunId = getZodiacSign(day, month);
  const sunIdx = SIGN_INDEX[sunId];
  const sun = signAt(sunIdx);

  const dayOfYear = Math.floor(
    (Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / 86400000
  );

  // Ay: ~27.3 günlük döngü, 12 burca bölünür
  const moonIdx = Math.floor(((dayOfYear % 27.3) / 27.3) * 12 + year % 12) % 12;
  const moon = signAt(moonIdx);

  // Yükselen: doğum saatine göre ~2 saatte bir burç ilerler (güneşten itibaren)
  const hour = birthHour ?? 12;
  const ascIdx = (sunIdx + Math.floor(hour / 2)) % 12;
  const ascendant = signAt(ascIdx);

  const seed = year * 372 + month * 31 + day;
  const placements: PlanetPlacement[] = [
    { planet: 'Güneş', signIdx: sunIdx },
    { planet: 'Ay', signIdx: moonIdx },
    { planet: 'Merkür', signIdx: sunIdx + (seed % 3) - 1 },       // güneşe yakın
    { planet: 'Venüs', signIdx: sunIdx + (seed % 5) - 2 },        // güneşe yakın
    { planet: 'Mars', signIdx: (seed * 7) % 12 },
    { planet: 'Jüpiter', signIdx: (year % 12 + 9) % 12 },          // ~1 yıl/burç
    { planet: 'Satürn', signIdx: (Math.floor(year / 2.5) + 3) % 12 }, // ~2.5 yıl/burç
  ].map((p, i) => ({
    planet: p.planet,
    emoji: PLANET_EMOJIS[p.planet],
    sign: signAt(p.signIdx),
    house: ((p.signIdx - ascIdx + 12) % 12) + 1,
    theme: PLANET_THEMES[p.planet],
  }));

  const elementCounts: Record<string, number> = { 'Ateş': 0, 'Toprak': 0, 'Hava': 0, 'Su': 0 };
  placements.forEach(p => { elementCounts[p.sign.element] += 1; });
  const dominantElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0][0];

  return { sun, moon, ascendant, placements, elementCounts, dominantElement };
}

export const ELEMENT_PERSONALITY: Record<string, string> = {
  'Ateş': 'Haritanda ateş elementi baskın: enerjik, girişken ve tutkulusun. Hayatı bir macera olarak görüyor, liderliği doğal olarak üstleniyorsun.',
  'Toprak': 'Haritanda toprak elementi baskın: pratik, güvenilir ve sabırlısın. Ayakların yere sağlam basıyor; somut sonuçlar senin dilinden konuşur.',
  'Hava': 'Haritanda hava elementi baskın: meraklı, sosyal ve fikir odaklısın. Zihnin sürekli hareket halinde; iletişim senin süper gücün.',
  'Su': 'Haritanda su elementi baskın: sezgisel, empatik ve derinsin. Duyguların pusulan; insanların söylemediklerini bile duyarsın.',
};

export const HOUSE_MEANINGS: Record<number, string> = {
  1: 'benlik ve dış görünüş', 2: 'maddi değerler ve kazanç', 3: 'iletişim ve yakın çevre',
  4: 'ev, aile ve kökler', 5: 'aşk, yaratıcılık ve eğlence', 6: 'sağlık ve günlük düzen',
  7: 'ilişkiler ve ortaklıklar', 8: 'dönüşüm ve derin bağlar', 9: 'felsefe ve uzak ufuklar',
  10: 'kariyer ve toplumsal statü', 11: 'dostluklar ve idealler', 12: 'bilinçaltı ve ruhsallık',
};

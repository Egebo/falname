export type ZodiacSignId =
  | 'koc' | 'boga' | 'ikizler' | 'yengec' | 'aslan' | 'basak'
  | 'terazi' | 'akrep' | 'yay' | 'oglak' | 'kova' | 'balik';

export type Element = 'Ateş' | 'Toprak' | 'Hava' | 'Su';

export interface ZodiacSign {
  id: ZodiacSignId;
  name: string;
  emoji: string;
  dateRange: string;
  element: Element;
  planet: string;
}

export interface DailyHoroscope {
  love: string;
  career: string;
  health: string;
  lucky_number: number;
  lucky_color: string;
}

export interface LifePathMeaning {
  title: string;
  desc: string;
}

export interface UserProfile {
  name: string;
  birthDate: string;
  zodiacSign: ZodiacSignId;
  lifePathNumber: number | null;
}

export type RootTabParamList = {
  'Ana Sayfa': undefined;
  Fallar: undefined;
  Numeroloji: undefined;
  Uyumluluk: undefined;
  Ayarlar: undefined;
};

export type FortuneStackParamList = {
  FalMenu: undefined;
  ElFali: undefined;
  KahveFali: undefined;
  BurcFali: undefined;
  DogumHaritasi: undefined;
  GecmisFallar: undefined;
};

export type PalmLineChoice = 'derin' | 'ince' | 'kesik';

export interface CoffeeSymbol {
  id: string;
  name: string;
  emoji: string;
  meaning: string;
}

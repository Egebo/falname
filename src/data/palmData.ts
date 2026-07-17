import { PalmLineChoice } from '../types';

export const PALM_LINES = [
  { id: 'kalp', name: 'Kalp Çizgisi', emoji: '💗', question: 'Avucunun üst kısmındaki kalp çizgin nasıl?' },
  { id: 'akil', name: 'Akıl Çizgisi', emoji: '🧠', question: 'Avucunun ortasındaki akıl çizgin nasıl?' },
  { id: 'yasam', name: 'Yaşam Çizgisi', emoji: '🌱', question: 'Başparmağını çevreleyen yaşam çizgin nasıl?' },
] as const;

export type PalmLineId = (typeof PALM_LINES)[number]['id'];

export const LINE_CHOICES: { id: PalmLineChoice; label: string; desc: string }[] = [
  { id: 'derin', label: 'Derin ve belirgin', desc: 'Net, kesintisiz ve koyu' },
  { id: 'ince', label: 'İnce ve uzun', desc: 'Hafif ama avucu boydan boya geçiyor' },
  { id: 'kesik', label: 'Kesik ya da dallı', desc: 'Aralıklı, çatallı veya zincir gibi' },
];

export const PALM_READINGS: Record<PalmLineId, Record<PalmLineChoice, string>> = {
  kalp: {
    derin: 'Duyguların güçlü ve tutkulusun. Sevdiğin zaman tüm kalbinle seviyorsun; sadakat senin için pazarlık konusu değil. Önümüzdeki dönemde kalbinin sesi seni doğru kişiye yönlendirecek.',
    ince: 'Duygularını herkese açmayan, seçici bir kalbin var. Derin bağlar kurman zaman alıyor ama kurduğun bağlar ömürlük oluyor. Yakında güvenini kazanacak biri kapını çalacak.',
    kesik: 'Kalbin geçmişte kırılmalar yaşamış ama her seferinde daha bilge çıkmışsın. Duygusal iniş çıkışlar seni olgunlaştırıyor. Kendini affetmeyi öğrendiğinde aşk da seni bulacak.',
  },
  akil: {
    derin: 'Analitik ve odaklı bir zihnin var. Karar verdiğinde geri dönmezsin ve bu kararlılık seni hedeflerine taşıyor. Yakın zamanda zekânı konuşturacağın büyük bir fırsat doğacak.',
    ince: 'Hayal gücü kuvvetli, yaratıcı bir düşünürsün. Fikirlerin sıradanın dışında; bu da seni farklı kılıyor. Sanat, tasarım ya da yazıyla ilgili bir kapı aralanmak üzere.',
    kesik: 'Zihnin sürekli yeni yollar arıyor; bir konudan diğerine atlaman zayıflık değil, çok yönlülük. Dağınık görünen düşüncelerin aslında büyük bir resmin parçaları. Yakında hepsi birleşecek.',
  },
  yasam: {
    derin: 'Enerjin yüksek, köklerin sağlam. Zorluklar karşısında bükülmeyen bir dayanıklılığın var. Uzun ve dolu dolu bir yaşam çizgisi seni bekliyor; sağlığına gösterdiğin özen meyvesini verecek.',
    ince: 'Hassas ama esnek bir yapın var; fırtınada kırılmak yerine eğilip doğruluyorsun. Kendine ayırdığın sessiz anlar senin şarj istasyonun. Dinlenmeyi ihmal etme, enerjin yakında zirveye çıkacak.',
    kesik: 'Hayatında belirgin dönüm noktaları var; her kesik yeni bir başlangıcın izi. Değişimden korkmuyorsun ve bu cesaret sana hep yeni kapılar açıyor. Önümüzdeki aylarda taze bir sayfa açılıyor.',
  },
};

// El seçimine göre giriş cümlesi
export const HAND_INTROS: Record<'sol' | 'sag', string> = {
  sol: 'Sol el, doğuştan getirdiğin potansiyeli ve iç dünyani gösterir.',
  sag: 'Sağ el, kendi iradenle şekillendirdiğin kaderi ve dış dünyanı gösterir.',
};

// Kombinasyona göre genel yorum (derin sayısına göre)
export function getOverallPalmReading(choices: PalmLineChoice[]): string {
  const derinCount = choices.filter(c => c === 'derin').length;
  const inceCount = choices.filter(c => c === 'ince').length;
  if (derinCount >= 2) {
    return 'Avucundaki hâkim derinlik, güçlü bir karakterin işareti. Ne istediğini bilen ve arkasında duran birisin. Kaderin senin ellerinde — kelimenin tam anlamıyla.';
  }
  if (inceCount >= 2) {
    return 'İnce çizgilerin zarafeti, sezgisel ve derin bir iç dünyaya işaret ediyor. Görünmeyeni gören gözlerin var; sezgilerine güvendiğin sürece yolun açık.';
  }
  return 'Avucundaki çeşitlilik, çok katmanlı ve dinamik bir hayatın haritası. Tek bir kalıba sığmıyorsun; bu da senin en büyük gücün. Değişken çizgiler, zengin bir kader demektir.';
}

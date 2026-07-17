// Mock günlük burç içerikleri
// Gerçek uygulamada Gemini API ile üretilip cache'lenecek

import { DailyHoroscope, ZodiacSignId } from '../types';

const DAILY_HOROSCOPES: Record<ZodiacSignId, DailyHoroscope[]> = {
  koc: [
    { love: 'Kalbindeki duygular bugün yüzeye çıkıyor. Sevdiğin kişiye açık ol.', career: 'Mesleki hedeflerin için cesur bir adım at. Fırsat kapıda.', health: 'Enerji seviyeniz yüksek, fiziksel aktivite seni güçlendirecek.', lucky_number: 7, lucky_color: 'Kırmızı' },
    { love: 'İlişkinde denge arayışı ön plana çıkıyor. Sabırlı ol.', career: 'Ekip çalışması bugün seni öne çıkaracak.', health: 'Dinlenmeyi ihmal etme, bedenine iyi bak.', lucky_number: 3, lucky_color: 'Turuncu' },
    { love: 'Yeni tanışmalar için enerjik bir gün.', career: 'Yaratıcı fikirlerini paylaş, takdir göreceksin.', health: 'Su tüketimini artır, hafif egzersiz faydalı.', lucky_number: 9, lucky_color: 'Beyaz' },
  ],
  boga: [
    { love: 'Güven ve istikrar ilişkinde hâkim. Sakin bir gün seni bekliyor.', career: 'Sabırlı çalışman yakında meyvelerini verecek.', health: 'Boğaz ve boyun bölgesine dikkat et.', lucky_number: 6, lucky_color: 'Yeşil' },
    { love: 'Romantik bir sürpriz kapıda. Kalbini açık tut.', career: 'Mali konularda akıllıca hareket et.', health: 'Doğa yürüyüşü seni yenileyecek.', lucky_number: 2, lucky_color: 'Pembe' },
    { love: 'Eski bir anı sizi yakınlaştırabilir.', career: 'Uzun vadeli plan yapma zamanı.', health: 'Yavaş tempolu bir gün geçir, kendine zaman ayır.', lucky_number: 8, lucky_color: 'Kahverengi' },
  ],
  ikizler: [
    { love: 'Esprili ve oyunbaz halin ilgi çekiyor. Eğlenceli anlar seni bekliyor.', career: 'İletişim yeteneklerin ön plana çıkıyor, konuş ve paylaş.', health: 'Zihin yorgunluğuna dikkat et, kısa molalar ver.', lucky_number: 5, lucky_color: 'Sarı' },
    { love: 'İki farklı duygu arasında gidip geliyorsun. Kalbini dinle.', career: 'Çoklu proje yönetiminde parlaklığın görünüyor.', health: 'Bol hava al, açık alanda zaman geçir.', lucky_number: 3, lucky_color: 'Açık Mavi' },
    { love: 'Birinin sana hayranlık duyduğunu fark edeceksin.', career: 'Yeni bir bağlantı kariyer fırsatı doğurabilir.', health: 'Nefes egzersizleri seni sakinleştirecek.', lucky_number: 11, lucky_color: 'Gümüş' },
  ],
  yengec: [
    { love: 'Duygusal derinliğin ilişkini güçlendiriyor. Güven ver.', career: 'Sezgilerine güven, doğru yoldasın.', health: 'Mide bölgesine dikkat et, sağlıklı beslen.', lucky_number: 2, lucky_color: 'Gümüş' },
    { love: 'Aile ve yakınlarınla güzel anlar yaşayacaksın.', career: 'Ev ofis düzenlemen verimliliğini artıracak.', health: 'Duygusal yeme alışkanlığına dikkat et.', lucky_number: 7, lucky_color: 'Beyaz' },
    { love: 'Hassasiyetin bugün bir güç olarak ortaya çıkıyor.', career: 'Yaratıcı bir proje seni motive edecek.', health: 'Yüzme ya da su sporları sana iyi gelecek.', lucky_number: 4, lucky_color: 'Deniz Mavisi' },
  ],
  aslan: [
    { love: 'Karizmanla herkesi büyülüyorsun. Sevgi hayatında heyecan var.', career: 'Liderlik pozisyonu seni bekliyor, öne çık.', health: 'Kalp ve sırt bölgesine özen göster.', lucky_number: 1, lucky_color: 'Altın' },
    { love: 'Sevdiğin kişiye değerini hissettir.', career: 'Sahneye çıkma zamanı, yeteneklerini göster.', health: 'Egzersiz rutinine sadık kal.', lucky_number: 8, lucky_color: 'Turuncu' },
    { love: 'Dramatik bir jest yerine samimi bir söz daha etkili.', career: 'Ekibine ilham ver, motivasyonun bulaşıcı.', health: 'Güneş ışığından beslen, dışarı çık.', lucky_number: 5, lucky_color: 'Kırmızı' },
  ],
  basak: [
    { love: 'Detaylara verdiğin önem ilişkinde fark yaratıyor.', career: 'Analitik düşüncen bugün seni öne çıkarıyor.', health: 'Sindirim sistemi ve bağırsaklara dikkat et.', lucky_number: 6, lucky_color: 'Kahverengi' },
    { love: 'Mükemmeliyetçiliğini bırak, anı yaşa.', career: 'Organize bir çalışma planı verimliliği artıracak.', health: 'Düzenli uyku ve beslenme önceliğin olsun.', lucky_number: 2, lucky_color: 'Yeşil' },
    { love: 'Eleştirinden önce takdir et, ilişkin derinleşecek.', career: 'Küçük ama önemli bir detayı fark edeceksin.', health: 'Yoga veya meditasyon zihnini sakinleştirecek.', lucky_number: 4, lucky_color: 'Bej' },
  ],
  terazi: [
    { love: 'Denge ve uyum ilişkinde hâkim. Romantik bir gün seni bekliyor.', career: 'Adil yaklaşımın takdir görüyor, arabulucu rolün güçlü.', health: 'Böbrekler ve bel bölgesine dikkat et.', lucky_number: 6, lucky_color: 'Pembe' },
    { love: 'Karar vermekte zorlanıyorsun; kalbini dinle.', career: 'Estetik ve güzellik alanında parlıyorsun.', health: 'Denge egzersizleri sana faydalı.', lucky_number: 9, lucky_color: 'Açık Mavi' },
    { love: 'Partnerinle ortak bir hedef belirle.', career: 'İşbirliği önerileri kapıda, değerlendir.', health: 'Tatlıları kısıtla, hafif bir yürüyüş yap.', lucky_number: 3, lucky_color: 'Mor' },
  ],
  akrep: [
    { love: 'Yoğun duygular bugün yüzeye çıkıyor. Dürüst ol.', career: 'Araştırma ve analiz gücün zirveye çıkıyor.', health: 'Stres yönetimine önem ver, derin nefes al.', lucky_number: 8, lucky_color: 'Bordo' },
    { love: 'Kıskançlık duygusu yerine güven inşa et.', career: 'Gizli kalan bir bilgi sana avantaj sağlayacak.', health: 'Sindirim sorunlarına karşı dikkatli ol.', lucky_number: 0, lucky_color: 'Siyah' },
    { love: 'Dönüşüm zamanı; eski kalıpları bırak.', career: 'Stratejik hamlen bugün meyvelerini verecek.', health: 'Detoks için bol su iç.', lucky_number: 11, lucky_color: 'Koyu Kırmızı' },
  ],
  yay: [
    { love: 'Özgürlük ve macera ruhun ilişkine renk katıyor.', career: 'Büyük hedeflerin için ilk adımı at.', health: 'Kalçalar ve bacak kaslarına dikkat et.', lucky_number: 3, lucky_color: 'Mor' },
    { love: 'Uzak mesafe ilişki ya da seyahat konulu gelişme var.', career: 'Yabancı bağlantılar fırsat kapısı açıyor.', health: 'Açık hava aktiviteleri sana enerji verecek.', lucky_number: 9, lucky_color: 'Turuncu' },
    { love: 'Felsefi bir sohbet kalpleri yakınlaştıracak.', career: 'Eğitim ve öğrenme yatırımın karşılığını verecek.', health: 'Aşırıya kaçma, ölçülü ol.', lucky_number: 5, lucky_color: 'Sarı' },
  ],
  oglak: [
    { love: 'Sorumluluk duygun ilişkinde güven veriyor. İfade et.', career: 'Kariyer hedeflerin için kararlı adım at.', health: 'Diz ve eklemlerine özen göster.', lucky_number: 8, lucky_color: 'Siyah' },
    { love: 'Duygularını açmak zor gelse de dene.', career: 'Uzun vadeli yatırım ve planlama zamanı.', health: 'Kemik sağlığı için kalsiyum alımına dikkat et.', lucky_number: 4, lucky_color: 'Gri' },
    { love: 'Romantizmi iş kadar ciddiye al.', career: 'Disiplinli çalışman seni rakiplerinIn önüne geçiriyor.', health: 'Kısa bir tatil ya da mola ruhunu yenileyecek.', lucky_number: 1, lucky_color: 'Lacivert' },
  ],
  kova: [
    { love: 'Özgün yaklaşımın ilgi çekiyor. Sıra dışı bir bağ kuruluyor.', career: 'Yenilikçi fikirlerin için doğru zaman.', health: 'Ayak bilekleri ve dolaşım sistemine dikkat et.', lucky_number: 11, lucky_color: 'Elektrik Mavisi' },
    { love: 'Arkadaşlıktan doğan bir his sürpriz yapabilir.', career: 'Toplumsal projelerde parlaklığın görünüyor.', health: 'Teknoloji detoksu yapman seni yenileyecek.', lucky_number: 7, lucky_color: 'Turkuaz' },
    { love: 'Sıra dışı bir randevu fikriyle şaşırt.', career: 'Grup dinamikleri seni öne çıkarıyor.', health: 'Zihinsel egzersizler enerji veriyor.', lucky_number: 4, lucky_color: 'Mor' },
  ],
  balik: [
    { love: 'Sezgilerin seni doğru yönlendiriyor. Hislerine güven.', career: 'Yaratıcı ve sanatsal projeler parlaklığını artırıyor.', health: 'Ayaklar ve bağışıklık sistemine özen göster.', lucky_number: 7, lucky_color: 'Deniz Mavisi' },
    { love: 'Hayal gücün aşkına renk katıyor.', career: 'Sezgisel kararın seni doğru yere taşıyacak.', health: 'Su ile vakit geç, banyo ve yüzme.', lucky_number: 2, lucky_color: 'Lila' },
    { love: 'Empatik doğan seni değerli kılıyor.', career: 'Yardım etme dürtün seni fırsatlara açıyor.', health: 'Fazla düşünme, anı yaşa.', lucky_number: 9, lucky_color: 'Yeşil' },
  ],
};

export function getDailyHoroscope(signId: ZodiacSignId): DailyHoroscope {
  const contents = DAILY_HOROSCOPES[signId] || DAILY_HOROSCOPES['koc'];
  // Tarihe göre deterministik seçim
  const dayOfYear = Math.floor(Date.now() / 86400000);
  return contents[dayOfYear % contents.length];
}

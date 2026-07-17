import { ZodiacSignId } from '../types';

export interface ZodiacFortune {
  genel: string;
  ask: string;
  para: string;
  uyari: string;
}

// Her burç için 2 haftalık fal seti — hafta numarasına göre dönüşümlü seçilir
const ZODIAC_FORTUNES: Record<ZodiacSignId, ZodiacFortune[]> = {
  koc: [
    { genel: 'Bu hafta enerjin dorukta. Uzun süredir ertelediğin o cesur adımı atmak için gökyüzü senden yana.', ask: 'Tutkulu bir karşılaşma seni bekliyor; ilk adımı atmaktan çekinme.', para: 'Ani bir harcama isteğine karşı dur. Hafta sonuna doğru beklenmedik bir gelir kapısı aralanıyor.', uyari: 'Öfkeyle verilen kararlar bu hafta pahalıya patlayabilir. Önce say, sonra konuş.' },
    { genel: 'Mars enerjin seni öne itiyor ama bu hafta strateji, hızdan daha değerli. Planla ve sonra saldır.', ask: 'İlişkinde rekabet değil, takım ruhu kazandırır. Bekârsan spor ya da hobi ortamına dikkat.', para: 'Kariyer basamağında yukarıyı işaret eden bir gelişme var. Görünür ol.', uyari: 'Herkesle aynı anda savaşamazsın. Önceliklerini seç.' },
  ],
  boga: [
    { genel: 'Sabrının sınandığı bir dönemden çıkıyorsun. Bu hafta emeklerinin ilk meyveleri görünmeye başlıyor.', ask: 'Güven arayışın karşılık buluyor. Sana huzur veren kişiye bir şans daha ver.', para: 'Birikim yapmak için yıldızlar uygun dizilimde. Küçük ama düzenli adımlar büyük fark yaratacak.', uyari: 'İnatçılığın bu hafta bir fırsatı kaçırmana neden olabilir. Esnek ol.' },
    { genel: 'Venüs sana konfor ve keyif vaat ediyor. Kendini şımartman gereken bir haftadasın.', ask: 'Duyularına hitap eden bir buluşma yakın. Güzel bir yemek, güzel bir başlangıç olabilir.', para: 'Taşınmaz, ev ya da uzun vadeli yatırım konuları gündeme geliyor. Acele etme ama kapıyı da kapatma.', uyari: 'Konfor alanı güvenlidir ama orada büyüme olmaz. Küçük bir risk al.' },
  ],
  ikizler: [
    { genel: 'Zihnin bu hafta bir fikir şöleninde. Yaz, anlat, paylaş — kelimelerin kapı açacak.', ask: 'Sohbetiyle seni büyüleyen biri çıkabilir. Aşk bu hafta kulaktan giriyor.', para: 'İki farklı gelir fikri arasında kararsızsın. İkisini de küçük ölçekte dene.', uyari: 'Her duyduğunu doğrulamadan aktarma; dedikodu bu hafta sana döner.' },
    { genel: 'Merkür seni destekliyor: anlaşmalar, görüşmeler ve yeni bağlantılar için mükemmel zaman.', ask: 'İlişkinde konuşulmamış bir konu var; nazikçe aç. Bekârsan eski bir mesajlaşma canlanabilir.', para: 'İmza atmadan önce ince yazıları oku. Detaylarda fırsat da var, tuzak da.', uyari: 'Dikkatin dağılırsa en önemli treni kaçırırsın. Tek işe odaklan.' },
  ],
  yengec: [
    { genel: 'Ay senin yöneticin ve bu hafta duyguların pusulan. İçinden gelen sese güven; yanılmıyor.', ask: 'Ev ve aile temalı romantik anlar öne çıkıyor. Sevdiğinle yuva hayali kurmak için güzel bir hafta.', para: 'Aile kaynaklı bir maddi destek ya da miras konusu gündeme gelebilir.', uyari: 'Alınganlık, olmayan sorunlar yaratabilir. Her sessizlik sana karşı değil.' },
    { genel: 'Kabuğundan çıkma vakti. Bu hafta sosyal ortamlar sana şifa ve şans getirecek.', ask: 'Korumacı yaklaşımın sevgiline bazen dar gelebilir. Nefes alanı tanı, bağ güçlensin.', para: 'Duygusal alışverişe dikkat: moralin bozukken cüzdanını evde bırak.', uyari: 'Geçmişi bugünün terazisinde tartma. Bu hafta ileriye bak.' },
  ],
  aslan: [
    { genel: 'Sahne yeniden senin. Bu hafta parlaman için evren spot ışıklarını üzerine çeviriyor.', ask: 'Kalbin görkemli jestler istiyor ama karşındakinin dili sadelik olabilir. Dinle.', para: 'Yeteneğini gelire çevirecek bir teklif ufukta. Değerini bil, ucuza satma.', uyari: 'Gurur, özür dilemeni engellemesin. Küçük bir "üzgünüm" büyük bir kapıyı açar.' },
    { genel: 'Güneş enerjin bulaşıcı; çevrendekiler senden güç alıyor. Liderliğini şefkatle birleştir.', ask: 'Sana hayranlık duyan biri sessizce bekliyor. Etrafına daha dikkatli bak.', para: 'Gösterişli harcamalar yerine kalıcı değere yatır. Altın ve sanat sana göz kırpıyor.', uyari: 'Her alkış samimi değildir. Dalkavuğu dosttan ayır.' },
  ],
  basak: [
    { genel: 'Düzen kurma enerjin zirvede. Bu hafta hayatının dağınık köşelerini toparlamak sana iyi gelecek.', ask: 'Mükemmel partner arayışı seni yalnızlaştırabilir. Kusurlarıyla güzel olana bir bak.', para: 'Bütçe planın işe yarıyor; küçük bir kaçamak dışında rotayı koru.', uyari: 'Eleştiri oklarını önce kendine sonra başkasına yöneltme; ikisinde de dozu kaçırma.' },
    { genel: 'Detaylardaki ustalığın bu hafta seni vazgeçilmez yapacak. Ama büyük resmi de kaçırma.', ask: 'Sevgiline hizmet ederek sevgi gösteriyorsun; ona bunu fark ettir, kelimeye dök.', para: 'Sağlık ya da eğitim için yapacağın harcama, yatırımların en kârlısı olacak.', uyari: 'Endişe, çözüm üretmez; plan üretir. Kaygıyı listeye çevir.' },
  ],
  terazi: [
    { genel: 'Dengeler yeniden kuruluyor. Bu hafta hem kalbinde hem çevrende uyum rüzgârları esiyor.', ask: 'Venüs sana zarif bir karşılaşma hazırlıyor. Estetik bir ortamda kalbin hızlanabilir.', para: 'Ortaklık ya da ikili anlaşma gündemde. Adil olduğundan emin ol, sonra imzala.', uyari: 'Herkesi memnun etmeye çalışmak, kimseyi memnun etmemekle biter. Kendi tarafını seç.' },
    { genel: 'Kararsızlık bulutları dağılıyor. Bu hafta net seçimler yapacak güce sahipsin.', ask: 'İlişkinde terazinin iki kefesi de dolu olmalı: vermek kadar almayı da hatırla.', para: 'Estetik, moda ya da tasarım alanından bir kazanç fırsatı doğuyor.', uyari: '"Belki" demek bazen "hayır" demekten daha çok kırar. Net ol.' },
  ],
  akrep: [
    { genel: 'Dönüşüm haftası. Eski bir kabuk çatlıyor ve altından daha güçlü bir sen çıkıyor.', ask: 'Yoğunluğun karşındakini hem çekiyor hem korkutuyor. Gizemini koru ama duvarını alçalt.', para: 'Başkalarının göremediği bir fırsatı sen görüyorsun. Sessizce pozisyon al.', uyari: 'İntikam tatlıdır ama zehirli. Enerjini geçmişe değil geleceğe harca.' },
    { genel: 'Plüton derinlerden bir sırrı gün yüzüne çıkarıyor. Bu bilgi seni özgürleştirecek.', ask: 'Tutkulu bir dönemdesin; kıskançlığı tutkuya değil güvene dönüştür.', para: 'Borç, kredi ya da ortak para konularında netleşme zamanı. Kayıt tut.', uyari: 'Herkes senin kadar derin hissetmez; bu onları yüzeysel yapmaz. Hoşgörü.' },
  ],
  yay: [
    { genel: 'Ufuk çizgin genişliyor. Seyahat, eğitim ya da yeni bir dünya görüşü kapıda.', ask: 'Uzaklardan gelen biri kalbini hareketlendirebilir. Farklı kültüre açık ol.', para: 'Jüpiter cömertliğini gösteriyor: beklenmedik bir şans, kapını çalabilir. Ama kumar değil!', uyari: 'Verdiğin sözleri unutma; özgürlük, sorumsuzluk demek değil.' },
    { genel: 'Macera ruhun kıpır kıpır. Rutini kırmak için küçük bir kaçamak planla; büyük ilham getirecek.', ask: 'İlişkine felsefe kat: birlikte öğrenin, birlikte keşfedin. Bekârsan bir kursa yazıl.', para: 'Yurtdışı ya da uzaktan iş bağlantısı kazanç vaat ediyor.', uyari: 'Okun her zaman hedefi bulmaz; bazen nişan almak için durman gerekir.' },
  ],
  oglak: [
    { genel: 'Zirve göründü. Bu hafta attığın her disiplinli adım, seni hedefe bir basamak yaklaştırıyor.', ask: 'İşine gösterdiğin özeni kalbine de göster. Sevgi de emek ister, terfi gibi.', para: 'Satürn uzun vadeli bir yatırımı ödüllendiriyor. Sabrın faiz getiriyor.', uyari: 'Çalışmak kaçış olmasın. Dinlenmek de üretkenliğin parçası.' },
    { genel: 'Otoriten bu hafta test edilebilir; sakin kal, gücünü kanıtlamana gerek yok, zaten belli.', ask: 'Soğuk görünümünün altındaki sıcaklığı göstermekten korkma. Kırılganlık güçtür.', para: 'Kariyer teklifinde maddi olduğu kadar manevi değeri de tart.', uyari: 'Her şeyi tek başına taşımak zorunda değilsin. Yardım istemek zayıflık değil.' },
  ],
  kova: [
    { genel: 'Sıra dışı fikirlerin bu hafta karşılık buluyor. Geleceği bugünden gören gözlerin var.', ask: 'Arkadaşlıktan filizlenen bir duygu netleşiyor. Etiketlerden korkma.', para: 'Teknoloji ya da yenilik temalı bir kazanç kapısı açılıyor. Trendleri izle.', uyari: 'Özgürlüğüne düşkünlüğün, seni sevenleri mesafeli hissettirebilir. Arada köprü kur.' },
    { genel: 'Uranüs sürpriz seviyor: bu hafta beklenmedik bir gelişme planlarını değiştirebilir — iyi yönde.', ask: 'Zihinsel bağ senin için ön koşul; seninle aynı frekansta düşünen biri yaklaşıyor.', para: 'Topluluk projesi ya da ekip işi bereket getiriyor. Yalnız kurt olma.', uyari: 'İsyan etmek için isyan etme; enerjini gerçek bir davaya sakla.' },
  ],
  balik: [
    { genel: 'Sezgilerin bu hafta radar gibi. Rüyaların, tesadüfler ve içe doğuşlar sana yol gösteriyor.', ask: 'Romantizm dozu yüksek bir hafta. Ama pembe gözlükleri ara sıra çıkarıp netliğe bak.', para: 'Sanat, müzik ya da yaratıcılıktan gelir fikri filizleniyor. Hayal değil, plan yap.', uyari: 'Herkesi kurtaramazsın. Önce kendi kıyına yüz.' },
    { genel: 'Neptün ilham perilerini gönderiyor. Yaratıcı projen için gökyüzü açık.', ask: 'Ruh eşi arayışında işaretler belirginleşiyor. Kalbinin pusulasına güven ama adresi de sor.', para: 'Bağış, yardım ya da destekle ilgili güzel bir döngü: verdiğin, katlanarak dönüyor.', uyari: 'Kaçış değil mola ver. Sorunlar, sen yüzleşince küçülür.' },
  ],
};

const LUCKY_DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

export function getZodiacFortune(signId: ZodiacSignId): ZodiacFortune & { luckyDay: string } {
  const week = Math.floor(Date.now() / (86400000 * 7));
  const sets = ZODIAC_FORTUNES[signId];
  const fortune = sets[week % sets.length];
  const luckyDay = LUCKY_DAYS[(week + signId.length) % 7];
  return { ...fortune, luckyDay };
}

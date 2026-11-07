# LoL Draft Lab — İlk çalışan MVP (v0.1)

React + TypeScript + Vite ile hazırlanmış, tarayıcı tabanlı bir League of Legends draft çalışma aracı.

## Kurulumsuz hızlı deneme

**`hizli-demo.html`** dosyasına çift tıkla: tarayıcıda açılır, Node.js ya da `npm install` gerektirmez. Bu dosya aynı fikrin tek dosyalık HTML/JavaScript demosudur. React sürümünden ayrı bir uygulamadır. İnternet varsa şampiyon görselleri ve güncel Data Dragon verileri yüklenir; yoksa gömülü 85 şampiyonluk havuz çalışır.

## React projesini çalıştırma

1. Güncel Node.js LTS yükle: https://nodejs.org/
2. ZIP'i klasöre çıkar ve bu klasörü VS Code ile aç.
3. Terminalde:

```bash
npm install
npm run dev
```

4. Terminalin gösterdiği adresi ziyaret et (normalde http://localhost:5173).

Üretim derlemesi: `npm run build` (çıktı `dist/` klasöründe).

## Kullanım

- Mavi veya kırmızı takımın pick alanına tıklayarak şampiyon seç.
- Yasaklama kutularından ban ekle.
- Ortadaki panelden takımı ve rolü seçerek **önerilen beş alternatifi** gör.
- `Seç` düğmesine basmak öneriyi o takımın ilgili rol alanına yerleştirir.
- `Örnek draft` üçe üç örnek kompozisyonu yükler; `Sıfırla` bütün seçimleri siler.
- Seçimler tarayıcının `localStorage` alanına kaydedilir.

## Dosya yapısı

- `src/App.tsx`: Draft ekranı, seçim penceresi, etkileşimler, durum yönetimi.
- `src/index.css`: Koyu tema ve duyarlı (responsive) görünüm.
- `src/data/champions.ts`: Riot Data Dragon'dan güncel şampiyon listesini alır. Erişim başarısızsa demo havuzunu kullanır.
- `src/lib/draft.ts`: Rol havuzları, kompozisyon kuralları, aday önerileri ve draft notları.
- `src/main.tsx`: React başlangıç noktası.

## Öneri motoru hakkında

Şu anda makine öğrenmesi kullanılmıyor. **Uyum puanı** örnek amaçlı, açıklanabilir ve kural tabanlı bir sezgisel skordur. Gerçek kazanma oranı, güncel eşleşme istatistiği ya da kanıtlanmış counter değeri DEĞİLDİR. Rol listeleri ve şampiyon etiketleri elle tanımlanmıştır ve yeni şampiyon/meta değişimlerinde güncelleme gerektirir.

İleride gerçek maç verisiyle istatistik altyapısı kurulabilir; bunun için veri kalitesi, patch, bölge, rank ve örneklem büyüklüğü ayrı ayrı değerlendirilmelidir.

## Riot / yayınlama notu

Prototip, maç istemcisine bağlanmaz ve herhangi bir oyuncu adına seçim yapmaz. Riot'un Data Dragon statik varlıkları kullanılır. Kamuya açmadan önce uygulamanızı Riot Developer Portal'a kaydetmeniz ve güncel [Riot geliştirici politikalarını](https://developer.riotgames.com/docs/lol) incelemeniz gerekir. Kullanıcıya gösterilmesi gereken resmî feragat metni arayüz altbilgisinde bulunur.

Draft Lab is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

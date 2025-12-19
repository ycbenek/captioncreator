# 📤 Canva'ya Yükleme Kılavuzu

## ✅ Build Başarılı!

Production build alındı! `dist/` klasöründe şu dosyalar var:
- ✅ `app.js` (1.03 MB)
- ✅ `app.js.LICENSE.txt`
- ✅ `messages_en.json`

## 🚀 Canva Developer Portal'a Yükleme

### Adım 1: Developer Portal'a Git
👉 https://www.canva.com/developers/apps

### Adım 2: Uygulamanı Seç veya Oluştur

**Yeni Uygulama İçin:**
1. "Create an app" butonuna tıkla
2. App type seç: **"App"** (not Extension)
3. App name gir: "Caption Generator"
4. Create'e tıkla

**Mevcut Uygulama İçin:**
1. Uygulama listesinden Caption Generator'ı bul
2. Tıkla

### Adım 3: App Configuration

#### General Settings
- **App name:** Caption Generator
- **Description:** AI-powered caption generator for social media designs
- **Category:** Marketing & Social Media
- **Supported surfaces:** Design editor

#### Development URLs (Development modunda)
- **App source:** `https://localhost:8080`
- **Backend host:** `http://localhost:3001` (backend çalışıyorsa)

### Adım 4: Production Build Yükle

1. **"Build" sekmesine git**
2. **"Upload build"** butonuna tıkla
3. **`dist/app.js`** dosyasını seç ve yükle
4. Build başarıyla yüklendikten sonra **"Submit for review"** yapabilirsin

### Adım 5: App Permissions & Scopes

Aşağıdaki izinleri ekle:

**Required Scopes:**
- ✅ `design:content:read` - Tasarım içeriğini okuma
- ✅ `design:content:write` - Tasarıma element ekleme
- ✅ `asset:write` - Asset yükleme (opsiyonel)

**User Authentication:**
- ✅ OAuth olmadan çalışabilir (getCanvaUserToken kullanıyoruz)

### Adım 6: Backend Configuration

#### Development Modunda
Backend'iniz `localhost:3001`'de çalışıyor. Bu sadece development için geçerli.

#### Production için
Production'a alırken backend'i deploy etmelisiniz:

**Önerilen Platformlar:**
1. **Vercel** (Ücretsiz) - Node.js destekli
2. **Railway** (Ücretsiz tier)
3. **Render** (Ücretsiz tier)
4. **Heroku** (Ücretli)
5. **AWS Lambda** (Ücretli ama esnek)

**Backend Deploy Sonrası:**
1. `.env` dosyasında `CANVA_BACKEND_HOST` güncelle
2. Yeni build al: `npm run build`
3. Yeni build'i Canva'ya yükle

### Adım 7: Test Etme

#### Development Modunda Test
```bash
# Terminal 1: Backend
npx ts-node utils/backend/caption/server.ts

# Terminal 2: Frontend
npm start
```

Sonra Canva'da:
- Developer Portal → Apps → Your App
- **"Preview"** butonuna tıkla
- Canva editor açılacak ve uygulamanız sağ panelde görünecek

#### Production Build Test
1. Build'i yükle
2. "Test in Canva" butonuna tıkla
3. Production build'i test et

## ⚠️ Önemli Notlar

### Backend Host Warning
Build sırasında şu uyarıyı gördünüz:
```
BACKEND_HOST should not be set to localhost for production builds!
```

**Bu normal!** Şu anlama gelir:
- Development'ta `localhost` kullanıyorsunuz ✅
- Production'a alırken gerçek backend URL'i kullanmalısınız

**Çözüm:**
1. Backend'i deploy edin (Vercel, Railway, vs.)
2. `.env`'de `CANVA_BACKEND_HOST=https://your-backend.vercel.app` olarak güncelleyin
3. Yeniden build alın: `npm run build`

### Bundle Size Warning
```
WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
Assets: app.js (1.03 MiB)
```

**Bu da normal!** React, UI Kit ve bağımlılıklar dahil. İyileştirmek için:
- Code splitting kullanabilirsiniz (ileri seviye)
- Lazy loading ekleyebilirsiniz
- Şimdilik sorun değil, uygulama çalışacak

## 🎯 Hızlı Checklist

- [ ] `.env` dosyası oluşturuldu
- [ ] Gemini API Key eklendi
- [ ] Backend çalışıyor (port 3001)
- [ ] Build alındı (`npm run build`)
- [ ] `dist/app.js` dosyası var
- [ ] Developer Portal'da app oluşturuldu
- [ ] Build yüklendi
- [ ] Preview'da test edildi

## 🚀 Canva'ya Yükleme Komutu

Build'i yüklemek için Canva CLI de kullanabilirsiniz:

```bash
canva apps upload
```

Bu komut:
1. `dist/` klasöründeki build'i otomatik bulur
2. Developer Portal'a yükler
3. Preview link verir

## 📚 Kaynaklar

- [Canva Apps Documentation](https://www.canva.dev/docs/apps/)
- [Publishing Your App](https://www.canva.dev/docs/apps/publishing/)
- [Backend Configuration](https://www.canva.dev/docs/apps/configuring-your-backend/)

## ✅ Sonraki Adımlar

1. **Şimdi:** Preview modunda test et (localhost)
2. **Sonra:** Backend'i deploy et (Vercel/Railway)
3. **En Son:** Production build yükle ve review için gönder

Başarılar! 🎉



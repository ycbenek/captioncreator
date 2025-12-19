# Caption Generator - Kurulum ve Kullanım Kılavuzu

## 📋 Gereksinimler

- Node.js v18, v20.10.0 veya v22
- npm v9, v10 veya v11
- Canva Developer hesabı
- Gemini API Key (ücretsiz)

## 🚀 Kurulum Adımları

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. .env Dosyasını Oluşturun

Proje kök dizininde `.env` dosyası oluşturun ve aşağıdaki içeriği ekleyin:

```env
# Canva App Configuration
CANVA_APP_ID=your-app-id-here
CANVA_APP_ORIGIN=https://localhost:8080

# Backend Configuration
CANVA_BACKEND_HOST=http://localhost
CANVA_BACKEND_PORT=3000

# Gemini API Key
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Gemini API Key Alın

1. https://aistudio.google.com/app/apikey adresine gidin
2. Google hesabınızla giriş yapın
3. "Create API Key" butonuna tıklayın
4. Oluşturulan API Key'i kopyalayın
5. `.env` dosyasındaki `GEMINI_API_KEY` değerine yapıştırın

### 4. Canva App ID'yi Alın

1. https://www.canva.com/developers/apps adresine gidin
2. "Create app" butonuna tıklayın
3. App tipini seçin: "Design Editor"
4. App ID'yi kopyalayın
5. `.env` dosyasındaki `CANVA_APP_ID` değerine yapıştırın

## 🎯 Uygulamayı Çalıştırma

### Terminal 1: Backend Server

PowerShell'de backend'i başlatın:

```powershell
.\start-backend.ps1
```

Backend server `http://localhost:3000` adresinde çalışacak.

### Terminal 2: Frontend Development Server

Ayrı bir terminal açın ve frontend'i başlatın:

```bash
npm start
```

Frontend server `https://localhost:8080` adresinde çalışacak.

### 3. Canva'da Preview

1. https://www.canva.com/developers/apps adresine gidin
2. Uygulamanızı bulun
3. "Preview" butonuna tıklayın
4. Veya CLI ile: `canva apps preview`

## 🔧 Development

### Hot Module Replacement (HMR)

Frontend geliştirirken değişiklikleriniz otomatik olarak yüklenecektir. Backend değişiklikleri için server'ı yeniden başlatmanız gerekebilir.

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
npm run lint:fix
```

### Build

Production build için:

```bash
npm run build
```

Build output `dist/` klasöründe oluşacak.

## 📁 Proje Yapısı

```
src/
├── index.tsx                 # Ana entry point (intent registration)
├── app.tsx                   # Ana app component
├── intents/
│   └── design_editor/
│       └── index.tsx         # Design editor intent implementasyonu
├── screens/
│   ├── IntroScreen.tsx       # Giriş ekranı
│   ├── SettingsScreen.tsx    # Ayarlar ve caption oluşturma
│   └── ResultScreen.tsx      # Sonuç ekranı
├── context/
│   └── AppContext.tsx        # Global state management
└── i18n/
    ├── tr.json               # Türkçe çeviriler
    └── en.json               # İngilizce çeviriler

utils/backend/caption/
├── server.ts                 # Express server
├── routes/
│   ├── caption.ts            # Caption generation routes
│   └── user.ts               # User management routes
├── services/
│   └── ai.ts                 # Gemini AI integration
└── db/
    ├── init.ts               # In-memory database
    ├── user.ts               # User management
    └── rate-limit.ts         # Rate limiting
```

## 🐛 Sorun Giderme

### Backend başlamıyor

- `.env` dosyasının doğru konumda olduğundan emin olun
- `GEMINI_API_KEY` değerinin doğru olduğunu kontrol edin
- Port 3000'in kullanılmadığından emin olun

### Frontend bağlanamıyor

- Backend'in çalıştığından emin olun
- `.env` dosyasındaki `CANVA_BACKEND_HOST` ve `CANVA_BACKEND_PORT` değerlerini kontrol edin
- Browser console'da hata mesajlarına bakın

### SSL Certificate Hatası

Frontend HTTPS kullanır. İlk kez çalıştırdığınızda tarayıcınız self-signed certificate uyarısı verecektir. "Advanced" > "Proceed" yapabilirsiniz.

### Gemini API Hatası

- API Key'in doğru olduğundan emin olun
- API quota'nızın dolmadığını kontrol edin
- https://aistudio.google.com/app/apikey adresinde API Key'inizi kontrol edin

## 📚 Kaynaklar

- [Canva Apps SDK Docs](https://www.canva.dev/docs/apps/)
- [Canva CLI Docs](https://www.canva.dev/docs/apps/canva-cli/)
- [Gemini API Docs](https://ai.google.dev/docs)

## ✨ Özellikler

- ✅ Tasarım metinlerini otomatik tarama
- ✅ 7+ platform desteği (Instagram, LinkedIn, Twitter, vb.)
- ✅ 6 farklı ton seçeneği
- ✅ Türkçe ve İngilizce dil desteği
- ✅ Kredi sistemi (Aylık 10 free, 100 pro)
- ✅ Rate limiting
- ✅ Generation history
- ✅ Modern ve responsive UI

## 🎨 Kullanım

1. Canva'da bir tasarım oluşturun
2. Caption Generator uygulamasını açın
3. "Başlayalım" butonuna tıklayın
4. Platform, ton ve dil seçeneklerini belirleyin
5. "Caption Oluştur" butonuna tıklayın
6. Oluşturulan caption'ı kopyalayın veya tasarıma ekleyin

Bol şans! 🚀



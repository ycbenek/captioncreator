# 🚀 Hızlı Başlatma Kılavuzu

## ✅ Durum: Proje Hazır!

Frontend ve backend örnek projelere göre düzenlendi ve çalışıyor! 

## 📝 Yapılması Gerekenler

### 1. .env Dosyası Oluştur

Proje kök dizininde `.env` dosyası oluştur ve içine aşağıdakileri ekle:

```env
CANVA_APP_ID=your-app-id-here
CANVA_APP_ORIGIN=https://localhost:8080
CANVA_BACKEND_HOST=http://localhost
CANVA_BACKEND_PORT=3000
GEMINI_API_KEY=your-gemini-api-key-here
```

**Gemini API Key almak için:**
👉 https://aistudio.google.com/app/apikey

### 2. Backend'i Başlat

**Terminal 1** (PowerShell):
```powershell
npx ts-node utils/backend/caption/server.ts
```

Backend `http://localhost:3000` adresinde çalışacak.

### 3. Frontend'i Başlat

**Terminal 2**:
```bash
npm start
```

Frontend `https://localhost:8080` adresinde çalışacak.

### 4. Canva'da Önizle

1. https://www.canva.com/developers/apps adresine git
2. Uygulamanı bul
3. "Preview" butonuna tıkla

## 🔧 Yapılan Değişiklikler

### ✅ Intent-Based Architecture
- `src/index.tsx` - Sadece intent kaydı yapıyor
- `src/intents/design_editor/index.tsx` - Design editor intent implementasyonu
- `src/app.tsx` - Ana uygulama komponenti

### ✅ Backend Entegrasyonu  
- Backend routes düzeltildi (TypeScript hataları giderildi)
- BACKEND_HOST webpack tarafından inject ediliyor
- Canva User Auth entegrasyonu eklendi

### ✅ Dosya Yapısı
```
src/
├── index.tsx                    # Intent kaydı
├── app.tsx                      # Ana app
├── intents/design_editor/
│   └── index.tsx               # Design editor intent
├── screens/
│   ├── IntroScreen.tsx
│   ├── SettingsScreen.tsx
│   └── ResultScreen.tsx
└── context/AppContext.tsx      # Canva auth ile entegre

utils/backend/caption/
├── server.ts                   # Express server
├── routes/
│   ├── caption.ts             # ✅ Düzeltildi
│   └── user.ts                # ✅ Düzeltildi
└── services/ai.ts             # ✅ Düzeltildi
```

## 🎯 Özellikler

- ✅ Intent-based architecture (örnek projelere uygun)
- ✅ Canva User Authentication
- ✅ Backend API entegrasyonu
- ✅ Gemini AI caption generation
- ✅ Kredi sistemi (50 free, 1000 pro)
- ✅ Rate limiting
- ✅ Çoklu platform desteği
- ✅ Türkçe/İngilizce dil desteği

## 🐛 Sorun mu var?

1. **Backend başlamıyor** → `.env` dosyasını oluştur
2. **TypeScript hatası** → `npm install` çalıştır
3. **Port 3000 kullanımda** → Diğer uygulamaları kapat
4. **Frontend bağlanamıyor** → Backend'in çalıştığından emin ol

## 📚 Daha Fazla Bilgi

- `KURULUM_KILAVUZU.md` - Detaylı kurulum
- `CAPTION_GENERATOR_README.md` - Proje dokümantasyonu
- https://www.canva.dev/docs/apps/ - Canva Apps SDK

## ✨ Başarılar!

Artık Caption Generator uygulamanız çalışıyor! 🎉


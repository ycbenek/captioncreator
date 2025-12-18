# Caption Generator Backend Baslatma Scripti
Write-Host "Caption Generator Backend Baslatiliyor..." -ForegroundColor Green
Write-Host ""

# .env dosyasini kontrol et
if (-Not (Test-Path ".env")) {
    Write-Host "HATA: .env dosyasi bulunamadi!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Lutfen asagidaki adimlari takip edin:" -ForegroundColor Yellow
    Write-Host "1. Proje kok dizininde '.env' adinda bir dosya olusturun" -ForegroundColor Yellow
    Write-Host "2. Asagidaki icerigi '.env' dosyasina kopyalayin:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "CANVA_APP_ID=your-app-id-here" -ForegroundColor Cyan
    Write-Host "CANVA_APP_ORIGIN=https://localhost:8080" -ForegroundColor Cyan
    Write-Host "CANVA_BACKEND_HOST=localhost" -ForegroundColor Cyan
    Write-Host "CANVA_BACKEND_PORT=3000" -ForegroundColor Cyan
    Write-Host "GEMINI_API_KEY=your-gemini-api-key-here" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. GEMINI_API_KEY icin: https://aistudio.google.com/app/apikey" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# GEMINI_API_KEY kontrolu
$envContent = Get-Content .env -Raw
if ($envContent -notmatch "GEMINI_API_KEY=.+") {
    Write-Host "UYARI: GEMINI_API_KEY bulunamadi veya bos!" -ForegroundColor Yellow
    Write-Host "API Key almak icin: https://aistudio.google.com/app/apikey" -ForegroundColor Yellow
    Write-Host ""
}

# Node modullerini kontrol et
if (-Not (Test-Path "node_modules")) {
    Write-Host "Node modulleri yukleniyor..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Backend'i baslat
Write-Host "Backend server baslatiliyor..." -ForegroundColor Green
Write-Host "Port: 3000" -ForegroundColor Cyan
Write-Host "URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Durdurmak icin: CTRL+C" -ForegroundColor Gray
Write-Host ""

# ts-node ile backend'i baslat
npx ts-node utils/backend/caption/server.ts


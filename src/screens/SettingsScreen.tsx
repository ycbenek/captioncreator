import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Button,
  Rows,
  Text,
  Title,
  Select,
  Alert,
  LoadingIndicator,
} from "@canva/app-ui-kit";
import { useFeatureSupport } from "@canva/app-hooks";
import { addElementAtPoint, addElementAtCursor } from "@canva/design";
import * as styles from "styles/components.css";

interface SettingsScreenProps {
  onBack: () => void;
  onCaptionGenerated: (caption: string) => void;
}

const BACKEND_URL = `${BACKEND_HOST}`;

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onCaptionGenerated,
}) => {
  const { canvaUserId, userInfo, fetchUserInfo } = useApp();
  const isSupported = useFeatureSupport();

  // Check if the app can add elements to the design
  const canAddElement = [addElementAtPoint, addElementAtCursor].some((fn) =>
    isSupported(fn),
  );

  const [platform, setPlatform] = useState("instagram_post");
  const [tone, setTone] = useState("casual");
  const [language, setLanguage] = useState("tr");
  const [designType, setDesignType] = useState("instagram_post");
  const [designTexts, setDesignTexts] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanDesignTexts = async () => {
    setIsScanning(true);
    setError(null);

    try {
      // Gerçek Canva Design API kullan
      const { editContent } = await import("@canva/design");
      
      const texts: string[] = [];
      
      // Tasarımdaki tüm richtext element'leri oku
      await editContent(
        {
          contentType: "richtext",
          target: "current_page",
        },
        async (session) => {
          // Her text element'in içeriğini oku
          session.contents.forEach((range) => {
            const plaintext = range.readPlaintext();
            if (plaintext && plaintext.trim()) {
              texts.push(plaintext.trim());
            }
          });
          
          // Sadece okuma yapıyoruz, değişiklik yok
          // Bu yüzden sync çağırmıyoruz
        },
      );

      if (texts.length === 0) {
        throw new Error("Tasarımda metin bulunamadı. Lütfen tasarımınıza metin ekleyin.");
      }

      console.log("Taranan metinler:", texts);
      setDesignTexts(texts);
    } catch (err: any) {
      const errorMessage = err.message || "Tasarım metinleri taranırken hata oluştu";
      setError(errorMessage);
      console.error("Design scan error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  const generateCaption = async () => {
    if (designTexts.length === 0) {
      setError("Lütfen önce tasarım metinlerini tarayın");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log("Backend URL:", BACKEND_URL);
      console.log("Request data:", {
        canvaUserId,
        texts: designTexts,
        platform,
        tone,
        language,
        designType,
      });

      const response = await fetch(`${BACKEND_URL}/api/caption/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          canvaUserId,
          texts: designTexts,
          platform,
          tone,
          language,
          designType,
        }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();

      if (response.ok && data.success) {
        onCaptionGenerated(data.data.caption);
        fetchUserInfo(); // Kredi bilgisini güncelle
      } else {
        if (data.code === "CREDIT_LIMIT_REACHED") {
          setError("Aylık kredi limitinize ulaştınız");
        } else if (data.code === "RATE_LIMIT_EXCEEDED") {
          setError("Çok fazla istek. Lütfen biraz bekleyin");
        } else {
          setError(data.error || "Caption oluşturulurken hata oluştu");
        }
      }
    } catch (err: any) {
      setError(err.message || "Bağlantı hatası");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    scanDesignTexts();
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Title size="medium">Caption Ayarları</Title>
        <Text size="small">Caption tercihlerinizi yapılandırın</Text>

        {error && (
          <Alert tone="critical" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        {!canAddElement && (
          <Alert tone="warn">
            Bu tasarım tipinde bazı özellikler kullanılamayabilir
          </Alert>
        )}

        {designTexts.length > 0 && (
          <Rows spacing="0.5u">
            <Text size="xsmall" fontWeight="semibold">
              Tasarımdaki Metinler:
            </Text>
            {designTexts.map((text, idx) => (
              <Text key={idx} size="xsmall">
                • {text}
              </Text>
            ))}
          </Rows>
        )}

        <Select
          value={platform}
          onChange={setPlatform}
          options={[
            { label: "Instagram - Post", value: "instagram_post" },
            { label: "Instagram - Story", value: "instagram_story" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "Pinterest", value: "pinterest" },
            { label: "Twitter / X", value: "twitter" },
            { label: "Facebook", value: "facebook" },
            { label: "TikTok", value: "tiktok" },
          ]}
          placeholder="Platform seçin"
        />

        <Select
          value={tone}
          onChange={setTone}
          options={[
            { label: "Resmi", value: "formal" },
            { label: "Samimi", value: "casual" },
            { label: "Eğlenceli", value: "fun" },
            { label: "Profesyonel", value: "professional" },
            { label: "Minimal", value: "minimal" },
            { label: "İlham Verici", value: "inspiring" },
          ]}
          placeholder="Ton seçin"
        />

        <Select
          value={language}
          onChange={setLanguage}
          options={[
            { label: "🇹🇷 Türkçe", value: "tr" },
            { label: "🇬🇧 English", value: "en" },
          ]}
          placeholder="Dil seçin"
        />

        {userInfo && (
          <Rows spacing="0.5u">
            <Text size="small" fontWeight="semibold">
              Kredi
            </Text>
            <Text size="xsmall">
              {userInfo.credits.remaining} / {userInfo.credits.total} kredi kaldı
            </Text>
          </Rows>
        )}

        <Rows spacing="1.5u">
          <Button variant="secondary" onClick={onBack} stretch>
            ← Geri
          </Button>
          <Button
            variant="primary"
            onClick={generateCaption}
            disabled={isGenerating || isScanning || designTexts.length === 0}
            stretch
            loading={isGenerating}
          >
            {isGenerating ? "Oluşturuluyor..." : "✨ Caption Oluştur"}
          </Button>
        </Rows>
      </Rows>
    </div>
  );
};

export default SettingsScreen;

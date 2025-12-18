import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useApp } from "../context/AppContext";
import {
  Button,
  Rows,
  Text,
  Title,
  MultilineInput,
  Alert,
} from "@canva/app-ui-kit";
import * as styles from "styles/components.css";

interface ResultScreenProps {
  caption: string;
  onBack: () => void;
  onRegenerate: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  caption,
  onBack,
  onRegenerate,
}) => {
  const intl = useIntl();
  const { userInfo } = useApp();
  const [editedCaption, setEditedCaption] = useState(caption);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedCaption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Kopyalama başarısız oldu");
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Title size="medium">✅ Caption Hazır!</Title>
        <Text size="small">
          İstediğiniz gibi düzenleyip kopyalayabilirsiniz
        </Text>

        {userInfo && (
          <Rows spacing="0.5u">
            <Text size="small" fontWeight="semibold">
              💳 Krediler
            </Text>
            <Text size="xsmall">
              {userInfo.credits.remaining} / {userInfo.credits.total} kredi kaldı
            </Text>
          </Rows>
        )}

        <MultilineInput
          value={editedCaption}
          onChange={(value) => setEditedCaption(value)}
          minRows={8}
        />

        <Rows spacing="0.5u">
          <Text size="small" fontWeight="semibold">
            💡 İpucu
          </Text>
          <Text size="xsmall">
            Caption'ı kopyalamadan önce istediğiniz gibi düzenleyebilirsiniz
          </Text>
        </Rows>

        <Button variant="primary" onClick={copyToClipboard} stretch>
          {copied ? "✓ Kopyalandı!" : "📋 Kopyala"}
        </Button>

        <Rows spacing="1.5u">
          <Button variant="secondary" onClick={onBack} stretch>
            ← Geri
          </Button>
          <Button variant="secondary" onClick={onRegenerate} stretch>
            🔄 Yeniden Oluştur
          </Button>
        </Rows>
      </Rows>
    </div>
  );
};

export default ResultScreen;

import React from "react";
import { useIntl } from "react-intl";
import { useApp } from "../context/AppContext";
import { Button, Rows, Text, Title } from "@canva/app-ui-kit";
import * as styles from "styles/components.css";

interface IntroScreenProps {
  onContinue: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onContinue }) => {
  const intl = useIntl();
  const { userInfo } = useApp();

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
          <Title size="large">✨ Caption Generator</Title>
          <Text>
            AI destekli sosyal medya caption oluşturucu
          </Text>

        <Rows spacing="1u">
          <Text size="medium" fontWeight="semibold">
            🎯 Nasıl Çalışır?
          </Text>
          <Text size="small">
            Tasarımınızdaki metinleri analiz edip, AI ile ilgi çekici caption'lar oluşturur
          </Text>
        </Rows>

        <Rows spacing="1u">
          <Text size="medium" fontWeight="semibold">
            🚀 Özellikler
          </Text>
          <Text size="small">• 7+ sosyal medya platformu</Text>
          <Text size="small">• 6 farklı ton seçeneği</Text>
          <Text size="small">• Türkçe & İngilizce destek</Text>
          <Text size="small">• AI destekli oluşturma</Text>
        </Rows>

        {userInfo && (
          <Rows spacing="0.5u">
            <Text size="small" fontWeight="semibold">
              {userInfo.plan === "pro" ? "💎 Pro Plan" : "🆓 Free Plan"}
            </Text>
            <Text size="xsmall">
              {userInfo.credits.remaining} / {userInfo.credits.total} kredi kaldı
            </Text>
          </Rows>
        )}

        <Button variant="primary" onClick={onContinue} stretch>
          Başlayalım →
        </Button>
      </Rows>
    </div>
  );
};

export default IntroScreen;

import { Rows } from "@canva/app-ui-kit";
import React, { useState, useEffect } from "react";
import { IntlProvider } from "react-intl";
import { AppProvider } from "./context/AppContext";
import IntroScreen from "./screens/IntroScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ResultScreen from "./screens/ResultScreen";
import { messages } from "./i18n";
import * as styles from "styles/components.css";

export type Screen = "intro" | "settings" | "result";

export const App = () => {
  const [screen, setScreen] = useState<Screen>("intro");
  const [locale, setLocale] = useState<"tr" | "en">("tr");
  const [generatedCaption, setGeneratedCaption] = useState<string>("");

  useEffect(() => {
    // Canva'dan dil bilgisini al (şimdilik default TR)
    // Gerçek uygulamada: Canva SDK'dan locale bilgisi alınır
    const browserLang = navigator.language.startsWith("tr") ? "tr" : "en";
    setLocale(browserLang as "tr" | "en");
  }, []);

  const handleNavigate = (newScreen: Screen) => {
    setScreen(newScreen);
  };

  const handleCaptionGenerated = (caption: string) => {
    setGeneratedCaption(caption);
    setScreen("result");
  };

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <AppProvider>
        <div className={styles.scrollContainer}>
          <Rows spacing="2u">
            {screen === "intro" && (
              <IntroScreen onContinue={() => handleNavigate("settings")} />
            )}
            {screen === "settings" && (
              <SettingsScreen
                onBack={() => handleNavigate("intro")}
                onCaptionGenerated={handleCaptionGenerated}
              />
            )}
            {screen === "result" && (
              <ResultScreen
                caption={generatedCaption}
                onBack={() => handleNavigate("settings")}
                onRegenerate={() => handleNavigate("settings")}
              />
            )}
          </Rows>
        </div>
      </AppProvider>
    </IntlProvider>
  );
};

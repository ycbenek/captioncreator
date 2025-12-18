import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@canva/user";

interface UserInfo {
  plan: "free" | "pro";
  credits: {
    used: number;
    total: number;
    remaining: number;
    reset_at: number;
  };
  rateLimit: {
    remaining: number;
    max: number;
    reset_at: number;
  };
}

interface AppContextType {
  userInfo: UserInfo | null;
  canvaUserId: string;
  isLoading: boolean;
  error: string | null;
  fetchUserInfo: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

// Backend URL - BACKEND_HOST webpack tarafından inject edilir
const BACKEND_URL = `${BACKEND_HOST}`;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [canvaUserId, setCanvaUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async () => {
    if (!canvaUserId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${BACKEND_URL}/api/user/info?canvaUserId=${canvaUserId}`,
      );
      const data = await response.json();

      if (data.success) {
        setUserInfo(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch user info");
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching user info:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Canva SDK ile user ID al
    const getUserId = async () => {
      try {
        const token = await auth.getCanvaUserToken();
        // Token'dan user ID'yi parse et veya direkt Canva user ID kullan
        // Basit demo için token'ı userId olarak kullanıyoruz
        // Gerçek uygulamada backend'de token verify edilir
        setCanvaUserId(token.substring(0, 20)); // Demo amaçlı
      } catch (error) {
        console.error("Failed to get Canva user ID:", error);
        // Fallback: demo user
        setCanvaUserId("demo_user_123");
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (canvaUserId) {
      fetchUserInfo();
    }
  }, [canvaUserId]);

  return (
    <AppContext.Provider
      value={{
        userInfo,
        canvaUserId,
        isLoading,
        error,
        fetchUserInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type AuthTheme = {
  primary: string;
  fog: {
    highlight: string;
    midtone: string;
    lowlight: string;
    base: string;
    speed: number;
    blur: number;
  };
};

export const DEFAULT_AUTH_THEME: AuthTheme = {
  primary: "#2563eb",
  fog: {
    highlight: "#ffffff",
    midtone: "#f4f7ff",
    lowlight: "#e9efff",
    base: "#ffffff",
    speed: 0.8,
    blur: 0.5,
  },
};

export const AUTH_THEME_STORAGE_KEY = "authTheme";

type AuthThemeContextType = {
  theme: AuthTheme;
  setTheme: React.Dispatch<React.SetStateAction<AuthTheme>>;
  reset: () => void;
  defaultTheme: AuthTheme;
};

const AuthThemeContext = createContext<AuthThemeContextType | null>(null);

export function AuthThemeProvider({ children }: { children: React.ReactNode }) {
  // 初期値をlocalStorageから同期に読み込む（クライアント限定）
  const initialTheme: AuthTheme = useMemo(() => {
    if (typeof window === "undefined") return DEFAULT_AUTH_THEME;
    try {
      const raw = localStorage.getItem(AUTH_THEME_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_AUTH_THEME,
          ...parsed,
          fog: { ...DEFAULT_AUTH_THEME.fog, ...(parsed?.fog ?? {}) },
        } as AuthTheme;
      }
    } catch {}
    return DEFAULT_AUTH_THEME;
  }, []);

  const [theme, setTheme] = useState<AuthTheme>(initialTheme);

  // 変更を保存
  useEffect(() => {
    try {
      localStorage.setItem(AUTH_THEME_STORAGE_KEY, JSON.stringify(theme));
    } catch {}
  }, [theme]);

  // 他タブ・他ページからの変更も反映（storageイベント）
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== AUTH_THEME_STORAGE_KEY) return;
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : null;
        if (parsed) {
          setTheme((prev) => ({
            ...prev,
            ...parsed,
            fog: { ...prev.fog, ...(parsed?.fog ?? {}) },
          }));
        }
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const reset = () => setTheme(DEFAULT_AUTH_THEME);

  const value: AuthThemeContextType = {
    theme,
    setTheme,
    reset,
    defaultTheme: DEFAULT_AUTH_THEME,
  };

  return React.createElement(
    AuthThemeContext.Provider,
    { value },
    children as any
  );
}

export function useAuthTheme(): AuthThemeContextType {
  const ctx = useContext(AuthThemeContext);
  if (ctx) return ctx;
  // フォールバック：Providerがない場合でも動くように（ただし共有はされない）
  console.warn(
    "useAuthTheme: Providerが見つかりません。AuthThemeProviderでラップしてください。"
  );
  const [theme, setTheme] = useState<AuthTheme>(DEFAULT_AUTH_THEME);
  const reset = () => setTheme(DEFAULT_AUTH_THEME);
  return { theme, setTheme, reset, defaultTheme: DEFAULT_AUTH_THEME };
}

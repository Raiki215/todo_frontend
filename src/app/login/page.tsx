/**
 * ログインページ（Vanta Fog 背景つき・ガラスカード）
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/lib/store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const defaultTheme = {
    primary: "#2563eb", // ボタン色（視認性を優先して据え置き）
    fog: {
      highlight: "#ffffff",
      midtone: "#f4f7ff", // かなり淡いブルーグレー
      lowlight: "#e9efff", // ごく淡いブルー
      base: "#ffffff", // 純白寄り
      speed: 0.8, // ゆったり動く
      blur: 0.5, // 少しだけ柔らかく
    },
  } as const;
  const [theme, setTheme] = useState<{
    primary: string;
    fog: {
      highlight: string;
      midtone: string;
      lowlight: string;
      base: string;
      speed: number;
      blur: number;
    };
  }>(defaultTheme);

  const { auth, login, setAuthError, initializeAuth } = useAppStore();
  const router = useRouter();

  // === Vanta Fog 用 refs ===
  const vantaRef = useRef<HTMLDivElement | null>(null);
  const vantaEffectRef = useRef<any>(null);
  const themeLoadedRef = useRef(false);

  // Vanta Fog 初期化（クライアントのみ）
  useEffect(() => {
    let mounted = true;

    const hexToNum = (hex: string) => {
      try {
        return parseInt(hex.replace("#", "0x"));
      } catch {
        return 0xffffff;
      }
    };

    (async () => {
      try {
        const prefersReduce = window.matchMedia?.(
          "(prefers-reduced-motion: reduce)"
        )?.matches;
        if (prefersReduce) return;

        const THREE = await import("three");
        const VANTA = await import("vanta/dist/vanta.fog.min");

        if (!mounted || !vantaRef.current) return;

        if (vantaEffectRef.current) {
          vantaEffectRef.current.destroy();
          vantaEffectRef.current = null;
        }

        const createVanta = (VANTA as any).default;
        vantaEffectRef.current = createVanta({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: hexToNum(theme.fog.highlight),
          midtoneColor: hexToNum(theme.fog.midtone),
          lowlightColor: hexToNum(theme.fog.lowlight),
          baseColor: hexToNum(theme.fog.base),
          blurFactor: theme.fog.blur,
          speed: theme.fog.speed,
          zoom: 1.0,
        });
      } catch (e) {
        console.error("Vanta init error:", e);
      }
    })();

    return () => {
      mounted = false;
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [
    theme.fog.highlight,
    theme.fog.midtone,
    theme.fog.lowlight,
    theme.fog.base,
    theme.fog.blur,
    theme.fog.speed,
  ]);

  // テーマの保存・復元
  useEffect(() => {
    // 初期読込
    if (!themeLoadedRef.current) {
      try {
        const raw = localStorage.getItem("loginTheme");
        if (raw) {
          const parsed = JSON.parse(raw);
          setTheme((prev) => ({
            ...prev,
            ...parsed,
            fog: { ...prev.fog, ...(parsed?.fog ?? {}) },
          }));
        }
      } catch {}
      themeLoadedRef.current = true;
      return;
    }

    // 変更の保存
    try {
      localStorage.setItem("loginTheme", JSON.stringify(theme));
    } catch {}
  }, [theme]);

  // 既ログインならホームへ
  useEffect(() => {
    if (auth?.isAuthenticated && auth?.user) {
      router.push("/");
    }
  }, [auth?.isAuthenticated, auth?.user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError("メールアドレスとパスワードを入力してください");
      return;
    }
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      if (user) {
        // バックエンドセッションとグローバル状態の整合をとる
        try {
          await initializeAuth();
        } catch {}
        // 状態反映を待ってから遷移（元実装に近い挙動）
        setTimeout(() => {
          router.push("/");
        }, 100);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* 背景層：Vanta を適用する div（フォールバックは静的グラデ） */}
      <div
        ref={vantaRef}
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% 10%, #ffffff 0%, #e8f1ff 30%, #dfe9ff 60%, #cfd6ff 100%)",
        }}
        aria-hidden
      />

      {/* 設定（カラー）パネル：右上にギア（右寄せ固定） */}
      <div className="absolute z-20 flex flex-col items-end top-4 right-4">
        <button
          type="button"
          onClick={() => setSettingsOpen((v) => !v)}
          className="px-2 py-2 text-gray-700 bg-white border border-gray-200 rounded-none shadow-sm hover:bg-gray-50"
          aria-label="カラー設定"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06A2 2 0 017.04 3.4l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.08a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c0 .67.39 1.27 1 1.51H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>

        {settingsOpen && (
          <div className="relative p-3 mt-2 border border-gray-200 rounded-none shadow-lg w-72 bg-white/95 backdrop-blur">
            <div className="mb-2 text-sm font-semibold text-gray-900">
              カラー設定
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <label className="text-gray-700">ボタン色</label>
                <input
                  type="color"
                  value={theme.primary}
                  onChange={(e) =>
                    setTheme((t) => ({ ...t, primary: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center justify-between gap-2">
                  <span className="text-gray-700">Highlight</span>
                  <input
                    type="color"
                    value={theme.fog.highlight}
                    onChange={(e) =>
                      setTheme((t) => ({
                        ...t,
                        fog: { ...t.fog, highlight: e.target.value },
                      }))
                    }
                  />
                </label>
                <label className="flex items-center justify-between gap-2">
                  <span className="text-gray-700">Midtone</span>
                  <input
                    type="color"
                    value={theme.fog.midtone}
                    onChange={(e) =>
                      setTheme((t) => ({
                        ...t,
                        fog: { ...t.fog, midtone: e.target.value },
                      }))
                    }
                  />
                </label>
                <label className="flex items-center justify-between gap-2">
                  <span className="text-gray-700">Lowlight</span>
                  <input
                    type="color"
                    value={theme.fog.lowlight}
                    onChange={(e) =>
                      setTheme((t) => ({
                        ...t,
                        fog: { ...t.fog, lowlight: e.target.value },
                      }))
                    }
                  />
                </label>
                <label className="flex items-center justify-between gap-2">
                  <span className="text-gray-700">Base</span>
                  <input
                    type="color"
                    value={theme.fog.base}
                    onChange={(e) =>
                      setTheme((t) => ({
                        ...t,
                        fog: { ...t.fog, base: e.target.value },
                      }))
                    }
                  />
                </label>
              </div>
              <div className="flex items-center gap-3">
                <label className="w-16 text-gray-700">速度</label>
                <input
                  type="range"
                  min={0.2}
                  max={2}
                  step={0.1}
                  value={theme.fog.speed}
                  onChange={(e) =>
                    setTheme((t) => ({
                      ...t,
                      fog: { ...t.fog, speed: Number(e.target.value) },
                    }))
                  }
                  className="flex-1"
                />
                <span className="w-10 text-right tabular-nums">
                  {theme.fog.speed.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="w-16 text-gray-700">ぼかし</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={theme.fog.blur}
                  onChange={(e) =>
                    setTheme((t) => ({
                      ...t,
                      fog: { ...t.fog, blur: Number(e.target.value) },
                    }))
                  }
                  className="flex-1"
                />
                <span className="w-10 text-right tabular-nums">
                  {theme.fog.blur.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-start pt-1">
                <button
                  type="button"
                  className="px-3 py-1.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-none"
                  onClick={() => setTheme(defaultTheme)}
                >
                  リセット
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 中央カード */}
      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col p-8 bg-white border border-gray-200 rounded-none shadow-2xl">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                アカウントにログイン
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                または{" "}
                <Link
                  href="/register"
                  className="font-semibold underline decoration-gray-300 hover:decoration-gray-600"
                >
                  新規アカウントを作成
                </Link>
              </p>
            </div>

            <div className="flex items-center flex-1">
              <form className="w-full mt-6 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      メールアドレス
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-3 py-2 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="メールアドレス"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      パスワード
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-3 py-2 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="パスワード"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {auth?.error && (
                  <div className="p-3 text-sm text-red-700 border border-red-200 rounded-none bg-red-50">
                    {auth.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full px-4 py-2 font-medium text-white transition rounded-none shadow-lg group focus:outline-none focus:ring-2 focus:ring-white/40 disabled:cursor-not-allowed disabled:opacity-60 hover:brightness-110"
                  style={{ backgroundColor: theme.primary }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      ログイン中…
                    </span>
                  ) : (
                    "ログイン"
                  )}
                </button>

                <div className="pt-2 text-xs text-center text-gray-600">
                  <div>テスト用アカウント：</div>
                  <div className="mt-1">
                    メール: test@example.com / パスワード: password123
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-6 text-xs text-center text-white/70">
            <span className="opacity-80">Powered by Vanta Fog</span>
          </div>
        </div>
      </div>
    </div>
  );
}

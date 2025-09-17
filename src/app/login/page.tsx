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

  const { auth, login, setAuthError, initializeAuth } = useAppStore();
  const router = useRouter();

  // === Vanta Fog 用 refs ===
  const vantaRef = useRef<HTMLDivElement | null>(null);
  const vantaEffectRef = useRef<any>(null);

  // Vanta Fog 初期化（クライアントのみ）
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // 低負荷配慮：reduce motion の人には適用しない
        const prefersReduce = window.matchMedia?.(
          "(prefers-reduced-motion: reduce)"
        )?.matches;
        if (prefersReduce) return;

        // dynamic import で SSR を回避
        const THREE = await import("three");
        const VANTA = await import("vanta/dist/vanta.fog.min");

        if (!mounted || !vantaRef.current) return;

        // 既存があれば破棄（ホットリロード対策）
        if (vantaEffectRef.current) {
          vantaEffectRef.current.destroy();
          vantaEffectRef.current = null;
        }

        // VANTA は default export
        const createVanta = (VANTA as any).default;
        vantaEffectRef.current = createVanta({
          el: vantaRef.current,
          THREE, // three のモジュールをそのまま渡す
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0xffffff, // 白
          midtoneColor: 0x00fff0, // 薄いシアン（0xfff0 は桁不足）
          lowlightColor: 0x2d00fc, // 青紫
          baseColor: 0xfafafa, // 明るいグレー
          blurFactor: 0.6,
          speed: 1.2,
          zoom: 1.0,
        });
      } catch (e) {
        // 読み込み失敗時は静的グラデ背景のまま
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
  }, []);

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
                  className="relative w-full px-4 py-2 font-medium text-white transition rounded-none shadow-lg group bg-blue-600/90 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:cursor-not-allowed disabled:opacity-60"
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

/**
 * アカウント登録ページ
 *
 * バックエンドAPIと連携してユーザー登録を行う
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/authService";
import { useAppStore } from "@/lib/store";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const { auth } = useAppStore();

  // Vanta Fog refs
  const vantaRef = useRef<HTMLDivElement | null>(null);
  const vantaEffectRef = useRef<any>(null);

  // Vanta Fog 初期化（ログイン画面と同仕様）
  useEffect(() => {
    let mounted = true;
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
          highlightColor: 0xffffff,
          midtoneColor: 0x00fff0,
          lowlightColor: 0x2d00fc,
          baseColor: 0xfafafa,
          blurFactor: 0.6,
          speed: 1.2,
          zoom: 1.0,
        });
      } catch (e) {
        console.error("Vanta init error (register):", e);
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

  // 既にログイン済みの場合はメインページにリダイレクト
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      router.push("/");
    }
  }, [auth.isAuthenticated, auth.user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // エラーをクリア
    if (error) setError(null);
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("すべての項目を入力してください");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("パスワードが一致しません");
      return false;
    }

    if (formData.password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await authService.register(formData);
      setSuccess(true);

      // 2秒後にログインページにリダイレクト
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "アカウント作成に失敗しました";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen">
        {/* 背景層 */}
        <div
          ref={vantaRef}
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 600px at 10% 10%, #ffffff 0%, #e8f1ff 30%, #dfe9ff 60%, #cfd6ff 100%)",
          }}
          aria-hidden
        />
        <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                アカウント作成完了
              </h2>
              <p className="mt-2 text-sm text-center text-gray-600">
                アカウントが正常に作成されました。
                <br />
                ログインページに移動しています...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* 背景層：Vanta */}
      <div
        ref={vantaRef}
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% 10%, #ffffff 0%, #e8f1ff 30%, #dfe9ff 60%, #cfd6ff 100%)",
        }}
        aria-hidden
      />

      {/* ブランド：SP=上中央 / PC=左上（大きめ） */}
      <div className="absolute z-20 text-3xl font-bold tracking-tight text-black -translate-x-1/2 top-6 left-1/2 sm:left-4 sm:translate-x-0 sm:text-5xl">
        ChronoVoice
      </div>

      {/* 中央カード */}
      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col p-8 bg-white border border-gray-200 rounded-none shadow-2xl">
            <div className="text-center">
              <div className="flex flex-col">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  新規アカウント作成
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  または{" "}
                  <Link
                    href="/login"
                    className="font-semibold underline decoration-gray-300 hover:decoration-gray-600"
                  >
                    既存アカウントでログイン
                  </Link>
                </p>
              </div>
              <div className="flex items-center flex-1">
                <form className="w-full mt-6 space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="sr-only">
                        お名前
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="山田太郎"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    </div>

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
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
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
                        placeholder="6文字以上"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="sr-only">
                        パスワード確認
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="w-full px-3 py-2 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="パスワードを再入力"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-700 border border-red-200 rounded-none bg-red-50">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-full px-4 py-2 font-medium text-white transition rounded-none shadow-lg group bg-blue-600/90 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
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
                        アカウント作成中...
                      </span>
                    ) : (
                      "アカウント作成"
                    )}
                  </button>
                </form>
              </div>
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

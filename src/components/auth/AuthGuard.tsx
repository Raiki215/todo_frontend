/**
 * 認証ガードコンポーネント
 *
 * 未認証ユーザーをログインページにリダイレクト
 * 認証が必要なページで使用する
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { auth, initializeAuth } = useAppStore();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);

  useEffect(() => {
    // ページの最初のロード時に認証状態を確認する
    const verifyAuth = async () => {
      setIsVerifyingAuth(true);

      // 既に認証済みの場合は初期化をスキップ
      if (auth.isAuthenticated && auth.user) {
        setHasInitialized(true);
        setIsVerifyingAuth(false);
        return;
      }

      // 初回マウント時のみ認証を初期化
      if (!hasInitialized && !auth.isLoading) {
        setHasInitialized(true);
        await initializeAuth();
      }

      setIsVerifyingAuth(false);
    };

    verifyAuth();
  }, [
    initializeAuth,
    hasInitialized,
    auth.isAuthenticated,
    auth.isLoading,
    auth.user,
  ]);

  useEffect(() => {
    // ローディング中は何もしない
    if (auth.isLoading) {
      return;
    }

    // 未認証かつ初期化が完了している場合のみログインページにリダイレクト
    if (!auth.isAuthenticated && hasInitialized) {
      router.push("/login");
    }
  }, [auth.isAuthenticated, auth.isLoading, hasInitialized, router]);

  // ローディング中の表示
  if (auth.isLoading || isVerifyingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">認証状態を確認中...</p>
        </div>
      </div>
    );
  }

  // 未認証の場合は何も表示しない（リダイレクト中）
  if (!auth.isAuthenticated && hasInitialized) {
    return null;
  }

  // 認証済みの場合は子コンポーネントを表示
  return <>{children}</>;
}

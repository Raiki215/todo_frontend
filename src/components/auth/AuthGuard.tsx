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

  useEffect(() => {
    // 既に認証済みの場合は初期化をスキップ
    if (auth.isAuthenticated && auth.user) {
      setHasInitialized(true);
      return;
    }

    // 初回マウント時のみ認証を初期化
    if (!hasInitialized && !auth.isLoading) {
      setHasInitialized(true);
      initializeAuth();
    }
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

    // 未認証の場合はログインページにリダイレクト
    if (!auth.isAuthenticated) {
      router.push("/login");
    }
  }, [auth.isAuthenticated, auth.isLoading, router]);

  // ローディング中の表示
  if (auth.isLoading) {
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
  if (!auth.isAuthenticated) {
    return null;
  }

  // 認証済みの場合は子コンポーネントを表示
  return <>{children}</>;
}

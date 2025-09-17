/**
 * アプリケーションヘッダーコンポーネント
 *
 * アプリケーション上部に表示される共通ヘッダー
 * タイトル表示と基本的な操作を提供
 */

"use client";

import React, { useState, useEffect } from "react";
import NotificationButton from "@/components/common/NotificationButton";
import NotificationPanel from "@/components/common/NotificationPanel";
import Drawer from "@/components/layout/Drawer";
import SidePanel from "@/components/layout/SidePanel";
import { useAppStore } from "@/lib/store";

/**
 * ユーザーメニューコンポーネント
 * ユーザー情報表示とログアウト機能
 */
function UserMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const { auth, logout } = useAppStore();

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
  };

  if (!auth.user) {
    return null;
  }

  return (
    <div className="relative">
      {/* ユーザーアバター */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center px-3 py-2 space-x-2 text-sm bg-white border border-gray-200 rounded-full hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-blue-500 rounded-full">
          {auth.user.name.charAt(0)}
        </div>
        <span className="hidden text-gray-700 sm:block">{auth.user.name}</span>
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* ドロップダウンメニュー */}
      {showMenu && (
        <div className="absolute right-0 z-50 w-48 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
              <div className="font-medium text-gray-900">{auth.user.name}</div>
              <div className="text-xs">{auth.user.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              ログアウト
            </button>
          </div>
        </div>
      )}

      {/* メニュー外クリック時のオーバーレイ */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}

/**
 * アプリケーションヘッダー
 * タイトル、通知ボタン、通知パネルを表示
 */
export default function AppHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendarDrawer, setShowCalendarDrawer] = useState(false);
  // 新しいstore体系では通知機能は自動的に初期化される

  return (
    <header className="relative bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto w-full md:w-[clamp(720px,92vw,1400px)] lg:w-[clamp(1040px,92vw,1400px)] px-4 sm:px-6 xl:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* 左側：ハンバーガーメニュー（モバイルのみ）とタイトル */}
          <div className="flex items-center space-x-3">
            {/* カレンダーボタン（モバイルのみ） */}
            <button
              onClick={() => setShowCalendarDrawer(true)}
              className="p-2 text-gray-600 hover:text-gray-900 lg:hidden"
              aria-label="カレンダーを開く"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
            </button>

            {/* アプリタイトル */}
            <h1 className="text-xl font-bold text-gray-900">Limitly</h1>
          </div>

          {/* 右側のメニューエリア */}
          <div className="flex items-center space-x-2">
            {/* ユーザー情報とログアウト */}
            <UserMenu />

            {/* 通知ボタン */}
            <NotificationButton
              onClick={() => setShowNotifications(!showNotifications)}
              isActive={showNotifications}
            />
          </div>
        </div>
      </div>

      {/* 通知パネル */}
      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}

      {/* カレンダードロワー（モバイル用） */}
      <Drawer
        open={showCalendarDrawer}
        onClose={() => setShowCalendarDrawer(false)}
        title="カレンダーとタスク"
      >
        <SidePanel onDateSelect={() => setShowCalendarDrawer(false)} />
      </Drawer>
    </header>
  );
}

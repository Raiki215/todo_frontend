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
            <h1 className="text-xl font-bold text-gray-900">TODO App</h1>
          </div>

          {/* 右側のメニューエリア */}
          <div className="flex items-center space-x-2">
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
        <SidePanel />
      </Drawer>
    </header>
  );
}

// src/components/layout/AppHeader.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Drawer from "@/components/layout/Drawer";
import SidePanel from "@/components/layout/SidePanel";
import NotificationPanel from "@/components/common/NotificationPanel";
import { useTaskStore } from "@/lib/store";

export default function AppHeader() {
  const [open, setOpen] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const { unreadCount } = useTaskStore(); // ストアから直接取得
  const notificationRef = useRef<HTMLDivElement>(null);

  // 外側クリック検知
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotificationPanel(false);
      }
    }

    if (showNotificationPanel) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showNotificationPanel]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="mx-auto w-full md:w-[clamp(720px,92vw,1400px)] lg:w-[clamp(1040px,92vw,1400px)] px-4 sm:px-6 xl:px-8">
          <div className="flex items-center justify-between gap-4 h-14">
            {/* 左：ハンバーガー（lg未満のみ）＋ロゴ＋今日へ戻る */}
            <div className="flex items-center gap-3">
              <button
                className="p-2 -ml-1 rounded-lg lg:hidden hover:bg-gray-100"
                aria-label="メニューを開く"
                onClick={() => setOpen(true)}
              >
                <span className="block h-0.5 w-5 bg-gray-800 mb-1" />
                <span className="block h-0.5 w-5 bg-gray-800 mb-1" />
                <span className="block h-0.5 w-5 bg-gray-800" />
              </button>
              <div className="text-2xl font-extrabold tracking-wide select-none">
                <span className="inline-block -skew-x-6">TaskFlow</span>
              </div>
              <button className="hidden text-sm text-gray-600 sm:inline-block hover:text-gray-900">
                今日へ戻る
              </button>
            </div>

            {/* 右：通知のみ */}
            <div className="flex items-center gap-3">
              <div className="relative" ref={notificationRef}>
                <button
                  id="notifyBtn"
                  onClick={() =>
                    setShowNotificationPanel(!showNotificationPanel)
                  }
                  className={`relative rounded-lg border p-2 transition-colors ${
                    showNotificationPanel
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {/* ベルアイコン */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  {/* NotificationPanelと同じ形式の通知数表示（右上に配置） */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 px-1 py-0.5 text-xs bg-red-500 text-white rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* 通知パネル */}
                {showNotificationPanel && (
                  <NotificationPanel
                    onClose={() => setShowNotificationPanel(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* モバイル用ドロワー */}
      <Drawer open={open} onClose={() => setOpen(false)} title="メニュー">
        <SidePanel />
      </Drawer>
    </>
  );
}

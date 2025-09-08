// src/components/layout/AppHeader.tsx
"use client";

import { useState } from "react";
import Drawer from "@/components/layout/Drawer";
import SidePanel from "@/components/layout/SidePanel";

export default function AppHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto w-full md:w-[clamp(720px,92vw,1400px)] lg:w-[clamp(1040px,92vw,1400px)] px-4 sm:px-6 xl:px-8">
          <div className="h-14 flex items-center justify-between gap-4">
            {/* 左：ハンバーガー（lg未満のみ）＋ロゴ＋今日へ戻る */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden -ml-1 p-2 rounded-lg hover:bg-gray-100"
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
              <button className="hidden sm:inline-block text-sm text-gray-600 hover:text-gray-900">
                今日へ戻る
              </button>
            </div>

            {/* 右：通知のみ */}
            <div className="flex items-center gap-3">
              <button
                id="notifyBtn"
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                通知
              </button>
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

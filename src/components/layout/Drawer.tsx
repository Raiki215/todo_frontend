// src/components/layout/Drawer.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function Drawer({
  open,
  onClose,
  title,
  children,
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;
  return createPortal(
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        className={`absolute left-0 top-0 h-full w-[320px] sm:w-[360px] bg-white shadow-xl border-r border-gray-200
        transition-transform duration-200 will-change-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "メニュー"}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="閉じる"
          >
            ×
          </button>
          <div className="text-sm font-semibold">{title ?? "メニュー"}</div>
          <div className="w-6"></div> {/* 右側のバランス調整用スペーサー */}
        </div>
        <div className="p-3 overflow-y-auto h-[calc(100%-56px)]">
          {children}
        </div>
      </aside>
    </div>,
    document.body
  );
}

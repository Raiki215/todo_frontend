"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  onMoveToTomorrow: () => void;
};

export default function KebabMenu({
  onEdit,
  onDelete,
  onMoveToTomorrow,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => setMounted(true), []);

  // ボタン位置を取得してメニュー位置を計算
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 160, // メニュー幅160pxから逆算
      });
    }
  }, [isOpen]);

  // クリック外でメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleMenuClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* 3つの点ボタン */}
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="p-1 text-gray-400 rounded hover:text-gray-600"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      {/* ドロップダウンメニューをPortalでレンダリング */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            className="fixed z-50 w-40 py-1 bg-white border border-gray-200 rounded-lg shadow-lg"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >
            <button
              onClick={() => handleMenuClick(onEdit)}
              className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              編集
            </button>

            <button
              onClick={() => handleMenuClick(onMoveToTomorrow)}
              className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              翌日にする
            </button>

            <hr className="my-1 border-gray-200" />

            <button
              onClick={() => handleMenuClick(onDelete)}
              className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3,6 5,6 21,6" />
                <path d="m19,6v14a2,2 0 0 1-2,2H7a2,2 0 0 1-2-2V6m3,0V4a2,2 0 0 1 2-2h4a2,2 0 0 1 2,2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              削除
            </button>
          </div>,
          document.body
        )}
    </>
  );
}

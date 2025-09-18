"use client";

import { useState } from "react";
import { useAuthTheme } from "@/hooks/useAuthTheme";

export default function AuthThemeSettings() {
  const { theme, setTheme, reset, defaultTheme } = useAuthTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute z-20 flex flex-col items-end top-4 right-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="px-2 py-2 text-gray-700 bg-white border border-gray-200 rounded-none shadow-sm hover:bg-gray-50"
        aria-label="カラー設定"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06A2 2 0 017.04 3.4l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.08a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c0 .67.39 1.27 1 1.51H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      </button>

      {open && (
        <div className="relative p-3 mt-2 border border-gray-200 rounded-none shadow-lg w-72 bg-white/95 backdrop-blur">
          <div className="mb-2 text-sm font-semibold text-gray-900">
            カラー設定
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <label className="text-gray-700">ボタン色</label>
              <input
                type="color"
                value={theme.primary}
                onChange={(e) =>
                  setTheme((t) => ({ ...t, primary: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center justify-between gap-2">
                <span className="text-gray-700">Highlight</span>
                <input
                  type="color"
                  value={theme.fog.highlight}
                  onChange={(e) =>
                    setTheme((t) => ({
                      ...t,
                      fog: { ...t.fog, highlight: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="text-gray-700">Midtone</span>
                <input
                  type="color"
                  value={theme.fog.midtone}
                  onChange={(e) =>
                    setTheme((t) => ({
                      ...t,
                      fog: { ...t.fog, midtone: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="text-gray-700">Lowlight</span>
                <input
                  type="color"
                  value={theme.fog.lowlight}
                  onChange={(e) =>
                    setTheme((t) => ({
                      ...t,
                      fog: { ...t.fog, lowlight: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="text-gray-700">Base</span>
                <input
                  type="color"
                  value={theme.fog.base}
                  onChange={(e) =>
                    setTheme((t) => ({
                      ...t,
                      fog: { ...t.fog, base: e.target.value },
                    }))
                  }
                />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <label className="w-16 text-gray-700">速度</label>
              <input
                type="range"
                min={0.2}
                max={2}
                step={0.1}
                value={theme.fog.speed}
                onChange={(e) =>
                  setTheme((t) => ({
                    ...t,
                    fog: { ...t.fog, speed: Number(e.target.value) },
                  }))
                }
                className="flex-1"
              />
              <span className="w-10 text-right tabular-nums">
                {theme.fog.speed.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <label className="w-16 text-gray-700">ぼかし</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={theme.fog.blur}
                onChange={(e) =>
                  setTheme((t) => ({
                    ...t,
                    fog: { ...t.fog, blur: Number(e.target.value) },
                  }))
                }
                className="flex-1"
              />
              <span className="w-10 text-right tabular-nums">
                {theme.fog.blur.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-start pt-1">
              <button
                type="button"
                className="px-3 py-1.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-none"
                onClick={reset}
              >
                リセット
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

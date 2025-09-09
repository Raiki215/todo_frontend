"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

/** ダイアログから返すドラフト型（保存先は後で配線） */
export type TaskDraft = {
  title: string;
  dueAt?: string | null; // ISO (例: "2025-09-05T14:00:00")
  importance: number; // 1..5
  estimatedMinutes?: number | null;
  tags: string[]; // ["仕事","重要"]
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (draft: TaskDraft) => void; // 後で接続
};

export default function TaskCreateDialog({ open, onClose, onSubmit }: Props) {
  // ---- フォーム状態 ----
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<string>(""); // YYYY-MM-DD
  const [dueTime, setDueTime] = useState<string>(""); // HH:mm
  const [importance, setImportance] = useState(3);
  const [estimate, setEstimate] = useState<string>(""); // 表示は文字列で保持
  const [tagsInput, setTagsInput] = useState("");

  // 開いたら初期化
  useEffect(() => {
    if (!open) return;
    setTitle("");
    setDueDate("");
    setDueTime("");
    setImportance(3);
    setEstimate("");
    setTagsInput("");
  }, [open]);

  // キーボード（Escで閉じる / Cmd/Ctrl+Enterで追加）
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, title, dueDate, dueTime, importance, estimate, tagsInput]);

  const applyPreset = (p: {
    label: string;
    title: string;
    est: number;
    imp: number;
    tag: string;
  }) => {
    setTitle((v) => v || p.title);
    setEstimate((v) => (v ? v : String(p.est)));
    setImportance((_) => p.imp);
    setTagsInput((v) => (v ? `${v}, ${p.tag}` : p.tag));
  };

  const presets = [
    { label: "会議", title: "チーム会議", est: 60, imp: 4, tag: "仕事" },
    {
      label: "買い物",
      title: "買い出し・日用品",
      est: 30,
      imp: 2,
      tag: "生活",
    },
    { label: "運動", title: "ジョギング・ジム", est: 45, imp: 3, tag: "健康" },
    { label: "勉強", title: "学習・資格", est: 60, imp: 4, tag: "学習" },
  ];

  const handleSubmit = () => {
    const tags = tagsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const dueAt = dueDate ? `${dueDate}T${dueTime || "23:59"}` : null;

    const draft: TaskDraft = {
      title: title.trim() || "無題",
      dueAt,
      importance,
      estimatedMinutes: estimate ? Number(estimate) : null,
      tags,
    };

    onSubmit?.(draft);
    onClose();
  };

  // Portal mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dialogId = useId();

  // mountされていない、またはopenがfalseの時は何も表示しない
  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 transition-opacity opacity-100 bg-black/30"
        onClick={onClose}
      />
      {/* panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${dialogId}-title`}
        className="absolute left-1/2 top-1/2 w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white shadow-xl transition-transform scale-100"
      >
        {/* header */}
        <div className="flex items-center justify-between h-12 px-4 border-b border-gray-200">
          <div id={`${dialogId}-title`} className="text-sm font-semibold">
            新しいタスクを追加
          </div>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="text-gray-500 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        {/* body */}
        <div className="p-4 space-y-4">
          {/* クイック入力 */}
          <div className="grid grid-cols-2 gap-3">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="px-3 py-3 text-left border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                <div className="text-sm font-medium">{p.label}</div>
                <div className="mt-1 text-xs text-gray-500">{p.title}</div>
              </button>
            ))}
          </div>

          {/* タスク名 */}
          <div>
            <label className="block text-sm text-gray-700">タスク名</label>
            <input
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg"
              placeholder="例：プレゼン資料の作成"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 締切（任意） */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700">締切日</label>
              <input
                type="date"
                className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">時刻</label>
              <input
                type="time"
                className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          {/* 優先度（スライダー） */}
          <div>
            <label className="block text-sm text-gray-700">
              優先度: <span className="font-semibold">{importance}</span>
            </label>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={importance}
              onChange={(e) => setImportance(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          {/* 予想時間・タグ */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700">
                予想時間（分）
              </label>
              <input
                type="number"
                min={1}
                className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg"
                placeholder="30"
                value={estimate}
                onChange={(e) => setEstimate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">
                タグ（カンマ区切り）
              </label>
              <input
                className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg"
                placeholder="仕事, 重要, 健康"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200">
          <button
            className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            className="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={handleSubmit}
          >
            タスクを追加
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

"use client";

import { useEffect, useId, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { getCurrentDate, getCurrentTime } from "@/utils/dateTime";
import TagsManager from "@/utils/TagsManager";

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

  // input要素への参照
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // 開いたら初期化（現在時刻をデフォルトに設定）
  useEffect(() => {
    if (!open) return;
    setTitle("");
    setDueDate(getCurrentDate());
    setDueTime(getCurrentTime());
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

  // アイコン（インラインSVG）
  const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
  const CartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M6 6L5 3H3" />
    </svg>
  );
  const DumbbellIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M3 14v-4M7 16V8M17 16V8M21 14v-4" />
      <path d="M7 12h10" />
    </svg>
  );
  const BookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4h16v13H6.5A2.5 2.5 0 0 0 4 19.5z" />
    </svg>
  );

  type Preset = {
    label: string;
    title: string;
    est: number;
    imp: number;
    tag: string;
    color: {
      bg: string; // ボタン背景
      ring: string; // 枠線色
      text: string; // 主要テキスト色
      iconBg: string; // アイコン背景
      iconText: string; // アイコン色
      hover: string; // hover背景
    };
    icon: React.ReactNode;
  };

  const presets: Preset[] = [
    {
      label: "会議",
      title: "チーム会議",
      est: 60,
      imp: 4,
      tag: "仕事",
      color: {
        bg: "bg-blue-50",
        ring: "ring-blue-200",
        text: "text-blue-900",
        iconBg: "bg-blue-100",
        iconText: "text-blue-600",
        hover: "hover:bg-blue-100",
      },
      icon: <CalendarIcon className="w-5 h-5" />,
    },
    {
      label: "買い物",
      title: "買い出し・日用品",
      est: 30,
      imp: 2,
      tag: "生活",
      color: {
        bg: "bg-emerald-50",
        ring: "ring-emerald-200",
        text: "text-emerald-900",
        iconBg: "bg-emerald-100",
        iconText: "text-emerald-600",
        hover: "hover:bg-emerald-100",
      },
      icon: <CartIcon className="w-5 h-5" />,
    },
    {
      label: "運動",
      title: "ジョギング・ジム",
      est: 45,
      imp: 3,
      tag: "健康",
      color: {
        bg: "bg-orange-50",
        ring: "ring-orange-200",
        text: "text-orange-900",
        iconBg: "bg-orange-100",
        iconText: "text-orange-600",
        hover: "hover:bg-orange-100",
      },
      icon: <DumbbellIcon className="w-5 h-5" />,
    },
    {
      label: "勉強",
      title: "学習・資格",
      est: 60,
      imp: 4,
      tag: "学習",
      color: {
        bg: "bg-purple-50",
        ring: "ring-purple-200",
        text: "text-purple-900",
        iconBg: "bg-purple-100",
        iconText: "text-purple-600",
        hover: "hover:bg-purple-100",
      },
      icon: <BookIcon className="w-5 h-5" />,
    },
  ];

  const handleSubmit = async () => {
    const tags = tagsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const dueAt = dueDate ? `${dueDate}T${dueTime || "23:59"}` : null;

    const response = await fetch("http://127.0.0.1:5000/manual_insert_todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo: title.trim(),
        deadline: dueAt,
        priority: importance,
        estimated_time: estimate ? Number(estimate) : null,
        tags,
      }),
      credentials: "include",
    });

    if (response.status === 401) {
      alert("ログインしてください");
    } else if (response.status === 201) {
      const data = await response.json();
      const todo = data.todo;
      const draft: TaskDraft = {
        title: title.trim() || "無題",
        dueAt,
        importance,
        estimatedMinutes: estimate ? Number(estimate) : null,
        tags,
      };

      console.log("タスク作成: バックエンドからの応答:", todo);

      // バックエンドから返されたタグ一覧があれば更新
      if (todo.all_tags) {
        try {
          console.log("タスク作成: タグ一覧を更新します:", todo.all_tags);
          TagsManager.updateTags(todo.all_tags);
        } catch (error) {
          console.error("タスク作成: タグの更新に失敗しました:", error);
        }
      } else {
        console.warn(
          "タスク作成: バックエンドからタグ一覧が返されませんでした"
        );
      }
      onSubmit?.(draft);
      onClose();
    }
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
        <div className="flex items-center justify-between h-12 px-2 sm:px-4 border-b border-gray-200">
          <div id={`${dialogId}-title`} className="text-sm font-semibold">
            新しいタスクを追加
          </div>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="flex items-center justify-center w-10 h-10 -m-1 sm:-m-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              ×
            </span>
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
                className={`flex items-center gap-3 px-3 py-3 text-left rounded-xl ring-1 ${p.color.ring} ${p.color.bg} ${p.color.hover}`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${p.color.iconBg} ${p.color.iconText}`}
                >
                  {p.icon}
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-medium ${p.color.text}`}>
                    {p.label}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-600 truncate">
                    {p.title}
                  </div>
                </div>
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
              <div
                className="relative mt-1 cursor-pointer"
                onClick={() => dateInputRef.current?.showPicker?.()}
              >
                <input
                  ref={dateInputRef}
                  type="date"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <div className="absolute inset-0 rounded-lg pointer-events-none"></div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700">時刻</label>
              <div
                className="relative mt-1 cursor-pointer"
                onClick={() => timeInputRef.current?.showPicker?.()}
              >
                <input
                  ref={timeInputRef}
                  type="time"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                />
                <div className="absolute inset-0 rounded-lg pointer-events-none"></div>
              </div>
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

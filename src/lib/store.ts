// lib/store.ts
"use client";
import { create } from "zustand";
import type { Task } from "./types";
import { todayStr } from "./date";

type State = {
  selectedDate: string;
  tasks: Task[];
  highlightTaskId: string | null;
  setDate: (d: string) => void;
  setHighlightTaskId: (id: string | null) => void;
};

const seed: Task[] = [
  {
    id: "a",
    title: "資料作成",
    date: todayStr(),
    time: "15:00",
    priority: 5,
    status: "未完了",
    duration: 120,
    tags: ["仕事"],
  },
  {
    id: "b",
    title: "運動",
    date: todayStr(),
    time: "19:30",
    priority: 4,
    status: "未完了",
    duration: 60,
    tags: ["健康"],
  },
  {
    id: "c",
    title: "メール",
    date: todayStr(),
    time: "11:30",
    priority: 3,
    status: "未完了",
    duration: 15,
    tags: ["仕事"],
  },
  {
    id: "d",
    title: "買い物",
    date: fmtOffset(1),
    priority: 2,
    status: "未完了",
    duration: 45,
    tags: ["生活"],
  },
  {
    id: "e",
    title: "レビュー",
    date: fmtOffset(2),
    priority: 4,
    status: "未完了",
    duration: 30,
    tags: ["仕事"],
  },
  {
    id: "f",
    title: "学習",
    date: fmtOffset(5),
    priority: 1,
    status: "未完了",
    duration: 90,
    tags: ["勉強"],
  },
  // 追加のテストデータ
  {
    id: "g",
    title: "プレゼン準備",
    date: todayStr(),
    time: "10:00",
    priority: 5,
    status: "未完了",
    duration: 180,
    tags: ["仕事", "重要"],
  },
  {
    id: "h",
    title: "会議参加",
    date: todayStr(),
    time: "14:00",
    priority: 4,
    status: "未完了",
    duration: 90,
    tags: ["仕事"],
  },
  {
    id: "i",
    title: "家事",
    date: todayStr(),
    time: "20:00",
    priority: 2,
    status: "未完了",
    duration: 60,
    tags: ["生活"],
  },
  {
    id: "j",
    title: "読書",
    date: fmtOffset(1),
    time: "21:00",
    priority: 3,
    status: "未完了",
    duration: 45,
    tags: ["趣味"],
  },
  {
    id: "k",
    title: "システム設計",
    date: fmtOffset(1),
    time: "09:00",
    priority: 5,
    status: "未完了",
    duration: 240,
    tags: ["仕事", "技術"],
  },
  {
    id: "l",
    title: "病院予約",
    date: fmtOffset(3),
    time: "16:00",
    priority: 4,
    status: "未完了",
    duration: 120,
    tags: ["健康"],
  },
  {
    id: "m",
    title: "英語学習",
    date: fmtOffset(4),
    time: "18:00",
    priority: 3,
    status: "未完了",
    duration: 60,
    tags: ["勉強"],
  },
  {
    id: "n",
    title: "コード修正",
    date: fmtOffset(-1),
    time: "13:00",
    priority: 5,
    status: "未完了",
    duration: 90,
    tags: ["仕事", "技術"],
  },
  {
    id: "o",
    title: "掃除",
    date: fmtOffset(6),
    time: "10:00",
    priority: 2,
    status: "未完了",
    duration: 90,
    tags: ["生活"],
  },
];

function fmtOffset(deltaDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + deltaDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const useTaskStore = create<State>((set) => ({
  selectedDate: todayStr(),
  tasks: seed,
  highlightTaskId: null,
  setDate: (d) => set({ selectedDate: d }),
  setHighlightTaskId: (id) => set({ highlightTaskId: id }),
}));

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
  // 別日にもいくつか置いておくとバッジが見やすい
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
];

function fmtOffset(deltaDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

export const useTaskStore = create<State>((set) => ({
  selectedDate: todayStr(),
  tasks: seed,
  highlightTaskId: null,
  setDate: (d) => set({ selectedDate: d }),
  setHighlightTaskId: (id) => set({ highlightTaskId: id }),
}));

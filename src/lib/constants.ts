/** 優先度→縦バー色のマッピング（1=低〜5=高） */
export const PRIORITY_BAR_CLASS: Record<number, string> = {
  1: "bg-emerald-500",
  2: "bg-lime-500",
  3: "bg-amber-500",
  4: "bg-orange-500",
  5: "bg-red-500",
};

export const priorityBarClass = (p: number) =>
  PRIORITY_BAR_CLASS[Math.min(5, Math.max(1, Math.round(p)))] ?? "bg-gray-300";

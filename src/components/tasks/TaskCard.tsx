import { priorityBarClass } from "@/lib/constants";

/**
 * 見た目用のタスクカード。
 * 左端に優先度カラーの縦バーを表示。
 */
export default function TaskCard({
  title,
  time,
  priority = 3,
  duration,
  tags,
}: {
  title: string;
  time?: string;
  priority?: number; // 1..5
  duration?: number;
  tags?: string[];
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* 優先度バー */}
      <div
        className={`absolute left-0 top-0 h-full w-1.5 ${priorityBarClass(
          priority
        )}`}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="flex-1">
          <div className="font-semibold text-gray-800">{title}</div>
          <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-2 items-center">
            {time && <span>{time}</span>}
            <span>{"⭐️".repeat(priority ?? 3)}</span>
            {duration && <span>{duration}分</span>}
          </div>
          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-gray-600">⋯</button>
          <input type="checkbox" className="h-5 w-5 rounded border-gray-300" />
        </div>
      </div>
    </div>
  );
}

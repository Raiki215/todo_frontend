/**
 * タスクタグ表示コンポーネント
 * 
 * タスクに関連付けられたタグを表示
 * 読みやすい形式でタグを配置
 */

"use client";

interface TaskTagsProps {
  /** タグの配列 */
  tags: string[];
}

/**
 * タスクタグ表示
 * グレーの背景で読みやすく表示
 */
export default function TaskTags({ tags }: TaskTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

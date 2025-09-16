/**
 * タスクタグ表示コンポーネント
 *
 * タスクに関連付けられたタグを表示
 * 読みやすい形式でタグを配置
 */

"use client";

// タグ型定義
interface Tag {
  id: string;
  name: string;
}

interface TaskTagsProps {
  /** タグの配列 - 文字列またはタグオブジェクト */
  tags: (string | Tag)[];
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
      {tags.map((tag, index) => {
        // タグがオブジェクトの場合
        if (typeof tag === "object" && tag !== null && "id" in tag) {
          return (
            <span
              key={tag.id}
              className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
            >
              {tag.name}
            </span>
          );
        }
        // タグが文字列の場合（従来の互換性維持）
        else {
          return (
            <span
              key={`${tag}-${index}`}
              className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
            >
              {tag}
            </span>
          );
        }
      })}
    </div>
  );
}

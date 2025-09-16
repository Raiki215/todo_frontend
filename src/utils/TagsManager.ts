// src/utils/TagsManager.ts
import { Tag } from "@/components/filters/FilterBar";

/**
 * タグ管理用シングルトン
 * - コンポーネント間でタグ情報を共有するためのユーティリティ
 * - タスク作成/編集時に新しいタグ一覧を受け取り、FilterBarコンポーネントに通知
 */
export const TagsManager = {
  // タグを更新する関数の参照（FilterBarコンポーネントからセット）
  updateTagsFunction: null as ((tags: Tag[]) => void) | null,

  // 初回のタグ取得
  fetchTags: async function (): Promise<Tag[]> {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_tags", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log("TagsManager: タグ一覧を取得:", data.tags);
        return data.tags || [];
      }
    } catch (error) {
      console.error("TagsManager: タグの取得に失敗しました:", error);
    }
    return [];
  },

  // バックエンドから返された新しいタグ一覧で更新
  // 以前のタグを削除して、新しいタグを設定する
  updateTags: function (tags: Tag[]) {
    console.log("TagsManager: タグ一覧を更新します:", tags);

    if (!tags || !Array.isArray(tags)) {
      console.error("TagsManager: 無効なタグデータです:", tags);
      return;
    }

    if (this.updateTagsFunction) {
      // 直接新しいタグの配列を設定
      // Reactのステート更新は置き換えなので、実質的に前のタグは削除される
      this.updateTagsFunction(tags);
      console.log(
        "TagsManager: タグを更新しました。新しいタグ数:",
        tags.length
      );
    } else {
      console.warn("TagsManager: 更新関数が設定されていません");
    }
  },
};

export default TagsManager;

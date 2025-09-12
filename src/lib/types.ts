/**
 * アプリケーション全体で使用される型定義
 *
 * Task、Notification、その他のエンティティの型を定義
 * バックエンドAPIとの連携時はこの型定義を基準とする
 */

/**
 * タスクのステータス種別
 */
export type Status = "未完了" | "完了" | "キャンセル";

/**
 * タスクエンティティ
 * アプリケーションの中核となるデータ構造
 */
export interface Task {
  /** タスクの一意識別子 */
  id: string;
  /** タスクのタイトル */
  title: string;
  /** 期限日 (YYYY-MM-DD形式) */
  date: string;
  /** 期限時刻 (HH:mm形式、省略可能) */
  time?: string;
  /** 優先度 (1: 最低 ～ 5: 最重要) */
  priority: number;
  /** 現在のステータス */
  status: Status;
  /** 予想所要時間（分単位、省略可能） */
  duration?: number;
  /** タスクに付与されたタグ（省略可能） */
  tags?: string[];
}

/**
 * 通知の種別
 */
export type NotificationType = "30min-warning" | "overdue";

/**
 * 通知エンティティ
 * ユーザーへの通知情報を管理
 */
export interface Notification {
  /** 通知の一意識別子 */
  id: string;
  /** 通知の種別 */
  type: NotificationType;
  /** 関連するタスク */
  task: Task;
  /** 通知生成日時 */
  timestamp: Date;
  /** 通知メッセージ */
  message: string;
  /** 既読フラグ */
  isRead: boolean;
}

/**
 * タスク作成時の下書きデータ
 * 作成ダイアログで使用される中間データ形式
 */
export interface TaskDraft {
  /** タスクタイトル */
  title: string;
  /** 期限日時 (ISO 8601形式、省略可能) */
  dueAt?: string;
  /** 重要度 (1-5) */
  importance: number;
  /** 予想所要時間（分単位、省略可能） */
  estimatedMinutes?: number;
  /** タグ配列（省略可能） */
  tags?: string[];
}

/**
 * 表示モードの種別
 */
export type ViewMode = "day" | "week";

/**
 * フィルタ条件
 */
export interface FilterOptions {
  /** ステータスフィルタ */
  status?: Status[];
  /** タグフィルタ */
  tags?: string[];
  /** 優先度フィルタ（最小値） */
  minPriority?: number;
  /** 優先度フィルタ（最大値） */
  maxPriority?: number;
  /** 期限切れのみ表示 */
  overdueOnly?: boolean;
}

/**
 * ソート条件
 */
export interface SortOptions {
  /** ソートキー */
  key: "importance" | "date" | "priority" | "title";
  /** ソート順 */
  order: "asc" | "desc";
}

/**
 * ユーザーエンティティ
 * 認証とユーザー管理に使用
 */
export interface User {
  /** ユーザーの一意識別子 */
  id: string;
  /** ユーザー名 */
  name: string;
  /** メールアドレス */
  email: string;
}

/**
 * ログインフォームのデータ
 */
export interface LoginData {
  /** メールアドレス */
  email: string;
  /** パスワード */
  password: string;
}

/**
 * アカウント登録フォームのデータ
 */
export interface RegisterData {
  /** ユーザー名 */
  name: string;
  /** メールアドレス */
  email: string;
  /** パスワード */
  password: string;
  /** パスワード確認 */
  confirmPassword: string;
}

/**
 * 認証状態
 */
export interface AuthState {
  /** 現在のユーザー */
  user: User | null;
  /** 認証済みかどうか */
  isAuthenticated: boolean;
  /** 認証処理中かどうか */
  isLoading: boolean;
  /** 認証エラーメッセージ */
  error: string | null;
}

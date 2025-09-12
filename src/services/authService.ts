/**
 * 認証サービス
 * 
 * バックエンドAPIと連携してユーザーの認証処理を行う
 * フロントエンドは画面のみ、処理はすべてバックエンドで実行
 */

import type { User, LoginData, RegisterData } from '@/lib/types';

const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * 認証API関連のサービス
 */
export const authService = {
  /**
   * ログイン処理
   * バックエンドのlogin.pyと連携
   */
  async login(data: LoginData): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // セッション管理のためのCookie送信
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ログインに失敗しました');
      }

      const result = await response.json();
      
      // バックエンドからユーザー情報を取得
      const user = {
        id: result.user.user_id.toString(),
        name: result.user.name,
        email: result.user.email,
      };
      
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('ネットワークエラーが発生しました');
    }
  },

  /**
   * アカウント登録処理
   * バックエンドのregister.pyと連携
   */
  async register(data: RegisterData): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // セッション管理のためのCookie送信
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'アカウント作成に失敗しました');
      }

      // 登録成功（レスポンスは成功メッセージのみ）
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('ネットワークエラーが発生しました');
    }
  },

  /**
   * ログアウト処理
   * バックエンドのlogin.pyと連携
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // セッション管理のためのCookie送信
      });
    } catch (error) {
      // ログアウトに失敗してもローカル状態はクリアする
      console.error('Logout error:', error);
    }
  },

  /**
   * 現在のユーザー情報を取得
   * バックエンドの/meエンドポイントと連携
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        credentials: 'include', // セッション管理のためのCookie送信
      });

      if (!response.ok) {
        throw new Error('認証情報が無効です');
      }

      const result = await response.json();
      
      const user = {
        id: result.user.user_id.toString(),
        name: result.user.name,
        email: result.user.email,
      };
      
      return user;
    } catch (error) {
      throw new Error('ユーザー情報の取得に失敗しました');
    }
  },

  /**
   * セッション確認
   * ページリロード時などに使用
   */
  async verifySession(): Promise<User | null> {
    try {
      const user = await this.getCurrentUser();
      return user;
    } catch (error) {
      // セッションが無効な場合はnullを返す
      return null;
    }
  },
};
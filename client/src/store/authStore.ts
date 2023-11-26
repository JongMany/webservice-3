import { create } from 'zustand';
// import {middlewares} from "./middlewares";
import { persist } from 'zustand/middleware';

export type Token = {
  token: string;
  refreshToken: string;
};
interface AuthState {
  id: string | null;
  isLogin: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  // login: (id: string) => void;
  login: (token: Token, id: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      id: null,
      isLogin: false,
      accessToken: null,
      refreshToken: null,
      login: (token: Token, id: string) =>
        set((state) => ({
          isLogin: true,
          accessToken: token.token,
          refreshToken: token.refreshToken,
          id,
        })),
      logout: () => set((state) => ({ isLogin: false })),
    }),
    { name: 'authStore' }
  )
);

export default useAuthStore;

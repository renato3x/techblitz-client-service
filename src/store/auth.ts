import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

type State = {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
};

type Action = {
  setIsSignedIn: (isSignedIn: boolean) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<State & Action>()(
  persist(
    (set) => ({
      isSignedIn: false,
      user: null,
      isLoading: false,
      setIsSignedIn: (isSignedIn) => set(() => ({ isSignedIn })),
      setUser: (user) => set(() => ({ user })),
    }),
    { name: 'auth-store' },
  ),
);

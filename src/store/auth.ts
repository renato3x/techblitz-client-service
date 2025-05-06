import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

type State = {
  user: User | null;
  isSignedIn: boolean;
};

type Action = {
  setUser: (user: User) => void;
  setIsSignedIn: (isSignedIn: boolean) => void;
}

export const useAuthStore = create<State & Action>()(
  persist(
    (set) => ({
      isSignedIn: false,
      user: null,
      setIsSignedIn: (isSignedIn) => set(() => ({ isSignedIn })),
      setUser: (user) => set(() => ({ user })),
    }),
    { name: 'auth-store' },
  ),
);

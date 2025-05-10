import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

type State = {
  user: User | null;
  isSignedIn: boolean;
  recoveryEmailExpiryDateInMillis: number | null;
};

type Action = {
  setUser: (value: User | null) => void;
  setIsSignedIn: (value: boolean) => void;
  setRecoveryEmailExpiryDateInMillis: (value: number | null) => void
}

export const useAuthStore = create<State & Action>()(
  persist(
    (set) => ({
      isSignedIn: false,
      user: null,
      recoveryEmailExpiryDateInMillis: null,
      setIsSignedIn: (value) => set({ isSignedIn: value }),
      setUser: (value) => set({ user: value }),
      setRecoveryEmailExpiryDateInMillis: (value) => set({ recoveryEmailExpiryDateInMillis: value }),
    }),
    { name: 'auth-store' },
  ),
);

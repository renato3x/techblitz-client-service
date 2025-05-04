import { create } from 'zustand';

type State = {
  redirectUrl: string;
}

type Action = {
  setRedirectUrl: (redirectUrl: string) => void;
}

export const useAppStore = create<State & Action>((set) => ({
  redirectUrl: '',
  setRedirectUrl: (redirectUrl) => set(() => ({ redirectUrl })),
}));

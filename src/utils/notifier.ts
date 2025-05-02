import { toast } from 'sonner';

export const notifier = {
  open: (title: string, description: string) => {
    toast(title, { description, closeButton: true });
  },
};

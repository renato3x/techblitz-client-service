import { toast } from 'sonner';

export const notifier = {
  info: (title: string, description: string) => {
    toast.info(title, { description });
  },
  success: (title: string, description: string) => {
    toast.success(title, { description });
  },
  error: (title: string, description: string) => {
    toast.error(title, { description });
  },
};

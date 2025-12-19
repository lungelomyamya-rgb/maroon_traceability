// src/components/ui/use-toast.ts
import { create } from 'zustand';

type ToastVariant = 'default' | 'destructive';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastStore {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  toast: (toast: Omit<Toast, 'id'>) =>
    set((state: ToastStore) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).substr(2, 9) }],
    })),
  dismissToast: (id: string) =>
    set((state: ToastStore) => ({
      toasts: state.toasts.filter((toast: Toast) => toast.id !== id),
    })),
}));
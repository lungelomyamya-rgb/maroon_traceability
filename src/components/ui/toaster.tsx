// src/components/ui/toaster.tsx
'use client';

import { useToast } from './use-toast';

type ToastVariant = 'default' | 'destructive';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export function Toaster() {
  const { toasts } = useToast();
  
  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2">
      {toasts.map((toast: ToastProps) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md ${
            toast.variant === 'destructive'
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          <div className="font-medium">{toast.title}</div>
          {toast.description && <div className="text-sm">{toast.description}</div>}
        </div>
      ))}
    </div>
  );
}
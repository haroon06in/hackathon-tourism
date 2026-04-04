'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  icon?: string;
}

interface ToastContextValue {
  notify: (message: string, type?: Toast['type'], icon?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ notify: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, type: Toast['type'] = 'info', icon?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const typeStyles = {
    success: 'bg-primary text-on-primary',
    info: 'bg-surface-container-lowest text-on-surface border border-outline-variant/10',
    warning: 'bg-secondary-container text-on-secondary-container',
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${typeStyles[toast.type]} px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right-4 fade-in duration-300 pointer-events-auto max-w-sm`}
          >
            {toast.icon && <span className="material-symbols-outlined text-[20px]">{toast.icon}</span>}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

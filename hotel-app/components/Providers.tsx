'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { GuestProvider } from '../contexts/GuestContext';
import { ToastProvider } from './ui/Toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <GuestProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </GuestProvider>
    </QueryClientProvider>
  );
}

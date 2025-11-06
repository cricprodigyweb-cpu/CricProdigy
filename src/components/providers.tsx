'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { OnboardingGuard } from './OnboardingGuard';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <OnboardingGuard>{children}</OnboardingGuard>
    </SessionProvider>
  );
}

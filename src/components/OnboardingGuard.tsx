'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      // Skip check if not authenticated or on auth/onboarding pages
      if (status === 'loading') {
        return;
      }

      if (status === 'unauthenticated') {
        setIsChecking(false);
        return;
      }

      // Don't redirect if already on onboarding or auth pages
      if (pathname.startsWith('/onboarding') || pathname.startsWith('/auth')) {
        setIsChecking(false);
        return;
      }

      // Check if user needs onboarding
      try {
        const response = await fetch('/api/user/check-onboarding');
        const data = await response.json();

        if (data.needsOnboarding) {
          router.push('/onboarding');
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        console.error('Error checking onboarding:', error);
        setIsChecking(false);
      }
    };

    checkOnboarding();
  }, [status, pathname, router]);

  // Show loading state while checking
  if (isChecking && status === 'authenticated') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigationStore } from '@/src/store/navigationStore';

export default function AboutMePage() {
  const router = useRouter();
  const setView = useNavigationStore((state) => state.setView);
  
  useEffect(() => {
    setView('about');
    router.replace('/');
  }, [setView, router]);
  
  return null;
}


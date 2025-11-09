'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigationStore } from '@/src/store/navigationStore';

export default function CreativeProcessPage() {
  const router = useRouter();
  const setView = useNavigationStore((state) => state.setView);
  
  useEffect(() => {
    setView('creative-process');
    router.replace('/');
  }, [setView, router]);
  
  return null;
}


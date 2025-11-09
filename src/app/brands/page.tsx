'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigationStore } from '@/src/store/navigationStore';

export default function BrandsPage() {
  const router = useRouter();
  const setView = useNavigationStore((state) => state.setView);
  
  useEffect(() => {
    setView('brands');
    router.replace('/');
  }, [setView, router]);
  
  return null;
}



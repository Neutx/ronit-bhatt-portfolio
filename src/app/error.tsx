'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-6xl font-bold mb-4">Oops!</h1>
      <h2 className="text-2xl mb-8">Something went wrong</h2>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        We encountered an error while loading this page.
      </p>
      <button
        onClick={reset}
        className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300"
      >
        Try Again
      </button>
    </div>
  );
}




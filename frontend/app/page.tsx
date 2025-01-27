'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { MessageContainer } from './components/MessageContainer';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end h-16 items-center">
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 pt-32">
        <MessageContainer />
      </main>
    </div>
  );
}

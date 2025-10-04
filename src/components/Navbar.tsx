'use client';

import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Navbar() {
  // 1. Get the user, token, and logout function from our Zustand store
  const { user, token, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out.');
    router.push('/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Eventsphere
        </Link>
        <div className="flex gap-4 items-center">
          {/* 2. Conditionally render links based on the presence of a token */}
          {token ? (
            <>
             {/* Add this "Create Event" link for logged-in users */}
              <Link href="/events/create" className="hover:text-gray-300">
                Create Event
              </Link>
              {/* If logged in, show user email and a Logout button */}
              <span className="text-sm">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm font-medium"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              {/* If logged out, show Sign In and Sign Up links */}
              <Link href="/signin" className="hover:text-gray-300">
                Sign In
              </Link>
              <Link href="/signup" className="hover:text-gray-300">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
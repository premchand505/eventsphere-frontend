'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api/axios';

export default function AuthCallbackPage() {
  const router = useRouter();
  // useSearchParams is a hook to read URL query parameters
  const searchParams = useSearchParams();
  const { setToken, setUser } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');

    const completeLogin = async (authToken: string) => {
      try {
        // 1. Save the token to our global store
        setToken(authToken);

        // 2. Fetch the user's data using the new token
        const userResponse = await apiClient.get('/users/me', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUser(userResponse.data);

        toast.success('Signed in successfully!');
        router.push('/'); // 3. Redirect to the homepage
      } catch (error) {
        toast.error('Failed to complete login. Please try again.');
        router.push('/signin');
      }
    };

    if (token) {
      completeLogin(token);
    } else {
      toast.error('Authentication failed. No token provided.');
      router.push('/signin');
    }
  }, [searchParams, router, setToken, setUser]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Finalizing your login, please wait...</p>
    </div>
  );
}
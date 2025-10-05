'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api/axios';

export default function CallbackClient() {
  const router = useRouter();
  // useSearchParams is a hook to read URL query parameters
  const searchParams = useSearchParams();
  const { setToken, setUser } = useAuthStore();

 
  useEffect(() => {
    const token = searchParams.get('token');

    const completeLogin = async (authToken: string) => {
      try {
        setToken(authToken);

        const userResponse = await apiClient.get('/users/me', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUser(userResponse.data);

        toast.success('Signed in successfully!');
        router.push('/');
      } catch {
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

  // This component now returns nothing, as the loading state
  // is handled by the Suspense boundary in page.tsx
  return null;
}
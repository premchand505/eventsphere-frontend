'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation'; // For programmatic navigation
import toast from 'react-hot-toast'; // For showing notifications
import apiClient from '@/lib/api/axios'; // Our configured API client
import { AxiosError } from 'axios';

// ... (schema and type definitions remain the same) ...
const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});
type SignUpFormValues = z.infer<typeof signUpSchema>;


export default function SignUpForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError, // We'll use this to set server-side errors
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  // This function will now be async and handle the API call
  const onSubmit = async (data: SignUpFormValues) => {
    try {
      await apiClient.post('/auth/signup', data);
      toast.success('Account created successfully! Please sign in.');
      router.push('/signin'); // Redirect to the sign-in page
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        // If the backend returns a 403, it means the email is taken
        setError('email', {
          type: 'server',
          message: 'Email already in use',
        });
      } else {
        // For any other errors, show a generic toast message
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  // ... (the JSX for the form remains exactly the same) ...
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-white"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 block w-full text-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-white"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1 block w-full px-3 text-white  py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
  );
}
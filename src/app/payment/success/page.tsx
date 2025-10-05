'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();

  // Redirect to the homepage after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container mx-auto p-8 text-center">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Thank you for your registration. You are all set! Your registration has been confirmed.
        </p>
        <p className="text-gray-500">
          You will be redirected to the homepage in 5 seconds.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700"
        >
          Go to Homepage Now
        </Link>
      </div>
    </div>
  );
}
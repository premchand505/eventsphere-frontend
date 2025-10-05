import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto p-8 text-center">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Canceled
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Your payment process was canceled. You have not been charged. You can return to the event page and try again if you'd like.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
import { Suspense } from 'react';
import CallbackClient from './CallbackClient';

// This is the loading UI that will be shown on the server
function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Finalizing your login, please wait...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CallbackClient />
    </Suspense>
  );
}
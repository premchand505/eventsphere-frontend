import SignInForm from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <div className="container mx-auto p-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
      <SignInForm />
    </div>
  );
}
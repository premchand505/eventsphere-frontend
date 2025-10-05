import SignInForm from '@/components/auth/SignInForm';

export default function SignInPage() {
  // Construct the Google auth URL using our environment variable
  const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;

  return (
    <div className="container mx-auto p-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
      <SignInForm />

      {/* --- Visual Separator --- */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* --- Google Sign-In Button --- */}
      <div>
        {/* We use a standard <a> tag because this is a full-page navigation to an external endpoint */}
        <a
          href={googleAuthUrl}
          className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          {/* You could add a Google icon SVG here for a better look */}
          <span className="ml-2">Sign in with Google</span>
        </a>
      </div>
    </div>
  );
}
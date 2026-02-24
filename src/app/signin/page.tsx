"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/components/svg/GoogleIcon";
import { useSignIn } from "@/hooks/useSignIn";
import { useAuth } from "@/context/AuthContext";
import PublicShell from "@/components/PublicShell";

export default function SignInPage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const { loading, handleSignIn } = useSignIn();

  // Redirect to profile if already authenticated
  useEffect(() => {
    if (!authLoading && authUser) {
      router.replace("/profile");
    }
  }, [authUser, authLoading, router]);

  if (loading || authLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-white'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-10 h-10 border-2 border-gray-700 border-t-blue-100 shadow-lg shadow-blue-500/20 rounded-full animate-spin'></div>
          <div className='text-sm font-medium text-gray-400'>
            Securely loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <PublicShell>
      <div className='flex justify-center items-center p-6'>
        <div className='w-full max-w-sm bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-semibold text-gray-800 tracking-tight mb-2'>
              Sign In
            </h1>
            <p className='text-gray-400 text-sm leading-relaxed px-2'>
              Sign in to continue your profile
            </p>
          </div>

          <button
            onClick={handleSignIn}
            className='justify-center flex gap-4 w-full py-3 px-6 rounded-xl font-semibold text-[rgb(32,38,130)] bg-white border border-[rgb(32,38,130)] hover:bg-blue-50 text-sm cursor-pointer'
          >
            <img
              src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
              alt='Google icon'
              className='w-5 h-5 opacity-90'
            />
            <span className='text-[15px]'>Sign in with Google</span>
          </button>

          <div className='mt-8 pt-6 border-t border-gray-50 text-center'>
            <p className='text-[12px] text-gray-300 max-w-[240px] mx-auto leading-normal'>
              By signing in, you agree to our{" "}
              <a
                href='#'
                className='text-gray-400 hover:text-gray-600 underline'
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href='#'
                className='text-gray-400 hover:text-gray-600 underline'
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}

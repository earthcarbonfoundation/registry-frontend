"use client";

import React from "react";
import GoogleIcon from "@/components/svg/GoogleIcon";
import { useSignIn } from "@/hooks/useSignIn";

export default function SignInPage() {
  const { loading, handleSignIn } = useSignIn();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-gray-700 border-t-blue-100 shadow-lg shadow-blue-500/20 rounded-full animate-spin"></div>
          <div className="text-sm font-medium text-gray-400">
            Securely loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 p-6">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-6 border border-gray-100/50">
            <GoogleIcon />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed px-2">
            Sign in to access your profile and environment tracking tools.
          </p>
        </div>

        <button
          onClick={handleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-white border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all duration-200 active:bg-gray-100 active:scale-[0.99]"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google icon"
            className="w-5 h-5 opacity-90"
          />
          <span className="text-[15px]">Sign in with Google</span>
        </button>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
          <p className="text-[12px] text-gray-300 max-w-[240px] mx-auto leading-normal">
            By signing in, you agree to our{" "}
            <a href="#" className="text-gray-400 hover:text-gray-600 underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-gray-400 hover:text-gray-600 underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ActionsPage from "@/components/AddNewActions";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const { user, loading } = useProfile();

  // Verify Firebase auth - redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !authUser) {
      router.replace("/signin");
    }
  }, [authUser, authLoading, router]);

  console.log(authLoading);

  if (loading || authLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-slate-50'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
          <div className='text-lg font-medium text-slate-500'>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <ActionsPage />
    </>
  );
}

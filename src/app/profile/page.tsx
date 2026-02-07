"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import ActionsPage from "@/components/AddNewActions";
import GoogleMapVIew from "@/components/GoogleMapVIew";
import { useProfile } from "@/hooks/useProfile";
import { useActionRecordTable } from "@/hooks/useActionRecordTable";

export default function ProfilePage() {
  const { user, loading } = useProfile();
  const { actions } = useActionRecordTable();

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-slate-50'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
          <div className='text-lg font-medium text-slate-500'>
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting to signin
  }

  return (
    <>
      <Navbar />
      <ActionsPage locations={actions} />
    </>
  );
}

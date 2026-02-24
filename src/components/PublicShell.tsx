"use client";

import React from "react";
import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";

export default function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-white'>
      <PublicHeader />

      <main className='flex-1 w-full'>
        <div className='max-w-6xl mx-auto px-4 py-8 md:py-12'>
          <div className='p-8 md:p-12 text-gray-900'>{children}</div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

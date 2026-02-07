"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function PublicHeader() {
  const { user } = useAuth();

  return (
    <header className='w-full bg-[rgb(32,38,130)] text-white'>
      <div className='max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between'>
        <Link href='/' className='text-xl font-black tracking-tight'>
          Earth Carbon Registry
        </Link>

        <nav className='flex items-center gap-6'>
          <Link href='/about' className='hover:underline'>
            About
          </Link>
          <Link href='/how-it-works' className='hover:underline'>
            How It Works
          </Link>
          <Link href='/impact' className='hover:underline'>
            Impact
          </Link>
          <Link href='/pricing' className='hover:underline'>
            Pricing
          </Link>

          {user ? (
            <Link
              href='/profile'
              className='ml-2 px-4 py-2 bg-white text-[rgb(32,38,130)] font-bold rounded-md shadow-sm hover:shadow-md transition'
            >
              Go To Profile
            </Link>
          ) : (
            <Link
              href='/signin'
              className='ml-2 px-4 py-2 bg-white text-[rgb(32,38,130)] font-bold rounded-md shadow-sm hover:shadow-md transition'
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

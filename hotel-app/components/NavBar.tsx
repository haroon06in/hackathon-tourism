'use client';

import Link from 'next/link';
import { useGuest } from '../contexts/GuestContext';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const { guest, signOut } = useGuest();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  return (
    <nav className="bg-white/70 dark:bg-stone-900/70 backdrop-blur-md fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-8 py-4 max-w-8xl mx-auto border-b border-outline-variant/10">
      <Link href="/" className="text-2xl font-serif tracking-tight text-emerald-950 dark:text-emerald-50">
        Kuriftu Resorts
      </Link>

      <div className="hidden md:flex items-center gap-10">
        <Link href="/hotels" className="text-stone-600 dark:text-stone-400 font-medium hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors duration-300">
          Hotels
        </Link>
        <Link href="/concierge" className="text-stone-600 dark:text-stone-400 font-medium hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors duration-300">
          Concierge
        </Link>
        <Link href="/activities" className="text-stone-600 dark:text-stone-400 font-medium hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors duration-300">
          Activities
        </Link>
        {guest && (
          <Link href="/dashboard" className="text-stone-600 dark:text-stone-400 font-medium hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors duration-300">
            Dashboard
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {guest ? (
          <>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary text-on-primary rounded-full flex items-center justify-center text-sm font-bold">
                {guest.full_name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:block text-sm font-medium text-on-surface">
                {guest.full_name.split(' ')[0]}
              </span>
            </Link>
            <button
              onClick={handleSignOut}
              className="text-on-surface-variant hover:text-on-surface transition-colors p-2"
              title="Sign out"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </>
        ) : (
          <Link href="/login">
            <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-medium hover:bg-primary-container transition-all active:opacity-80 active:scale-95">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}

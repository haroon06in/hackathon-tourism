'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGuest } from '../contexts/GuestContext';
import { useRouter } from 'next/navigation';

const NAV_LINKS = [
  { href: '/hotels', label: 'Hotels' },
  { href: '/concierge', label: 'Concierge' },
  { href: '/activities', label: 'Activities' },
];

export default function NavBar() {
  const { guest, signOut } = useGuest();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    setMobileOpen(false);
    router.push('/');
  };

  return (
    <nav className="bg-white/70 dark:bg-stone-900/70 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-8xl mx-auto">
        <Link href="/" className="text-2xl font-serif tracking-tight text-emerald-950 dark:text-emerald-50">
          Kuriftu Resorts
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-stone-600 dark:text-stone-400 font-medium hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors duration-300">
              {link.label}
            </Link>
          ))}
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
              <button onClick={handleSignOut} className="hidden md:block text-on-surface-variant hover:text-on-surface transition-colors p-2" title="Sign out">
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </>
          ) : (
            <Link href="/login" className="hidden md:block">
              <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-medium hover:bg-primary-container transition-all active:opacity-80 active:scale-95">
                Sign In
              </button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[24px]">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-outline-variant/10 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col px-6 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="text-stone-700 dark:text-stone-300 font-medium py-3 hover:text-emerald-800 transition-colors">
                {link.label}
              </Link>
            ))}
            {guest && (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="text-stone-700 dark:text-stone-300 font-medium py-3 hover:text-emerald-800 transition-colors">
                  Dashboard
                </Link>
                <Link href="/pickup" onClick={() => setMobileOpen(false)}
                  className="text-stone-700 dark:text-stone-300 font-medium py-3 hover:text-emerald-800 transition-colors">
                  Airport Pickup
                </Link>
                <Link href="/transfer" onClick={() => setMobileOpen(false)}
                  className="text-stone-700 dark:text-stone-300 font-medium py-3 hover:text-emerald-800 transition-colors">
                  Branch Transfer
                </Link>
                <button onClick={handleSignOut}
                  className="text-left text-red-600 font-medium py-3 border-t border-outline-variant/10 mt-2">
                  Sign Out
                </button>
              </>
            )}
            {!guest && (
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="bg-primary text-on-primary text-center py-3 rounded-lg font-medium mt-2">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGuest } from '../../../contexts/GuestContext';
import { api } from '../../../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn } = useGuest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Try to find existing profile
      const profile = await api.getProfile(email);

      if (profile.persona) {
        // Completed onboarding — sign in directly
        await signIn(email);
        router.push('/dashboard');
      } else {
        // Profile exists but no persona — incomplete onboarding
        router.push(`/onboarding?email=${encodeURIComponent(email)}`);
      }
    } catch {
      // No profile found — new guest
      router.push(`/onboarding?email=${encodeURIComponent(email)}&new=true`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <span className="text-secondary font-bold tracking-widest text-[11px] uppercase mb-4 block">
            Kuriftu Resorts & Spa
          </span>
          <h1 className="text-4xl md:text-5xl font-headline text-primary tracking-tight mb-4">
            Welcome Back
          </h1>
          <p className="text-on-surface-variant leading-relaxed">
            Enter your email to access your Living Itinerary
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10">
            <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 p-4 focus:outline-none focus:border-primary transition-all font-body text-sm rounded-t-lg"
            />

            {error && (
              <p className="text-sm text-red-600 mt-3">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                Checking...
              </>
            ) : (
              <>
                Continue
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-on-surface-variant">
            New guest? We&apos;ll set up your profile in just a moment.
          </p>
        </form>
      </div>
    </div>
  );
}

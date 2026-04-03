'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Profile } from '../types/profile';
import { api } from '../lib/api';

const STORAGE_KEY = 'kuriftu_guest_email';

interface GuestContextValue {
  guest: Profile | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<Profile | null>;
  signOut: () => void;
  updateGuest: (profile: Profile) => void;
}

const GuestContext = createContext<GuestContextValue>({
  guest: null,
  isLoading: true,
  signIn: async () => null,
  signOut: () => {},
  updateGuest: () => {},
});

export function GuestProvider({ children }: { children: ReactNode }) {
  const [guest, setGuest] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const email = localStorage.getItem(STORAGE_KEY);
    if (!email) {
      setIsLoading(false);
      return;
    }
    api.getProfile(email)
      .then(setGuest)
      .catch(() => localStorage.removeItem(STORAGE_KEY))
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = useCallback(async (email: string): Promise<Profile | null> => {
    try {
      const profile = await api.getProfile(email);
      localStorage.setItem(STORAGE_KEY, email);
      setGuest(profile);
      return profile;
    } catch {
      return null;
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setGuest(null);
  }, []);

  const updateGuest = useCallback((profile: Profile) => {
    localStorage.setItem(STORAGE_KEY, profile.email);
    setGuest(profile);
  }, []);

  return (
    <GuestContext.Provider value={{ guest, isLoading, signIn, signOut, updateGuest }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  return useContext(GuestContext);
}

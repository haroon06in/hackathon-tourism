export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  persona: 'adventurous' | 'relaxed' | 'cultural' | 'family' | 'wellness' | null;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileRequest {
  fullName: string;
  email: string;
  phone?: string;
  persona?: Profile['persona'];
  preferences?: Record<string, unknown>;
}

import { supabase } from '../lib/supabase';

// ─── RESOLVE JOIN CODE → { schoolSlug, role } ─────────────────────────────────
export async function resolveCode(raw) {
  const code = (raw || '').toUpperCase().trim();
  if (code.length !== 6) return null;
  const { data } = await supabase
    .from('schools')
    .select('slug, officer_code, player_code')
    .or(`officer_code.eq.${code},player_code.eq.${code}`)
    .limit(1);
  if (!data || data.length === 0) return null;
  const row = data[0];
  if (row.officer_code === code) return { schoolSlug: row.slug, role: 'officer' };
  if (row.player_code  === code) return { schoolSlug: row.slug, role: 'player' };
  return null;
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
export async function registerUser({ code, firstName, lastName, email, password }) {
  const resolved = await resolveCode(code);
  if (!resolved) return { error: 'Invalid join code.' };
  const { schoolSlug, role } = resolved;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { firstName, lastName, schoolSlug, role } },
  });
  if (authError) return { error: authError.message };

  const userId = authData.user?.id;
  if (!userId) return { error: 'Registration failed. Please try again.' };

  const { error: profileError } = await supabase.from('profiles').insert({
    id:          userId,
    first_name:  firstName,
    last_name:   lastName,
    school_slug: schoolSlug,
    role,
  });
  if (profileError) return { error: profileError.message };

  return { session: { id: userId, firstName, lastName, email, role, schoolSlug } };
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'Invalid email or password.' };

  const userId = data.user.id;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!profile) return { error: 'Account not found. Please register first.' };

  return {
    session: {
      id:         userId,
      firstName:  profile.first_name,
      lastName:   profile.last_name,
      email:      data.user.email,
      role:       profile.role,
      schoolSlug: profile.school_slug,
    },
  };
}

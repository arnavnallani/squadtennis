import { supabase } from '../lib/supabase';

// ─── FIELD NAME MAPPING ────────────────────────────────────────────────────────
// DB uses snake_case; app code uses camelCase.
function toApp(row) {
  if (!row) return null;
  return {
    slug:            row.slug,
    name:            row.name,
    enrolled:        row.enrolled,
    colors:          row.colors,
    officerCode:     row.officer_code,
    playerCode:      row.player_code,
    roster:          row.roster          || [],
    matches:         row.matches         || [],
    tournaments:     row.tournaments     || [],
    activities:      row.activities      || [],
    hasSOP:          row.has_sop,
    heroEyebrow:     row.hero_eyebrow,
    bgImage:         row.bg_image,
    schedule:        row.schedule,
    announcements:   row.announcements,
    challengeRules:  row.challenge_rules || [],
  };
}

function toDB(data) {
  const d = {};
  if (data.slug            !== undefined) d.slug            = data.slug;
  if (data.name            !== undefined) d.name            = data.name;
  if (data.enrolled        !== undefined) d.enrolled        = data.enrolled;
  if (data.colors          !== undefined) d.colors          = data.colors;
  if (data.officerCode     !== undefined) d.officer_code    = data.officerCode;
  if (data.playerCode      !== undefined) d.player_code     = data.playerCode;
  if (data.roster          !== undefined) d.roster          = data.roster;
  if (data.matches         !== undefined) d.matches         = data.matches;
  if (data.tournaments     !== undefined) d.tournaments     = data.tournaments;
  if (data.activities      !== undefined) d.activities      = data.activities;
  if (data.hasSOP          !== undefined) d.has_sop         = data.hasSOP;
  if (data.heroEyebrow     !== undefined) d.hero_eyebrow    = data.heroEyebrow;
  if (data.bgImage         !== undefined) d.bg_image        = data.bgImage;
  if (data.schedule        !== undefined) d.schedule        = data.schedule;
  if (data.announcements   !== undefined) d.announcements   = data.announcements;
  if (data.challengeRules  !== undefined) d.challenge_rules = data.challengeRules;
  return d;
}

// ─── READ ─────────────────────────────────────────────────────────────────────
export async function getSchoolData(slug) {
  const { data } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', slug)
    .single();
  return toApp(data);
}

export async function getAllEnrolledSchools() {
  const { data } = await supabase
    .from('schools')
    .select('*')
    .eq('enrolled', true);
  return (data || []).map(toApp);
}

// ─── WRITE ────────────────────────────────────────────────────────────────────
export async function saveSchoolData(slug, schoolData) {
  const row = toDB({ ...schoolData, slug });
  const { error } = await supabase
    .from('schools')
    .upsert(row, { onConflict: 'slug' });
  if (error) console.error('saveSchoolData error:', error);
}

// ─── ENROLL A NEW SCHOOL ──────────────────────────────────────────────────────
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function randomCode() {
  let c = '';
  for (let i = 0; i < 6; i++) c += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return c;
}

export function makeSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function enrollSchool({ name, claimCode, colors, officerData }) {
  const slug        = makeSlug(name);
  const officerCode = randomCode();
  const playerCode  = randomCode();

  const record = {
    slug, name, colors, officerCode, playerCode,
    enrolled:       true,
    roster:         [],
    matches:        [],
    tournaments:    [],
    activities:     [],
    challengeRules: [],
  };

  await saveSchoolData(slug, record);
  return { slug, officerCode, playerCode };
}

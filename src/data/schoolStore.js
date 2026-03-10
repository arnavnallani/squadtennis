// ─── KEYS ────────────────────────────────────────────────────────────────────
const schoolKey  = slug => `sq_school_${slug}`;
const usersKey   = slug => `sq_users_${slug}`;
const INDEX_KEY  = 'sq_enrolled_index';

// ─── SLUG GENERATION ─────────────────────────────────────────────────────────
export function makeSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── 6-CHAR RANDOM CODE ───────────────────────────────────────────────────────
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export function randomCode() {
  let c = '';
  for (let i = 0; i < 6; i++) c += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return c;
}

// ─── SCHOOL DATA ─────────────────────────────────────────────────────────────
export function getSchoolData(slug) {
  try { return JSON.parse(localStorage.getItem(schoolKey(slug))); }
  catch { return null; }
}

export function saveSchoolData(slug, data) {
  localStorage.setItem(schoolKey(slug), JSON.stringify(data));
  // Keep an index of all enrolled slugs for FindCollegeModal
  const idx = getEnrolledIndex();
  if (!idx.includes(slug)) {
    localStorage.setItem(INDEX_KEY, JSON.stringify([...idx, slug]));
  }
}

export function getEnrolledIndex() {
  try { return JSON.parse(localStorage.getItem(INDEX_KEY) || '[]'); }
  catch { return []; }
}

// Returns all locally-enrolled school records
export function getAllEnrolledSchools() {
  return getEnrolledIndex()
    .map(slug => getSchoolData(slug))
    .filter(Boolean);
}

// ─── USERS (per-school) ────────────────────────────────────────────────────────
export function getSchoolUsers(slug) {
  try { return JSON.parse(localStorage.getItem(usersKey(slug)) || '[]'); }
  catch { return []; }
}

export function addSchoolUser(slug, user) {
  const users = getSchoolUsers(slug);
  localStorage.setItem(usersKey(slug), JSON.stringify([...users, user]));
}

// ─── ENROLL A SCHOOL ──────────────────────────────────────────────────────────
// Creates a full school record in localStorage.
export function enrollSchool({ name, claimCode, colors, officerData, rosterNow }) {
  const slug = makeSlug(name);
  const officerCode = randomCode();
  const playerCode  = randomCode();

  const record = {
    name,
    slug,
    claimCode,
    officerCode,
    playerCode,
    colors,
    enrolled: true,
    enrolledAt: Date.now(),
    roster: [],
    matches: [],
  };

  saveSchoolData(slug, record);

  // Store the founding officer
  const officer = {
    ...officerData,
    schoolSlug: slug,
    role: officerData.title || 'Officer',
    createdAt: Date.now(),
  };
  addSchoolUser(slug, officer);

  return { slug, officerCode, playerCode };
}

import { getEnrolledIndex, getSchoolData, getSchoolUsers, addSchoolUser } from './schoolStore';

// ─── SJSU HARDCODED CODES (mirrors App.js constants) ─────────────────────────
const SJSU_OFFICER_CODE = 'SJSU2026';
const SJSU_PLAYER_CODE  = 'SPARTAN24';

const SESSION_KEY = 'sq_session';

// ─── SESSION ──────────────────────────────────────────────────────────────────
export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

export function setCurrentUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem(SESSION_KEY);
}

// ─── SJSU USER LIST ───────────────────────────────────────────────────────────
function getSJSUUsers() {
  try { return JSON.parse(localStorage.getItem('sjsu_users') || '[]'); }
  catch { return []; }
}

function addSJSUUser(user) {
  const arr = getSJSUUsers();
  localStorage.setItem('sjsu_users', JSON.stringify([...arr, user]));
}

// ─── RESOLVE CODE → { schoolSlug, role } ─────────────────────────────────────
export function resolveCode(raw) {
  const code = (raw || '').toUpperCase().trim();
  if (!code) return null;
  if (code === SJSU_OFFICER_CODE) return { schoolSlug: 'sjsu', role: 'officer' };
  if (code === SJSU_PLAYER_CODE)  return { schoolSlug: 'sjsu', role: 'player' };
  for (const slug of getEnrolledIndex()) {
    const school = getSchoolData(slug);
    if (!school) continue;
    if (school.officerCode === code) return { schoolSlug: slug, role: 'officer' };
    if (school.playerCode  === code) return { schoolSlug: slug, role: 'player' };
  }
  return null;
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
export function registerUser({ code, firstName, lastName, email, password }) {
  const resolved = resolveCode(code);
  if (!resolved) return { error: 'Invalid join code.' };
  const { schoolSlug, role } = resolved;

  if (schoolSlug === 'sjsu') {
    if (getSJSUUsers().some(u => u.email === email)) return { error: 'Email already registered.' };
    const user = { id: `sjsu_${Date.now()}`, firstName, lastName, email, password, role, schoolSlug };
    addSJSUUser(user);
    const session = { id: user.id, firstName, lastName, email, role, schoolSlug };
    setCurrentUser(session);
    return { session };
  }

  if (getSchoolUsers(schoolSlug).some(u => u.email === email)) return { error: 'Email already registered.' };
  const user = { id: `${schoolSlug}_${Date.now()}`, firstName, lastName, email, password, role, schoolSlug };
  addSchoolUser(schoolSlug, user);
  const session = { id: user.id, firstName, lastName, email, role, schoolSlug };
  setCurrentUser(session);
  return { session };
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export function loginUser({ email, password }) {
  // SJSU users
  const sjsuFound = getSJSUUsers().find(u => u.email === email && u.password === password);
  if (sjsuFound) {
    const session = {
      id: sjsuFound.id,
      firstName: sjsuFound.firstName || (sjsuFound.name || '').split(' ')[0],
      lastName:  sjsuFound.lastName  || (sjsuFound.name || '').split(' ').slice(1).join(' '),
      email: sjsuFound.email,
      role: sjsuFound.role,
      schoolSlug: 'sjsu',
    };
    setCurrentUser(session);
    return { session };
  }

  // All other enrolled schools
  for (const slug of getEnrolledIndex()) {
    const found = getSchoolUsers(slug).find(u => u.email === email && u.password === password);
    if (found) {
      const session = {
        id: found.id,
        firstName: found.firstName || (found.name || '').split(' ')[0],
        lastName:  found.lastName  || (found.name || '').split(' ').slice(1).join(' '),
        email: found.email,
        role: found.role,
        schoolSlug: slug,
      };
      setCurrentUser(session);
      return { session };
    }
  }

  return { error: 'Invalid email or password.' };
}

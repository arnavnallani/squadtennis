import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser, registerUser, resolveCode } from './data/authStore';
import { useAuth } from './AuthContext';

// ─── SHARED AUTH STYLES ───────────────────────────────────────────────────────
const AUTH_STYLES = `
.auth-page {
  min-height: calc(100vh - var(--nav-h));
  display: flex; align-items: center; justify-content: center;
  padding: 48px 24px;
}
.auth-card {
  width: 100%; max-width: 420px;
  background: rgba(13,13,13,.98);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 18px;
  padding: 40px 36px;
  box-shadow: 0 32px 80px rgba(0,0,0,.7);
  animation: sqRiseIn .3s var(--spring) both;
}
.auth-eyebrow {
  font-family: var(--font-ui); font-size: 11px; font-weight: 500;
  letter-spacing: 0.5px; text-transform: uppercase;
  color: var(--c-green); margin-bottom: 10px;
}
.auth-h1 {
  font-family: var(--font-disp); font-size: 42px;
  line-height: .95; letter-spacing: 2px; margin-bottom: 32px;
}
.auth-divider {
  width: 100%; height: 1px;
  background: rgba(255,255,255,.07); margin: 24px 0;
}
.auth-fg { display: flex; flex-direction: column; gap: 5px; margin-bottom: 16px; }
.auth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.auth-label {
  font-family: var(--font-ui); font-size: 12px; font-weight: 500;
  letter-spacing: 0; color: rgba(240,236,230,.5);
}
.auth-input {
  width: 100%; padding: 11px 14px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 8px; color: var(--c-text);
  font-family: var(--font-ui); font-size: 14px;
  outline: none; transition: border-color .18s;
}
.auth-input:focus { border-color: rgba(61,186,111,.45); }
.auth-input::placeholder { color: rgba(240,236,230,.2); }
.auth-code-hint {
  font-family: var(--font-ui); font-size: 12px;
  color: rgba(240,236,230,.35);
  margin-top: 4px; line-height: 1.6;
}
.auth-code-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 6px; margin-top: 10px;
  background: rgba(61,186,111,.08);
  border: 1px solid rgba(61,186,111,.2);
  font-family: var(--font-mono); font-size: 10px;
  color: var(--c-green); letter-spacing: .5px;
}
.auth-code-chip-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--c-green); flex-shrink: 0;
}
.auth-btn {
  width: 100%; padding: 13px;
  background: var(--c-green); color: #060606;
  border: none; border-radius: 9px; cursor: pointer;
  font-family: var(--font-ui); font-size: 14px;
  font-weight: 600; letter-spacing: 0;
  transition: background .18s, transform .1s;
  margin-top: 8px;
}
.auth-btn:hover { background: var(--c-green-hi); }
.auth-btn:active { transform: scale(.98); }
.auth-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }
.auth-err {
  background: rgba(201,96,96,.1); border: 1px solid rgba(201,96,96,.25);
  border-radius: 7px; padding: 10px 14px;
  font-family: var(--font-ui); font-size: 13px; color: #e07e7e;
  margin-bottom: 12px;
}
.auth-foot {
  margin-top: 24px; text-align: center;
  font-family: var(--font-ui); font-size: 13px;
  color: rgba(240,236,230,.38);
}
.auth-link {
  color: var(--c-green); background: none; border: none;
  cursor: pointer; font-family: inherit; font-size: inherit;
  text-decoration: underline;
  text-decoration-color: rgba(61,186,111,.35);
}
.auth-link:hover { color: var(--c-green-hi); }
`;

function useAuthStyles() {
  const [injected] = useState(() => {
    if (!document.getElementById('auth-styles')) {
      const tag = document.createElement('style');
      tag.id = 'auth-styles';
      tag.textContent = AUTH_STYLES;
      document.head.appendChild(tag);
    }
    return true;
  });
  return injected;
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
export function LoginPage() {
  useAuthStyles();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const returnTo = params.get('returnTo') || '/';

  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const set = k => e => setF(x => ({ ...x, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setErr('');
    if (!f.email || !f.password) { setErr('Both fields are required.'); return; }
    setBusy(true);
    const { session, error } = await loginUser(f);
    setBusy(false);
    if (error) { setErr(error); return; }
    login(session);
    navigate(returnTo);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-eyebrow">Squad Tennis · Member Access</div>
        <div className="auth-h1">Log In</div>
        {err && <div className="auth-err">{err}</div>}
        <form onSubmit={submit}>
          <div className="auth-fg">
            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" placeholder="you@university.edu"
              value={f.email} onChange={set('email')} autoFocus />
          </div>
          <div className="auth-fg">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" placeholder="••••••••"
              value={f.password} onChange={set('password')} />
          </div>
          <button className="auth-btn" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div className="auth-foot">
          No account?{' '}
          <button className="auth-link" onClick={() => navigate(`/register?returnTo=${encodeURIComponent(returnTo)}`)}>
            Register with your join code
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
export function RegisterPage() {
  useAuthStyles();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const returnTo = params.get('returnTo') || '/';

  const [f, setF] = useState({ code: '', firstName: '', lastName: '', email: '', password: '' });
  const [resolved, setResolved]     = useState(null); // { schoolSlug, role } once code valid
  const [resolving, setResolving]   = useState(false);
  const [err, setErr]               = useState('');
  const [busy, setBusy]             = useState(false);

  const set = k => e => {
    const val = e.target.value;
    setF(x => ({ ...x, [k]: val }));
    if (k === 'code') {
      if (err) setErr('');
      const upper = val.toUpperCase().trim();
      if (upper.length === 6) {
        setResolving(true);
        resolveCode(upper).then(r => { setResolved(r); setResolving(false); });
      } else {
        setResolved(null);
      }
    }
  };

  const submit = async e => {
    e.preventDefault();
    setErr('');
    if (!resolved) { setErr('Invalid join code.'); return; }
    if (!f.firstName || !f.lastName || !f.email || !f.password) { setErr('All fields are required.'); return; }
    setBusy(true);
    const { session, error } = await registerUser(f);
    setBusy(false);
    if (error) { setErr(error); return; }
    login(session);
    navigate(returnTo);
  };

  const roleLabel = resolved
    ? `${resolved.role === 'officer' ? 'Officer' : 'Player'} · ${resolved.schoolSlug.toUpperCase()}`
    : null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-eyebrow">Squad Tennis · Join Your Team</div>
        <div className="auth-h1">Register</div>
        {err && <div className="auth-err">{err}</div>}
        <form onSubmit={submit}>
          <div className="auth-fg">
            <label className="auth-label">Join Code</label>
            <input className="auth-input" placeholder="6-character code from your officer"
              value={f.code}
              onChange={set('code')}
              autoFocus
              style={{ textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}
            />
            {resolving ? (
              <div className="auth-code-hint">Checking code…</div>
            ) : resolved ? (
              <div className="auth-code-chip">
                <span className="auth-code-chip-dot" />
                {roleLabel}
              </div>
            ) : (
              <div className="auth-code-hint">
                Enter the player or officer code your team captain shared with you.
              </div>
            )}
          </div>

          {resolved && (
            <>
              <div className="auth-divider" />
              <div className="auth-row">
                <div className="auth-fg" style={{ margin: 0 }}>
                  <label className="auth-label">First Name</label>
                  <input className="auth-input" placeholder="First" value={f.firstName} onChange={set('firstName')} />
                </div>
                <div className="auth-fg" style={{ margin: 0 }}>
                  <label className="auth-label">Last Name</label>
                  <input className="auth-input" placeholder="Last" value={f.lastName} onChange={set('lastName')} />
                </div>
              </div>
              <div className="auth-fg" style={{ marginTop: 12 }}>
                <label className="auth-label">Email</label>
                <input className="auth-input" type="email" placeholder="you@university.edu"
                  value={f.email} onChange={set('email')} />
              </div>
              <div className="auth-fg">
                <label className="auth-label">Password</label>
                <input className="auth-input" type="password" placeholder="Create a password"
                  value={f.password} onChange={set('password')} />
              </div>
            </>
          )}

          <button className="auth-btn" type="submit" disabled={busy || !resolved}>
            {busy ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <div className="auth-foot">
          Already have an account?{' '}
          <button className="auth-link" onClick={() => navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`)}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SCHOOLS from "./data/schools";
import { getSchoolColors } from "./data/schoolColors";
import { enrollSchool } from "./data/schoolStore";
import { useAuth } from "./AuthContext";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const OB_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --c-bg:#0d110f; --c-surf:#141813; --c-surf2:#1a1f1b;
  --c-border:rgba(255,255,255,.06); --c-border2:rgba(255,255,255,.1);
  --c-green:#27cf83; --c-green-hi:#4de8a0; --c-green-glow:rgba(39,207,131,.15);
  --c-text:#f0ece6; --c-muted:rgba(240,236,230,.38); --c-muted2:rgba(240,236,230,.18);
  --c-win:#5db882; --c-loss:#c96060;
  --nav-h:58px; --r:10px;
  --spring:cubic-bezier(.16,1,.3,1);
  --font-disp:'Bebas Neue',sans-serif;
  --font-ui:'DM Sans',sans-serif;
  --font-mono:'DM Mono',monospace;
}
html { scroll-behavior:smooth; }
body { background:var(--c-bg); color:var(--c-text); font-family:var(--font-ui); font-size:14px; line-height:1.6; overflow-x:hidden; }
body::before {
  content:''; position:fixed; inset:0; z-index:9990; pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity:.022; mix-blend-mode:overlay;
}

/* NAV */
.ob-nav {
  position:fixed; top:0; left:0; right:0; z-index:100; height:var(--nav-h);
  display:flex; align-items:center; padding:0 24px;
  background:rgba(7,7,7,.82); backdrop-filter:blur(32px);
  border-bottom:1px solid var(--c-border);
}
.ob-nav-logo { font-family:var(--font-disp); font-size:17px; letter-spacing:5px; color:var(--c-text); }
.ob-nav-logo span { color:var(--c-green); }

/* FLOW LAYOUT */
.ob-shell {
  min-height:100vh; padding-top:calc(var(--nav-h) + 40px);
  display:flex; flex-direction:column; align-items:center;
  justify-content:center; padding-left:24px; padding-right:24px; padding-bottom:60px;
}
.ob-card {
  width:100%; max-width:500px;
  background:var(--c-surf); border:1px solid var(--c-border2);
  border-radius:18px; padding:44px 40px 40px;
  box-shadow:0 32px 80px rgba(0,0,0,.6);
  animation:obIn .3s var(--spring) both;
}
@keyframes obIn { from{opacity:0;transform:translateY(24px)scale(.97)} to{opacity:1;transform:translateY(0)scale(1)} }

/* STEP INDICATOR */
.ob-steps { display:flex; gap:6px; margin-bottom:36px; }
.ob-step-dot {
  height:3px; border-radius:2px; flex:1;
  background:var(--c-border2); transition:background .3s;
}
.ob-step-dot.done { background:var(--c-green); }
.ob-step-dot.active { background:rgba(39,207,131,.5); }

/* TYPOGRAPHY */
.ob-eyebrow { font-family:var(--font-ui); font-size:11px; font-weight:500; letter-spacing:0.5px; text-transform:uppercase; color:var(--c-muted); margin-bottom:10px; }
.ob-title { font-family:var(--font-disp); font-size:42px; letter-spacing:1px; line-height:.95; margin-bottom:8px; }
.ob-title em { font-style:normal; color:var(--c-green); }
.ob-sub { font-size:12.5px; color:var(--c-muted); line-height:1.7; margin-bottom:28px; }

/* FORM ELEMENTS */
.ob-fg { margin-bottom:14px; }
.ob-fg-2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.ob-label { display:block; font-family:var(--font-ui); font-size:12px; font-weight:500; letter-spacing:0; color:var(--c-muted); margin-bottom:6px; }
.ob-input {
  width:100%; padding:11px 13px;
  background:var(--c-surf2); border:1px solid var(--c-border);
  border-radius:9px; color:var(--c-text);
  font-family:var(--font-ui); font-size:14px; outline:none;
  transition:border-color .18s; letter-spacing:.3px;
}
.ob-input:focus { border-color:rgba(39,207,131,.45); }
.ob-input::placeholder { color:var(--c-muted2); }
.ob-input.error { border-color:rgba(201,96,96,.6); }
.ob-err { font-family:var(--font-ui); font-size:12px; color:var(--c-loss); margin-top:8px; }

/* CODE INPUT — monospace, big */
.ob-code-input {
  width:100%; padding:14px 16px;
  background:var(--c-surf2); border:1px solid var(--c-border);
  border-radius:9px; color:var(--c-text);
  font-family:var(--font-mono); font-size:22px; letter-spacing:8px; text-transform:uppercase;
  outline:none; transition:border-color .18s; text-align:center;
}
.ob-code-input:focus { border-color:rgba(39,207,131,.45); }
.ob-code-input.error { border-color:rgba(201,96,96,.6); }

/* CHECKBOX */
.ob-check-row { display:flex; align-items:flex-start; gap:12px; margin-bottom:24px; cursor:pointer; }
.ob-check-box {
  width:18px; height:18px; border-radius:5px; flex-shrink:0; margin-top:2px;
  border:1px solid var(--c-border2); background:var(--c-surf2);
  display:flex; align-items:center; justify-content:center;
  transition:background .15s, border-color .15s;
}
.ob-check-box.checked { background:var(--c-green); border-color:var(--c-green); }
.ob-check-box svg { width:10px; height:10px; color:#0d110f; }
.ob-check-text { font-size:13px; color:var(--c-muted); line-height:1.65; }
.ob-check-text strong { color:var(--c-text); }

/* BUTTONS */
.ob-btn-primary {
  width:100%; padding:13px; border:none; border-radius:10px; cursor:pointer;
  background:var(--c-green); color:#0d110f;
  font-family:var(--font-ui); font-size:14px; font-weight:600;
  letter-spacing:0;
  transition:background .18s, transform .1s; margin-top:4px;
}
.ob-btn-primary:hover { background:var(--c-green-hi); }
.ob-btn-primary:active { transform:scale(.98); }
.ob-btn-primary:disabled { opacity:.3; cursor:not-allowed; }
.ob-btn-ghost {
  width:100%; padding:12px; border:1px solid var(--c-border2); border-radius:10px; cursor:pointer;
  background:none; color:var(--c-muted);
  font-family:var(--font-ui); font-size:13px; font-weight:500; letter-spacing:0;
  transition:all .18s; margin-top:6px;
}
.ob-btn-ghost:hover { color:var(--c-text); background:var(--c-surf2); }

/* CHOICE CARDS */
.ob-choices { display:flex; flex-direction:column; gap:10px; margin-top:4px; }
.ob-choice {
  padding:22px 22px 20px;
  border:1px solid var(--c-border2); border-radius:12px;
  background:var(--c-surf2); cursor:pointer; text-align:left;
  transition:border-color .18s, background .18s;
}
.ob-choice:hover { border-color:rgba(39,207,131,.5); background:#1a1a1a; }
.ob-choice-label { font-size:14.5px; font-weight:600; margin-bottom:4px; }
.ob-choice-sub { font-family:var(--font-ui); font-size:12px; color:var(--c-muted); }

/* LOADING SCREEN */
.ob-loading-screen {
  position:fixed; inset:0; z-index:500;
  background:var(--c-bg);
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:0;
}
.ob-ball-wrap { display:flex; flex-direction:column; align-items:center; margin-bottom:40px; }
.ob-ball {
  width:52px; height:52px; border-radius:50%;
  background:radial-gradient(circle at 35% 30%, #d4f07e, #7ec850 55%, #5aab30);
  box-shadow:0 0 30px rgba(120,200,80,.35);
  animation:obBounce .65s ease-in-out infinite alternate;
  position:relative;
}
/* Tennis ball seam lines */
.ob-ball::before, .ob-ball::after {
  content:''; position:absolute; border:1.5px solid rgba(255,255,255,.28); border-radius:50%;
}
.ob-ball::before { width:100%; height:40%; top:30%; left:0; transform:rotate(20deg); clip-path:inset(0 0 50% 0); }
.ob-ball::after  { width:100%; height:40%; top:30%; left:0; transform:rotate(-20deg); clip-path:inset(50% 0 0 0); }
.ob-ball-shadow {
  width:36px; height:8px; border-radius:50%;
  background:rgba(0,0,0,.35); margin-top:10px;
  animation:obShadow .65s ease-in-out infinite alternate;
}
@keyframes obBounce { from{transform:translateY(0)} to{transform:translateY(-44px)} }
@keyframes obShadow { from{transform:scaleX(1);opacity:.35} to{transform:scaleX(.4);opacity:.1} }

.ob-loading-caption {
  font-family:var(--font-ui); font-size:13px; font-weight:500;
  color:var(--c-muted);
  animation:obPulse 1.4s ease-in-out infinite;
}
@keyframes obPulse { 0%,100%{opacity:.4} 50%{opacity:1} }

/* SUCCESS SCREEN */
.ob-success { text-align:center; }
.ob-success-icon {
  width:56px; height:56px; border-radius:50%;
  background:rgba(39,207,131,.12); border:1.5px solid rgba(39,207,131,.3);
  display:flex; align-items:center; justify-content:center;
  margin:0 auto 24px; color:var(--c-green);
}
.ob-success-icon svg { width:26px; height:26px; }
.ob-code-display {
  background:var(--c-surf2); border:1px solid var(--c-border2);
  border-radius:10px; padding:18px 20px; margin-bottom:10px;
  display:flex; align-items:center; justify-content:space-between; gap:12px;
}
.ob-code-display-left { text-align:left; }
.ob-code-display-lbl { font-family:var(--font-ui); font-size:11px; font-weight:500; color:var(--c-muted); margin-bottom:6px; }
.ob-code-display-val { font-family:var(--font-mono); font-size:22px; letter-spacing:5px; color:var(--c-text); }
.ob-copy-btn {
  padding:7px 14px; border-radius:6px;
  background:none; border:1px solid var(--c-border2); cursor:pointer;
  font-family:var(--font-ui); font-size:12px; font-weight:500;
  color:var(--c-muted); transition:all .15s; white-space:nowrap; flex-shrink:0;
}
.ob-copy-btn:hover { color:var(--c-green); border-color:rgba(39,207,131,.4); }
.ob-copy-btn.copied { color:var(--c-green); border-color:rgba(39,207,131,.4); }
.ob-warning {
  background:rgba(201,96,96,.07); border:1px solid rgba(201,96,96,.2);
  border-radius:8px; padding:12px 16px; margin:16px 0;
  font-family:var(--font-ui); font-size:13px; color:rgba(201,96,96,.8); line-height:1.7;
}

@media(max-width:600px) { .ob-card { padding:36px 24px 32px; } .ob-fg-2 { grid-template-columns:1fr; } }
`;

// ─── ICONS ───────────────────────────────────────────────────────────────────
const CheckIcon = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3.5 3.5L13 4.5"/></svg>;
const CopyIcon  = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="5" width="8" height="8" rx="2"/><path d="M11 5V3a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/></svg>;

// ─── COPY BUTTON ──────────────────────────────────────────────────────────────
function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button className={`ob-copy-btn${copied ? ' copied' : ''}`} onClick={copy}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

// ─── STEP INDICATORS ─────────────────────────────────────────────────────────
const TOTAL_STEPS = 4; // code, confirm, register, choice (loading/success are not "steps")
function StepBar({ step }) {
  const steps = ['code', 'confirm', 'register', 'choice'];
  const idx = steps.indexOf(step);
  return (
    <div className="ob-steps">
      {steps.map((_, i) => (
        <div key={i} className={`ob-step-dot${i < idx ? ' done' : i === idx ? ' active' : ''}`} />
      ))}
    </div>
  );
}

// ─── MAIN ONBOARD FLOW ────────────────────────────────────────────────────────
export default function OnboardFlow() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const schoolName = new URLSearchParams(window.location.search).get('school') || '';

  // Find the school in our data
  const schoolRecord = SCHOOLS.find(
    s => s.name.toLowerCase() === schoolName.toLowerCase()
  );

  const [step,      setStep]      = useState('code');
  const [codeInput, setCodeInput] = useState('');
  const [codeErr,   setCodeErr]   = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [form,      setForm]      = useState({ firstName: '', lastName: '', email: '', password: '', title: '' });
  const [formErr,   setFormErr]   = useState('');
  const [result,    setResult]    = useState(null); // { slug, officerCode, playerCode }
  const [rosterNow, setRosterNow] = useState(false);

  // Inject styles once
  useEffect(() => {
    const tag = document.createElement('style');
    tag.id = 'ob-styles';
    tag.textContent = OB_STYLES;
    document.head.appendChild(tag);
    return () => { const t = document.getElementById('ob-styles'); if (t) t.remove(); };
  }, []);

  // ── Step 1: Code verification ─────────────────────────────────────────────
  const verifyCode = () => {
    const entered = codeInput.trim().toUpperCase();
    if (entered.length !== 6) { setCodeErr('Please enter the full 6-character code.'); return; }
    if (!schoolRecord) { setCodeErr('This school is not in our system.'); return; }
    if (entered !== schoolRecord.code) { setCodeErr('Incorrect code. Please check and try again.'); return; }
    setCodeErr('');
    setStep('confirm');
  };

  // ── Step 2: Confirm officer status ────────────────────────────────────────
  const proceedConfirm = () => {
    if (!confirmed) return;
    setStep('register');
  };

  // ── Step 3: Officer registration ─────────────────────────────────────────
  const submitRegister = () => {
    const { firstName, lastName, email, password, title } = form;
    if (!firstName || !lastName || !email || !password || !title) {
      setFormErr('All fields are required.'); return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) { setFormErr('Please enter a valid email address.'); return; }
    if (password.length < 8) { setFormErr('Password must be at least 8 characters.'); return; }
    setFormErr('');
    setStep('choice');
  };

  // ── Step 4: Roster choice → launch loading ────────────────────────────────
  const launch = (skipRoster) => {
    setRosterNow(!skipRoster);
    setStep('loading');
    const colors = getSchoolColors(schoolRecord.name);
    const res = enrollSchool({
      name:        schoolRecord.name,
      claimCode:   schoolRecord.code,
      colors,
      officerData: { ...form },
    });
    // Auto-login the founding officer
    const session = {
      id: `${res.slug}_${Date.now()}`,
      firstName: form.firstName,
      lastName:  form.lastName,
      email:     form.email,
      role:      'officer',
      schoolSlug: res.slug,
    };
    login(session);
    setResult(res);
    // Show loading for at least 2.5 seconds
    setTimeout(() => setStep('success'), 2500);
  };

  // ── Success: navigate to school page ──────────────────────────────────────
  const goToPage = () => navigate(`/schools/${result.slug}${rosterNow ? '?open=roster-edit' : ''}`);

  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // ── RENDER ────────────────────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <div className="ob-loading-screen">
        <div className="ob-ball-wrap">
          <div className="ob-ball" />
          <div className="ob-ball-shadow" />
        </div>
        <div className="ob-loading-caption">
          Creating {schoolRecord?.name || schoolName}'s home page...
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="ob-shell">
        <div className="ob-card">
          <div className="ob-success">
            <div className="ob-success-icon"><CheckIcon /></div>
            <div className="ob-title" style={{ fontSize: 36, marginBottom: 8 }}>
              Page Created!
            </div>
            <p className="ob-sub" style={{ marginBottom: 24 }}>
              {schoolRecord?.name}'s home page is live.<br />
              Here are the join codes for officers and players. You can save them now or always access them from {schoolRecord?.name}'s home page.
            </p>

            <div className="ob-code-display">
              <div className="ob-code-display-left">
                <div className="ob-code-display-lbl">Officer Join Code</div>
                <div className="ob-code-display-val">{result?.officerCode}</div>
              </div>
              <CopyButton value={result?.officerCode || ''} />
            </div>

            <div className="ob-code-display">
              <div className="ob-code-display-left">
                <div className="ob-code-display-lbl">Player Join Code</div>
                <div className="ob-code-display-val">{result?.playerCode}</div>
              </div>
              <CopyButton value={result?.playerCode || ''} />
            </div>

            <button className="ob-btn-primary" style={{ marginTop: 24 }} onClick={goToPage}>
              Go to {schoolRecord?.name}'s page →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="ob-nav">
        <div className="ob-nav-logo">SQUAD&nbsp;<span>TENNIS</span></div>
      </nav>
      <div className="ob-shell">
        <div className="ob-card">
          <StepBar step={step} />

          {/* ── STEP 1: CODE ── */}
          {step === 'code' && (
            <>
              <div className="ob-eyebrow">Step 1 of 4 · Verification</div>
              <div className="ob-title">Enter Your<br /><em>School Code</em></div>
              <p className="ob-sub">
                Enter the 6-character claim code for <strong style={{ color: 'var(--c-text)' }}>
                {schoolName || 'your school'}</strong>.<br /><br />
                If you don't know what I'm talking about, email <a href="mailto:arnav.nallani@gmail.com" style={{ color: 'var(--c-accent)' }}>arnav.nallani@gmail.com</a> with evidence that you are an officer of {schoolName || 'your school'} and you are requesting to create its official page. After we verify you, we'll give you the code.
              </p>
              <div className="ob-fg">
                <label className="ob-label">School Code</label>
                <input
                  className={`ob-code-input${codeErr ? ' error' : ''}`}
                  maxLength={6}
                  value={codeInput}
                  onChange={e => { setCodeInput(e.target.value); setCodeErr(''); }}
                  onKeyDown={e => e.key === 'Enter' && verifyCode()}
                  placeholder="———————"
                  autoFocus
                />
                {codeErr && <div className="ob-err">{codeErr}</div>}
              </div>
              <button className="ob-btn-primary" onClick={verifyCode}>
                Verify Code
              </button>
            </>
          )}

          {/* ── STEP 2: CONFIRM ── */}
          {step === 'confirm' && (
            <>
              <div className="ob-eyebrow">Step 2 of 4 · Confirmation</div>
              <div className="ob-title">Confirm<br /><em>Your Role</em></div>
              <p className="ob-sub">
                You're about to create the official Squad Tennis page for <strong style={{ color: 'var(--c-text)' }}>{schoolRecord?.name}</strong>.
              </p>
              <div className="ob-check-row" onClick={() => setConfirmed(c => !c)}>
                <div className={`ob-check-box${confirmed ? ' checked' : ''}`}>
                  {confirmed && <CheckIcon />}
                </div>
                <span className="ob-check-text">
                  I confirm that I am an officer of <strong>{schoolRecord?.name}'s</strong> club tennis team and am authorized to create this page.
                </span>
              </div>
              <button className="ob-btn-primary" onClick={proceedConfirm} disabled={!confirmed}>
                Continue
              </button>
              <button className="ob-btn-ghost" onClick={() => setStep('code')}>
                Back
              </button>
            </>
          )}

          {/* ── STEP 3: REGISTER ── */}
          {step === 'register' && (
            <>
              <div className="ob-eyebrow">Step 3 of 4 · Officer Account</div>
              <div className="ob-title">Create Your<br /><em>Account</em></div>
              <p className="ob-sub">This creates your officer account for {schoolRecord?.name}.</p>
              <div className="ob-fg-2">
                <div className="ob-fg">
                  <label className="ob-label">First Name</label>
                  <input className="ob-input" value={form.firstName} onChange={e => setF('firstName', e.target.value)} placeholder="First" />
                </div>
                <div className="ob-fg">
                  <label className="ob-label">Last Name</label>
                  <input className="ob-input" value={form.lastName} onChange={e => setF('lastName', e.target.value)} placeholder="Last" />
                </div>
              </div>
              <div className="ob-fg">
                <label className="ob-label">Email</label>
                <input className="ob-input" type="email" value={form.email} onChange={e => setF('email', e.target.value)} placeholder="you@university.edu" />
              </div>
              <div className="ob-fg">
                <label className="ob-label">Password</label>
                <input className="ob-input" type="password" value={form.password} onChange={e => setF('password', e.target.value)} placeholder="Min. 8 characters" />
              </div>
              <div className="ob-fg">
                <label className="ob-label">Your Role / Title on the Team</label>
                <input className="ob-input" value={form.title} onChange={e => setF('title', e.target.value)} placeholder="e.g. President, Captain" />
              </div>
              {formErr && <div className="ob-err">{formErr}</div>}
              <button className="ob-btn-primary" onClick={submitRegister}>
                Continue
              </button>
              <button className="ob-btn-ghost" onClick={() => setStep('confirm')}>
                Back
              </button>
            </>
          )}

          {/* ── STEP 4: CHOICE ── */}
          {step === 'choice' && (
            <>
              <div className="ob-eyebrow">Step 4 of 4 · Setup</div>
              <div className="ob-title">Almost<br /><em>There</em></div>
              <p className="ob-sub">
                How would you like to start? You can always add data later.
              </p>
              <div className="ob-choices">
                <div className="ob-choice" onClick={() => launch(false)}>
                  <div className="ob-choice-label">Enter Roster &amp; Results Now</div>
                  <div className="ob-choice-sub">You'll be taken to your page with the roster editor ready to go.</div>
                </div>
                <div className="ob-choice" onClick={() => launch(true)}>
                  <div className="ob-choice-label">Skip — Create Homepage</div>
                  <div className="ob-choice-sub">Generate your page now and add the roster later.</div>
                </div>
              </div>
              <button className="ob-btn-ghost" onClick={() => setStep('register')} style={{ marginTop: 16 }}>
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

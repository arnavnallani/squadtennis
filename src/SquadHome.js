import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SCHOOLS from "./data/schools";
import { getAllEnrolledSchools, getSchoolData } from "./data/schoolStore";
import { useAuth } from "./AuthContext";

// ─── UPCOMING TOURNAMENTS ─────────────────────────────────────────────────────
const UPCOMING_TOURNAMENTS = [
  { name: "UC Berkeley Golden Bears Invitationals", date: "Mar 21–22" },
  { name: "UNR Wolf-Pack Invitational",             date: "Apr 10–12" },
  { name: "UCD Cowtown Showdown",                   date: "May 1–3"   },
];

// ─── TOP PLAYERS — pulled from all enrolled rosters in ladder order ────────────
function getTopPlayers() {
  const gentlemen = [];
  const ladies    = [];
  for (const school of getAllEnrolledSchools()) {
    const data   = getSchoolData(school.slug);
    const roster = data?.roster || [];
    const label  = school.name.split(' ').slice(0, 2).join(' ');
    for (const p of roster) {
      const entry = { name: p.name, school: label, role: p.role || '' };
      if (p.gender === 'F') ladies.push(entry);
      else                  gentlemen.push(entry);
    }
  }
  return { gentlemen: gentlemen.slice(0, 5), ladies: ladies.slice(0, 5) };
}

// ─── COMPUTE ENROLLED COLLEGES FOR STANDINGS ─────────────────────────────────
function getColleges() {
  const lsEnrolled = getAllEnrolledSchools();
  const lsSlugs = new Set(lsEnrolled.map(s => s.slug));
  // Static enrolled schools (e.g. SJSU) — wins not in localStorage, show 0-0
  const staticEntries = STATIC_ENROLLED
    .filter(s => !lsSlugs.has(s.slug))
    .map(s => ({ name: s.name, wins: 0, losses: 0 }));
  // localStorage enrolled schools — read match data
  const lsEntries = lsEnrolled.map(s => {
    const data = getSchoolData(s.slug) || s;
    const ms = data.matches || [];
    return { name: s.name, wins: ms.filter(m => m.result === 'W').length, losses: ms.filter(m => m.result === 'L').length };
  });
  return [...staticEntries, ...lsEntries].sort((a, b) => b.wins - a.wins || a.losses - b.losses);
}

// Static enrolled (hardcoded in data, e.g. SJSU)
const STATIC_ENROLLED = SCHOOLS.filter(s => s.enrolled);

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icons = {
  chevronDown: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6l4 4 4-4"/></svg>,
  arrowRight:  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>,
  search:      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="6.5" cy="6.5" r="4"/><path d="M10.5 10.5L14 14"/></svg>,
  bar:         <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 12V8h3v4H2zM6.5 12V5h3v7h-3zM11 12V7h3v5h-3z"/></svg>,
  globe:       <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="8" cy="8" r="5.5"/><path d="M8 2.5c-2 1.5-2 8 0 11M8 2.5c2 1.5 2 8 0 11M2.5 8h11"/></svg>,
  user:        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="8" cy="6" r="3"/><path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/></svg>,
  logout:      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"/></svg>,
  maleAvatar:  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><circle cx="12" cy="7" r="4"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7H5z"/></svg>,
  femaleAvatar:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><circle cx="12" cy="7" r="4"/><path d="M9 14l-4 7h14l-4-7c-.8.9-1.9 1.5-3 1.5s-2.2-.6-3-1.5z"/></svg>,
  // ── Tennis decorative icons ──
  tennisBall:   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="10" cy="10" r="8.5"/><path d="M2.5 8.5Q10 3 17.5 8.5"/><path d="M2.5 11.5Q10 17 17.5 11.5"/></svg>,
  tennisRacket: <svg viewBox="0 0 18 26" fill="none" stroke="currentColor" strokeLinecap="round"><ellipse cx="9" cy="9.5" rx="7.5" ry="8.5" strokeWidth="1.2"/><line x1="3.5" y1="7" x2="14.5" y2="7" strokeWidth="0.7"/><line x1="2" y1="9.5" x2="16" y2="9.5" strokeWidth="0.7"/><line x1="3.5" y1="12" x2="14.5" y2="12" strokeWidth="0.7"/><line x1="6.5" y1="1.5" x2="6.5" y2="18" strokeWidth="0.7"/><line x1="9" y1="1" x2="9" y2="18" strokeWidth="0.7"/><line x1="11.5" y1="1.5" x2="11.5" y2="18" strokeWidth="0.7"/><line x1="9" y1="18" x2="9" y2="25.5" strokeWidth="2.2" strokeLinecap="round"/></svg>,
  miniCourt:    <svg viewBox="0 0 32 20" fill="none" stroke="currentColor" strokeLinecap="round"><rect x="1" y="1" width="30" height="18" strokeWidth="1.1"/><line x1="16" y1="1" x2="16" y2="19" strokeWidth="1.3"/><line x1="1" y1="4.5" x2="31" y2="4.5" strokeWidth="0.7"/><line x1="1" y1="15.5" x2="31" y2="15.5" strokeWidth="0.7"/><line x1="7" y1="4.5" x2="7" y2="15.5" strokeWidth="0.7"/><line x1="25" y1="4.5" x2="25" y2="15.5" strokeWidth="0.7"/><line x1="7" y1="10" x2="25" y2="10" strokeWidth="0.7"/></svg>,
  tennisPlayer: <svg viewBox="0 0 24 30" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="3.5" r="2.5"/><line x1="9" y1="6" x2="8" y2="17"/><line x1="9" y1="10" x2="19" y2="6.5"/><line x1="9" y1="10" x2="4" y2="13.5"/><line x1="8" y1="17" x2="14" y2="27"/><line x1="8" y1="17" x2="3" y2="26"/><ellipse cx="21.5" cy="5" rx="2.8" ry="3.8" transform="rotate(-35 21.5 5)" strokeWidth="1"/></svg>,
  tennisNet:    <svg viewBox="0 0 30 14" fill="none" stroke="currentColor" strokeLinecap="round"><line x1="2" y1="2" x2="2" y2="13" strokeWidth="1.5"/><line x1="28" y1="2" x2="28" y2="13" strokeWidth="1.5"/><path d="M2 3.5Q15 5 28 3.5" strokeWidth="1.1"/><line x1="2" y1="13" x2="28" y2="13" strokeWidth="0.8"/><line x1="8" y1="4" x2="8" y2="13" strokeWidth="0.55"/><line x1="14" y1="4.5" x2="14" y2="13" strokeWidth="0.55"/><line x1="20" y1="4.5" x2="20" y2="13" strokeWidth="0.55"/><line x1="26" y1="4" x2="26" y2="13" strokeWidth="0.55"/><line x1="2" y1="8" x2="28" y2="8" strokeWidth="0.55"/><line x1="2" y1="11" x2="28" y2="11" strokeWidth="0.55"/></svg>,
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const SQUAD_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600;700&family=Inter:wght@600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --c-bg:        #0d110f;
  --c-surf:      #141813;
  --c-surf2:     #1a1f1b;
  --c-border:    rgba(255,255,255,.06);
  --c-border2:   rgba(255,255,255,.1);
  --c-green:     #27cf83;
  --c-green-hi:  #4de8a0;
  --c-green-glow:rgba(39,207,131,.15);
  --c-text:      #f0ece6;
  --c-muted:     rgba(240,236,230,.38);
  --c-muted2:    rgba(240,236,230,.18);
  --c-win:       #5db882;
  --c-loss:      #c96060;
  --nav-h:       58px;
  --r:           10px;
  --ease:        cubic-bezier(.25,.46,.45,.94);
  --spring:      cubic-bezier(.16,1,.3,1);
  --font-disp:   'Bebas Neue', sans-serif;
  --font-ui:     'DM Sans', sans-serif;
  --font-mono:   'DM Mono', monospace;
}

html { scroll-behavior: smooth; }

body {
  background: var(--c-bg);
  color: var(--c-text);
  font-family: var(--font-ui);
  font-size: 14px;
  line-height: 1.6;
  overflow-x: hidden;
}

/* ── NOISE TEXTURE ── */
body::before {
  content:''; position:fixed; inset:0; z-index:9990; pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity:.022; mix-blend-mode:overlay;
}

/* ── AMBIENT GLOW ── */
.sq-amb {
  position: fixed; pointer-events: none; z-index: 0;
  border-radius: 50%; filter: blur(140px);
  animation: sqAmbFloat 12s ease-in-out infinite alternate;
}
.sq-amb-a { width:700px; height:700px; background:rgba(39,207,131,.06); top:-200px; left:-150px; }
.sq-amb-b { width:500px; height:500px; background:rgba(39,207,131,.04); bottom:-100px; right:-100px; animation-delay:-6s; }
@keyframes sqAmbFloat { from{transform:translate(0,0)} to{transform:translate(30px,40px)} }

/* ── NAV ── */
.sq-nav {
  position: fixed; top:0; left:0; right:0; z-index:100;
  height: var(--nav-h);
  display: flex; align-items: center;
  padding: 0 24px;
  background: rgba(13,17,15,.82);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border-bottom: 1px solid var(--c-border);
}

.sq-nav-logo {
  font-family: var(--font-disp);
  font-size: 18px;
  letter-spacing: 5px; text-transform: uppercase;
  color: var(--c-text); cursor: pointer;
  white-space: nowrap;
  position: absolute; left: 50%; transform: translateX(-50%);
  user-select: none; z-index: 2;
}
.sq-nav-logo span { color: var(--c-green); }

.sq-nav-left, .sq-nav-right {
  display: flex; align-items: center; gap: 4px;
  position: relative; z-index: 1;
  flex: 1;
}
.sq-nav-right { justify-content: flex-end; }

/* Nav button */
.sq-nb {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 11px; border-radius: 7px;
  background: none; border: none; cursor: pointer;
  font-family: var(--font-ui); font-size: 13px; font-weight: 500;
  color: var(--c-muted); letter-spacing: 0;
  transition: color .18s, background .18s;
}
.sq-nb:hover, .sq-nb.active { color: var(--c-text); background: var(--c-surf2); }
.sq-nb .ic { width:14px; height:14px; display:flex; align-items:center; justify-content:center; }
.sq-nb .chev { width:14px; height:14px; transition: transform .2s var(--spring); }
.sq-nb.active .chev { transform: rotate(180deg); }

/* Find a College pill */
.sq-pill {
  padding: 7px 16px; border-radius: 8px; cursor: pointer;
  font-family: var(--font-ui); font-size: 13px; font-weight: 500; letter-spacing: 0;
  background: none;
  border: 1px solid rgba(39,207,131,.55);
  color: var(--c-green);
  transition: all .18s;
}
.sq-pill:hover { background: rgba(39,207,131,.08); color: var(--c-green-hi); border-color: var(--c-green-hi); }

/* ── DROPDOWN ── */
.sq-dd-wrap { position: relative; }
.sq-dd {
  position: absolute; top: calc(100% + 7px);
  background: rgba(13,13,13,.97);
  backdrop-filter: blur(24px);
  border: 1px solid var(--c-border2);
  border-radius: var(--r); min-width: 188px;
  padding: 5px;
  box-shadow: 0 20px 60px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.03);
  animation: sqDdIn .15s var(--spring);
  z-index: 200;
}
@keyframes sqDdIn { from{opacity:0;transform:translateY(-6px)scale(.97)} to{opacity:1;transform:translateY(0)scale(1)} }

.sq-dd-item {
  display: flex; align-items: center; gap: 9px;
  width: 100%; padding: 8px 11px; border-radius: 6px;
  background: none; border: none; cursor: pointer;
  color: var(--c-muted); font-family: var(--font-ui); font-size: 13px;
  transition: background .12s, color .12s; text-align: left; white-space: nowrap;
}
.sq-dd-item:hover { background: var(--c-surf2); color: var(--c-text); }
.sq-dd-item .ic { width: 14px; height: 14px; opacity: .6; transition: opacity .12s; flex-shrink: 0; }
.sq-dd-item:hover .ic { opacity: 1; color: var(--c-green); }

/* ── PAGE ── */
.sq-page { padding-top: var(--nav-h); }

/* ── TOURNAMENT BAR ── */
.sq-tourn-bar {
  display: flex; align-items: center;
  background: rgba(13,17,15,.78);
  border-bottom: 1px solid rgba(255,255,255,.05);
  overflow: hidden; flex-shrink: 0; height: 48px;
}
.sq-tourn-bar-label {
  font-family: var(--font-mono); font-size: 9px; font-weight: 500;
  letter-spacing: 1.5px; text-transform: uppercase; color: var(--c-green);
  white-space: nowrap; flex-shrink: 0; padding: 0 20px;
  border-right: 1px solid var(--c-border); height: 100%;
  display: flex; align-items: center;
}
.sq-tourn-bar-items {
  display: flex; align-items: stretch; flex: 1; overflow-x: auto; height: 100%;
  scrollbar-width: none;
}
.sq-tourn-bar-items::-webkit-scrollbar { display: none; }
.sq-tourn-bar-item {
  display: flex; align-items: center; gap: 10px;
  padding: 0 20px; border-right: 1px solid var(--c-border);
  white-space: nowrap; flex-shrink: 0;
}
.sq-tourn-bar-name { font-size: 12px; font-weight: 500; color: var(--c-text); }
.sq-tourn-bar-date {
  font-family: var(--font-mono); font-size: 10px; color: var(--c-green);
  letter-spacing: .5px; background: rgba(39,207,131,.07);
  padding: 2px 8px; border-radius: 4px;
}

/* ── HOME MAIN GRID ── */
.sq-home-grid {
  display: grid;
  grid-template-columns: 1fr 305px 220px;
  border-bottom: 1px solid var(--c-border);
  min-height: calc(100vh - var(--nav-h) - 48px);
}

/* ── HERO ── */
.sq-hero {
  position: relative; overflow: hidden;
  padding: 56px 64px 56px 72px;
  display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;
  text-align: left;
  background-color: #0d110f;
  background-image:
    linear-gradient(to bottom, rgba(13,17,15,.88) 0%, rgba(13,17,15,.6) 40%, rgba(13,17,15,.6) 60%, rgba(13,17,15,.97) 100%);
}

/* ── SIDE PANELS ── */
.sq-side-panel {
  border-left: 1px solid rgba(0,0,0,.15);
  display: flex; flex-direction: column; overflow: hidden;
  background: #152618;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
.sq-side-panel-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 20px 16px;
  border-bottom: 1px solid rgba(0,0,0,.2);
  border-top: 3px solid rgba(255,255,255,.25);
  flex-shrink: 0;
  background: rgba(0,0,0,.15);
}
.sq-side-panel-title {
  font-family: var(--font-disp); font-size: 20px; letter-spacing: 2px;
  color: #ffffff; line-height: 1; text-shadow: 0 1px 3px rgba(0,0,0,.3);
}
.sq-side-panel-body { flex: 1; overflow-y: auto; }
.sq-side-panel-body::-webkit-scrollbar { width: 3px; }
.sq-side-panel-body::-webkit-scrollbar-track { background: transparent; }
.sq-side-panel-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,.25); border-radius: 2px; }
.sq-panel-item {
  padding: 13px 20px; border-bottom: 1px solid rgba(0,0,0,.12);
  cursor: pointer; transition: background .15s;
}
.sq-panel-item:last-child { border-bottom: none; }
.sq-panel-item:hover { background: rgba(0,0,0,.1); }

.sq-hero-grid {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}


.sq-hero-eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--font-ui); font-size: 11px; font-weight: 500;
  color: var(--c-green); letter-spacing: 1px; text-transform: uppercase;
  margin-bottom: 20px;
}
.sq-hero-eyebrow::after {
  content: ''; flex: 1; max-width: 100px; height: 1px; background: var(--c-green);
}

.sq-hero-h1 {
  font-family: var(--font-disp);
  font-size: clamp(52px, 6vw, 96px);
  font-weight: 400;
  line-height: .92;
  letter-spacing: 3px; color: var(--c-text);
}
.sq-hero-h1 em { font-style: normal; color: var(--c-green); }

.sq-hero-sub {
  margin-top: 20px;
  font-family: var(--font-ui); font-size: 14px;
  color: rgba(240,236,230,.5); line-height: 1.7;
}

/* ── COUNTDOWN ── */
.sq-countdown-wrap {
  margin-top: 40px;
  display: flex; flex-direction: column; gap: 14px;
}
.sq-countdown-label {
  display: flex; flex-direction: column; gap: 3px;
}
.sq-countdown-event {
  font-family: var(--font-ui); font-size: 10px; font-weight: 600;
  color: var(--c-green); letter-spacing: 2px; text-transform: uppercase;
}
.sq-countdown-date-str {
  font-family: var(--font-mono); font-size: 10px; color: var(--c-muted);
  letter-spacing: 1px;
}
.sq-countdown-units {
  display: flex; align-items: flex-end; gap: 0;
}
.sq-countdown-unit {
  display: flex; flex-direction: column; align-items: center;
  padding: 0 20px 0 0;
  position: relative;
}
.sq-countdown-unit:not(:last-child)::after {
  content: ':';
  position: absolute; right: 7px; top: 6px;
  font-family: var(--font-disp); font-size: 40px;
  color: rgba(39,207,131,.25); line-height: 1;
}
.sq-countdown-num {
  font-family: var(--font-disp);
  font-size: clamp(48px, 5.5vw, 76px);
  line-height: 1; letter-spacing: 2px;
  color: var(--c-text);
  font-variant-numeric: tabular-nums;
  min-width: 3ch; text-align: center;
  background: linear-gradient(180deg, var(--c-text) 0%, rgba(240,236,230,.55) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.sq-countdown-num.urgent {
  background: linear-gradient(180deg, var(--c-green) 0%, rgba(39,207,131,.5) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.sq-countdown-sublabel {
  font-family: var(--font-mono); font-size: 8px;
  color: var(--c-muted); letter-spacing: 2px; text-transform: uppercase;
  margin-top: 6px;
}
.sq-countdown-divider {
  width: 40px; height: 1px;
  background: linear-gradient(90deg, var(--c-green) 0%, transparent 100%);
  margin-top: 14px;
}

@keyframes sqRiseIn  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
@keyframes sqFadeIn  { from{opacity:0} to{opacity:1} }

/* ── SECTION ── */
.sq-section {
  padding: 80px 72px 60px;
  border-top: 1px solid var(--c-border);
  position: relative;
}
.sq-section-tag {
  font-family: var(--font-ui); font-size: 11px; font-weight: 500;
  color: var(--c-muted); letter-spacing: 0.5px; text-transform: uppercase;
  display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
}
.sq-section-tag::after { content:''; flex:1; height:1px; background:var(--c-border); max-width:80px; }

.sq-section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 36px; }
.sq-section-h2 {
  font-family: var(--font-disp); font-size: clamp(38px,5vw,58px);
  font-weight: 400; line-height: .95; letter-spacing: 2px;
}

/* ── VIEW ALL BUTTON ── */
.sq-view-all {
  display: flex; align-items: center; gap: 5px;
  font-family: var(--font-ui); font-size: 11px; font-weight: 600;
  color: rgba(255,255,255,.85); letter-spacing: .5px; text-transform: uppercase;
  background: none; border: none;
  padding: 5px 10px 5px 0; cursor: pointer;
  transition: color .18s, gap .2s var(--spring);
}
.sq-view-all:hover { color: #ffffff; gap: 8px; }
.sq-view-all .ic { width: 13px; height: 13px; transition: transform .2s var(--spring); }
.sq-view-all:hover .ic { transform: translateX(3px); }

/* ── STANDINGS TABLE ── */
.sq-lb {
  border: 1.5px solid var(--c-border);
  border-radius: 16px; overflow: hidden;
  max-width: 900px; width: 100%;
  box-shadow: 0 4px 32px rgba(0,0,0,.18);
}
.sq-lb-head {
  display: grid; grid-template-columns: 72px 1fr 72px 72px;
  padding: 14px 28px;
  background: rgba(255,255,255,.03);
  border-bottom: 1.5px solid var(--c-border);
}
.sq-lb-head-lbl {
  font-family: var(--font-ui); font-size: 12px; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase; color: var(--c-muted2);
  text-align: center;
}
.sq-lb-head-lbl:nth-child(2) { text-align: left; }
.sq-lb-row {
  display: grid; grid-template-columns: 72px 1fr 72px 72px;
  align-items: center; padding: 18px 28px;
  border-bottom: 1px solid var(--c-border);
  transition: background .15s; cursor: default;
}
.sq-lb-row:last-child { border-bottom: none; }
.sq-lb-row:hover { background: rgba(255,255,255,.03); }
.sq-lb-rank-wrap {
  display: flex; align-items: center; justify-content: center;
}
.sq-lb-rank {
  font-family: var(--font-disp); font-size: 20px; font-weight: 400;
  font-variant-numeric: tabular-nums;
  color: var(--c-muted2);
  width: 36px; text-align: center;
}
.sq-lb-rank.top {
  color: var(--c-green);
  font-weight: 600;
}
.sq-lb-school { font-size: 15.5px; font-weight: 600; text-align: left; }
.sq-lb-stat {
  font-family: var(--font-mono); font-size: 14px; font-weight: 600; color: var(--c-muted); text-align: center;
}

.sq-empty {
  padding: 56px 0; text-align: center;
  font-family: var(--font-ui); font-size: 13px; font-weight: 500;
  color: rgba(255,255,255,.7); line-height: 2;
}
.sq-empty-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(255,255,255,.5); opacity: .6;
  margin: 0 auto 16px;
}

/* ── SEARCH BAR ── */
.sq-search-wrap {
  position: relative; max-width: 380px; margin-bottom: 28px;
}
.sq-search-icon {
  position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
  width: 18px; height: 18px; color: var(--c-muted); pointer-events: none;
}
.sq-search {
  width: 100%; padding: 15px 20px 15px 50px;
  background: var(--c-surf); border: 1.5px solid var(--c-border);
  border-radius: 12px; color: var(--c-text);
  font-family: var(--font-ui); font-size: 15px;
  outline: none;
  transition: border-color .18s, box-shadow .18s;
}
.sq-search:focus { border-color: rgba(39,207,131,.5); box-shadow: 0 0 0 3px rgba(39,207,131,.08); }
.sq-search::placeholder { color: var(--c-muted2); }

/* ── PAGE HERO (inner pages) ── */
.sq-page-hero {
  padding: 72px 72px 52px;
  border-bottom: 1px solid var(--c-border);
  position: relative; overflow: hidden;
}
.sq-page-hero::after {
  content: attr(data-word);
  position: absolute; right: 48px; bottom: -24px;
  font-family: var(--font-disp); font-size: clamp(90px, 16vw, 190px);
  font-weight: 400; color: transparent;
  -webkit-text-stroke: 1px rgba(39,207,131,.05);
  line-height: 1; pointer-events: none; user-select: none;
  letter-spacing: 4px;
}
.sq-page-eyebrow {
  font-family: var(--font-ui); font-size: 11px; font-weight: 500;
  letter-spacing: 0.5px; text-transform: uppercase; color: var(--c-muted);
  margin-bottom: 12px;
}
.sq-page-h1 {
  font-family: var(--font-disp); font-size: clamp(48px,8vw,90px);
  font-weight: 400; line-height: .92; letter-spacing: 3px;
}

/* ── FOOTER ── */
.sq-footer {
  border-top: 1px solid var(--c-border);
  padding: 36px 72px;
  display: flex; justify-content: space-between; align-items: center;
}
.sq-footer-logo { font-family: var(--font-disp); font-size: 20px; letter-spacing: 4px; text-transform: uppercase; }
.sq-footer-logo span { color: var(--c-green); }
.sq-footer-right { font-family: var(--font-ui); font-size: 12px; color: var(--c-muted); text-align: right; line-height: 2; }

/* ── SCROLL REVEAL ── */
.sq-reveal.in, .sq-reveal.in-2, .sq-reveal.in-3 { opacity: 1; }

/* ── FIND COLLEGE MODAL ── */
.fc-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,.5);
  backdrop-filter: blur(20px) saturate(160%);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 100px 16px 16px;
  animation: sqFadeIn .14s ease;
}
.fc-panel {
  width: 100%; max-width: 580px;
  background: #141813;
  border: 1px solid rgba(255,255,255,.11);
  border-radius: 14px;
  box-shadow: 0 48px 100px rgba(0,0,0,.92), 0 0 0 1px rgba(255,255,255,.04);
  overflow: hidden;
  animation: sqRiseIn .18s var(--spring);
  max-height: calc(100vh - 120px);
  display: flex; flex-direction: column;
}
.fc-search-zone {
  display: flex; align-items: center; gap: 16px;
  padding: 0 22px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  flex-shrink: 0;
}
.fc-search-icon {
  width: 20px; height: 20px; flex-shrink: 0;
  color: rgba(240,236,230,.28); pointer-events: none;
}
.fc-input {
  flex: 1; padding: 22px 0;
  background: none; border: none;
  color: var(--c-text);
  font-family: var(--font-ui); font-size: 17px; font-weight: 400;
  outline: none;
}
.fc-input::placeholder { color: rgba(240,236,230,.22); }
.fc-esc {
  font-family: var(--font-mono); font-size: 11px; letter-spacing: .5px; text-transform: uppercase;
  color: rgba(240,236,230,.22);
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 5px; padding: 4px 9px;
  cursor: pointer; flex-shrink: 0;
  transition: color .15s, background .15s;
}
.fc-esc:hover { color: rgba(240,236,230,.5); background: rgba(255,255,255,.08); }
.fc-body {
  flex: 1; overflow-y: auto;
  padding: 6px 0 12px;
}
.fc-body::-webkit-scrollbar { width: 3px; }
.fc-body::-webkit-scrollbar-track { background: transparent; }
.fc-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,.08); border-radius: 2px; }
.fc-list-label {
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 1.5px;
  text-transform: uppercase; color: rgba(240,236,230,.22);
  padding: 16px 24px 8px;
}
.fc-item {
  display: flex; align-items: center; gap: 16px;
  width: 100%; padding: 14px 24px;
  background: none; border: none; cursor: pointer;
  color: var(--c-text); text-align: left;
  transition: background .1s;
}
.fc-item:hover { background: rgba(255,255,255,.045); }
.fc-item-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
  background: rgba(255,255,255,.12);
}
.fc-item-dot.on { background: var(--c-green); box-shadow: 0 0 6px rgba(39,207,131,.35); }
.fc-item-name {
  flex: 1; font-size: 15px; font-weight: 400;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.fc-item-arrow {
  width: 15px; height: 15px; flex-shrink: 0;
  color: rgba(240,236,230,.14);
  transition: color .15s, transform .2s var(--spring);
}
.fc-item:hover .fc-item-arrow { color: var(--c-green); transform: translateX(3px); }
.fc-not-found { padding: 36px 24px 28px; }
.fc-nf-query {
  font-family: var(--font-disp); font-size: 36px; letter-spacing: 2px;
  color: var(--c-text); line-height: 1; margin-bottom: 10px;
}
.fc-nf-text {
  font-family: var(--font-ui); font-size: 14px; color: rgba(240,236,230,.35);
  line-height: 1.6; margin-bottom: 24px;
}
.fc-yes-btn {
  display: inline-flex; align-items: center;
  padding: 11px 22px;
  background: rgba(39,207,131,.09);
  color: var(--c-green);
  border: 1px solid rgba(39,207,131,.22);
  border-radius: 9px; cursor: pointer;
  font-family: var(--font-ui); font-size: 14px; font-weight: 500;
  transition: background .18s, border-color .18s;
}
.fc-yes-btn:hover { background: rgba(39,207,131,.17); border-color: rgba(39,207,131,.38); }
.fc-empty-enrolled {
  padding: 32px 24px;
  font-family: var(--font-ui); font-size: 14px;
  color: rgba(240,236,230,.22);
}

/* ── ONBOARD PAGE ── */
.ob-page {
  padding-top: var(--nav-h);
  min-height: 100vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding-left: 24px; padding-right: 24px;
}
.ob-eyebrow {
  font-family: var(--font-ui); font-size: 11px; font-weight: 500;
  letter-spacing: 0.5px; text-transform: uppercase; color: var(--c-green);
  margin-bottom: 18px;
}
.ob-h1 {
  font-family: var(--font-disp); font-size: clamp(42px, 7vw, 80px);
  letter-spacing: 2px; line-height: .95; margin-bottom: 20px;
}
.ob-sub {
  font-family: var(--font-ui); font-size: 14px;
  color: var(--c-muted); line-height: 1.7;
  max-width: 380px; margin: 0 auto 32px;
}
.ob-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 20px; border-radius: 20px;
  border: 1px solid var(--c-border2); color: var(--c-muted);
  font-family: var(--font-ui); font-size: 12px; font-weight: 500;
  cursor: default;
}

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .sq-hero { padding: 64px 24px; }
  .sq-section { padding-left: 24px; padding-right: 24px; }
  .sq-page-hero { padding: 52px 24px 40px; }
  .sq-footer { padding-left: 24px; padding-right: 24px; flex-direction: column; gap: 16px; text-align: center; }
  .sq-hero-grid, .sq-amb { display: none; }
  .sq-lb { max-width: 100%; }
  .fc-panel { max-height: calc(100vh - 80px); }
  .sq-home-grid { grid-template-columns: 1fr; }
  .sq-side-panel { border-left: none; border-top: 1px solid var(--c-border); min-height: 280px; }
  .sq-hero-h1 { max-width: 90%; font-size: clamp(48px, 10vw, 80px); }
}
/* ── HAMBURGER MENU ── */
.sq-hb-wrap { position: relative; display: none; }
.sq-hb-btn {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: 7px;
  background: none; border: none; cursor: pointer;
  color: var(--c-muted); transition: color .18s, background .18s;
}
.sq-hb-btn:hover, .sq-hb-btn.active { color: var(--c-text); background: var(--c-surf2); }
.sq-hb-lines { display: flex; flex-direction: column; gap: 4px; width: 16px; }
.sq-hb-lines span { display: block; width: 16px; height: 1.5px; background: currentColor; border-radius: 1px; }
.sq-hb-dd {
  position: absolute; top: calc(100% + 7px); left: 0;
  background: rgba(13,13,13,.97); backdrop-filter: blur(24px);
  border: 1px solid var(--c-border2); border-radius: var(--r);
  min-width: 200px; padding: 5px;
  box-shadow: 0 20px 60px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.03);
  animation: sqDdIn .15s var(--spring); z-index: 200;
}
.sq-hb-sec-btn {
  display: flex; align-items: center; gap: 9px;
  width: 100%; padding: 8px 11px; border-radius: 6px;
  background: none; border: none; cursor: pointer;
  color: var(--c-muted); font-family: var(--font-ui); font-size: 13px; font-weight: 500;
  transition: background .12s, color .12s; text-align: left;
}
.sq-hb-sec-btn:hover, .sq-hb-sec-btn.open { color: var(--c-text); background: var(--c-surf2); }
.sq-hb-chev { width: 14px; height: 14px; margin-left: auto; transition: transform .2s var(--spring); flex-shrink: 0; }
.sq-hb-sec-btn.open .sq-hb-chev { transform: rotate(180deg); }
.sq-hb-items { padding: 2px 0 2px 20px; }
.sq-hb-item {
  display: flex; align-items: center; gap: 9px;
  width: 100%; padding: 7px 11px; border-radius: 6px;
  background: none; border: none; cursor: pointer;
  color: var(--c-muted); font-family: var(--font-ui); font-size: 13px;
  transition: background .12s, color .12s; text-align: left;
}
.sq-hb-item:hover { background: var(--c-surf2); color: var(--c-text); }
.sq-hb-item .ic { width: 14px; height: 14px; opacity: .6; flex-shrink: 0; }
.sq-hb-item:hover .ic { opacity: 1; }

@media (max-width: 600px) {
  .sq-nav { padding: 0 10px; }
  .sq-nav-logo { font-size: 13px; letter-spacing: 2px; }
  .sq-nav-left, .sq-nav-right { gap: 2px; }
  .sq-pill { padding: 5px 10px; font-size: 11px; letter-spacing: 0; }
  .sq-nav-left .sq-dd-wrap { display: none; }
  .sq-hb-wrap { display: block; }
}
`;

// ─── COUNTDOWN HOOK ───────────────────────────────────────────────────────────
const UCB_INVITATIONAL = new Date('2026-03-21T09:00:00');

function useCountdown(target) {
  const calc = () => {
    const diff = target - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// ─── SCROLL REVEAL HOOK ────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.sq-reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.classList.add(`in${i % 3 === 1 ? '-2' : i % 3 === 2 ? '-3' : ''}`);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

// ─── NAV DROPDOWN ─────────────────────────────────────────────────────────────
function Dropdown({ items, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <div ref={ref} className="sq-dd">
      {items.map((item, i) =>
        item.sep
          ? <div key={i} style={{ height: 1, background: 'rgba(255,255,255,.06)', margin: '4px 0' }} />
          : <button key={i} className="sq-dd-item" onClick={() => { item.action(); onClose(); }}>
              <span className="ic">{item.icon}</span>{item.label}
            </button>
      )}
    </div>
  );
}

function NavMenu({ label, icon, items }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <div className="sq-dd-wrap">
      <button className={`sq-nb${open ? ' active' : ''}`} onClick={() => setOpen(o => !o)}>
        <span className="ic">{icon}</span><span className="sq-nb-label">{label}</span>
        <span className="chev ic">{Icons.chevronDown}</span>
      </button>
      {open && <Dropdown items={items} onClose={close} />}
    </div>
  );
}

// ─── HAMBURGER MENU ───────────────────────────────────────────────────────────
function HamburgerMenu({ sections }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="sq-hb-wrap" ref={ref}>
      <button className={`sq-hb-btn${open ? ' active' : ''}`} onClick={() => setOpen(o => !o)}>
        <span className="sq-hb-lines"><span/><span/><span/></span>
      </button>
      {open && (
        <div className="sq-hb-dd">
          {sections.map(sec => (
            <div key={sec.label}>
              <button
                className={`sq-hb-sec-btn${expanded === sec.label ? ' open' : ''}`}
                onClick={() => setExpanded(s => s === sec.label ? null : sec.label)}
              >
                <span className="ic">{sec.icon}</span>
                {sec.label}
                <span className="sq-hb-chev">{Icons.chevronDown}</span>
              </button>
              {expanded === sec.label && (
                <div className="sq-hb-items">
                  {sec.items.filter(item => !item.sep).map((item, i) => (
                    <button key={i} className="sq-hb-item" onClick={() => { item.action(); setOpen(false); setExpanded(null); }}>
                      <span className="ic">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FIND COLLEGE MODAL ───────────────────────────────────────────────────────

function FindCollegeModal({ onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  // Auto-focus
  useEffect(() => { inputRef.current?.focus(); }, []);

  const trimmed = query.trim();

  // Merge static enrolled + localStorage enrolled for default view
  const lsEnrolled = getAllEnrolledSchools();
  const defaultList = [
    ...STATIC_ENROLLED,
    ...lsEnrolled.filter(ls => !STATIC_ENROLLED.some(s => s.slug === ls.slug)),
  ];

  const results = trimmed.length > 0
    ? SCHOOLS.filter(s => s.name.toLowerCase().includes(trimmed.toLowerCase()))
    : defaultList;

  const noMatch = trimmed.length > 2 && results.length === 0;

  const handleSchoolClick = school => {
    if (school.officerCode) {
      // localStorage-enrolled school → dynamic school page
      navigate(`/schools/${school.slug}`);
    } else if (school.enrolled && school.slug) {
      // Static enrolled (e.g. SJSU legacy route)
      navigate(`/${school.slug}`);
    } else {
      navigate(`/onboard?school=${encodeURIComponent(school.name)}`);
    }
    onClose();
  };

  return (
    <div className="fc-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fc-panel">
        <div className="fc-search-zone">
          <span className="fc-search-icon">{Icons.search}</span>
          <input
            ref={inputRef}
            className="fc-input"
            placeholder="Search colleges..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="fc-esc" onClick={onClose}>esc</button>
        </div>

        <div className="fc-body">
          {noMatch ? (
            <div className="fc-not-found">
              <div className="fc-nf-query">{trimmed}</div>
              <div className="fc-nf-text">
                We couldn't find <strong style={{ color: 'var(--c-text)', fontWeight: 600 }}>"{trimmed}"</strong>. Do you want to create the home page for it right now?
              </div>
              <button
                className="fc-yes-btn"
                onClick={() => { navigate(`/onboard?school=${encodeURIComponent(trimmed)}`); onClose(); }}
              >
                Yes, create it
              </button>
            </div>
          ) : (
            <>
              <div className="fc-list-label">
                {trimmed ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'Enrolled'}
              </div>
              {!trimmed && results.length === 0 && (
                <div className="fc-empty-enrolled">No colleges enrolled yet.</div>
              )}
              {results.map(school => (
                <button key={school.code} className="fc-item" onClick={() => handleSchoolClick(school)}>
                  <div className={`fc-item-dot${school.enrolled ? ' on' : ''}`} />
                  <div className="fc-item-name">{school.name}</div>
                  <span className="fc-item-arrow">{Icons.arrowRight}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SCHOOL HOME PILL ─────────────────────────────────────────────────────────
function SchoolHomePill({ label, color, onClick }) {
  const [hov, setHov] = useState(false);
  const shortLabel = label.replace(/ Tennis Home$/, '');
  return (
    <button
      style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        padding: '6px 10px', borderRadius: '6px',
        background: hov ? `${color}4a` : `${color}30`,
        border: 'none', cursor: 'pointer',
        fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600,
        letterSpacing: '1.5px', textTransform: 'uppercase',
        color: hov ? 'rgba(240,236,230,.92)' : 'rgba(240,236,230,.6)',
        transition: 'color .15s, background .15s', whiteSpace: 'nowrap',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
    >
      <span style={{
        fontSize: '9px', flexShrink: 0,
        color: hov ? color : `${color}99`,
        transition: 'color .15s',
      }}>◂</span>
      {shortLabel}
    </button>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function SquadNav({ onHome, onFindCollege }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [accOpen, setAccOpen] = useState(false);
  const closeAcc = useCallback(() => setAccOpen(false), []);

  const schoolPath = user
    ? user.schoolSlug === 'sjsu' ? '/sjsu' : `/schools/${user.schoolSlug}`
    : null;

  // Resolve school display name and color for the school home pill
  const schoolPillInfo = user ? (() => {
    if (user.schoolSlug === 'sjsu') return { label: 'SJSU Tennis Home', color: '#c9a96e' };
    const data = getSchoolData(user.schoolSlug);
    const color = data?.accent || '#3dba6f';
    const rawName = data?.name || user.schoolSlug.toUpperCase();
    const abbrev = rawName
      .replace(/University|College|State|of\b|the\b|at\b/gi, '')
      .replace(/\s+/g, ' ').trim()
      .split(' ').slice(0, 2).join(' ');
    return { label: `${abbrev || user.schoolSlug.toUpperCase()} Tennis Home`, color };
  })() : null;

  const viewItems = [
    { icon: Icons.bar, label: 'Standings', action: () => navigate('/standings') },
  ];

  const accItems = [
    { icon: Icons.logout, label: 'Log Out', action: () => { logout(); setAccOpen(false); } },
  ];

  const hamburgerSections = [
    { label: 'View', icon: Icons.bar, items: viewItems },
  ];

  return (
    <nav className="sq-nav">
      <div className="sq-nav-left">
        <HamburgerMenu sections={hamburgerSections} />
        <NavMenu label="View" icon={Icons.bar} items={viewItems} />
        {user && schoolPillInfo && (
          <SchoolHomePill
            label={schoolPillInfo.label}
            color={schoolPillInfo.color}
            onClick={() => navigate(schoolPath)}
          />
        )}
      </div>

      <div className="sq-nav-logo" onClick={onHome} data-hover>
        SQUAD&nbsp;<span>TENNIS</span>
      </div>

      <div className="sq-nav-right">
        <button className="sq-pill" onClick={onFindCollege}>Find a College</button>
        {user && (
          <div className="sq-dd-wrap">
            <button className={`sq-nb${accOpen ? ' active' : ''}`} onClick={() => setAccOpen(o => !o)}>
              <span className="ic">{Icons.user}</span>
              {user.firstName}
              <span className="chev ic">{Icons.chevronDown}</span>
            </button>
            {accOpen && <Dropdown items={accItems} onClose={closeAcc} />}
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── STANDINGS TABLE ──────────────────────────────────────────────────────────
function StandingsTable({ colleges, limit }) {
  const shown = limit ? colleges.slice(0, limit) : colleges;
  return (
    <div className="sq-lb sq-reveal">
      <div className="sq-lb-head">
        <span className="sq-lb-head-lbl">#</span>
        <span className="sq-lb-head-lbl">College</span>
        <span className="sq-lb-head-lbl">W</span>
        <span className="sq-lb-head-lbl">L</span>
      </div>
      {shown.length === 0 ? (
        <div className="sq-empty">
          <div className="sq-empty-dot" />
          No colleges enrolled yet
        </div>
      ) : (
        shown.map((c, i) => (
          <div key={c.name} className="sq-lb-row">
            <div className="sq-lb-rank-wrap">
              <div className={`sq-lb-rank${i < 3 ? ' top' : ''}`}>{i + 1}</div>
            </div>
            <div className="sq-lb-school">{c.name}</div>
            <div className="sq-lb-stat">{c.wins}</div>
            <div className="sq-lb-stat">{c.losses}</div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── TENNIS COURT GEOMETRIC BACKGROUND ───────────────────────────────────────
function TennisCourtBg() {
  // Three courts stacked vertically, like an aerial view of a facility.
  // Court geometry follows real proportions (feet × scale S).
  const W  = 1400;
  const cx = W / 2; // 700 — horizontal centre
  const S  = 15;    // px per foot

  const halfL  = 39   * S; // 382.2 — half court length (baseline → net)
  const halfW  = 18   * S; // 176.4 — half doubles width
  const halfWs = 13.5 * S; // 132.3 — half singles width
  const svcD   = 21   * S; // 205.8 — net → service line distance

  // Gap between courts: ~10 ft of clearance behind each baseline (standard minimum)
  const gap = 10 * S; // 98px

  // Total height: 3 courts + 2 gaps, with equal padding top/bottom
  const courtH = halfW * 2;
  const totalH = courtH * 3 + gap * 2;
  const pad    = 52; // top/bottom breathing room
  const H      = totalH + pad * 2;

  // Vertical centres of the three courts
  const CY = [
    pad + halfW,
    pad + halfW + courtH + gap,
    pad + halfW + (courtH + gap) * 2,
  ];

  // x-axis coordinates (same for all courts — same width)
  const xL  = cx - halfL;
  const xR  = cx + halfL;
  const xSL = cx - svcD;
  const xSR = cx + svcD;

  const g = o => `rgba(39,207,131,${o * 1.5})`;

  // Render one complete court centred on `cy`
  const Court = ({ cy: c }) => {
    const yT  = c - halfW;
    const yB  = c + halfW;
    const yTS = c - halfWs;
    const yBS = c + halfWs;

    const junctions = [
      [xSL, yTS],[cx, yTS],[xSR, yTS],
      [xSL, yBS],[cx, yBS],[xSR, yBS],
      [xSL, c],  [xSR, c],
      [cx,  yT], [cx,  yB],
    ];
    const corners = [[xL,yT],[xR,yT],[xL,yB],[xR,yB]];

    return (
      <g fill="none">
        {/* ── Court lines ── */}
        {/* Doubles outline */}
        <rect x={xL} y={yT} width={halfL*2} height={halfW*2}
          stroke={g(0.15)} strokeWidth="1.3"/>
        {/* Singles sidelines */}
        <line x1={xL}  y1={yTS} x2={xR} y2={yTS} stroke={g(0.12)} strokeWidth="1.1"/>
        <line x1={xL}  y1={yBS} x2={xR} y2={yBS} stroke={g(0.12)} strokeWidth="1.1"/>
        {/* Net */}
        <line x1={cx} y1={yT} x2={cx} y2={yB} stroke={g(0.15)} strokeWidth="1.3"/>
        {/* Service lines */}
        <line x1={xSL} y1={yTS} x2={xSL} y2={yBS} stroke={g(0.12)} strokeWidth="1.1"/>
        <line x1={xSR} y1={yTS} x2={xSR} y2={yBS} stroke={g(0.12)} strokeWidth="1.1"/>
        {/* Centre service line */}
        <line x1={xSL} y1={c} x2={xSR} y2={c} stroke={g(0.12)} strokeWidth="1.1"/>
        {/* Baseline centre marks */}
        <line x1={xL} y1={c-9} x2={xL} y2={c+9} stroke={g(0.17)} strokeWidth="1.05"/>
        <line x1={xR} y1={c-9} x2={xR} y2={c+9} stroke={g(0.17)} strokeWidth="1.05"/>

        {/* ── Decorative details ── */}
        {/* Junction circles (inner + outer ring) */}
        {junctions.map(([x, y], i) => (
          <g key={`j${i}`}>
            <circle cx={x} cy={y} r="3"   stroke={g(0.19)} strokeWidth="0.6"/>
            <circle cx={x} cy={y} r="6.5" stroke={g(0.07)} strokeWidth="0.38"/>
          </g>
        ))}
        {/* Diamond + outer ring at each court corner */}
        {corners.map(([x, y], i) => (
          <g key={`c${i}`}>
            <rect x={x-4.5} y={y-4.5} width="9" height="9"
              transform={`rotate(45,${x},${y})`}
              stroke={g(0.21)} strokeWidth="0.7"/>
            <rect x={x-9} y={y-9} width="18" height="18"
              transform={`rotate(45,${x},${y})`}
              stroke={g(0.09)} strokeWidth="0.4"/>
          </g>
        ))}
        {/* L-bracket accents — doubles corners */}
        {[[xL,yT,1,1],[xR,yT,-1,1],[xL,yB,1,-1],[xR,yB,-1,-1]].map(([x,y,sx,sy],i) => (
          <g key={`ld${i}`} stroke={g(0.17)} strokeWidth="0.8" strokeLinecap="round">
            <line x1={x} y1={y} x2={x+sx*38} y2={y}/>
            <line x1={x} y1={y} x2={x}       y2={y+sy*38}/>
          </g>
        ))}
        {/* L-bracket accents — singles corners */}
        {[[xL,yTS,1,1],[xR,yTS,-1,1],[xL,yBS,1,-1],[xR,yBS,-1,-1]].map(([x,y,sx,sy],i) => (
          <g key={`ls${i}`} stroke={g(0.11)} strokeWidth="0.6" strokeLinecap="round">
            <line x1={x} y1={y} x2={x+sx*22} y2={y}/>
            <line x1={x} y1={y} x2={x}       y2={y+sy*22}/>
          </g>
        ))}
        {/* Net post marks */}
        <line x1={cx-4} y1={yT-7} x2={cx+4} y2={yT-7} stroke={g(0.16)} strokeWidth="0.7"/>
        <line x1={cx-4} y1={yB+7} x2={cx+4} y2={yB+7} stroke={g(0.16)} strokeWidth="0.7"/>
        <line x1={cx}   y1={yT-3} x2={cx}   y2={yT-11} stroke={g(0.12)} strokeWidth="0.55"/>
        <line x1={cx}   y1={yB+3} x2={cx}   y2={yB+11} stroke={g(0.12)} strokeWidth="0.55"/>
        {/* Tick marks along net */}
        {Array.from({ length: Math.floor((yB - yT) / 22) }, (_, i) => {
          const y = yT + 11 + i * 22;
          return <line key={i} x1={cx-2.5} y1={y} x2={cx+2.5} y2={y}
            stroke={g(0.115)} strokeWidth="0.45"/>;
        })}
        {/* Tick marks along baselines */}
        {Array.from({ length: Math.floor((yB - yT) / 22) }, (_, i) => {
          const y = yT + 11 + i * 22;
          return (
            <g key={i}>
              <line x1={xL-2.5} y1={y} x2={xL+2.5} y2={y} stroke={g(0.09)} strokeWidth="0.4"/>
              <line x1={xR-2.5} y1={y} x2={xR+2.5} y2={y} stroke={g(0.09)} strokeWidth="0.4"/>
            </g>
          );
        })}
        {/* Concentric rings at net midpoint */}
        {[5, 12, 22, 36].map((r, i) => (
          <circle key={i} cx={cx} cy={c} r={r}
            stroke={g(Math.max(0.082 - i * 0.015, 0.012))} strokeWidth="0.45"/>
        ))}
      </g>
    );
  };

  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none',
      }}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fine orthogonal micro-grid */}
        <pattern id="tcMicro" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M44 0L0 0 0 44" fill="none" stroke={g(0.022)} strokeWidth="0.28"/>
        </pattern>
        {/* Horizontal left/right vignette */}
        <linearGradient id="tcFadeH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="white" stopOpacity="0"/>
          <stop offset="10%"  stopColor="white" stopOpacity="1"/>
          <stop offset="90%"  stopColor="white" stopOpacity="1"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        {/* Vertical top/bottom vignette */}
        <linearGradient id="tcFadeV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="white" stopOpacity="0"/>
          <stop offset="6%"   stopColor="white" stopOpacity="1"/>
          <stop offset="94%"  stopColor="white" stopOpacity="1"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <mask id="tcMask">
          <rect width="100%" height="100%" fill="url(#tcFadeH)"/>
          <rect width="100%" height="100%" fill="url(#tcFadeV)"
            style={{ mixBlendMode: 'multiply' }}/>
        </mask>
      </defs>

      <g mask="url(#tcMask)">
        {/* Background micro-grid */}
        <rect width="100%" height="100%" fill="url(#tcMicro)"/>

        {/* Vertical rules through all 5 court x-axes (extend full height) */}
        {[
          [xL,  0.068], [xSL, 0.052],
          [cx,  0.06],
          [xSR, 0.052], [xR, 0.068],
        ].map(([x, o], i) => (
          <line key={i} x1={x} y1={0} x2={x} y2={H}
            stroke={g(o)} strokeWidth="0.48"/>
        ))}

        {/* Three courts */}
        {CY.map((cy, i) => <Court key={i} cy={cy}/>)}
      </g>
    </svg>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function SquadHomePage() {
  useReveal();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState(() => getColleges());
  const [topPlayers, setTopPlayers] = useState(() => getTopPlayers());
  const countdown = useCountdown(UCB_INVITATIONAL);

  const refresh = useCallback(() => {
    setColleges(getColleges());
    setTopPlayers(getTopPlayers());
  }, []);

  useEffect(() => {
    // refresh when another tab updates localStorage
    window.addEventListener('storage', refresh);
    // refresh when this tab regains focus
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [refresh]);

  return (
    <div className="sq-page">
      {/* UPCOMING TOURNAMENTS BAR */}
      <div className="sq-tourn-bar">
        <div className="sq-tourn-bar-label">Upcoming</div>
        <div className="sq-tourn-bar-items">
          {UPCOMING_TOURNAMENTS.map((t, i) => (
            <div key={i} className="sq-tourn-bar-item">
              <span className="sq-tourn-bar-name">{t.name}</span>
              <span className="sq-tourn-bar-date">{t.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT: Hero + Side Panels */}
      <div className="sq-home-grid">
        {/* HERO — LEFT */}
        <div className="sq-hero">
          <TennisCourtBg />
          {/* Decorative floating tennis icons */}
          <span aria-hidden="true" style={{ position:'absolute', right:'6%', top:'14%', width:88, height:88, opacity:.06, color:'var(--c-green)', pointerEvents:'none', transform:'rotate(20deg)', display:'block' }}>{Icons.tennisRacket}</span>
          <span aria-hidden="true" style={{ position:'absolute', left:'4%', bottom:'18%', width:56, height:56, opacity:.07, color:'var(--c-green)', pointerEvents:'none', display:'block' }}>{Icons.tennisBall}</span>
          <span aria-hidden="true" style={{ position:'absolute', right:'20%', bottom:'12%', width:72, height:72, opacity:.045, color:'var(--c-text)', pointerEvents:'none', transform:'rotate(-6deg)', display:'block' }}>{Icons.miniCourt}</span>
          <span aria-hidden="true" style={{ position:'absolute', left:'12%', top:'10%', width:60, height:60, opacity:.045, color:'var(--c-green)', pointerEvents:'none', transform:'rotate(8deg) scaleX(-1)', display:'block' }}>{Icons.tennisPlayer}</span>
          <div className="sq-hero-eyebrow">Tennis on Campus</div>
          <h1 className="sq-hero-h1">The <em>Home</em> for <em>College Club</em> Tennis</h1>
          <p className="sq-hero-sub">Track results and rankings across Northern California</p>

          {/* COUNTDOWN */}
          <div className="sq-countdown-wrap">
            <div className="sq-countdown-label">
              <span className="sq-countdown-event">Countdown to UC Berkeley Golden Bears Invitational</span>
              <span className="sq-countdown-date-str">Mar 21 – 22, 2026</span>
            </div>
            <div className="sq-countdown-divider" />
            <div className="sq-countdown-units">
              {[
                { val: countdown.days,    lbl: 'Days' },
                { val: countdown.hours,   lbl: 'Hrs'  },
                { val: countdown.minutes, lbl: 'Min'  },
                { val: countdown.seconds, lbl: 'Sec'  },
              ].map(({ val, lbl }) => (
                <div key={lbl} className="sq-countdown-unit">
                  <span className={`sq-countdown-num${countdown.days === 0 ? ' urgent' : ''}`}>
                    {String(val).padStart(2, '0')}
                  </span>
                  <span className="sq-countdown-sublabel">{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STANDINGS — middle right panel */}
        <div className="sq-side-panel">
          <div className="sq-side-panel-head">
            <span className="sq-side-panel-title">Standings</span>
            <button className="sq-view-all" onClick={() => navigate('/standings')}>
              View all <span className="ic">{Icons.arrowRight}</span>
            </button>
          </div>
          <div className="sq-side-panel-body">
            {colleges.length === 0 ? (
              <div className="sq-empty">
                <div className="sq-empty-dot" />
                No colleges enrolled yet
              </div>
            ) : colleges.map((c, i) => (
              <div key={c.name} className="sq-panel-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    fontFamily: 'var(--font-disp)', fontSize: 22, lineHeight: 1,
                    color: i < 3 ? '#ffffff' : 'rgba(255,255,255,.4)',
                    width: 28, flexShrink: 0, textAlign: 'center',
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#ffffff' }}>{c.name}</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, flexShrink: 0,
                    color: 'rgba(255,255,255,.85)', letterSpacing: '.5px',
                    background: 'rgba(0,0,0,.2)', padding: '2px 7px', borderRadius: 4,
                  }}>{c.wins}–{c.losses}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP PLAYERS — right panel */}
        {(() => {
          const { gentlemen, ladies } = topPlayers;
          const renderList = (list, gender) => list.map((p, i) => (
            <div key={i} className="sq-panel-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontFamily: 'var(--font-disp)', fontSize: 20, lineHeight: 1, color: i < 3 ? '#ffffff' : 'rgba(255,255,255,.4)', width: 22, flexShrink: 0, textAlign: 'center' }}>{i + 1}</div>
                <span style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: i < 3 ? '#ffffff' : 'rgba(255,255,255,.55)' }}>
                  {gender === 'F' ? Icons.femaleAvatar : Icons.maleAvatar}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#ffffff' }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,.7)', letterSpacing: '.3px', marginTop: 2 }}>{p.school}{p.role ? ` · ${p.role}` : ''}</div>
                </div>
              </div>
            </div>
          ));
          return (
            <div className="sq-side-panel">
              <div className="sq-side-panel-head">
                <span className="sq-side-panel-title">Top Players</span>
              </div>
              <div className="sq-side-panel-body">
                {gentlemen.length > 0 && <>
                  <div style={{ padding: '10px 20px 6px', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)' }}>Gentlemen</div>
                  {renderList(gentlemen, 'M')}
                </>}
                {ladies.length > 0 && <>
                  <div style={{ padding: '12px 20px 6px', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', borderTop: gentlemen.length > 0 ? '1px solid rgba(0,0,0,.12)' : 'none' }}>Ladies</div>
                  {renderList(ladies, 'F')}
                </>}
                {gentlemen.length === 0 && ladies.length === 0 && (
                  <div style={{ padding: '32px 16px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,.65)', textAlign: 'center', letterSpacing: '1px' }}>No roster data yet</div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      <footer className="sq-footer" style={{ position:'relative' }}>
        <span aria-hidden="true" style={{ position:'absolute', right:120, top:'50%', transform:'translateY(-50%) rotate(15deg)', width:18, height:18, opacity:.1, color:'var(--c-green)', pointerEvents:'none', display:'block' }}>{Icons.tennisBall}</span>
        <span aria-hidden="true" style={{ position:'absolute', left:'40%', top:'50%', transform:'translateY(-50%) rotate(-8deg)', width:17, height:17, opacity:.08, color:'var(--c-green)', pointerEvents:'none', display:'block' }}>{Icons.tennisRacket}</span>
        <div className="sq-footer-logo">SQUAD <span>Tennis</span></div>
        <div className="sq-footer-right">
          USTA Tennis on Campus · 2025–26 Season
        </div>
      </footer>
    </div>
  );
}

// ─── STANDINGS PAGE ───────────────────────────────────────────────────────────
function SquadStandingsPage() {
  useReveal();
  const [query, setQuery] = useState('');

  const allColleges = getColleges();
  const filtered = allColleges.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="sq-page">
      <div className="sq-page-hero" data-word="RANKS" style={{ textAlign: 'center' }}>
        <div className="sq-page-eyebrow" style={{ textAlign: 'center' }}>USTA Tennis on Campus · 2025–26 Season</div>
        <h1 className="sq-page-h1" style={{ textAlign: 'center' }}>Standings</h1>
      </div>
      <div className="sq-section" style={{ borderTop: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 52, position:'relative' }}>
        <span aria-hidden="true" style={{ position:'absolute', right:40, top:36, width:19, height:19, opacity:.09, color:'var(--c-green)', pointerEvents:'none', transform:'rotate(22deg)', display:'block' }}>{Icons.miniCourt}</span>
        <span aria-hidden="true" style={{ position:'absolute', left:36, bottom:40, width:17, height:17, opacity:.08, color:'var(--c-green)', pointerEvents:'none', transform:'rotate(-15deg)', display:'block' }}>{Icons.tennisBall}</span>
        <div className="sq-search-wrap" style={{ width: '100%', maxWidth: 900, marginBottom: 36 }}>
          <span className="sq-search-icon">{Icons.search}</span>
          <input
            className="sq-search"
            placeholder="Search colleges..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <StandingsTable colleges={filtered} />
      </div>
    </div>
  );
}

// ─── ROOT SQUAD APP ───────────────────────────────────────────────────────────
export default function SquadApp({ children }) {
  const navigate = useNavigate();
  const [findOpen, setFindOpen] = useState(false);

  // Inject CSS once
  useEffect(() => {
    const tag = document.createElement('style');
    tag.id = 'squad-styles';
    tag.textContent = SQUAD_STYLES;
    document.head.appendChild(tag);
    return () => { const t = document.getElementById('squad-styles'); if (t) t.remove(); };
  }, []);

  return (
    <>
      <div className="sq-amb sq-amb-a" />
      <div className="sq-amb sq-amb-b" />
      <SquadNav onHome={() => navigate('/')} onFindCollege={() => setFindOpen(true)} />
      {children}
      {findOpen && <FindCollegeModal onClose={() => setFindOpen(false)} />}
    </>
  );
}

// ─── CODES PAGE ───────────────────────────────────────────────────────────────
function SquadCodesPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [shake, setShake] = useState(false);
  const [query, setQuery] = useState('');
  const filtered = SCHOOLS.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  if (!authed) {
    const submit = (e) => {
      e.preventDefault();
      if (pw === 'ranchgradient') {
        setAuthed(true);
      } else {
        setShake(true);
        setPw('');
        setTimeout(() => setShake(false), 600);
      }
    };
    return (
      <div className="sq-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Access Required</span>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            autoFocus
            placeholder="passphrase"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 14, background: 'rgba(255,255,255,.04)',
              border: `1px solid ${shake ? 'var(--c-accent)' : 'var(--c-border)'}`,
              color: 'var(--c-text)', borderRadius: 6, padding: '10px 16px', outline: 'none', width: 220,
              transition: 'border-color .2s',
              animation: shake ? 'sq-shake .5s' : 'none',
            }}
          />
          <style>{`@keyframes sq-shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
        </form>
      </div>
    );
  }

  return (
    <div className="sq-page">
      <div className="sq-page-hero" data-word="CODES">
        <div className="sq-page-eyebrow">Admin · Squad Tennis</div>
        <h1 className="sq-page-h1">College Codes</h1>
      </div>
      <div className="sq-section" style={{ borderTop: 'none' }}>
        <div className="sq-search-wrap">
          <span className="sq-search-icon">{Icons.search}</span>
          <input
            className="sq-search"
            placeholder="Search colleges..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="sq-lb" style={{ maxWidth: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', padding: '10px 20px', background: 'rgba(255,255,255,.02)', borderBottom: '1px solid var(--c-border)' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--c-muted2)' }}>College</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--c-muted2)' }}>Code</span>
          </div>
          {filtered.map(s => (
            <div key={s.code} style={{ display: 'grid', gridTemplateColumns: '1fr 80px', alignItems: 'center', padding: '11px 20px', borderBottom: '1px solid var(--c-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</span>
                {s.enrolled && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--c-green)', background: 'rgba(39,207,131,.08)', border: '1px solid rgba(39,207,131,.18)', padding: '1px 6px', borderRadius: 3 }}>Active</span>}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--c-green)', letterSpacing: 1 }}>{s.code}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { SquadHomePage, SquadStandingsPage, SquadCodesPage };

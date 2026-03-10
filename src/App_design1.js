import { useState, useEffect, useRef, useCallback } from "react";

// ─── ACCESS CODES ────────────────────────────────────────────────────────────
const OFFICER_CODE = "SJSU2026";
const PLAYER_CODE  = "SPARTAN24";

// ─── REAL DATA ───────────────────────────────────────────────────────────────
const INITIAL_MATCHES = [];

const INITIAL_ROSTER = [
  // Team A — Gentlemen
  { id:1,  name:"Brandon Wirjadisastra", utr:0, year:"", major:"", team:"A", gender:"M", role:"",           wins:0, losses:0 },
  { id:2,  name:"Abraham Lau",           utr:0, year:"", major:"", team:"A", gender:"M", role:"Captain",    wins:0, losses:0 },
  { id:3,  name:"Julian Whalen",         utr:0, year:"", major:"", team:"A", gender:"M", role:"",           wins:0, losses:0 },
  { id:4,  name:"Anurag Potla",          utr:0, year:"", major:"", team:"A", gender:"M", role:"",           wins:0, losses:0 },
  // Team A — Ladies
  { id:5,  name:"Arin Akkaya",           utr:0, year:"", major:"", team:"A", gender:"F", role:"",           wins:0, losses:0 },
  { id:6,  name:"Kiana Lua",             utr:0, year:"", major:"", team:"A", gender:"F", role:"",           wins:0, losses:0 },
  { id:7,  name:"Faith Son",             utr:0, year:"", major:"", team:"A", gender:"F", role:"",           wins:0, losses:0 },
  // Team B — Gentlemen
  { id:8,  name:"Scott Conlin",          utr:0, year:"", major:"", team:"B", gender:"M", role:"Co-Captain", wins:0, losses:0 },
  { id:9,  name:"Yurro Zabala",          utr:0, year:"", major:"", team:"B", gender:"M", role:"Co-Captain", wins:0, losses:0 },
  { id:10, name:"Adi Shah",              utr:0, year:"", major:"", team:"B", gender:"M", role:"",           wins:0, losses:0 },
  { id:11, name:"Tanay Mahesh",          utr:0, year:"", major:"", team:"B", gender:"M", role:"",           wins:0, losses:0 },
  { id:12, name:"Arnav Nallani",         utr:0, year:"", major:"", team:"B", gender:"M", role:"",           wins:0, losses:0 },
  // Team B — Ladies
  { id:13, name:"Julie Phan",            utr:0, year:"", major:"", team:"B", gender:"F", role:"",           wins:0, losses:0 },
  { id:14, name:"Lethycia Palomera",     utr:0, year:"", major:"", team:"B", gender:"F", role:"",           wins:0, losses:0 },
  { id:15, name:"Noelle Dwyer",          utr:0, year:"", major:"", team:"B", gender:"F", role:"",           wins:0, losses:0 },
  // Team C — Gentlemen
  { id:16, name:"Gorden Thao",           utr:0, year:"", major:"", team:"C", gender:"M", role:"Captain",    wins:0, losses:0 },
  { id:17, name:"Carden Dang",           utr:0, year:"", major:"", team:"C", gender:"M", role:"",           wins:0, losses:0 },
  { id:18, name:"Kevin Zarnegar",        utr:0, year:"", major:"", team:"C", gender:"M", role:"",           wins:0, losses:0 },
  { id:19, name:"Anthony Phan",          utr:0, year:"", major:"", team:"C", gender:"M", role:"",           wins:0, losses:0 },
  // Team C — Ladies
  { id:20, name:"Kayla Solano",          utr:0, year:"", major:"", team:"C", gender:"F", role:"",           wins:0, losses:0 },
  { id:21, name:"Brooklyn Tayo",         utr:0, year:"", major:"", team:"C", gender:"F", role:"",           wins:0, losses:0 },
  { id:22, name:"Sonya Son",             utr:0, year:"", major:"", team:"C", gender:"F", role:"",           wins:0, losses:0 },
];

const LEADERBOARD = [
  { rank:1,  school:"UC Berkeley",          wins:0, losses:0 },
  { rank:2,  school:"Stanford",             wins:0, losses:0 },
  { rank:3,  school:"UC Davis",             wins:0, losses:0 },
  { rank:4,  school:"CSU Sacramento",       wins:0, losses:0 },
  { rank:5,  school:"UC Santa Cruz",        wins:0, losses:0 },
  { rank:6,  school:"Santa Clara",          wins:0, losses:0 },
  { rank:7,  school:"SJSU",                wins:0, losses:0 },
  { rank:8,  school:"SF State",             wins:0, losses:0 },
  { rank:9,  school:"St. Mary's",           wins:0, losses:0 },
  { rank:10, school:"UC Merced",            wins:0, losses:0 },
  { rank:11, school:"Fresno State",         wins:0, losses:0 },
  { rank:12, school:"UNR",                  wins:0, losses:0 },
  { rank:13, school:"Northeastern Oakland", wins:0, losses:0 },
];

// ─── ICONS (all SVG — no emoji, no icon fonts) ───────────────────────────────
const Icons = {
  star: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><path d="M10 2.5l2.1 6.4H18l-5 3.6 1.9 5.9L10 14.8l-4.9 3.6 1.9-5.9-5-3.6h5.9z"/></svg>,
  racket: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><ellipse cx="8" cy="8" rx="5.5" ry="6.5" transform="rotate(-45 8 8)"/><line x1="11.5" y1="11.5" x2="17.5" y2="17.5"/><line x1="5.5" y1="5.5" x2="10.5" y2="10.5" strokeOpacity=".35"/><line x1="8" y1="2.5" x2="8" y2="13.5" strokeOpacity=".35"/><line x1="2.5" y1="8" x2="13.5" y2="8" strokeOpacity=".35"/></svg>,
  eye: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="2.5"/></svg>,
  chevronDown: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6l4 4 4-4"/></svg>,
  chevronRight: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4l4 4-4 4"/></svg>,
  user: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="10" cy="7" r="3.5"/><path d="M3 18c0-4 3.1-7 7-7s7 3 7 7"/></svg>,
  plus: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>,
  list: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 4h7M6 8h7M6 12h7M3 4h.01M3 8h.01M3 12h.01"/></svg>,
  pencil: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z"/><path d="M10 4l2 2"/></svg>,
  bar: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 12V8h3v4H2zM6.5 12V5h3v7h-3zM11 12V7h3v5h-3z"/></svg>,
  clock: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="5.5"/><path d="M8 5v3.5l2 1.5"/></svg>,
  settings: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="8" cy="8" r="2.5"/><path d="M8 2v1M8 13v1M2 8h1M13 8h1M3.5 3.5l.7.7M11.8 11.8l.7.7M3.5 12.5l.7-.7M11.8 4.2l.7-.7"/></svg>,
  logout: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3"/><path d="M10.5 11l3-3-3-3M6 8h7.5"/></svg>,
  close: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15"/></svg>,
  arrowUp: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11V3M3.5 6.5L7 3l3.5 3.5"/></svg>,
  arrowDown: <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3v8M3.5 7.5L7 11l3.5-3.5"/></svg>,
  arrowRight: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>,
  check: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3.5 3.5L13 4.5"/></svg>,
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --c-bg:       #070707;
  --c-surf:     #0d0d0d;
  --c-surf2:    #141414;
  --c-border:   rgba(255,255,255,.06);
  --c-border2:  rgba(255,255,255,.1);
  --c-gold:     #c9a96e;
  --c-gold-hi:  #e4c98c;
  --c-gold-glow:rgba(201,169,110,.15);
  --c-text:     #f0ece6;
  --c-muted:    rgba(240,236,230,.38);
  --c-muted2:   rgba(240,236,230,.18);
  --c-win:      #5db882;
  --c-loss:     #c96060;
  --c-blue:     #6e9ec9;
  --nav-h:      58px;
  --r:          10px;
  --ease:       cubic-bezier(.25,.46,.45,.94);
  --spring:     cubic-bezier(.16,1,.3,1);
  --font-disp:  'Bebas Neue', sans-serif;
  --font-ui:    'DM Sans', sans-serif;
  --font-mono:  'DM Mono', monospace;
}

html { scroll-behavior: smooth; }

body {
  background: var(--c-bg);
  color: var(--c-text);
  font-family: var(--font-ui);
  font-size: 14px;
  line-height: 1.6;
  overflow-x: hidden;
  cursor: auto;
}

/* ── CURSOR ── */
#csr {
  position: fixed; z-index: 9999; pointer-events: none;
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--c-gold);
  transform: translate(-50%,-50%);
  transition: width .22s var(--spring), height .22s var(--spring), background .2s, opacity .2s;
  will-change: transform;
  top: 0; left: 0;
}
#csr.large {
  width: 36px; height: 36px;
  background: transparent;
  border: 1.5px solid rgba(201,169,110,.55);
}

/* ── AMBIENT GLOW ── */
.amb {
  position: fixed; pointer-events: none; z-index: 0;
  border-radius: 50%; filter: blur(140px);
  animation: ambFloat 12s ease-in-out infinite alternate;
}
.amb-a { width:700px; height:700px; background:rgba(201,169,110,.06); top:-200px; left:-150px; }
.amb-b { width:500px; height:500px; background:rgba(110,158,201,.05); bottom:-100px; right:-100px; animation-delay:-6s; }
@keyframes ambFloat { from{transform:translate(0,0)} to{transform:translate(30px,40px)} }

/* ── NOISE TEXTURE OVERLAY ── */
body::before {
  content:''; position:fixed; inset:0; z-index:9990; pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity:.022; mix-blend-mode:overlay;
}

/* ── NAV ── */
nav {
  position: fixed; top:0; left:0; right:0; z-index:100;
  height: var(--nav-h);
  display: flex; align-items: center;
  padding: 0 24px;
  background: rgba(7,7,7,.75);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border-bottom: 1px solid var(--c-border);
}

.nav-logo {
  font-family: var(--font-disp);
  font-size: 18px;
  letter-spacing: 5px; text-transform: uppercase;
  color: var(--c-text); cursor: pointer;
  white-space: nowrap;
  position: absolute; left: 50%; transform: translateX(-50%);
}
.nav-logo span { color: var(--c-gold); }

.nav-left, .nav-right {
  display: flex; align-items: center; gap: 2px;
  position: relative; z-index: 1;
}
.nav-right { margin-left: auto; }

/* Nav button */
.nb {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 11px; border-radius: 7px;
  background: none; border: none; cursor: pointer;
  font-family: var(--font-mono); font-size: 10.5px;
  color: var(--c-muted); letter-spacing: .4px;
  transition: color .18s, background .18s;
}
.nb:hover, .nb.active { color: var(--c-text); background: var(--c-surf2); }
.nb .ic { width:14px; height:14px; display:flex; align-items:center; justify-content:center; }
.nb .chev { width:14px; height:14px; transition: transform .2s var(--spring); }
.nb.active .chev { transform: rotate(180deg); }

/* Pill buttons */
.pill {
  padding: 7px 18px; border-radius: 6px; cursor: pointer;
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
  background: none; border: 1px solid transparent;
  color: var(--c-muted); transition: all .18s;
}
.pill:hover { color: var(--c-text); }
.pill.filled {
  background: none;
  border: 1px solid var(--c-gold);
  color: var(--c-gold);
}
.pill.filled:hover { background: rgba(201,169,110,.08); color: var(--c-gold-hi); border-color: var(--c-gold-hi); }

.welcome-tag {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: 20px;
  border: 1px solid rgba(201,169,110,.25);
  background: rgba(201,169,110,.05);
  font-family: var(--font-mono); font-size: 10px;
  color: var(--c-gold); letter-spacing: .3px;
}
.welcome-tag .ic { width: 12px; height: 12px; }

/* ── DROPDOWN ── */
.dd-wrap { position: relative; }
.dd {
  position: absolute; top: calc(100% + 7px);
  background: rgba(13,13,13,.97);
  backdrop-filter: blur(24px);
  border: 1px solid var(--c-border2);
  border-radius: var(--r); min-width: 188px;
  padding: 5px;
  box-shadow: 0 20px 60px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.03);
  animation: ddIn .15s var(--spring);
  z-index: 200;
}
.dd.dd-right { right: 0; }
@keyframes ddIn { from{opacity:0;transform:translateY(-6px)scale(.97)} to{opacity:1;transform:translateY(0)scale(1)} }

.dd-item {
  display: flex; align-items: center; gap: 9px;
  width: 100%; padding: 8px 11px; border-radius: 6px;
  background: none; border: none; cursor: pointer;
  color: var(--c-muted); font-family: var(--font-ui); font-size: 13px;
  transition: background .12s, color .12s; text-align: left; white-space: nowrap;
}
.dd-item:hover { background: var(--c-surf2); color: var(--c-text); }
.dd-item .ic { width: 14px; height: 14px; opacity: .6; transition: opacity .12s; flex-shrink: 0; }
.dd-item:hover .ic { opacity: 1; color: var(--c-gold); }
.dd-sep { height: 1px; background: var(--c-border); margin: 4px 0; }

/* ── MODAL ── */
.modal-bg {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(0,0,0,.7);
  backdrop-filter: blur(16px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: fadeIn .18s ease;
}
@keyframes fadeIn { from{opacity:0} to{opacity:1} }

.modal {
  background: var(--c-surf);
  border: 1px solid var(--c-border2);
  border-radius: 18px;
  padding: 40px 36px 36px;
  width: 100%; max-width: 440px;
  max-height: 90vh; overflow-y: auto;
  position: relative;
  box-shadow: 0 40px 100px rgba(0,0,0,.8);
  animation: modeIn .22s var(--spring);
}
.modal-wide { max-width: 540px; }
@keyframes modeIn { from{opacity:0;transform:translateY(18px)scale(.97)} to{opacity:1;transform:translateY(0)scale(1)} }

.modal-close {
  position: absolute; top: 16px; right: 16px;
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--c-surf2); border: 1px solid var(--c-border);
  color: var(--c-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: color .15s, background .15s;
}
.modal-close:hover { color: var(--c-text); background: var(--c-border2); }
.modal-close .ic { width: 14px; height: 14px; }

.modal-title { font-family: var(--font-disp); font-size: 34px; letter-spacing: 1px; margin-bottom: 4px; }
.modal-sub { font-size: 12px; color: var(--c-muted); font-family: var(--font-mono); margin-bottom: 28px; }

/* ── ROLE CARDS ── */
.role-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 22px; }
.role-card {
  padding: 18px 10px 14px;
  border: 1px solid var(--c-border);
  border-radius: var(--r);
  background: var(--c-surf2);
  cursor: pointer; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  transition: border-color .18s, background .18s;
}
.role-card:hover { border-color: var(--c-border2); background: #1a1a1a; }
.role-card.sel { border-color: var(--c-gold); background: rgba(201,169,110,.07); }
.role-card .icon-wrap { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: var(--c-muted); transition: color .18s; }
.role-card.sel .icon-wrap, .role-card:hover .icon-wrap { color: var(--c-gold); }
.role-card .icon-wrap svg { width: 22px; height: 22px; }
.role-lbl { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--c-muted); }
.role-card.sel .role-lbl { color: var(--c-gold); }

/* ── FORM ── */
.fg { margin-bottom: 13px; }
.fg-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.flabel {
  display: block; font-family: var(--font-mono); font-size: 9px;
  letter-spacing: 1.5px; text-transform: uppercase; color: var(--c-muted);
  margin-bottom: 6px;
}
.finput, .fselect {
  width: 100%; padding: 10px 12px;
  background: var(--c-surf2); border: 1px solid var(--c-border);
  border-radius: 8px; color: var(--c-text);
  font-family: var(--font-ui); font-size: 13.5px;
  outline: none; cursor: text;
  transition: border-color .18s;
  appearance: none; -webkit-appearance: none;
}
.finput:focus, .fselect:focus { border-color: rgba(201,169,110,.5); }
.finput::placeholder { color: var(--c-muted2); }
.ferr { font-family: var(--font-mono); font-size: 10px; color: var(--c-loss); margin-top: 8px; }
.fok  { font-family: var(--font-mono); font-size: 10px; color: var(--c-win); margin-top: 8px; display:flex; align-items:center; gap:5px; }

/* ── BUTTONS ── */
.btn-primary {
  width: 100%; padding: 12px;
  background: var(--c-gold); color: #080808;
  border: none; border-radius: 9px; cursor: pointer;
  font-family: var(--font-mono); font-size: 11px; font-weight: 500;
  letter-spacing: 1.2px; text-transform: uppercase;
  transition: background .18s, transform .1s;
  margin-top: 6px;
}
.btn-primary:hover { background: var(--c-gold-hi); }
.btn-primary:active { transform: scale(.98); }
.btn-primary:disabled { opacity: .35; cursor: not-allowed; }

.btn-ghost {
  width: 100%; padding: 11px;
  background: none; border: 1px solid var(--c-border2);
  color: var(--c-muted); border-radius: 9px; cursor: pointer;
  font-family: var(--font-mono); font-size: 11px;
  letter-spacing: 1px; text-transform: uppercase;
  transition: all .18s; margin-top: 6px;
}
.btn-ghost:hover { color: var(--c-text); background: var(--c-surf2); }

/* ── PAGE LAYOUT ── */
.page { padding-top: var(--nav-h); }

/* ── HERO ── */
.hero {
  position: relative; overflow: hidden;
  padding: 120px 72px 100px;
  min-height: 75vh; display: flex; flex-direction: column; justify-content: center;
  text-align: center;
  background-color: #070707;
  background-image:
    linear-gradient(to right, #070707 0%, rgba(7,7,7,.5) 22%, rgba(7,7,7,.5) 78%, #070707 100%),
    linear-gradient(to bottom, rgba(7,7,7,.92) 0%, rgba(7,7,7,.65) 30%, rgba(7,7,7,.65) 70%, rgba(7,7,7,.97) 100%),
    url('/team.jpeg');
  background-size: cover;
  background-position: center;
}

/* Scan line animation */
.hero::before {
  content:''; position:absolute;
  left:0; right:0; height:1px;
  background: linear-gradient(90deg, transparent 0%, rgba(201,169,110,.5) 40%, rgba(201,169,110,.5) 60%, transparent 100%);
  animation: scanDown 2.8s var(--spring) .4s forwards;
  opacity:0; top: var(--nav-h);
}
@keyframes scanDown {
  0%  { top: var(--nav-h); opacity: 0 }
  15% { opacity: .6 }
  90% { opacity: 0 }
  100%{ top: 85vh; opacity: 0 }
}

.hero-eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--font-mono); font-size: 10px;
  color: var(--c-gold); letter-spacing: 2.5px; text-transform: uppercase;
  margin-bottom: 20px;
  animation: riseIn .7s var(--spring) .1s both;
  justify-content: center;
}
.hero-eyebrow::before, .hero-eyebrow::after {
  content: ''; width: 28px; height: 1px; background: var(--c-gold);
}

.hero-h1 {
  font-family: var(--font-disp);
  font-size: clamp(72px, 11vw, 144px);
  font-weight: 400;
  line-height: .92;
  letter-spacing: 3px; color: var(--c-text);
  animation: riseIn .85s var(--spring) .2s both;
}
.hero-h1 em { font-style: normal; color: var(--c-gold); }

.hero-sub {
  margin-top: 28px;
  font-family: var(--font-mono); font-size: 12px;
  color: rgba(240,236,230,.6); line-height: 1.8; max-width: 340px;
  animation: riseIn .85s var(--spring) .35s both;
  margin-left: auto; margin-right: auto;
}

.hero-bg-text {
  position: absolute; right: 40px; bottom: -30px;
  font-family: var(--font-disp); font-size: clamp(160px,24vw,310px);
  font-weight: 400; color: transparent;
  -webkit-text-stroke: 1px rgba(201,169,110,.055);
  line-height: 1; pointer-events: none; user-select: none;
  letter-spacing: 4px;
  animation: fadeIn .9s ease .5s both;
}

/* Parallax grid lines */
.hero-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(201,169,110,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(201,169,110,.03) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,.6) 40%, transparent 100%);
  animation: fadeIn 1.2s ease .6s both;
}

@keyframes riseIn { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }

/* ── STATS BAR ── */
.stats-bar {
  display: grid; grid-template-columns: repeat(4,1fr);
  border-top: 1px solid var(--c-border);
  border-bottom: 1px solid var(--c-border);
  position: relative; z-index: 1;
}
.stat-cell {
  padding: 36px 48px;
  border-right: 1px solid var(--c-border);
  position: relative; overflow: hidden;
  transition: background .3s;
  cursor: pointer;
}
.stat-cell:last-child { border-right: none; }
.stat-cell::after {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(circle at 0% 100%, var(--c-gold-glow), transparent 70%);
  opacity: 0; transition: opacity .35s;
}
.stat-cell:hover::after { opacity: 1; }
.stat-num {
  font-family: var(--font-disp);
  font-size: clamp(44px, 6vw, 76px);
  color: var(--c-gold); line-height: 1;
  position: relative; z-index: 1;
  letter-spacing: 2px;
}
.stat-lbl {
  font-family: var(--font-mono); font-size: 9px;
  color: var(--c-muted); letter-spacing: 2.5px;
  text-transform: uppercase; margin-top: 8px;
  position: relative; z-index: 1;
}

/* ── SECTION ── */
.section {
  padding: 72px;
  border-top: 1px solid var(--c-border);
  position: relative;
}
.section-tag {
  font-family: var(--font-mono); font-size: 9px;
  color: var(--c-muted); letter-spacing: 3px; text-transform: uppercase;
  display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
}
.section-tag::after { content:''; flex:1; height:1px; background:var(--c-border); max-width:80px; }

.section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 36px; }
.section-h2 {
  font-family: var(--font-disp); font-size: clamp(38px,5vw,58px);
  font-weight: 400; line-height: .95; letter-spacing: 2px;
}

.view-all {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 1px;
  text-transform: uppercase; color: var(--c-muted);
  background: none; border: 1px solid var(--c-border);
  padding: 7px 14px; border-radius: 20px; cursor: pointer;
  transition: color .18s, border-color .18s;
}
.view-all:hover { color: var(--c-gold); border-color: rgba(201,169,110,.4); }
.view-all .ic { width: 13px; height: 13px; }

/* ── MATCH LIST ── */
.match-list { display: flex; flex-direction: column; gap: 1px; }

.match-row {
  display: grid;
  grid-template-columns: 68px 1fr 1fr 52px;
  align-items: center; gap: 16px;
  padding: 16px 20px;
  background: var(--c-surf);
  border: 1px solid transparent; border-radius: 4px;
  transition: background .2s, border-color .2s, transform .2s var(--spring);
  cursor: pointer;
}
.match-row:first-child { border-radius: 8px 8px 4px 4px; }
.match-row:last-child  { border-radius: 4px 4px 8px 8px; }
.match-row:hover { background: var(--c-surf2); border-color: var(--c-border); transform: translateX(4px); }

.match-date {
  font-family: var(--font-mono); font-size: 10px;
  color: var(--c-muted); line-height: 1.4;
}
.match-vs   { font-size: 13.5px; font-weight: 500; }
.match-loc  { font-family: var(--font-mono); font-size: 9.5px; color: var(--c-muted); margin-top: 1px; }
.match-score{ font-family: var(--font-mono); font-size: 12px; color: var(--c-muted); justify-self: end; }

.badge {
  width: 28px; height: 28px; border-radius: 7px;
  font-family: var(--font-mono); font-size: 11px; font-weight: 500;
  display: flex; align-items: center; justify-content: center;
}
.badge-W { background: #0d2b1f; color: #4dbd85; }
.badge-L { background: #2b0f0f; color: #c95050; }

/* ── PLAYER GRID ── */
.player-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1px; background: var(--c-bg);
  border-radius: 12px; overflow: hidden;
}

.player-card {
  background: var(--c-surf);
  padding: 28px 24px;
  position: relative; overflow: hidden; cursor: pointer;
  transition: background .25s, transform .25s var(--spring);
}
.player-card:hover { background: var(--c-surf2); transform: translateY(-3px); z-index: 1; }

/* Ghost position number behind card */
.player-card::before {
  content: attr(data-pos);
  position: absolute; right: 12px; top: 8px;
  font-family: var(--font-disp); font-size: 64px;
  color: rgba(201,169,110,.04); line-height: 1;
  pointer-events: none; user-select: none;
  letter-spacing: 2px;
}

/* Gold top edge highlight on hover */
.player-card::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--c-gold), transparent);
  transform: scaleX(0); transform-origin: left;
  transition: transform .3s var(--spring);
}
.player-card:hover::after { transform: scaleX(1); }

.team-pill {
  display: inline-flex; align-items: center;
  font-family: var(--font-mono); font-size: 8.5px; letter-spacing: 1.5px;
  text-transform: uppercase; padding: 3px 9px; border-radius: 20px;
  border: 1px solid var(--c-border); color: var(--c-muted);
  margin-bottom: 14px; position: relative; z-index: 1;
}
.team-pill.A { border-color: rgba(201,169,110,.35); color: var(--c-gold); background: rgba(201,169,110,.05); }

.player-avatar {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--c-surf2);
  border: 2px solid var(--c-border);
  overflow: hidden; display: flex; align-items: center; justify-content: center;
  margin-bottom: 14px; position: relative; z-index: 1; flex-shrink: 0;
}
.player-avatar img { width: 100%; height: 100%; object-fit: cover; }
.player-avatar-placeholder {
  font-family: var(--font-disp); font-size: 20px;
  color: var(--c-muted); user-select: none;
}
.player-name { font-size: 16px; font-weight: 600; position: relative; z-index: 1; }
.player-utr-lbl {
  font-family: var(--font-mono); font-size: 8.5px; letter-spacing: 2.5px;
  text-transform: uppercase; color: var(--c-muted);
  margin-top: 14px; position: relative; z-index: 1;
}
.player-utr {
  font-family: var(--font-disp); font-size: 46px;
  color: var(--c-gold); line-height: 1.05;
  position: relative; z-index: 1;
  letter-spacing: 2px;
}
.player-meta {
  font-size: 11.5px; color: var(--c-muted); line-height: 2;
  margin-top: 10px; position: relative; z-index: 1;
}
.player-record {
  display: flex; gap: 20px;
  margin-top: 16px; padding-top: 16px;
  border-top: 1px solid var(--c-border);
  position: relative; z-index: 1;
}
.rec-item { font-family: var(--font-mono); font-size: 9.5px; color: var(--c-muted); }
.rec-item span { display: block; font-family: var(--font-disp); font-size: 22px; letter-spacing: 1px; }
.rec-w { color: var(--c-win); }
.rec-l { color: var(--c-loss); }

/* ── PLAYER MODAL ── */
.pm-header { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 28px; }
.pm-team-pill {
  display: inline-flex; align-items: center;
  font-family: var(--font-mono); font-size: 8.5px; letter-spacing: 1.5px;
  text-transform: uppercase; padding: 3px 9px; border-radius: 20px;
  border: 1px solid var(--c-border); color: var(--c-muted); margin-bottom: 12px;
}
.pm-team-pill.A { border-color: rgba(201,169,110,.35); color: var(--c-gold); background: rgba(201,169,110,.05); }
.pm-name { font-family: var(--font-disp); font-size: 42px; letter-spacing: 1px; line-height: 1; }
.pm-role { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--c-gold); margin-top: 8px; }
.pm-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; }
.pm-stat { background: var(--c-surf2); border: 1px solid var(--c-border); border-radius: 10px; padding: 18px 20px; }
.pm-stat-num { font-family: var(--font-disp); font-size: 40px; letter-spacing: 1px; line-height: 1; }
.pm-stat-lbl { font-family: var(--font-mono); font-size: 8.5px; letter-spacing: 2px; text-transform: uppercase; color: var(--c-muted); margin-top: 4px; }
.pm-detail { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--c-border); }
.pm-detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--c-border); }
.pm-detail-row:last-child { border-bottom: none; }
.pm-detail-lbl { font-family: var(--font-mono); font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--c-muted); }
.pm-detail-val { font-size: 13px; font-weight: 500; }

/* ── LEADERBOARD ── */
.lb {
  border: 1px solid var(--c-border);
  border-radius: 12px; overflow: hidden;
}
.lb-head {
  display: grid; grid-template-columns: 52px 1fr 40px 40px;
  padding: 11px 20px;
  background: rgba(255,255,255,.02);
  border-bottom: 1px solid var(--c-border);
}
.lb-head-lbl {
  font-family: var(--font-mono); font-size: 8.5px;
  letter-spacing: 2px; text-transform: uppercase; color: var(--c-muted2);
}

.lb-row {
  display: grid; grid-template-columns: 52px 1fr 40px 40px;
  align-items: center; padding: 14px 20px;
  border-bottom: 1px solid var(--c-border);
  transition: background .15s; cursor: pointer;
}
.lb-row:last-child { border-bottom: none; }
.lb-row:hover { background: var(--c-surf2); }
.lb-row.sjsu { background: rgba(201,169,110,.04); border-left: 2px solid var(--c-gold); padding-left: 18px; }
.lb-row.sjsu:hover { background: rgba(201,169,110,.07); }

.lb-rank {
  font-family: var(--font-disp); font-size: 22px; color: var(--c-muted2);
  letter-spacing: 1px;
}
.lb-rank.gold { color: var(--c-gold); }

.lb-school { font-size: 13.5px; font-weight: 500; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.lb-badge-inline {
  font-family: var(--font-mono); font-size: 8px; letter-spacing: .8px;
  padding: 2px 7px; border-radius: 3px;
  background: var(--c-gold-glow); color: var(--c-gold);
  border: 1px solid rgba(201,169,110,.2);
}
.lb-stat { font-family: var(--font-mono); font-size: 12px; color: var(--c-muted); text-align: right; }

/* ── PAGE HERO (inner pages) ── */
.page-hero {
  padding: 72px 72px 52px;
  border-bottom: 1px solid var(--c-border);
  position: relative; overflow: hidden;
}
.page-hero::after {
  content: attr(data-word);
  position: absolute; right: 48px; bottom: -24px;
  font-family: var(--font-disp); font-size: clamp(90px, 16vw, 190px);
  font-weight: 400; color: transparent;
  -webkit-text-stroke: 1px rgba(201,169,110,.05);
  line-height: 1; pointer-events: none; user-select: none;
  letter-spacing: 4px;
}
.page-eyebrow {
  font-family: var(--font-mono); font-size: 9.5px;
  letter-spacing: 3px; text-transform: uppercase; color: var(--c-muted);
  margin-bottom: 12px;
}
.page-h1 {
  font-family: var(--font-disp); font-size: clamp(48px,8vw,90px);
  font-weight: 400; line-height: .92; letter-spacing: 3px;
}
.page-meta { display: flex; gap: 44px; margin-top: 28px; }
.page-stat-num {
  font-family: var(--font-disp); font-size: 48px; line-height: 1;
  letter-spacing: 2px;
}
.page-stat-lbl {
  font-family: var(--font-mono); font-size: 8.5px; letter-spacing: 2px;
  text-transform: uppercase; color: var(--c-muted); margin-top: 4px;
}

/* ── EDIT ROSTER ── */
.er-row {
  display: grid; grid-template-columns: 1fr 70px 96px 44px;
  gap: 8px; align-items: center;
  padding: 10px 0; border-bottom: 1px solid var(--c-border);
}
.er-row:last-child { border-bottom: none; }
.er-name { font-size: 13px; font-weight: 500; }
.er-input {
  padding: 5px 8px; background: var(--c-surf2);
  border: 1px solid var(--c-border); border-radius: 6px;
  color: var(--c-text); font-size: 12.5px; width: 100%; outline: none;
  transition: border-color .15s; cursor: none;
}
.er-input:focus { border-color: rgba(201,169,110,.4); }
.arr-btn {
  background: none; border: none; cursor: pointer; color: var(--c-muted);
  padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center;
  transition: color .15s, background .15s;
}
.arr-btn:hover { color: var(--c-gold); background: var(--c-surf2); }
.arr-btn svg { width: 13px; height: 13px; }

/* ── SCROLL REVEAL ── */
.reveal { opacity: 0; transform: translateY(20px); }
.reveal.in { animation: riseIn .65s var(--spring) both; }
.reveal.in-2 { animation: riseIn .65s var(--spring) .1s both; }
.reveal.in-3 { animation: riseIn .65s var(--spring) .2s both; }

/* ── FOOTER ── */
.footer {
  border-top: 1px solid var(--c-border);
  padding: 36px 72px;
  display: flex; justify-content: space-between; align-items: center;
}
.footer-logo { font-family: var(--font-disp); font-size: 20px; letter-spacing: 4px; text-transform: uppercase; }
.footer-logo span { color: var(--c-gold); }
.footer-right { font-family: var(--font-mono); font-size: 9.5px; color: var(--c-muted); text-align: right; line-height: 2; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .hero, .section, .page-hero, .footer { padding-left: 24px; padding-right: 24px; }
  .hero-bg-text, .hero-grid { display: none; }
  .stats-bar { grid-template-columns: 1fr 1fr; }
  .stat-cell { padding: 24px 28px; }
  .fg-2 { grid-template-columns: 1fr; }
  .match-row { grid-template-columns: 56px 1fr 40px; }
  .match-score { display: none; }
  .amb { display: none; }
}
`;

// ─── CURSOR ──────────────────────────────────────────────────────────────────
function Cursor() {
  const el = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const move = e => { pos.current = { x: e.clientX, y: e.clientY }; };
    const tick = () => {
      if (el.current) {
        el.current.style.left = pos.current.x + 'px';
        el.current.style.top  = pos.current.y + 'px';
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    window.addEventListener('mousemove', move);

    const expand = e => { if (e.target.closest('button,a,input,select,[data-hover]') && el.current) el.current.classList.add('large'); };
    const shrink = () => { if (el.current) el.current.classList.remove('large'); };
    window.addEventListener('mouseover', expand);
    window.addEventListener('mouseout', shrink);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', expand);
      window.removeEventListener('mouseout', shrink);
    };
  }, []);

  return <div id="csr" ref={el} />;
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
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

// ─── DROPDOWN ────────────────────────────────────────────────────────────────
function Dropdown({ items, right, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <div ref={ref} className={`dd${right ? ' dd-right' : ''}`}>
      {items.map((item, i) =>
        item.sep ? <div key={i} className="dd-sep" /> :
        <button key={i} className="dd-item" onClick={() => { item.action(); onClose(); }}>
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
    <div className="dd-wrap">
      <button className={`nb${open ? ' active' : ''}`} onClick={() => setOpen(o => !o)}>
        <span className="ic">{icon}</span>{label}<span className="chev ic">{Icons.chevronDown}</span>
      </button>
      {open && <Dropdown items={items} onClose={close} />}
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ user, setModal, setPage, onLogout }) {
  const [accOpen, setAccOpen] = useState(false);
  const closeAcc = useCallback(() => setAccOpen(false), []);

  const editItems = user?.role === 'officer'
    ? [
        { icon: Icons.plus,   label: 'Input Results',      action: () => setModal('results') },
        { icon: Icons.list,   label: 'Edit Roster',         action: () => setModal('roster-edit') },
        { icon: Icons.pencil, label: 'Update Player Card',  action: () => setModal('card-edit') },
      ]
    : user?.role === 'player'
    ? [{ icon: Icons.pencil, label: 'Update Player Card', action: () => setModal('card-edit') }]
    : null;

  const viewItems = [
    { icon: Icons.clock, label: 'Match History', action: () => setPage('history') },
    { icon: Icons.list,  label: 'Roster',        action: () => setPage('roster') },
    { icon: Icons.bar,   label: 'Standings',     action: () => setPage('leaderboard') },
  ];

  const accItems = [
    { icon: Icons.settings, label: 'Settings', action: () => {} },
    { sep: true },
    { icon: Icons.logout, label: 'Log Out', action: onLogout },
  ];

  return (
    <nav>
      <div className="nav-left">
        {user && editItems && (
          <NavMenu label="Edit" icon={Icons.pencil} items={editItems} />
        )}
        <NavMenu label="View" icon={Icons.eye} items={viewItems} />
      </div>

      <div className="nav-logo" onClick={() => setPage('home')} data-hover>
        SJSU&nbsp;<span>TENNIS</span>
      </div>

      <div className="nav-right">
        {user ? (
          <div className="dd-wrap">
            <div className="welcome-tag" onClick={() => setAccOpen(o => !o)} style={{ cursor: 'pointer' }}>
              <span className="ic">{Icons.user}</span>
              {user.firstName}
              <span className="ic" style={{ marginLeft: 2 }}>{Icons.chevronDown}</span>
            </div>
            {accOpen && <Dropdown items={accItems} right onClose={closeAcc} />}
          </div>
        ) : (
          <>
            <button className="pill" onClick={() => setModal('login')}>Log in</button>
            <button className="pill filled" onClick={() => setModal('register')}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}

// ─── REGISTER MODAL ───────────────────────────────────────────────────────────
function RegisterModal({ onClose, onSuccess }) {
  const [step, setStep] = useState('role');
  const [role, setRole] = useState(null);
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', password: '', code: '' });
  const [err, setErr] = useState('');

  const submit = () => {
    setErr('');
    if (!f.firstName || !f.lastName || !f.email || !f.password) { setErr('All fields are required.'); return; }
    if (role === 'officer' && f.code !== OFFICER_CODE) { setErr('Invalid officer code.'); return; }
    if (role === 'player'  && f.code !== PLAYER_CODE)  { setErr('Invalid player code.');  return; }
    onSuccess({ ...f, role });
  };

  const roles = [
    { id: 'officer', icon: Icons.star,   label: 'Officer' },
    { id: 'player',  icon: Icons.racket, label: 'Player'  },
    { id: 'viewer',  icon: Icons.eye,    label: 'Viewer'  },
  ];

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}><span className="ic">{Icons.close}</span></button>
        <div className="modal-title">Register</div>
        <div className="modal-sub">{step === 'role' ? 'Choose your access level' : `Creating ${role} account`}</div>

        {step === 'role' ? (
          <>
            <div className="role-grid">
              {roles.map(r => (
                <button key={r.id} className={`role-card${role === r.id ? ' sel' : ''}`} onClick={() => setRole(r.id)}>
                  <div className="icon-wrap">{r.icon}</div>
                  <div className="role-lbl">{r.label}</div>
                </button>
              ))}
            </div>
            <button className="btn-primary" onClick={() => role && setStep('info')} disabled={!role}>Continue</button>
          </>
        ) : (
          <>
            <div className="fg-2">
              <div className="fg">
                <label className="flabel">First Name</label>
                <input className="finput" value={f.firstName} onChange={e => setF(x => ({ ...x, firstName: e.target.value }))} placeholder="First" />
              </div>
              <div className="fg">
                <label className="flabel">Last Name</label>
                <input className="finput" value={f.lastName} onChange={e => setF(x => ({ ...x, lastName: e.target.value }))} placeholder="Last" />
              </div>
            </div>
            <div className="fg">
              <label className="flabel">Email</label>
              <input className="finput" type="email" value={f.email} onChange={e => setF(x => ({ ...x, email: e.target.value }))} placeholder="you@sjsu.edu" />
            </div>
            <div className="fg">
              <label className="flabel">Password</label>
              <input className="finput" type="password" value={f.password} onChange={e => setF(x => ({ ...x, password: e.target.value }))} placeholder="••••••••" />
            </div>
            {(role === 'officer' || role === 'player') && (
              <div className="fg">
                <label className="flabel">{role === 'officer' ? 'Officer' : 'Player'} Access Code</label>
                <input className="finput" value={f.code} onChange={e => setF(x => ({ ...x, code: e.target.value }))} placeholder="Enter code" />
              </div>
            )}
            {err && <div className="ferr">{err}</div>}
            <button className="btn-primary" onClick={submit}>Create Account</button>
            <button className="btn-ghost" onClick={() => setStep('role')}>Back</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── LOGIN MODAL ──────────────────────────────────────────────────────────────
function LoginModal({ onClose, onSuccess, users }) {
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const submit = () => {
    if (!f.email || !f.password) { setErr('All fields required.'); return; }
    const registered = users.find(u => u.email === f.email);
    if (!registered) { setErr('No account found with that email.'); return; }
    onSuccess({ ...registered });
  };
  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}><span className="ic">{Icons.close}</span></button>
        <div className="modal-title">Log In</div>
        <div className="modal-sub">Welcome back to SJSU Tennis</div>
        <div className="fg">
          <label className="flabel">Email</label>
          <input className="finput" type="email" value={f.email} onChange={e => setF(x => ({ ...x, email: e.target.value }))} placeholder="you@sjsu.edu" />
        </div>
        <div className="fg">
          <label className="flabel">Password</label>
          <input className="finput" type="password" value={f.password} onChange={e => setF(x => ({ ...x, password: e.target.value }))} placeholder="••••••••" />
        </div>
        {err && <div className="ferr">{err}</div>}
        <button className="btn-primary" onClick={submit}>Log In</button>
      </div>
    </div>
  );
}

// ─── INPUT RESULTS MODAL ──────────────────────────────────────────────────────
function InputResultsModal({ onClose, onSave }) {
  const [f, setF] = useState({ date: '', opponent: '', score: '', result: 'W', location: 'Home' });
  const [saved, setSaved] = useState(false);
  const save = () => {
    if (!f.date || !f.opponent || !f.score) return;
    onSave({ ...f, id: Date.now() });
    setSaved(true);
    setTimeout(onClose, 1000);
  };
  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}><span className="ic">{Icons.close}</span></button>
        <div className="modal-title">Input Result</div>
        <div className="modal-sub">Log a match result for the 2025–26 season</div>
        <div className="fg-2">
          <div className="fg">
            <label className="flabel">Date</label>
            <input className="finput" type="date" value={f.date} onChange={e => setF(x => ({ ...x, date: e.target.value }))} />
          </div>
          <div className="fg">
            <label className="flabel">Result</label>
            <select className="fselect" value={f.result} onChange={e => setF(x => ({ ...x, result: e.target.value }))}>
              <option value="W">Win</option>
              <option value="L">Loss</option>
            </select>
          </div>
        </div>
        <div className="fg">
          <label className="flabel">Opponent School</label>
          <input className="finput" value={f.opponent} onChange={e => setF(x => ({ ...x, opponent: e.target.value }))} placeholder="e.g. UC Berkeley" />
        </div>
        <div className="fg-2">
          <div className="fg">
            <label className="flabel">Score (TOC format)</label>
            <input className="finput" value={f.score} onChange={e => setF(x => ({ ...x, score: e.target.value }))} placeholder="e.g. 36-32" />
          </div>
          <div className="fg">
            <label className="flabel">Location</label>
            <select className="fselect" value={f.location} onChange={e => setF(x => ({ ...x, location: e.target.value }))}>
              <option value="Home">Home</option>
              <option value="Away">Away</option>
            </select>
          </div>
        </div>
        {saved
          ? <div className="fok"><span className="ic">{Icons.check}</span>Result saved</div>
          : <button className="btn-primary" onClick={save}>Save Result</button>
        }
      </div>
    </div>
  );
}

// ─── EDIT ROSTER MODAL ────────────────────────────────────────────────────────
function EditRosterModal({ roster, onClose, onSave }) {
  const [players, setPlayers] = useState(roster.map(p => ({ ...p })));
  const move = (i, d) => {
    const a = [...players]; const j = i + d;
    if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]];
    setPlayers(a);
  };
  const upd = (i, k, v) => { const a = [...players]; a[i] = { ...a[i], [k]: v }; setPlayers(a); };
  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-wide">
        <button className="modal-close" onClick={onClose}><span className="ic">{Icons.close}</span></button>
        <div className="modal-title">Edit Roster</div>
        <div className="modal-sub">Reorder players, update UTR ratings and team assignments</div>
        {players.map((p, i) => (
          <div key={p.id} className="er-row">
            <div className="er-name">{p.name}</div>
            <input className="er-input" type="number" step=".1" value={p.utr}
              onChange={e => upd(i, 'utr', parseFloat(e.target.value))} />
            <select className="er-input" value={p.team} onChange={e => upd(i, 'team', e.target.value)}>
              <option value="A">A Team</option>
              <option value="B">B Team</option>
            </select>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button className="arr-btn" onClick={() => move(i, -1)}>{Icons.arrowUp}</button>
              <button className="arr-btn" onClick={() => move(i,  1)}>{Icons.arrowDown}</button>
            </div>
          </div>
        ))}
        <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => { onSave(players); onClose(); }}>
          Save Roster
        </button>
      </div>
    </div>
  );
}

// ─── UPDATE CARD MODAL ────────────────────────────────────────────────────────
function UpdateCardModal({ user, roster, onClose, onSave }) {
  const existing = roster.find(p => p.name.toLowerCase().includes(user.firstName.toLowerCase())) || {};
  const [f, setF] = useState({ major: existing.major || '', year: existing.year || 'Freshman', utr: existing.utr || '', photo: existing.photo || '' });

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setF(x => ({ ...x, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}><span className="ic">{Icons.close}</span></button>
        <div className="modal-title">Player Card</div>
        <div className="modal-sub">Update your profile on the roster</div>
        <div className="fg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div className="player-avatar" style={{ width: 72, height: 72, marginBottom: 0 }}>
            {f.photo
              ? <img src={f.photo} alt="preview" />
              : <span className="player-avatar-placeholder">{user.firstName.charAt(0)}</span>}
          </div>
          <label style={{ cursor: 'pointer' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--c-gold)', border: '1px solid rgba(201,169,110,.35)', borderRadius: 6, padding: '5px 14px' }}>
              {f.photo ? 'Change Photo' : 'Upload Photo'}
            </span>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
          </label>
        </div>
        <div className="fg" style={{ marginTop: 16 }}>
          <label className="flabel">Major</label>
          <input className="finput" value={f.major} onChange={e => setF(x => ({ ...x, major: e.target.value }))} placeholder="e.g. Computer Science" />
        </div>
        <div className="fg">
          <label className="flabel">Year</label>
          <select className="fselect" value={f.year} onChange={e => setF(x => ({ ...x, year: e.target.value }))}>
            {['Freshman','Sophomore','Junior','Senior'].map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div className="fg">
          <label className="flabel">UTR Rating</label>
          <input className="finput" type="number" step=".1" min="1" max="16.5"
            value={f.utr} onChange={e => setF(x => ({ ...x, utr: e.target.value }))} placeholder="e.g. 7.2" />
        </div>
        <button className="btn-primary" onClick={() => { onSave(f, user.firstName); onClose(); }}>Save Changes</button>
      </div>
    </div>
  );
}

// ─── PLAYER CARD ─────────────────────────────────────────────────────────────
function PlayerCard({ p, pos, onSelect }) {
  return (
    <div className="player-card reveal" data-pos={pos} onClick={() => onSelect && onSelect(p)}>
      <div className="player-avatar">
        {p.photo
          ? <img src={p.photo} alt={p.name} />
          : <span className="player-avatar-placeholder">{p.name.charAt(0)}</span>}
      </div>
      <div className={`team-pill${p.team === 'A' ? ' A' : ''}`}>{p.team} Team</div>
      <div className="player-name">{p.name}</div>
      {p.role && <div className="player-meta" style={{ color: 'var(--c-gold)', marginTop: 2 }}>{p.role}</div>}
      {p.utr > 0 && <>
        <div className="player-utr-lbl">UTR Rating</div>
        <div className="player-utr">{Number(p.utr).toFixed(1)}</div>
      </>}
      {(p.year || p.major) && <div className="player-meta">{p.year}{p.year && p.major ? '\u00a0\u00a0·\u00a0\u00a0' : ''}{p.major}</div>}
      <div className="player-record">
        <div className="rec-item"><span className="rec-w">{p.wins}</span>Wins</div>
        <div className="rec-item"><span className="rec-l">{p.losses}</span>Losses</div>
      </div>
    </div>
  );
}

// ─── PLAYER MODAL ─────────────────────────────────────────────────────────────
function PlayerModal({ p, onClose }) {
  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}><span className="ic">{Icons.close}</span></button>
        <div className={`pm-team-pill${p.team === 'A' ? ' A' : ''}`}>{p.team} Team</div>
        <div className="pm-name">{p.name}</div>
        {p.role && <div className="pm-role">{p.role}</div>}
        <div className="pm-stats">
          <div className="pm-stat">
            <div className="pm-stat-num" style={{ color: 'var(--c-win)' }}>{p.wins}</div>
            <div className="pm-stat-lbl">Wins</div>
          </div>
          <div className="pm-stat">
            <div className="pm-stat-num" style={{ color: 'var(--c-loss)' }}>{p.losses}</div>
            <div className="pm-stat-lbl">Losses</div>
          </div>
        </div>
        <div className="pm-detail">
          <div className="pm-detail-row">
            <span className="pm-detail-lbl">Section</span>
            <span className="pm-detail-val">{p.gender === 'F' ? 'Ladies' : 'Gentlemen'}</span>
          </div>
          {p.utr > 0 && (
            <div className="pm-detail-row">
              <span className="pm-detail-lbl">UTR Rating</span>
              <span className="pm-detail-val" style={{ color: 'var(--c-gold)', fontFamily: 'var(--font-disp)', fontSize: 22 }}>{Number(p.utr).toFixed(1)}</span>
            </div>
          )}
          {p.year && (
            <div className="pm-detail-row">
              <span className="pm-detail-lbl">Year</span>
              <span className="pm-detail-val">{p.year}</span>
            </div>
          )}
          {p.major && (
            <div className="pm-detail-row">
              <span className="pm-detail-lbl">Major</span>
              <span className="pm-detail-val">{p.major}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ matches, roster, setPage, onSelectPlayer }) {
  useReveal();
  const wins   = matches.filter(m => m.result === 'W').length;
  const losses = matches.filter(m => m.result === 'L').length;
  const recent = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  const topFour = roster.slice(0, 4);

  const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <div className="hero-grid" />
        <div className="hero-bg-text">TOC</div>
        <div className="hero-eyebrow">NorCal TOC · 2025–26 Season</div>
        <h1 className="hero-h1">SJSU <em>CLUB</em><br />TENNIS</h1>
        <p className="hero-sub">
          The Official Site for San José State's Club Tennis Team<br />
          <br />
        </p>
      </div>

      {/* STATS */}
      <div className="stats-bar">
        {[
          { n: wins,            l: 'Season Wins' },
          { n: losses,          l: 'Season Losses' },
          { n: matches.length,  l: 'Matches Played' },
          { n: roster.length,   l: 'Roster Players' },
        ].map((s, i) => (
          <div key={i} className="stat-cell reveal">
            <div className="stat-num">{s.n}</div>
            <div className="stat-lbl">{s.l}</div>
          </div>
        ))}
      </div>

      {/* RECENT MATCHES */}
      <div className="section">
        <div className="section-tag">Results</div>
        <div className="section-header">
          <h2 className="section-h2">Recent<br />Matches</h2>
          <button className="view-all" onClick={() => setPage('history')}>
            View all <span className="ic">{Icons.arrowRight}</span>
          </button>
        </div>
        {recent.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--c-muted)', letterSpacing: '1px' }}>
            Let's add some wins...
          </div>
        ) : (
          <div className="match-list">
            {recent.map(m => (
              <div key={m.id} className="match-row reveal">
                <div className="match-date">{fmt(m.date)}</div>
                <div>
                  <div className="match-vs">SJSU vs. {m.opponent}</div>
                  <div className="match-loc">{m.location}</div>
                </div>
                <div className="match-score">{m.score}</div>
                <div className={`badge badge-${m.result}`}>{m.result}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ROSTER PREVIEW */}
      <div className="section">
        <div className="section-tag">Squad</div>
        <div className="section-header">
          <h2 className="section-h2">Roster</h2>
          <button className="view-all" onClick={() => setPage('roster')}>
            View all <span className="ic">{Icons.arrowRight}</span>
          </button>
        </div>
        <div className="player-grid">
          {topFour.map((p, i) => <PlayerCard key={p.id} p={p} pos={i + 1} onSelect={onSelectPlayer} />)}
        </div>
      </div>

      {/* STANDINGS PREVIEW */}
      <div className="section">
        <div className="section-tag">NorCal TOC · 13 Schools</div>
        <div className="section-header">
          <h2 className="section-h2">Standings</h2>
          <button className="view-all" onClick={() => setPage('leaderboard')}>
            View all <span className="ic">{Icons.arrowRight}</span>
          </button>
        </div>
        <div className="lb reveal">
          <div className="lb-head">
            <span className="lb-head-lbl">#</span>
            <span className="lb-head-lbl">School</span>
            <span className="lb-head-lbl" style={{ textAlign: 'right' }}>W</span>
            <span className="lb-head-lbl" style={{ textAlign: 'right' }}>L</span>
          </div>
          {LEADERBOARD.slice(0, 5).map(s => (
            <div key={s.rank} className={`lb-row${s.school === 'SJSU' ? ' sjsu' : ''}`}>
              <div className={`lb-rank${s.rank <= 3 ? ' gold' : ''}`}>{s.rank}</div>
              <div className="lb-school">
                {s.school}
              </div>
              <div className="lb-stat">{s.wins}</div>
              <div className="lb-stat">{s.losses}</div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-logo">SJSU <span>Tennis</span></div>
        <div className="footer-right">
          USTA Tennis on Campus · NorCal Section<br />
        </div>
      </footer>
    </div>
  );
}

// ─── HISTORY PAGE ─────────────────────────────────────────────────────────────
function HistoryPage({ matches }) {
  useReveal();
  const sorted = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date));
  const wins   = matches.filter(m => m.result === 'W').length;
  const losses = matches.filter(m => m.result === 'L').length;
  const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });

  return (
    <div className="page">
      <div className="page-hero" data-word="HISTORY">
        <div className="page-eyebrow">2025–26 Season</div>
        <h1 className="page-h1">Match<br />History</h1>
        <div className="page-meta">
          <div>
            <div className="page-stat-num" style={{ color: 'var(--c-win)' }}>{wins}</div>
            <div className="page-stat-lbl">Wins</div>
          </div>
          <div>
            <div className="page-stat-num" style={{ color: 'var(--c-loss)' }}>{losses}</div>
            <div className="page-stat-lbl">Losses</div>
          </div>
          <div>
            <div className="page-stat-num">{matches.length}</div>
            <div className="page-stat-lbl">Played</div>
          </div>
        </div>
      </div>
      <div className="section" style={{ borderTop: 'none' }}>
        <div className="match-list">
          {sorted.map(m => (
            <div key={m.id} className="match-row reveal">
              <div className="match-date">{fmt(m.date)}</div>
              <div>
                <div className="match-vs">SJSU vs. {m.opponent}</div>
                <div className="match-loc">{m.location}</div>
              </div>
              <div className="match-score">{m.score}</div>
              <div className={`badge badge-${m.result}`}>{m.result}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROSTER PAGE ──────────────────────────────────────────────────────────────
function RosterPage({ roster, onSelectPlayer }) {
  useReveal();
  const aTeam = roster.filter(p => p.team === 'A');
  const bTeam = roster.filter(p => p.team === 'B');
  const cTeam = roster.filter(p => p.team === 'C');

  const TeamSection = ({ label, players }) => (
    <>
      <div className="section-tag">{label} — Gentlemen</div>
      <div className="player-grid" style={{ marginBottom: 32 }}>
        {players.filter(p => p.gender === 'M').map((p, i) => <PlayerCard key={p.id} p={p} pos={i + 1} onSelect={onSelectPlayer} />)}
      </div>
      <div className="section-tag">{label} — Ladies</div>
      <div className="player-grid" style={{ marginBottom: 56 }}>
        {players.filter(p => p.gender === 'F').map((p, i) => <PlayerCard key={p.id} p={p} pos={i + 1} onSelect={onSelectPlayer} />)}
      </div>
    </>
  );

  return (
    <div className="page">
      <div className="page-hero" data-word="SQUAD">
        <div className="page-eyebrow">2025–26 · SJSU Club Tennis</div>
        <h1 className="page-h1">Roster</h1>
        <div className="page-meta">
          <div>
            <div className="page-stat-num">{roster.length}</div>
            <div className="page-stat-lbl">Players</div>
          </div>
          <div>
            <div className="page-stat-num">{aTeam.length}</div>
            <div className="page-stat-lbl">A Team</div>
          </div>
          <div>
            <div className="page-stat-num">{bTeam.length}</div>
            <div className="page-stat-lbl">B Team</div>
          </div>
          <div>
            <div className="page-stat-num">{cTeam.length}</div>
            <div className="page-stat-lbl">C Team</div>
          </div>
        </div>
      </div>
      <div className="section" style={{ borderTop: 'none' }}>
        <TeamSection label="Team A" players={aTeam} />
        <TeamSection label="Team B" players={bTeam} />
        <div className="section-tag">Team C — Gentlemen</div>
        <div className="player-grid" style={{ marginBottom: 32 }}>
          {cTeam.filter(p => p.gender === 'M').map((p, i) => <PlayerCard key={p.id} p={p} pos={i + 1} onSelect={onSelectPlayer} />)}
        </div>
        <div className="section-tag">Team C — Ladies</div>
        <div className="player-grid">
          {cTeam.filter(p => p.gender === 'F').map((p, i) => <PlayerCard key={p.id} p={p} pos={i + 1} onSelect={onSelectPlayer} />)}
        </div>
      </div>
    </div>
  );
}

// ─── STANDINGS PAGE ────────────────────────────────────────────────────────────
function LeaderboardPage() {
  useReveal();
  return (
    <div className="page">
      <div className="page-hero" data-word="RANKS">
        <div className="page-eyebrow">NorCal USTA Tennis on Campus · 2025–26</div>
        <h1 className="page-h1">Standings</h1>
      </div>
      <div className="section" style={{ borderTop: 'none' }}>
        <div className="lb reveal">
          <div className="lb-head">
            <span className="lb-head-lbl">#</span>
            <span className="lb-head-lbl">School</span>
            <span className="lb-head-lbl" style={{ textAlign: 'right' }}>W</span>
            <span className="lb-head-lbl" style={{ textAlign: 'right' }}>L</span>
          </div>
          {LEADERBOARD.map(s => (
            <div key={s.rank} className={`lb-row${s.school === 'SJSU' ? ' sjsu' : ''}`}>
              <div className={`lb-rank${s.rank <= 3 ? ' gold' : ''}`}>{s.rank}</div>
              <div className="lb-school">
                {s.school}
              </div>
              <div className="lb-stat">{s.wins}</div>
              <div className="lb-stat">{s.losses}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [user,           setUser]           = useState(null);
  const [users,          setUsers]          = useState(() => { try { return JSON.parse(localStorage.getItem('sjsu_users') || '[]'); } catch { return []; } });
  const [modal,          setModal]          = useState(null);
  const [page,           setPage]           = useState('home');
  const [matches,        setMatches]        = useState(INITIAL_MATCHES);
  const [roster,         setRoster]         = useState(INITIAL_ROSTER);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Inject CSS once
  useEffect(() => {
    const tag = document.createElement('style');
    tag.textContent = STYLES;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  // Scroll to top on page change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

  const register = d  => { setUsers(u => { const next = [...u, d]; localStorage.setItem('sjsu_users', JSON.stringify(next)); return next; }); setUser(d); setModal(null); };
  const login    = d  => { setUser(d); setModal(null); };
  const logout   = () => { setUser(null); setPage('home'); };

  const saveMatch  = m => setMatches(p => [m, ...p]);
  const saveRoster = r => setRoster(r);
  const saveCard   = (f, fn) => setRoster(p => p.map(pl =>
    pl.name.toLowerCase().includes(fn.toLowerCase())
      ? { ...pl, major: f.major || pl.major, year: f.year || pl.year, utr: parseFloat(f.utr) || pl.utr, photo: f.photo || pl.photo }
      : pl
  ));

  return (
    <>
      {/* Ambient light orbs */}
      <div className="amb amb-a" />
      <div className="amb amb-b" />

      <Nav user={user} setModal={setModal} setPage={setPage} onLogout={logout} />

      {page === 'home'        && <HomePage matches={matches} roster={roster} setPage={setPage} onSelectPlayer={setSelectedPlayer} />}
      {page === 'history'     && <HistoryPage matches={matches} />}
      {page === 'roster'      && <RosterPage roster={roster} onSelectPlayer={setSelectedPlayer} />}
      {page === 'leaderboard' && <LeaderboardPage />}
      {selectedPlayer && <PlayerModal p={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}

      {modal === 'register'    && <RegisterModal    onClose={() => setModal(null)} onSuccess={register} />}
      {modal === 'login'       && <LoginModal        onClose={() => setModal(null)} onSuccess={login} users={users} />}
      {modal === 'results'     && <InputResultsModal onClose={() => setModal(null)} onSave={saveMatch} />}
      {modal === 'roster-edit' && <EditRosterModal   roster={roster} onClose={() => setModal(null)} onSave={saveRoster} />}
      {modal === 'card-edit'   && user && <UpdateCardModal user={user} roster={roster} onClose={() => setModal(null)} onSave={saveCard} />}
    </>
  );
}
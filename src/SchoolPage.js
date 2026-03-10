import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getSchoolData, saveSchoolData, getAllEnrolledSchools } from "./data/schoolStore";
import { registerUser, loginUser } from "./data/authStore";
import { useAuth } from "./AuthContext";

// ─── CSS FACTORY ─────────────────────────────────────────────────────────────
// Same design system as SJSU but with --c-accent replacing --c-gold
function makeCSS(accent, accentHi, accentGlow) {
  return `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600;700&family=Inter:wght@600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --c-bg:#0e0c0a;--c-surf:#151210;--c-surf2:#1b1816;
  --c-border:rgba(255,255,255,.06);--c-border2:rgba(255,255,255,.1);
  --c-accent:${accent};--c-accent-hi:${accentHi};--c-accent-glow:${accentGlow};
  --c-text:#f0ece6;--c-muted:rgba(240,236,230,.38);--c-muted2:rgba(240,236,230,.18);
  --c-win:#5db882;--c-loss:#c96060;
  --nav-h:58px;--r:10px;
  --spring:cubic-bezier(.16,1,.3,1);--ease:cubic-bezier(.25,.46,.45,.94);
  --font-disp:'Bebas Neue',sans-serif;--font-ui:'DM Sans',sans-serif;--font-mono:'DM Mono',monospace;
}
html{scroll-behavior:smooth}
body{background:var(--c-bg);color:var(--c-text);font-family:var(--font-ui);font-size:14px;line-height:1.6;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;z-index:9990;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");opacity:.022;mix-blend-mode:overlay}
.sp-amb{position:fixed;pointer-events:none;z-index:0;border-radius:50%;filter:blur(140px);animation:spAmb 12s ease-in-out infinite alternate}
.sp-amb-a{width:700px;height:700px;background:var(--c-accent-glow);top:-200px;left:-150px}
.sp-amb-b{width:500px;height:500px;background:var(--c-accent-glow);bottom:-100px;right:-100px;animation-delay:-6s;opacity:.6}
@keyframes spAmb{from{transform:translate(0,0)}to{transform:translate(30px,40px)}}
/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:100;height:var(--nav-h);display:flex;align-items:center;padding:0 24px;background:rgba(14,12,10,.78);backdrop-filter:blur(32px) saturate(180%);-webkit-backdrop-filter:blur(32px) saturate(180%);border-bottom:1px solid var(--c-border)}
.nav-logo{font-family:var(--font-disp);font-size:18px;letter-spacing:4px;text-transform:uppercase;color:var(--c-text);cursor:pointer;white-space:nowrap;position:absolute;left:50%;transform:translateX(-50%);z-index:2}
.nav-logo span{color:var(--c-accent)}
.nav-left,.nav-right{display:flex;align-items:center;gap:2px;position:relative;z-index:1;flex:1}
.nav-right{justify-content:flex-end}
.sq-home-pill{display:flex;align-items:center;gap:7px;padding:6px 10px;border-radius:6px;cursor:pointer;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;background:rgba(61,186,111,.2);border:none;color:rgba(240,236,230,.75);transition:color .15s,background .15s;white-space:nowrap}
.sq-home-pill:hover{color:rgba(240,236,230,.96);background:rgba(61,186,111,.3)}
.sq-home-pill-arrow{font-size:9px;color:rgba(61,186,111,.8);transition:color .15s;flex-shrink:0}
.sq-home-pill:hover .sq-home-pill-arrow{color:#3dba6f}
.nb{display:flex;align-items:center;gap:5px;padding:6px 11px;border-radius:7px;background:none;border:none;cursor:pointer;font-family:var(--font-ui);font-size:13px;font-weight:500;color:var(--c-muted);letter-spacing:0;transition:color .18s,background .18s}
.nb:hover,.nb.active{color:var(--c-text);background:var(--c-surf2)}
.nb .ic{width:14px;height:14px;display:flex;align-items:center;justify-content:center}
.nb .chev{width:14px;height:14px;transition:transform .2s var(--spring)}
.nb.active .chev{transform:rotate(180deg)}
.pill{padding:7px 16px;border-radius:8px;cursor:pointer;font-family:var(--font-ui);font-size:13px;font-weight:500;letter-spacing:0;background:none;border:1px solid transparent;color:var(--c-muted);transition:all .18s}
.pill:hover{color:var(--c-text)}
.pill.filled{border:1px solid color-mix(in srgb,var(--c-accent) 55%,transparent);color:var(--c-accent)}
.pill.filled:hover{background:var(--c-accent-glow);color:var(--c-accent-hi);border-color:var(--c-accent-hi)}
.welcome-tag{display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:20px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);font-family:var(--font-ui);font-size:12px;font-weight:500;color:var(--c-text);letter-spacing:0;cursor:pointer}
/* DROPDOWN */
.dd-wrap{position:relative}
.dd{position:absolute;top:calc(100% + 7px);background:rgba(13,13,13,.97);backdrop-filter:blur(24px);border:1px solid var(--c-border2);border-radius:var(--r);min-width:188px;padding:5px;box-shadow:0 20px 60px rgba(0,0,0,.7);animation:ddIn .15s var(--spring);z-index:200}
.dd.dd-right{right:0}
@keyframes ddIn{from{opacity:0;transform:translateY(-6px)scale(.97)}to{opacity:1;transform:translateY(0)scale(1)}}
.dd-item{display:flex;align-items:center;gap:9px;width:100%;padding:8px 11px;border-radius:6px;background:none;border:none;cursor:pointer;color:var(--c-muted);font-family:var(--font-ui);font-size:13px;transition:background .12s,color .12s;text-align:left;white-space:nowrap}
.dd-item:hover{background:var(--c-surf2);color:var(--c-text)}
.dd-item .ic{width:14px;height:14px;opacity:.6;flex-shrink:0;transition:opacity .12s}
.dd-item:hover .ic{opacity:1;color:var(--c-accent)}
.dd-sep{height:1px;background:var(--c-border);margin:4px 0}
/* MODAL */
.modal-bg{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.7);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .18s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:var(--c-surf);border:1px solid var(--c-border2);border-radius:18px;padding:40px 36px 36px;width:100%;max-width:440px;max-height:90vh;overflow-y:auto;position:relative;box-shadow:0 40px 100px rgba(0,0,0,.8);animation:modeIn .22s var(--spring)}
.modal-wide{max-width:540px}
@keyframes modeIn{from{opacity:0;transform:translateY(18px)scale(.97)}to{opacity:1;transform:translateY(0)scale(1)}}
.modal-close{position:absolute;top:16px;right:16px;width:30px;height:30px;border-radius:50%;background:var(--c-surf2);border:1px solid var(--c-border);color:var(--c-muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:color .15s,background .15s}
.modal-close:hover{color:var(--c-text);background:var(--c-border2)}
.modal-close .ic{width:14px;height:14px}
.modal-title{font-family:var(--font-disp);font-size:34px;letter-spacing:1px;margin-bottom:4px}
.modal-sub{font-size:13px;color:var(--c-muted);font-family:var(--font-ui);margin-bottom:28px}
/* ROLE CARDS */
.role-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:22px}
.role-card{padding:18px 10px 14px;border:1px solid var(--c-border);border-radius:var(--r);background:var(--c-surf2);cursor:pointer;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;transition:border-color .18s,background .18s}
.role-card:hover{border-color:var(--c-border2);background:#1a1a1a}
.role-card.sel{border-color:var(--c-accent);background:var(--c-accent-glow)}
.role-card .icon-wrap{width:36px;height:36px;display:flex;align-items:center;justify-content:center;color:var(--c-muted)}
.role-card.sel .icon-wrap,.role-card:hover .icon-wrap{color:var(--c-accent)}
.role-card .icon-wrap svg{width:22px;height:22px}
.role-lbl{font-family:var(--font-ui);font-size:11px;font-weight:500;letter-spacing:0;color:var(--c-muted)}
.role-card.sel .role-lbl{color:var(--c-accent)}
/* FORM */
.fg{margin-bottom:13px}
.fg-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.flabel{display:block;font-family:var(--font-ui);font-size:12px;font-weight:500;letter-spacing:0;color:var(--c-muted);margin-bottom:6px}
.finput,.fselect{width:100%;padding:10px 12px;background:var(--c-surf2);border:1px solid var(--c-border);border-radius:8px;color:var(--c-text);font-family:var(--font-ui);font-size:13.5px;outline:none;cursor:text;transition:border-color .18s;appearance:none;-webkit-appearance:none}
.finput:focus,.fselect:focus{border-color:color-mix(in srgb,var(--c-accent) 50%,transparent)}
.finput::placeholder{color:var(--c-muted2)}
.ferr{font-family:var(--font-ui);font-size:12px;color:var(--c-loss);margin-top:8px}
.fok{font-family:var(--font-ui);font-size:12px;color:var(--c-win);margin-top:8px;display:flex;align-items:center;gap:5px}
/* BUTTONS */
.btn-primary{width:100%;padding:12px;background:var(--c-accent);color:#080808;border:none;border-radius:9px;cursor:pointer;font-family:var(--font-ui);font-size:14px;font-weight:600;letter-spacing:0;transition:background .18s,transform .1s;margin-top:6px}
.btn-primary:hover{background:var(--c-accent-hi)}
.btn-primary:active{transform:scale(.98)}
.btn-primary:disabled{opacity:.35;cursor:not-allowed}
.btn-ghost{width:100%;padding:11px;background:none;border:1px solid var(--c-border2);color:var(--c-muted);border-radius:9px;cursor:pointer;font-family:var(--font-ui);font-size:13px;font-weight:500;letter-spacing:0;transition:all .18s;margin-top:6px}
.btn-ghost:hover{color:var(--c-text);background:var(--c-surf2)}
/* PAGE */
.page{padding-top:var(--nav-h)}
/* HERO */
.hero{position:relative;overflow:hidden;padding:120px 72px 100px;min-height:75vh;display:flex;flex-direction:column;justify-content:center;text-align:center;background-color:#0e0c0a}

.hero-eyebrow{display:flex;align-items:center;gap:10px;font-family:var(--font-ui);font-size:11px;font-weight:500;color:var(--c-accent);letter-spacing:1px;text-transform:uppercase;margin-bottom:20px;justify-content:center}
.hero-eyebrow::before,.hero-eyebrow::after{content:'';width:28px;height:1px;background:var(--c-accent)}
.hero-h1{font-family:var(--font-disp);font-size:clamp(72px,11vw,144px);font-weight:400;line-height:.92;letter-spacing:3px;color:var(--c-text)}
.hero-h1 em{font-style:normal;color:var(--c-accent)}
.hero-sub{margin-top:28px;font-family:var(--font-ui);font-size:15px;color:rgba(240,236,230,.6);line-height:1.7;max-width:340px;margin-left:auto;margin-right:auto}
.hero-bg-text{position:absolute;right:40px;bottom:-30px;font-family:var(--font-disp);font-size:clamp(160px,24vw,310px);font-weight:400;color:transparent;-webkit-text-stroke:1px var(--c-accent-glow);line-height:1;pointer-events:none;user-select:none;letter-spacing:4px}
.hero-grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(var(--c-accent-glow) 1px,transparent 1px),linear-gradient(90deg,var(--c-accent-glow) 1px,transparent 1px);background-size:80px 80px;mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.6) 40%,transparent 100%)}
@keyframes riseIn{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
/* STATS BAR */
.stats-bar{display:grid;grid-template-columns:1.4fr 1.2fr 0.9fr 0.8fr;border-top:1px solid var(--c-border);border-bottom:1px solid var(--c-border);position:relative;z-index:1}
.stat-cell{padding:36px 40px;border-right:1px solid var(--c-border);position:relative;overflow:hidden;transition:background .3s;cursor:default}
.stat-cell:first-child{padding:44px 52px}
.stat-cell:last-child{border-right:none}
.stat-cell::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 0% 100%,var(--c-accent-glow),transparent 70%);opacity:0;transition:opacity .35s}
.stat-cell:hover::after{opacity:1}
.stat-num{font-family:var(--font-disp);font-size:clamp(44px,6vw,76px);color:var(--c-accent);line-height:1;position:relative;z-index:1;letter-spacing:2px}
.stat-lbl{font-family:var(--font-ui);font-size:11px;font-weight:500;color:var(--c-muted);letter-spacing:0;margin-top:8px;position:relative;z-index:1}
/* SECTION */
.section{padding:80px 72px 60px;border-top:1px solid var(--c-border);position:relative}
.section-tag{font-family:var(--font-ui);font-size:11px;font-weight:500;color:var(--c-muted);letter-spacing:0.5px;text-transform:uppercase;display:flex;align-items:center;gap:12px;margin-bottom:24px}
.section-tag::after{content:'';flex:1;height:1px;background:var(--c-border);max-width:80px}
.section-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:36px}
.section-h2{font-family:var(--font-disp);font-size:clamp(38px,5vw,58px);font-weight:400;line-height:.95;letter-spacing:2px}
.view-all{display:flex;align-items:center;gap:5px;font-family:var(--font-ui);font-size:13px;font-weight:500;color:var(--c-muted);background:none;border:none;padding:0;cursor:pointer;transition:color .18s}
.view-all:hover{color:var(--c-accent)}
.view-all .ic{width:14px;height:14px;transition:transform .2s var(--spring)}
.view-all:hover .ic{transform:translateX(3px)}
/* MATCH LIST */
.match-list{display:flex;flex-direction:column;gap:1px}
.match-row{display:grid;grid-template-columns:68px 1fr 1fr 52px;align-items:center;gap:16px;padding:16px 20px;background:var(--c-surf);border:1px solid transparent;border-radius:4px;transition:background .2s,border-color .2s,transform .2s var(--spring);cursor:default}
.match-row:first-child{border-radius:8px 8px 4px 4px}
.match-row:last-child{border-radius:4px 4px 8px 8px}
.match-row:hover{background:var(--c-surf2);border-color:var(--c-border)}
.match-date{font-family:var(--font-mono);font-size:10px;color:var(--c-muted);line-height:1.4}
.match-vs{font-size:13.5px;font-weight:500}
.match-loc{font-family:var(--font-mono);font-size:9.5px;color:var(--c-muted);margin-top:1px}
.match-score{font-family:var(--font-mono);font-size:12px;color:var(--c-muted);justify-self:end}
.badge{width:28px;height:28px;border-radius:7px;font-family:var(--font-mono);font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:center}
.badge-W{background:#0d2b1f;color:#4dbd85}
.badge-L{background:#2b0f0f;color:#c95050}
/* PLAYER GRID */
.player-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1px;background:var(--c-bg);border-radius:12px;overflow:hidden}
.player-card{background:var(--c-surf);padding:28px 24px;position:relative;overflow:hidden;cursor:pointer;transition:background .25s,transform .25s var(--spring)}
.player-card:hover{background:var(--c-surf2);transform:translateY(-3px);z-index:1}
.player-card::before{content:attr(data-pos);position:absolute;right:12px;top:8px;font-family:var(--font-disp);font-size:64px;color:var(--c-accent-glow);line-height:1;pointer-events:none;user-select:none}
.player-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--c-accent),transparent);transform:scaleX(0);transform-origin:left;transition:transform .3s var(--spring)}
.player-card:hover::after{transform:scaleX(1)}
.team-pill{display:inline-flex;align-items:center;font-family:var(--font-ui);font-size:10px;font-weight:600;letter-spacing:0.3px;text-transform:uppercase;padding:3px 9px;border-radius:4px;border:1px solid var(--c-border);color:var(--c-muted);margin-bottom:14px;position:relative;z-index:1}
.team-pill.A{border-color:color-mix(in srgb,var(--c-accent) 35%,transparent);color:var(--c-accent);background:var(--c-accent-glow)}
.team-pill.B{border-color:rgba(168,169,173,.35);color:#a8a9ad;background:rgba(168,169,173,.05)}
.team-pill.C{border-color:rgba(139,98,52,.35);color:#8b6234;background:rgba(139,98,52,.05)}
.player-avatar{width:56px;height:56px;border-radius:50%;background:var(--c-surf2);border:2px solid var(--c-border);overflow:hidden;display:flex;align-items:center;justify-content:center;margin-bottom:14px;position:relative;z-index:1;flex-shrink:0}
.player-avatar img{width:100%;height:100%;object-fit:cover}
.player-avatar-placeholder{font-family:var(--font-disp);font-size:20px;color:var(--c-muted);user-select:none}
.player-name{font-size:16px;font-weight:600;position:relative;z-index:1}
.player-utr-lbl{font-family:var(--font-ui);font-size:11px;font-weight:500;color:var(--c-muted);margin-top:14px;position:relative;z-index:1}
.player-utr{font-family:var(--font-disp);font-size:46px;color:var(--c-accent);line-height:1.05;position:relative;z-index:1;letter-spacing:2px}
.player-meta{font-size:11.5px;color:var(--c-muted);line-height:2;margin-top:10px;position:relative;z-index:1}
.player-record{display:flex;gap:20px;margin-top:16px;padding-top:16px;border-top:1px solid var(--c-border);position:relative;z-index:1}
.rec-item{font-family:var(--font-ui);font-size:11px;color:var(--c-muted)}
.rec-item span{display:block;font-family:var(--font-disp);font-size:22px;letter-spacing:1px}
.rec-w{color:var(--c-win)}.rec-l{color:var(--c-loss)}
/* LEADERBOARD */
.lb{border:1px solid var(--c-border);border-radius:12px;overflow:hidden}
.lb-head{display:grid;grid-template-columns:52px 1fr 40px 40px;padding:11px 20px;background:rgba(255,255,255,.02);border-bottom:1px solid var(--c-border)}
.lb-head-lbl{font-family:var(--font-ui);font-size:11px;font-weight:600;letter-spacing:0;color:var(--c-muted2)}
.lb-row{display:grid;grid-template-columns:52px 1fr 40px 40px;align-items:center;padding:14px 20px;border-bottom:1px solid var(--c-border);transition:background .15s}
.lb-row:last-child{border-bottom:none}
.lb-row:hover{background:var(--c-surf2)}
.lb-row.hl{background:var(--c-accent-glow);border-left:2px solid var(--c-accent);padding-left:18px}
.lb-rank{font-family:var(--font-disp);font-size:22px;color:var(--c-muted2);letter-spacing:1px}
.lb-rank.gold{color:var(--c-accent)}
.lb-school{font-size:13.5px;font-weight:500}
.lb-stat{font-family:var(--font-mono);font-size:12px;color:var(--c-muted);text-align:right}
/* PAGE HERO */
.page-hero{padding:72px 72px 52px;border-bottom:1px solid var(--c-border);position:relative;overflow:hidden}
.page-hero::after{content:attr(data-word);position:absolute;right:48px;bottom:-24px;font-family:var(--font-disp);font-size:clamp(90px,16vw,190px);font-weight:400;color:transparent;-webkit-text-stroke:1px var(--c-accent-glow);line-height:1;pointer-events:none;user-select:none;letter-spacing:4px}
.page-eyebrow{font-family:var(--font-ui);font-size:11px;font-weight:500;letter-spacing:0.5px;text-transform:uppercase;color:var(--c-muted);margin-bottom:12px}
.page-h1{font-family:var(--font-disp);font-size:clamp(48px,8vw,90px);font-weight:400;line-height:.92;letter-spacing:3px}
.page-meta{display:flex;gap:44px;margin-top:28px}
.page-stat-num{font-family:var(--font-disp);font-size:48px;line-height:1;letter-spacing:2px}
.page-stat-lbl{font-family:var(--font-ui);font-size:11px;font-weight:500;color:var(--c-muted);margin-top:4px}
/* HOME PANELS */
.home-panels{display:grid;grid-template-columns:1.8fr 1fr 0.7fr;border-bottom:1px solid var(--c-border)}
.home-panels-2{display:grid;grid-template-columns:1.65fr 1fr;border-bottom:1px solid var(--c-border)}
.home-panel{border-right:1px solid rgba(255,255,255,.1);display:flex;flex-direction:column;background:var(--c-surf)}
.home-panel:last-child{border-right:none}
.home-panel-head{display:flex;justify-content:space-between;align-items:center;padding:18px 24px 16px;border-bottom:1px solid rgba(255,255,255,.08);border-top:2px solid var(--c-accent);flex-shrink:0;background:linear-gradient(180deg,color-mix(in srgb,var(--c-accent) 8%,transparent) 0%,transparent 100%)}
.home-panel-title{font-family:var(--font-disp);font-size:20px;letter-spacing:2px;color:var(--c-text);line-height:1}
.home-panel-body{overflow:hidden}
.home-panel-item{padding:14px 24px;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;transition:background .15s}
.home-panel-item:last-child{border-bottom:none}
.home-panel-item:hover{background:rgba(255,255,255,.03)}
.panel-edit-btn{background:none;border:none;cursor:pointer;color:var(--c-muted);padding:4px;display:flex;align-items:center;justify-content:center;border-radius:4px;transition:color .15s,background .15s}
.panel-edit-btn:hover{color:var(--c-accent);background:var(--c-surf2)}
.panel-edit-btn svg{width:13px;height:13px}
/* HERO UPLOAD */
.hero-upload-label{position:absolute;bottom:24px;right:24px;padding:7px 16px;border-radius:8px;cursor:pointer;font-family:var(--font-ui);font-size:12px;font-weight:500;background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.15);color:rgba(240,236,230,.5);transition:all .18s}
.hero-upload-label:hover{color:var(--c-text);border-color:var(--c-accent)}
.view-all-sm{font-family:var(--font-ui);font-size:11px;font-weight:600;color:var(--c-accent);letter-spacing:.5px;text-transform:uppercase;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:4px;transition:color .18s,gap .2s var(--spring);padding:5px 0}
.view-all-sm:hover{color:var(--c-accent-hi);gap:7px}
.view-all-sm .ic{width:12px;height:12px;transition:transform .2s var(--spring)}
.view-all-sm:hover .ic{transform:translateX(3px)}
/* RULES GRID */
.rules-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}
.rule-item{background:var(--c-surf);border:1px solid rgba(255,255,255,.08);border-top:2px solid var(--c-accent);border-radius:12px;padding:24px 28px;display:flex;align-items:flex-start;gap:20px;transition:background .2s,border-color .2s}
.rule-item:hover{background:var(--c-surf2);border-color:color-mix(in srgb,var(--c-accent) 40%,transparent)}
.rule-num{font-family:var(--font-disp);font-size:48px;color:var(--c-accent);opacity:.35;flex-shrink:0;line-height:1;letter-spacing:1px}
.rule-text{font-size:14px;color:rgba(240,236,230,.75);line-height:1.75;padding-top:10px}
/* FOOTER */
.footer{border-top:1px solid var(--c-border);padding:36px 72px;display:flex;justify-content:space-between;align-items:center}
.footer-logo{font-family:var(--font-disp);font-size:20px;letter-spacing:4px;text-transform:uppercase}
.footer-logo span{color:var(--c-accent)}
.footer-right{font-family:var(--font-ui);font-size:12px;color:var(--c-muted);text-align:right;line-height:2}
/* EDIT ROSTER */
.er-row{display:grid;grid-template-columns:1fr 70px 96px 44px;gap:8px;align-items:center;padding:10px 0;border-bottom:1px solid var(--c-border)}
.er-row:last-child{border-bottom:none}
.er-name{font-size:13px;font-weight:500}
.er-input{padding:5px 8px;background:var(--c-surf2);border:1px solid var(--c-border);border-radius:6px;color:var(--c-text);font-size:12.5px;width:100%;outline:none;transition:border-color .15s}
.er-input:focus{border-color:color-mix(in srgb,var(--c-accent) 40%,transparent)}
.arr-btn{background:none;border:none;cursor:pointer;color:var(--c-muted);padding:4px;border-radius:4px;display:flex;align-items:center;justify-content:center;transition:color .15s,background .15s}
.arr-btn:hover{color:var(--c-accent);background:var(--c-surf2)}
.arr-btn svg{width:13px;height:13px}
/* REVEAL */
.reveal{opacity:1}
/* RESPONSIVE */
/* HOME INFO CARDS */
.home-info-grid{display:grid;grid-template-columns:1.5fr 1.15fr 0.8fr;gap:12px}
.home-info-card{background:var(--c-surf);border:1px solid rgba(255,255,255,.08);border-top:2px solid var(--c-accent);border-radius:12px;padding:24px 28px;transition:border-color .2s,background .2s}
.home-info-card:hover{border-color:color-mix(in srgb,var(--c-accent) 40%,transparent);background:var(--c-surf2)}
.home-info-label{font-family:var(--font-mono);font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--c-accent);opacity:.8;margin-bottom:8px}
.home-info-val{font-family:var(--font-disp);font-size:32px;color:var(--c-accent);line-height:1;letter-spacing:1px;margin-bottom:6px}
.home-info-sub{font-size:13.5px;color:rgba(240,236,230,.7);line-height:1.8}
/* TOURNAMENT CARDS */
.tourn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
.tourn-card{background:var(--c-surf);border:1px solid var(--c-border);border-radius:12px;padding:28px;position:relative;overflow:hidden;transition:border-color .2s,transform .2s var(--spring)}
.tourn-card:hover{border-color:color-mix(in srgb,var(--c-accent) 30%,transparent);transform:translateY(-2px)}
.tourn-num{font-family:var(--font-disp);font-size:72px;color:var(--c-accent-glow);position:absolute;right:12px;top:4px;line-height:1;pointer-events:none;user-select:none}
.tourn-name{font-size:15px;font-weight:600;margin-bottom:8px;position:relative;z-index:1}
.tourn-date{font-family:var(--font-mono);font-size:10px;color:var(--c-accent);letter-spacing:1px;margin-bottom:12px;position:relative;z-index:1}
.tourn-teams{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px;position:relative;z-index:1}
.tourn-note{font-family:var(--font-mono);font-size:9px;letter-spacing:.5px;color:var(--c-muted);position:relative;z-index:1}
/* ACTIVITY CARDS */
.act-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
.act-card{background:var(--c-surf);border:1px solid rgba(255,255,255,.08);border-top:2px solid var(--c-accent);border-radius:12px;padding:28px;transition:border-color .2s,background .2s}
.act-card:hover{border-color:color-mix(in srgb,var(--c-accent) 40%,transparent);background:var(--c-surf2)}
.act-name{font-family:var(--font-disp);font-size:22px;letter-spacing:1px;color:var(--c-text);margin-bottom:8px}
.act-desc{font-size:12px;color:var(--c-muted);margin-bottom:16px;font-family:var(--font-ui);line-height:1.6}
.act-date-opt{font-family:var(--font-ui);font-size:12.5px;padding:7px 0;border-bottom:1px solid var(--c-border);display:flex;gap:10px;align-items:center}
.act-date-opt:last-child{border-bottom:none}
.act-date-opt-lbl{font-family:var(--font-ui);font-size:8.5px;letter-spacing:1px;text-transform:uppercase;color:var(--c-muted);flex-shrink:0}
/* SOP */
.sop-content{max-width:760px;margin:0 auto;padding:0 72px 72px}
.sop-section{margin-bottom:52px}
.sop-h2{font-family:var(--font-disp);font-size:38px;letter-spacing:1px;margin-bottom:20px;color:var(--c-accent)}
.sop-h3{font-family:var(--font-disp);font-size:22px;letter-spacing:1px;margin-bottom:10px;margin-top:28px;color:var(--c-text)}
.sop-body{font-size:13.5px;line-height:1.85;color:rgba(240,236,230,.7)}
.sop-body p{margin-bottom:14px}
.sop-quote{font-style:italic;border-left:2px solid var(--c-accent);padding-left:18px;color:var(--c-muted);margin-bottom:24px;line-height:1.8}
.sop-list{list-style:none;padding:0;margin-top:8px}
.sop-list li{padding:9px 0;border-bottom:1px solid var(--c-border);font-size:13px;color:rgba(240,236,230,.7);line-height:1.65}
.sop-list li:last-child{border-bottom:none}
/* FOOTER LINKS */
.footer-links{display:flex;flex-direction:column;gap:6px}
.footer-link{background:none;border:none;cursor:pointer;font-family:var(--font-mono);font-size:9.5px;color:var(--c-muted);letter-spacing:.5px;text-align:left;padding:0;transition:color .15s;text-decoration:underline;text-underline-offset:3px}
.footer-link:hover{color:var(--c-accent)}
@media(max-width:900px){
  .hero,.section,.page-hero,.footer{padding-left:24px;padding-right:24px}
  .hero-bg-text,.hero-grid,.sp-amb{display:none}
  .stats-bar{grid-template-columns:1fr 1fr}
  .stat-cell{padding:24px 28px}
  .fg-2{grid-template-columns:1fr}
  .match-row{grid-template-columns:56px 1fr 40px}
  .match-score{display:none}
  .home-panels,.home-panels-2{grid-template-columns:1fr}
  .home-panel{border-right:none;border-bottom:1px solid var(--c-border)}
  .home-info-grid,.tourn-grid,.act-grid{grid-template-columns:1fr}
  .sop-content{padding:0 24px 48px}
}
`;
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icons = {
  star:        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><path d="M10 2.5l2.1 6.4H18l-5 3.6 1.9 5.9L10 14.8l-4.9 3.6 1.9-5.9-5-3.6h5.9z"/></svg>,
  racket:      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><ellipse cx="8" cy="8" rx="5.5" ry="6.5" transform="rotate(-45 8 8)"/><line x1="11.5" y1="11.5" x2="17.5" y2="17.5"/><line x1="5.5" y1="5.5" x2="10.5" y2="10.5" strokeOpacity=".35"/><line x1="8" y1="2.5" x2="8" y2="13.5" strokeOpacity=".35"/><line x1="2.5" y1="8" x2="13.5" y2="8" strokeOpacity=".35"/></svg>,
  eye:         <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="2.5"/></svg>,
  chevronDown: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6l4 4 4-4"/></svg>,
  chevronRight:<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4l4 4-4 4"/></svg>,
  user:        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="10" cy="7" r="3.5"/><path d="M3 18c0-4 3.1-7 7-7s7 3 7 7"/></svg>,
  plus:        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>,
  list:        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 4h7M6 8h7M6 12h7M3 4h.01M3 8h.01M3 12h.01"/></svg>,
  pencil:      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z"/><path d="M10 4l2 2"/></svg>,
  bar:         <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 12V8h3v4H2zM6.5 12V5h3v7h-3zM11 12V7h3v5h-3z"/></svg>,
  clock:       <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="5.5"/><path d="M8 5v3.5l2 1.5"/></svg>,
  logout:      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3"/><path d="M10.5 11l3-3-3-3M6 8h7.5"/></svg>,
  close:       <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15"/></svg>,
  arrowUp:     <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11V3M3.5 6.5L7 3l3.5 3.5"/></svg>,
  arrowDown:   <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3v8M3.5 7.5L7 11l3.5-3.5"/></svg>,
  arrowRight:  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>,
  check:       <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3.5 3.5L13 4.5"/></svg>,
  settings:    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="8" cy="8" r="2.5"/><path d="M8 2v1M8 13v1M2 8h1M13 8h1M3.5 3.5l.7.7M11.8 11.8l.7.7M3.5 12.5l.7-.7M11.8 4.2l.7-.7"/></svg>,
  // ── Tennis decorative icons ──
  tennisBall:   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="10" cy="10" r="8.5"/><path d="M2.5 8.5Q10 3 17.5 8.5"/><path d="M2.5 11.5Q10 17 17.5 11.5"/></svg>,
  tennisRacket: <svg viewBox="0 0 18 26" fill="none" stroke="currentColor" strokeLinecap="round"><ellipse cx="9" cy="9.5" rx="7.5" ry="8.5" strokeWidth="1.2"/><line x1="3.5" y1="7" x2="14.5" y2="7" strokeWidth="0.7"/><line x1="2" y1="9.5" x2="16" y2="9.5" strokeWidth="0.7"/><line x1="3.5" y1="12" x2="14.5" y2="12" strokeWidth="0.7"/><line x1="6.5" y1="1.5" x2="6.5" y2="18" strokeWidth="0.7"/><line x1="9" y1="1" x2="9" y2="18" strokeWidth="0.7"/><line x1="11.5" y1="1.5" x2="11.5" y2="18" strokeWidth="0.7"/><line x1="9" y1="18" x2="9" y2="25.5" strokeWidth="2.2" strokeLinecap="round"/></svg>,
  miniCourt:    <svg viewBox="0 0 32 20" fill="none" stroke="currentColor" strokeLinecap="round"><rect x="1" y="1" width="30" height="18" strokeWidth="1.1"/><line x1="16" y1="1" x2="16" y2="19" strokeWidth="1.3"/><line x1="1" y1="4.5" x2="31" y2="4.5" strokeWidth="0.7"/><line x1="1" y1="15.5" x2="31" y2="15.5" strokeWidth="0.7"/><line x1="7" y1="4.5" x2="7" y2="15.5" strokeWidth="0.7"/><line x1="25" y1="4.5" x2="25" y2="15.5" strokeWidth="0.7"/><line x1="7" y1="10" x2="25" y2="10" strokeWidth="0.7"/></svg>,
  tennisPlayer: <svg viewBox="0 0 24 30" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="3.5" r="2.5"/><line x1="9" y1="6" x2="8" y2="17"/><line x1="9" y1="10" x2="19" y2="6.5"/><line x1="9" y1="10" x2="4" y2="13.5"/><line x1="8" y1="17" x2="14" y2="27"/><line x1="8" y1="17" x2="3" y2="26"/><ellipse cx="21.5" cy="5" rx="2.8" ry="3.8" transform="rotate(-35 21.5 5)" strokeWidth="1"/></svg>,
  tennisNet:    <svg viewBox="0 0 30 14" fill="none" stroke="currentColor" strokeLinecap="round"><line x1="2" y1="2" x2="2" y2="13" strokeWidth="1.5"/><line x1="28" y1="2" x2="28" y2="13" strokeWidth="1.5"/><path d="M2 3.5Q15 5 28 3.5" strokeWidth="1.1"/><line x1="2" y1="13" x2="28" y2="13" strokeWidth="0.8"/><line x1="8" y1="4" x2="8" y2="13" strokeWidth="0.55"/><line x1="14" y1="4.5" x2="14" y2="13" strokeWidth="0.55"/><line x1="20" y1="4.5" x2="20" y2="13" strokeWidth="0.55"/><line x1="26" y1="4" x2="26" y2="13" strokeWidth="0.55"/><line x1="2" y1="8" x2="28" y2="8" strokeWidth="0.55"/><line x1="2" y1="11" x2="28" y2="11" strokeWidth="0.55"/></svg>,
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
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
        <span className="ic">{icon}</span>{label}
        <span className="chev ic">{Icons.chevronDown}</span>
      </button>
      {open && <Dropdown items={items} onClose={close} />}
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function SchoolNav({ school, user, setModal, setPage, onLogout }) {
  const navigate = useNavigate();
  const [accOpen, setAccOpen] = useState(false);
  const closeAcc = useCallback(() => setAccOpen(false), []);

  const isMember = user?.schoolSlug === school.slug;

  const editItems = isMember && user?.role === 'officer'
    ? [
        { icon: Icons.plus,   label: 'Input Results',          action: () => setModal('results') },
        { icon: Icons.list,   label: 'Edit Roster',            action: () => setModal('roster-edit') },
        { icon: Icons.clock,  label: 'Edit Practice Schedule', action: () => setModal('edit-schedule') },
        { icon: Icons.settings, label: 'Edit Challenge Match Rules', action: () => setModal('challenge-rules') },
        { sep: true },
        { icon: Icons.pencil, label: 'Update Player Card',     action: () => setModal('card-edit') },
      ]
    : isMember && user?.role === 'player'
    ? [{ icon: Icons.pencil, label: 'Update Player Card', action: () => setModal('card-edit') }]
    : null;

  const viewItems = [
    { icon: Icons.clock, label: 'Schedule',  action: () => setPage('schedule') },
    { icon: Icons.list,  label: 'Roster',    action: () => setPage('roster') },
    { icon: Icons.bar,   label: 'Standings', action: () => setPage('leaderboard') },
  ];

  const accItems = [
    ...(isMember && school.hasSOP ? [{ icon: Icons.list, label: 'Standard Operating Procedures', action: () => setPage('sop') }, { sep: true }] : []),
    { icon: Icons.logout, label: 'Log Out', action: onLogout },
  ];

  // Abbreviate school name for logo
  const abbrev = school.name.replace(/University|College|State|of|the|at/gi, '').replace(/\s+/g, ' ').trim().split(' ').slice(0, 2).join(' ');

  return (
    <nav>
      <div className="nav-left">
        <button className="sq-home-pill" onClick={() => navigate('/')}>
          <span className="sq-home-pill-arrow">◂</span>Squad Tennis
        </button>
        {editItems && <NavMenu label="Edit" icon={Icons.pencil} items={editItems} />}
        <NavMenu label="View" icon={Icons.eye} items={viewItems} />
      </div>
      <div className="nav-logo" onClick={() => setPage('home')} data-hover>
        {abbrev}&nbsp;<span>TENNIS</span>
      </div>
      <div className="nav-right">
        {user ? (
          <div className="dd-wrap">
            <div className="welcome-tag" onClick={() => setAccOpen(o => !o)}>
              <span className="ic">{Icons.user}</span>
              {user.firstName}
              <span className="ic">{Icons.chevronDown}</span>
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

// ─── LOGIN MODAL ──────────────────────────────────────────────────────────────
function LoginModal({ onClose, onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [err,      setErr]      = useState('');

  const submit = () => {
    const result = loginUser({ email, password });
    if (result.error) { setErr(result.error); return; }
    onLogin(result.session);
    onClose();
  };

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}><span className="ic">{Icons.close}</span></button>
        <div className="modal-title">Welcome Back</div>
        <div className="modal-sub">Sign in to access your team's private section</div>
        <div className="fg">
          <label className="flabel">Email</label>
          <input className="finput" type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(''); }} placeholder="your@email.com" />
        </div>
        <div className="fg">
          <label className="flabel">Password</label>
          <input className="finput" type="password" value={password} onChange={e => { setPassword(e.target.value); setErr(''); }} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>
        {err && <div className="ferr">{err}</div>}
        <button className="btn-primary" onClick={submit} disabled={!email || !password}>Sign In</button>
      </div>
    </div>
  );
}

// ─── REGISTER MODAL ───────────────────────────────────────────────────────────
function RegisterModal({ school, onClose, onLogin }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', password: '', code: '' });
  const [err, setErr] = useState('');

  const upd = (key, val) => { setF(x => ({ ...x, [key]: val })); setErr(''); };

  const submit = () => {
    const result = registerUser({ ...f });
    if (result.error) { setErr(result.error); return; }
    onLogin(result.session);
    onClose();
  };

  const schoolShort = school.name.split(' ').slice(0, 2).join(' ');

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}><span className="ic">{Icons.close}</span></button>
        <div className="modal-title">Join {schoolShort}</div>
        <div className="modal-sub">
          {step === 1 ? 'Select your role on the team' : `${role === 'officer' ? 'Officer' : 'Player'} Registration`}
        </div>

        {step === 1 ? (
          <div className="role-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="role-card" onClick={() => { setRole('officer'); setStep(2); }}>
              <div className="icon-wrap">{Icons.star}</div>
              <div className="role-lbl">Officer</div>
            </div>
            <div className="role-card" onClick={() => { setRole('player'); setStep(2); }}>
              <div className="icon-wrap">{Icons.racket}</div>
              <div className="role-lbl">Player</div>
            </div>
          </div>
        ) : (
          <>
            <div className="fg-2">
              <div className="fg">
                <label className="flabel">First Name</label>
                <input className="finput" value={f.firstName} onChange={e => upd('firstName', e.target.value)} placeholder="First" />
              </div>
              <div className="fg">
                <label className="flabel">Last Name</label>
                <input className="finput" value={f.lastName} onChange={e => upd('lastName', e.target.value)} placeholder="Last" />
              </div>
            </div>
            <div className="fg">
              <label className="flabel">Email</label>
              <input className="finput" type="email" value={f.email} onChange={e => upd('email', e.target.value)} placeholder="your@email.com" />
            </div>
            <div className="fg">
              <label className="flabel">Password</label>
              <input className="finput" type="password" value={f.password} onChange={e => upd('password', e.target.value)} placeholder="••••••••" />
            </div>
            <div className="fg">
              <label className="flabel">{role === 'officer' ? 'Officer' : 'Player'} Code</label>
              <input className="finput" value={f.code} onChange={e => upd('code', e.target.value)} placeholder="Enter your join code" />
            </div>
            {err && <div className="ferr">{err}</div>}
            <button className="btn-primary" onClick={submit} disabled={!f.firstName || !f.lastName || !f.email || !f.password || !f.code}>
              Create Account
            </button>
            <button className="btn-ghost" onClick={() => { setStep(1); setErr(''); }}>← Back</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── EDIT ANNOUNCEMENTS MODAL ─────────────────────────────────────────────────
function EditAnnouncementsModal({ announcements, onClose, onSave }) {
  const [text, setText] = useState(announcements || '');
  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}><span className="ic">{Icons.close}</span></button>
        <div className="modal-title">Announcements</div>
        <div className="modal-sub">Officers only — visible to team members</div>
        <div className="fg">
          <label className="flabel">Announcement Text</label>
          <textarea className="finput" rows={6} value={text} onChange={e => setText(e.target.value)}
            placeholder="Enter announcements, updates, or news for the team..."
            style={{ resize: 'vertical', minHeight: 120 }} />
        </div>
        <button className="btn-primary" onClick={() => { onSave(text); onClose(); }}>Save Announcements</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// ─── EDIT SCHEDULE MODAL ───────────────────────────────────────────────────────
function EditScheduleModal({ schedule, onClose, onSave }) {
  const [text, setText] = useState(schedule || '');
  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}><span className="ic">{Icons.close}</span></button>
        <div className="modal-title">Practice Schedule</div>
        <div className="modal-sub">Officers only — visible to team members</div>
        <div className="fg">
          <label className="flabel">Schedule Details</label>
          <textarea className="finput" rows={6} value={text} onChange={e => setText(e.target.value)}
            placeholder="e.g. Mon/Wed/Fri 4–6pm at East Side Courts..."
            style={{ resize: 'vertical', minHeight: 120 }} />
        </div>
        <button className="btn-primary" onClick={() => { onSave(text); onClose(); }}>Save Schedule</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// ─── EDIT CHALLENGE RULES MODAL ───────────────────────────────────────────────
function EditChallengeRulesModal({ rules, onClose, onSave }) {
  const [text, setText] = useState((rules || []).join('\n'));
  const save = () => {
    const newRules = text.split('\n').map(s => s.trim()).filter(Boolean);
    onSave(newRules);
    onClose();
  };
  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}><span className="ic">{Icons.close}</span></button>
        <div className="modal-title">Challenge Match Rules</div>
        <div className="modal-sub">Officers only — enter each rule on a new line</div>
        <div className="fg">
          <label className="flabel">Rules (one per line)</label>
          <textarea className="finput" rows={8} value={text} onChange={e => setText(e.target.value)}
            placeholder="e.g. Challenge up to 2 spots above your current position..."
            style={{ resize: 'vertical', minHeight: 180 }} />
        </div>
        <button className="btn-primary" onClick={save}>Save Rules</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// ─── UPDATE PLAYER CARD MODAL ─────────────────────────────────────────────────
function UpdatePlayerCardModal({ user, roster, onClose, onSave }) {
  const myName = `${user.firstName} ${user.lastName}`;
  const myCard = roster.find(p => p.name === myName);
  const [utr,   setUtr]   = useState(myCard?.utr   ?? '');
  const [major, setMajor] = useState(myCard?.major  ?? '');

  if (!myCard) {
    return (
      <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal">
          <button className="modal-close" onClick={onClose}><span className="ic">{Icons.close}</span></button>
          <div className="modal-title">Player Card</div>
          <div className="modal-sub" style={{ marginBottom: 20 }}>
            No roster entry found for <strong>{myName}</strong>. Ask an officer to add you to the roster first.
          </div>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const save = () => {
    const updated = roster.map(p =>
      p.id === myCard.id ? { ...p, utr: Number(utr) || 0, major } : p
    );
    onSave(updated);
    onClose();
  };

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}><span className="ic">{Icons.close}</span></button>
        <div className="modal-title">Player Card</div>
        <div className="modal-sub">{myCard.name} · {myCard.team} Team · {myCard.gender === 'M' ? 'Gentlemen' : 'Ladies'}</div>
        <div className="fg">
          <label className="flabel">UTR Rating</label>
          <input className="finput" type="number" step="0.1" min="0" max="16" value={utr}
            onChange={e => setUtr(e.target.value)} placeholder="e.g. 7.5" />
        </div>
        <div className="fg">
          <label className="flabel">Major</label>
          <input className="finput" value={major} onChange={e => setMajor(e.target.value)} placeholder="e.g. Computer Science" />
        </div>
        <button className="btn-primary" onClick={save}>Save</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// ─── INPUT RESULTS MODAL ──────────────────────────────────────────────────────
function InputResultsModal({ school, onClose, onSave }) {
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
        <div className="modal-sub">{school.name} · Club Tennis</div>
        <div className="fg-2">
          <div className="fg"><label className="flabel">Date</label><input className="finput" type="date" value={f.date} onChange={e => setF(x => ({ ...x, date: e.target.value }))} /></div>
          <div className="fg"><label className="flabel">Result</label>
            <select className="fselect" value={f.result} onChange={e => setF(x => ({ ...x, result: e.target.value }))}>
              <option value="W">Win</option><option value="L">Loss</option>
            </select>
          </div>
        </div>
        <div className="fg"><label className="flabel">Opponent</label><input className="finput" value={f.opponent} onChange={e => setF(x => ({ ...x, opponent: e.target.value }))} placeholder="Opponent school" /></div>
        <div className="fg-2">
          <div className="fg"><label className="flabel">Score</label><input className="finput" value={f.score} onChange={e => setF(x => ({ ...x, score: e.target.value }))} placeholder="e.g. 5-4" /></div>
          <div className="fg"><label className="flabel">Location</label>
            <select className="fselect" value={f.location} onChange={e => setF(x => ({ ...x, location: e.target.value }))}>
              <option>Home</option><option>Away</option><option>Neutral</option>
            </select>
          </div>
        </div>
        {saved
          ? <div className="fok"><span className="ic">{Icons.check}</span>Saved!</div>
          : <button className="btn-primary" onClick={save} disabled={!f.date || !f.opponent || !f.score}>Save Result</button>
        }
      </div>
    </div>
  );
}

// ─── EDIT ROSTER MODAL ────────────────────────────────────────────────────────
function EditRosterModal({ roster, onClose, onSave }) {
  const [rows, setRows] = useState(roster.map(p => ({ ...p })));
  const add = () => setRows(r => [...r, { id: Date.now(), name: '', utr: 0, team: 'A', gender: 'M', role: '', wins: 0, losses: 0 }]);
  const update = (id, key, val) => setRows(r => r.map(p => p.id === id ? { ...p, [key]: val } : p));
  const move = (i, dir) => setRows(r => { const a = [...r]; [a[i], a[i + dir]] = [a[i + dir], a[i]]; return a; });

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-wide">
        <button className="modal-close" onClick={onClose}><span className="ic">{Icons.close}</span></button>
        <div className="modal-title">Edit Roster</div>
        <div className="modal-sub">Drag rows or use arrows to reorder</div>
        <div style={{ maxHeight: 380, overflowY: 'auto', marginBottom: 12 }}>
          {rows.map((p, i) => (
            <div key={p.id} className="er-row">
              <input className="er-input" value={p.name} onChange={e => update(p.id, 'name', e.target.value)} placeholder="Player name" />
              <select className="er-input" value={p.team} onChange={e => update(p.id, 'team', e.target.value)} style={{ cursor: 'pointer' }}>
                <option value="A">A</option><option value="B">B</option><option value="C">C</option>
              </select>
              <select className="er-input" value={p.gender} onChange={e => update(p.id, 'gender', e.target.value)} style={{ cursor: 'pointer' }}>
                <option value="M">Gentlemen</option><option value="F">Ladies</option>
              </select>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button className="arr-btn" onClick={() => i > 0 && move(i, -1)}><span>{Icons.arrowUp}</span></button>
                <button className="arr-btn" onClick={() => i < rows.length - 1 && move(i, 1)}><span>{Icons.arrowDown}</span></button>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-ghost" onClick={add} style={{ marginBottom: 6 }}>+ Add Player</button>
        <button className="btn-primary" onClick={() => { onSave(rows.filter(p => p.name)); onClose(); }}>Save Roster</button>
      </div>
    </div>
  );
}

// ─── PLAYER CARD ─────────────────────────────────────────────────────────────
function PlayerCard({ p, pos, onSelect }) {
  return (
    <div className="player-card" data-pos={pos} onClick={() => onSelect(p)}>
      <div className={`team-pill${p.team === 'A' ? ' A' : p.team === 'B' ? ' B' : p.team === 'C' ? ' C' : ''}`}>{p.team} Team</div>
      <div className="player-avatar">
        {p.photo
          ? <img src={p.photo} alt={p.name} />
          : <span className="player-avatar-placeholder">{p.name.charAt(0)}</span>}
      </div>
      <div className="player-name">{p.name}</div>
      {p.role && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '1px', color: 'var(--c-accent)', marginTop: 4 }}>{p.role}</div>}
      <div className="player-utr-lbl">UTR Rating</div>
      <div className="player-utr">{p.utr || '—'}</div>
      <div className="player-record">
        <div className="rec-item"><span className="rec-w">{p.wins}</span>W</div>
        <div className="rec-item"><span className="rec-l">{p.losses}</span>L</div>
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
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}>
          <div className="player-avatar" style={{ width: 64, height: 64, flexShrink: 0 }}>
            {p.photo ? <img src={p.photo} alt={p.name} /> : <span className="player-avatar-placeholder">{p.name.charAt(0)}</span>}
          </div>
          <div>
            <div className={`team-pill${p.team === 'A' ? ' A' : p.team === 'B' ? ' B' : p.team === 'C' ? ' C' : ''}`} style={{ marginBottom: 8 }}>{p.team} Team</div>
            <div style={{ fontFamily: 'var(--font-disp)', fontSize: 38, letterSpacing: 1, lineHeight: 1 }}>{p.name}</div>
            {p.role && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--c-accent)', marginTop: 8 }}>{p.role}</div>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[['UTR', p.utr || '—'], ['Wins', p.wins], ['Losses', p.losses]].map(([lbl, val]) => (
            <div key={lbl} style={{ background: 'var(--c-surf2)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--font-disp)', fontSize: 40, letterSpacing: 1, lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--c-muted)', marginTop: 4 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

function HomePage({ school, matches, roster, setPage, setModal, onSelectPlayer, onBgUpload, isMember, isOfficer, divisionStandings }) {
  useReveal();
  const bgFileRef = useRef(null);
  const recent           = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const standingsPreview = (divisionStandings || []).slice(0, 5);
  const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const shortName = school.name
    .replace(/University of |University at /i, '')
    .replace(/ University$| College$/i, '')
    .replace(/California State University,\s*/i, 'CSU ')
    .trim();

  return (
    <div>
      {/* HERO */}
      <div className="hero" style={school.bgImage ? {
        backgroundImage: `linear-gradient(to right, #0e0c0a 0%, rgba(14,12,10,.82) 22%, rgba(14,12,10,.70) 50%, rgba(14,12,10,.82) 78%, #0e0c0a 100%), url(${school.bgImage})`,
        backgroundSize: 'auto, cover',
        backgroundPosition: 'center, center',
      } : {}}>
        {!school.bgImage && <div className="hero-grid" />}

        {/* Decorative tennis icons */}
        <span aria-hidden="true" style={{ position:'absolute', right:'9%', top:'16%', width:90, height:90, opacity:.055, color:'var(--c-accent)', pointerEvents:'none', transform:'rotate(22deg)', display:'block' }}>{Icons.tennisRacket}</span>
        <span aria-hidden="true" style={{ position:'absolute', left:'5%', bottom:'18%', width:52, height:52, opacity:.07, color:'var(--c-accent)', pointerEvents:'none', display:'block' }}>{Icons.tennisBall}</span>
        <span aria-hidden="true" style={{ position:'absolute', right:'22%', bottom:'12%', width:80, height:80, opacity:.04, color:'var(--c-text)', pointerEvents:'none', transform:'rotate(-8deg)', display:'block' }}>{Icons.miniCourt}</span>
        <span aria-hidden="true" style={{ position:'absolute', left:'14%', top:'12%', width:62, height:62, opacity:.04, color:'var(--c-accent)', pointerEvents:'none', transform:'rotate(10deg) scaleX(-1)', display:'block' }}>{Icons.tennisPlayer}</span>
        <div className="hero-eyebrow">Tennis on Campus · 2025–26 Season</div>
        <h1 className="hero-h1">{shortName} <em>CLUB TENNIS</em></h1>
        <p className="hero-sub">The Official Site for {school.name}'s Club Tennis Team</p>
        {isOfficer && (
          <>
            <input ref={bgFileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => onBgUpload(ev.target.result); r.readAsDataURL(f); }} />
            <label className="hero-upload-label" onClick={() => bgFileRef.current?.click()}>Upload Background</label>
          </>
        )}
      </div>

      {/* THREE PANELS — always visible */}
      <div className="home-panels">
        {/* SCHEDULE / RECENT MATCHES */}
        <div className="home-panel">
          <div className="home-panel-head">
            <span className="home-panel-title">Schedule</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {isOfficer && <button className="panel-edit-btn" onClick={() => setModal('results')}><span className="ic">{Icons.plus}</span></button>}
              <button className="view-all-sm" onClick={() => setPage('schedule')}>View all <span className="ic">{Icons.arrowRight}</span></button>
            </div>
          </div>
          <div className="home-panel-body">
            {school.tournaments?.length > 0
              ? school.tournaments.map((t, i) => (
                <div key={i} className="home-panel-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--c-text)' }}>{t.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--c-muted)', marginTop: 3, letterSpacing: '.5px' }}>{t.date} · Teams: {t.teams.join(', ')}</div>
                    </div>
                  </div>
                </div>
              ))
              : recent.length === 0
              ? <div style={{ padding: '32px 24px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-muted)', textAlign: 'center', letterSpacing: '1px' }}>Season hasn't started yet</div>
              : recent.map(m => (
                <div key={m.id} className="home-panel-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--c-text)' }}>vs. {m.opponent}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--c-muted)', marginTop: 3 }}>{fmt(m.date)} · {m.location}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-muted)', background: 'rgba(255,255,255,.04)', padding: '2px 7px', borderRadius: 4 }}>{m.score}</span>
                      <div className={`badge badge-${m.result}`}>{m.result}</div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* ROSTER */}
        <div className="home-panel">
          <div className="home-panel-head">
            <span className="home-panel-title">Roster</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {isOfficer && <button className="panel-edit-btn" onClick={() => setModal('roster-edit')}><span className="ic">{Icons.pencil}</span></button>}
              <button className="view-all-sm" onClick={() => setPage('roster')}>View all <span className="ic">{Icons.arrowRight}</span></button>
            </div>
          </div>
          <div className="home-panel-body">
            {roster.length === 0
              ? <div style={{ padding: '32px 24px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-muted)', textAlign: 'center', letterSpacing: '1px' }}>Roster not set yet</div>
              : roster.slice(0, 5).map((p, idx) => (
                <div key={p.id} className="home-panel-item" onClick={() => onSelectPlayer(p)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: idx < 3 ? 'color-mix(in srgb,var(--c-accent) 12%,transparent)' : 'var(--c-surf2)',
                      border: `1px solid ${idx < 3 ? 'color-mix(in srgb,var(--c-accent) 28%,transparent)' : 'var(--c-border)'}`,
                    }}>
                      {p.photo
                        ? <img src={p.photo} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontFamily: 'var(--font-disp)', fontSize: 15, color: idx < 3 ? 'var(--c-accent)' : 'var(--c-muted)' }}>{p.name.charAt(0)}</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--c-text)' }}>{p.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--c-muted)', marginTop: 2 }}>{p.team} · {p.gender === 'M' ? 'Gentlemen' : 'Ladies'}</div>
                    </div>
                    {p.role && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--c-accent)', flexShrink: 0, background: 'color-mix(in srgb,var(--c-accent) 10%,transparent)', padding: '2px 6px', borderRadius: 3 }}>{p.role}</div>}
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* STANDINGS */}
        <div className="home-panel">
          <div className="home-panel-head">
            <span className="home-panel-title">Standings</span>
            <button className="view-all-sm" onClick={() => setPage('leaderboard')}>View all <span className="ic">{Icons.arrowRight}</span></button>
          </div>
          <div className="home-panel-body">
            {standingsPreview.length === 0
              ? <div style={{ padding: '32px 24px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-muted2)', textAlign: 'center', letterSpacing: '1px' }}>No standings yet</div>
              : standingsPreview.map((s, i) => (
                <div key={s.slug} className="home-panel-item" style={s.slug === school.slug ? { borderLeft: '2px solid var(--c-accent)', paddingLeft: 22, background: 'color-mix(in srgb,var(--c-accent) 6%,transparent)' } : {}}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontFamily: 'var(--font-disp)', fontSize: 22, lineHeight: 1, color: i < 3 ? 'var(--c-accent)' : 'rgba(240,236,230,.2)', width: 30, flexShrink: 0, textAlign: 'center' }}>{i + 1}</div>
                    <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--c-text)' }}>{s.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-muted)', flexShrink: 0, background: 'rgba(255,255,255,.04)', padding: '2px 7px', borderRadius: 4 }}>{s.wins}–{s.losses}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* MEMBER SECTION — mirrors SJSU's "The Personal Stuff" */}
      {isMember && <>
        <div style={{ padding: '64px 72px 0' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--c-accent)', marginBottom: 10, opacity: .8 }}>Members Only</div>
          <div style={{ fontFamily: 'var(--font-disp)', fontSize: 'clamp(44px,6vw,72px)', letterSpacing: '3px', color: 'var(--c-text)', lineHeight: .95 }}>The Personal Stuff</div>
        </div>

        <div className="section">
          <span aria-hidden="true" style={{ position:'absolute', right:36, top:28, width:19, height:19, opacity:.09, color:'var(--c-accent)', pointerEvents:'none', transform:'rotate(20deg)', display:'block' }}>{Icons.miniCourt}</span>
          <div className="section-tag">Schedule &amp; Info</div>
          <div className="home-info-grid">
            <div className="home-info-card reveal">
              <div className="home-info-label">Announcements</div>
              <div className="home-info-sub" style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>
                {school.announcements || <span style={{ color: 'var(--c-muted2)' }}>No announcements yet</span>}
              </div>
              {isOfficer && <button className="view-all-sm" style={{ marginTop: 12 }} onClick={() => setModal('edit-announcements')}><span className="ic">{Icons.pencil}</span> Edit</button>}
            </div>
            <div className="home-info-card reveal">
              <div className="home-info-label">Practice Schedule</div>
              <div className="home-info-sub" style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>
                {school.schedule || <span style={{ color: 'var(--c-muted2)' }}>Schedule not set yet</span>}
              </div>
              {isOfficer && <button className="view-all-sm" style={{ marginTop: 12 }} onClick={() => setModal('edit-schedule')}><span className="ic">{Icons.pencil}</span> Edit</button>}
            </div>
            {isOfficer && (
              <div className="home-info-card reveal">
                <div className="home-info-label">Join Codes</div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--c-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>Officer</div>
                  <div style={{ fontFamily: 'var(--font-disp)', fontSize: 26, letterSpacing: 3, color: 'var(--c-accent)' }}>{school.officerCode}</div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--c-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>Player</div>
                  <div style={{ fontFamily: 'var(--font-disp)', fontSize: 26, letterSpacing: 3, color: 'var(--c-accent)' }}>{school.playerCode}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {school.activities?.length > 0 && (
          <div className="section">
            <span aria-hidden="true" style={{ position:'absolute', left:44, bottom:40, width:20, height:20, opacity:.08, color:'var(--c-accent)', pointerEvents:'none', transform:'rotate(-10deg) scaleX(-1)', display:'block' }}>{Icons.tennisPlayer}</span>
            <div className="section-tag">Team Life</div>
            <div className="section-header">
              <h2 className="section-h2">Team<br />Activities</h2>
            </div>
            <div className="act-grid">
              {school.activities.map((a, i) => (
                <div key={i} className="act-card reveal">
                  <div className="act-name">{a.name}</div>
                  <div className="act-desc">{a.desc}</div>
                  {a.dates.map((d, j) => (
                    <div key={j} className="act-date-opt">
                      <span className="act-date-opt-lbl">Option {j + 1}</span>
                      {d}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {(school.challengeRules || []).length > 0 && (
          <div className="section">
            <span aria-hidden="true" style={{ position:'absolute', right:52, bottom:36, width:21, height:21, opacity:.09, color:'var(--c-accent)', pointerEvents:'none', transform:'rotate(6deg)', display:'block' }}>{Icons.tennisNet}</span>
            <span aria-hidden="true" style={{ position:'absolute', left:60, top:36, width:18, height:18, opacity:.07, color:'var(--c-accent)', pointerEvents:'none', transform:'rotate(-18deg)', display:'block' }}>{Icons.tennisRacket}</span>
            <div className="section-tag">Ladder System</div>
            <div className="section-header">
              <h2 className="section-h2">Challenge<br />Match Rules</h2>
            </div>
            <div className="rules-grid">
              {(school.challengeRules || []).map((rule, i) => (
                <div key={i} className="rule-item reveal">
                  <div className="rule-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="rule-text">{rule}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>}

      <footer className="footer" style={{ position:'relative' }}>
        <span aria-hidden="true" style={{ position:'absolute', right:200, top:'50%', transform:'translateY(-50%) rotate(12deg)', width:17, height:17, opacity:.1, color:'var(--c-accent)', pointerEvents:'none', display:'block' }}>{Icons.tennisBall}</span>
        <span aria-hidden="true" style={{ position:'absolute', left:'38%', top:'50%', transform:'translateY(-50%) rotate(-9deg)', width:16, height:16, opacity:.08, color:'var(--c-accent)', pointerEvents:'none', display:'block' }}>{Icons.tennisRacket}</span>
        <div className="footer-logo">{school.name.split(' ').slice(0, 2).join(' ')} <span>Tennis</span></div>
        {isMember && school.hasSOP && (
          <div className="footer-links">
            <button className="footer-link" onClick={() => setPage('sop')}>Standard Operating Procedures</button>
          </div>
        )}
        <div className="footer-right">USTA Tennis on Campus · 2025–26 Season</div>
      </footer>
    </div>
  );
}

// ─── SCHEDULE PAGE ─────────────────────────────────────────────────────────────
function SchedulePage({ school, matches }) {
  useReveal();
  const sorted = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date));
  const wins   = matches.filter(m => m.result === 'W').length;
  const losses = matches.filter(m => m.result === 'L').length;
  const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  const hasTournaments = school.tournaments?.length > 0;

  return (
    <div className="page">
      <div className="page-hero" data-word="SCHEDULE">
        <span aria-hidden="true" style={{ position:'absolute', right:'8%', bottom:'22%', width:20, height:20, opacity:.09, color:'var(--c-accent)', pointerEvents:'none', transform:'rotate(16deg)', display:'block' }}>{Icons.miniCourt}</span>
        <div className="page-eyebrow">2025–26 Season · {school.name}</div>
        <h1 className="page-h1">Schedule</h1>
        <div className="page-meta">
          {hasTournaments && <div><div className="page-stat-num">{school.tournaments.length}</div><div className="page-stat-lbl">Tournaments</div></div>}
          <div><div className="page-stat-num" style={{ color: 'var(--c-win)' }}>{wins}</div><div className="page-stat-lbl">Wins</div></div>
          <div><div className="page-stat-num" style={{ color: 'var(--c-loss)' }}>{losses}</div><div className="page-stat-lbl">Losses</div></div>
          <div><div className="page-stat-num">{matches.length}</div><div className="page-stat-lbl">Played</div></div>
        </div>
      </div>

      {hasTournaments && (
        <div className="section" style={{ borderTop: 'none' }}>
          <div className="section-tag">Upcoming Matches</div>
          <div className="tourn-grid">
            {school.tournaments.map((t, i) => (
              <div key={i} className="tourn-card reveal">
                <div className="tourn-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="tourn-name">{t.name}</div>
                <div className="tourn-date">{t.date}</div>
                <div className="tourn-teams">
                  {t.teams.map(tm => (
                    <span key={tm} style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 20, border: `1px solid ${tm === 'A' ? 'color-mix(in srgb,var(--c-accent) 35%,transparent)' : 'var(--c-border)'}`, color: tm === 'A' ? 'var(--c-accent)' : 'var(--c-muted)', background: tm === 'A' ? 'var(--c-accent-glow)' : 'none', marginRight: 4 }}>
                      {tm} Team
                    </span>
                  ))}
                </div>
                <div className="tourn-note">{t.notes}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section" style={{ borderTop: hasTournaments ? undefined : 'none' }}>
        <div className="section-tag">Match History</div>
        {sorted.length === 0
          ? <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-muted)', letterSpacing: '1px', paddingTop: 40 }}>No matches yet this season</div>
          : <div className="match-list">
              {sorted.map(m => (
                <div key={m.id} className="match-row reveal">
                  <div className="match-date">{fmt(m.date)}</div>
                  <div><div className="match-vs">{school.name.split(' ')[0]} vs. {m.opponent}</div><div className="match-loc">{m.location}</div></div>
                  <div className="match-score">{m.score}</div>
                  <div className={`badge badge-${m.result}`}>{m.result}</div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}

// ─── ROSTER PAGE ───────────────────────────────────────────────────────────────
function RosterPage({ school, roster, onSelectPlayer }) {
  useReveal();
  const aTeam = roster.filter(p => p.team === 'A');
  const bTeam = roster.filter(p => p.team === 'B');
  const cTeam = roster.filter(p => p.team === 'C');

  return (
    <div className="page">
      <div className="page-hero" data-word="SQUAD">
        <span aria-hidden="true" style={{ position:'absolute', right:'10%', top:'24%', width:21, height:21, opacity:.08, color:'var(--c-accent)', pointerEvents:'none', transform:'rotate(-18deg) scaleX(-1)', display:'block' }}>{Icons.tennisPlayer}</span>
        <div className="page-eyebrow">2025–26 · {school.name} Club Tennis</div>
        <h1 className="page-h1">Roster</h1>
        <div className="page-meta">
          <div><div className="page-stat-num">{roster.length}</div><div className="page-stat-lbl">Players</div></div>
          {aTeam.length > 0 && <div><div className="page-stat-num">{aTeam.length}</div><div className="page-stat-lbl">A Team</div></div>}
          {bTeam.length > 0 && <div><div className="page-stat-num">{bTeam.length}</div><div className="page-stat-lbl">B Team</div></div>}
          {cTeam.length > 0 && <div><div className="page-stat-num">{cTeam.length}</div><div className="page-stat-lbl">C Team</div></div>}
        </div>
      </div>
      <div className="section" style={{ borderTop: 'none' }}>
        {roster.length === 0
          ? <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-muted)', letterSpacing: '1px' }}>Roster not set yet</div>
          : (['A', 'B', 'C']).map(team => {
              const players = roster.filter(p => p.team === team);
              if (!players.length) return null;
              return (
                <div key={team}>
                  {['M', 'F'].map(gender => {
                    const grp = players.filter(p => p.gender === gender);
                    if (!grp.length) return null;
                    return (
                      <div key={gender}>
                        <div className="section-tag">Team {team} — {gender === 'M' ? 'Gentlemen' : 'Ladies'}</div>
                        <div className="player-grid" style={{ marginBottom: 32 }}>
                          {grp.map((p, i) => <PlayerCard key={p.id} p={p} pos={i + 1} onSelect={onSelectPlayer} />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
        }
      </div>
    </div>
  );
}

// ─── LEADERBOARD PAGE ─────────────────────────────────────────────────────────
function LeaderboardPage({ school, divisionStandings }) {
  useReveal();
  const preview = (divisionStandings || []).slice(0, 7);
  return (
    <div className="page">
      <div className="page-hero" data-word="RANKS">
        <span aria-hidden="true" style={{ position:'absolute', left:'7%', bottom:'24%', width:18, height:18, opacity:.09, color:'var(--c-accent)', pointerEvents:'none', display:'block' }}>{Icons.tennisBall}</span>
        <div className="page-eyebrow">USTA Tennis on Campus · 2025–26</div>
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
          {preview.length === 0
            ? <div className="lb-row hl">
                <div className="lb-rank gold">1</div>
                <div className="lb-school">{school.name}</div>
                <div className="lb-stat">—</div>
                <div className="lb-stat">—</div>
              </div>
            : preview.map((s, i) => (
              <div key={s.slug} className={`lb-row${s.slug === school.slug ? ' hl' : ''}`}>
                <div className={`lb-rank${i === 0 ? ' gold' : ''}`}>{i + 1}</div>
                <div className="lb-school">{s.name}</div>
                <div className="lb-stat">{s.wins}</div>
                <div className="lb-stat">{s.losses}</div>
              </div>
            ))
          }
        </div>
        {(!divisionStandings || divisionStandings.length === 0) && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--c-muted)', marginTop: 20, letterSpacing: '0.5px' }}>
            Full league standings will appear here once matches are recorded.
          </p>
        )}
        {divisionStandings?.length > 7 && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--c-muted)', marginTop: 20, letterSpacing: '0.5px' }}>
            Showing top 7 of {divisionStandings.length} schools.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── SOP PAGE ─────────────────────────────────────────────────────────────────
function SOPPage({ school }) {
  useReveal();
  const tournaments = school.tournaments || [];
  const activities  = school.activities  || [];
  return (
    <div className="page">
      <div className="page-hero" data-word="SOP">
        <div className="page-eyebrow">{school.name} · As of March 2, 2026</div>
        <h1 className="page-h1">Standard<br />Operating<br />Procedures</h1>
        <div className="page-meta">
          <div>
            <div className="page-stat-lbl">Articulated by</div>
            <div className="page-stat-num" style={{ fontSize: 32 }}>Abraham Lau</div>
          </div>
        </div>
      </div>
      <div className="sop-content">

        <div className="sop-section reveal">
          <div className="sop-h2">Foreword</div>
          <div className="sop-body">
            <p className="sop-quote">"The purpose of this organization shall be two-fold: one, to provide an opportunity for students at San José State University to enjoy and improve at the game of tennis; and two, to field a team to represent San José State University in games versus both other clubs and colleges." — Article II, Section 1</p>
            <p>As your Team Captain and President, it is my pleasure to welcome you to another season of Club Tennis here at San Jose State University. SJSU was founded in 1856, making it the oldest California State University and its legacy is in our hands today.</p>
            <p>Club Tennis was founded back in 2017 from a group of friends yearning for a special place to call home. Through the 15-plus semesters this organization has gone through, numerous brave souls stepped up to the plate, to lead one another to the finish line. That finish line is not merely the trophy but the treatment of each other with the respect and dignity that they deserve. If one of us falls down, we stop running and carry them on our shoulders. We are a team through and through, a team of Spartans ready for war.</p>
          </div>
        </div>

        <div className="sop-section reveal">
          <div className="sop-h2">Operations</div>
          <div className="sop-h3">Practices</div>
          <div className="sop-body">
            <p>SJSU Club Tennis meets on <strong>Monday and Wednesday from 6–8 PM</strong>. Players must fill out the Attendance Tracker and notify the President by <strong>3 PM</strong> if they cannot attend. Thursdays are optional drop-in.</p>
            <p><a href="https://tinyurl.com/yc2rm86v" target="_blank" rel="noreferrer" style={{ color: 'var(--c-accent)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>Attendance Tracker → tinyurl.com/yc2rm86v</a></p>
          </div>
          <div className="sop-h3">Dues</div>
          <div className="sop-body">
            <ul className="sop-list">
              <li>Payable by check to Treasurer Brandon Wirjadisastra by <strong>Monday, March 23rd</strong></li>
              <li>Pay to the order of <strong>"Student Union Inc. of SJSU"</strong></li>
              <li>Returning members: <strong>$255</strong> · New members: <strong>$305</strong></li>
            </ul>
          </div>
          <div className="sop-h3">Officer Team</div>
          <div className="sop-body">
            <ul className="sop-list">
              <li><strong>President:</strong> Abraham Lau · tennis@sjsustudents.com · (408) 480-6255</li>
              <li><strong>Treasurer:</strong> Brandon Wirjadisastra · brandon.wirjadisastra@sjsu.edu · (510) 468-4244</li>
              <li><strong>Marketing:</strong> Kayla Solano · kayla.solano@sjsu.edu · (415) 524-9833</li>
              <li><strong>Safety:</strong> Kiana Lua · kiana.lua@sjsu.edu · (661) 808-4734</li>
            </ul>
          </div>
          <div className="sop-h3">Telecommunication</div>
          <div className="sop-body">
            <p>Official Discord server for broad announcements. WhatsApp is used frequently — members must read and react to the "Announcements" chat and stay current in "General." Ensure tennis@sjsustudents.com is not in your spam folder.</p>
          </div>
        </div>

        <div className="sop-section reveal">
          <div className="sop-h2">Player Conduct</div>
          <div className="sop-body">
            <p>The Officer Team may suspend or dismiss any member for the following:</p>
            <ul className="sop-list">
              <li>Unsportsmanlike Conduct — aggression, verbal abuse, or disrespect</li>
              <li>Violation of Club Policies — attendance, team rules, officer directives</li>
              <li>Academic or Ethical Misconduct</li>
              <li>Substance Abuse during club activities</li>
              <li>Harassment or Discrimination of any kind</li>
              <li>Violent or Criminal Behavior</li>
              <li>Reckless or Dangerous Behavior</li>
              <li>Repeated Disregard of Warnings</li>
            </ul>
          </div>
        </div>

        <div className="sop-section reveal">
          <div className="sop-h2">Competition</div>
          <div className="sop-h3">Tournaments</div>
          <div className="sop-body">
            <ul className="sop-list">
              {tournaments.map((t, i) => (
                <li key={i}><strong>{t.name}</strong> · {t.date} · Teams: {t.teams.join(', ')} · {t.notes}</li>
              ))}
            </ul>
          </div>
          <div className="sop-h3">Challenge Match Policy</div>
          <div className="sop-body">
            <ul className="sop-list">
              <li>Challenge up to 2 spots above your current position (e.g. #6 may challenge up to #4)</li>
              <li>Singles set to 6, played at Monday Practices — Doubles on hold</li>
              <li>Maximum of 3 challenge matches per week</li>
              <li>If you challenge or are challenged, you may not challenge again that same week</li>
              <li>If the challenger wins, the two players swap ladder positions</li>
              <li>No-show by the challenged player for all match days = challenger automatically takes their spot</li>
            </ul>
          </div>
        </div>

        {activities.length > 0 && (
          <div className="sop-section reveal">
            <div className="sop-h2">Activities</div>
            {activities.map((a, i) => (
              <div key={i}>
                <div className="sop-h3">{a.name}</div>
                <div className="sop-body">
                  <p>{a.desc}</p>
                  <ul className="sop-list">
                    {a.dates.map((d, j) => <li key={j}>Option {j + 1}: {d}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="sop-section reveal">
          <div className="sop-h2">Big/Little's Program</div>
          <div className="sop-body">
            <p>This mentorship program pairs new players with a returning member to create a welcoming environment. Big's shall be inviting, friendly, and knowledgeable — a supportive role model who sets a good example.</p>
            <p>Designated WhatsApp group chats are created for Big's, Little's, and a shared group between each pair.</p>
          </div>
        </div>

        <div className="sop-section reveal">
          <div className="sop-h2">Member Agreement</div>
          <div className="sop-body">
            <p>By joining, members confirm they have received, read, and agree to comply with this SOP — including all attendance requirements, ladder policies, tournament expectations, financial obligations, and conduct standards.</p>
            <p>Failure to comply may result in loss of ladder position, suspension from matches or tournaments, removal from the travel team, or dismissal from the organization.</p>
            <p>This agreement remains in effect for the duration of the Member's participation during the academic semester in which it is signed.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── NOT FOUND ────────────────────────────────────────────────────────────────
function SchoolNotFound({ slug }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, fontFamily: "'DM Sans', sans-serif", background: '#0e0c0a', color: '#f0ece6' }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(60px,10vw,120px)', letterSpacing: 3, lineHeight: .9, marginBottom: 20 }}>Not Found</div>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(240,236,230,.38)', letterSpacing: 1, marginBottom: 28 }}>
        No school page found for "{slug}".<br />
        It may not have been set up yet.
      </p>
      <button onClick={() => navigate('/')} style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid rgba(255,255,255,.1)', background: 'none', color: 'rgba(240,236,230,.6)', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1, cursor: 'pointer' }}>
        ← Back to Squad Tennis
      </button>
    </div>
  );
}

// ─── SJSU DEFAULT SEED DATA ───────────────────────────────────────────────────
const SJSU_SEED = {
  name: 'San Jose State University',
  slug: 'sjsu',
  colors: { accent: '#c9a96e', accentHi: '#e4c98c', accentGlow: 'rgba(201,169,110,.15)' },
  officerCode: 'SJSU2026',
  playerCode:  'SPARTAN24',
  enrolled: true,
  hasSOP: true,
  heroEyebrow: 'NorCal TOC · 2025–26 Season',
  roster: [
    { id:1,  name:"Brandon Wirjadisastra", utr:0, year:"", major:"", team:"A", gender:"M", role:"",           wins:0, losses:0 },
    { id:2,  name:"Abraham Lau",           utr:0, year:"", major:"", team:"A", gender:"M", role:"Captain",    wins:0, losses:0 },
    { id:3,  name:"Julian Whalen",         utr:0, year:"", major:"", team:"A", gender:"M", role:"",           wins:0, losses:0 },
    { id:4,  name:"Anurag Potla",          utr:0, year:"", major:"", team:"A", gender:"M", role:"",           wins:0, losses:0 },
    { id:5,  name:"Arin Akkaya",           utr:0, year:"", major:"", team:"A", gender:"F", role:"",           wins:0, losses:0 },
    { id:6,  name:"Kiana Lua",             utr:0, year:"", major:"", team:"A", gender:"F", role:"",           wins:0, losses:0 },
    { id:7,  name:"Faith Son",             utr:0, year:"", major:"", team:"A", gender:"F", role:"",           wins:0, losses:0 },
    { id:8,  name:"Scott Conlin",          utr:0, year:"", major:"", team:"B", gender:"M", role:"Co-Captain", wins:0, losses:0 },
    { id:9,  name:"Yurro Zabala",          utr:0, year:"", major:"", team:"B", gender:"M", role:"Co-Captain", wins:0, losses:0 },
    { id:10, name:"Adi Shah",              utr:0, year:"", major:"", team:"B", gender:"M", role:"",           wins:0, losses:0 },
    { id:11, name:"Tanay Mahesh",          utr:0, year:"", major:"", team:"B", gender:"M", role:"",           wins:0, losses:0 },
    { id:12, name:"Arnav Nallani",         utr:0, year:"", major:"", team:"B", gender:"M", role:"",           wins:0, losses:0 },
    { id:13, name:"Julie Phan",            utr:0, year:"", major:"", team:"B", gender:"F", role:"",           wins:0, losses:0 },
    { id:14, name:"Lethycia Palomera",     utr:0, year:"", major:"", team:"B", gender:"F", role:"",           wins:0, losses:0 },
    { id:15, name:"Noelle Dwyer",          utr:0, year:"", major:"", team:"B", gender:"F", role:"",           wins:0, losses:0 },
    { id:16, name:"Gorden Thao",           utr:0, year:"", major:"", team:"C", gender:"M", role:"Captain",    wins:0, losses:0 },
    { id:17, name:"Carden Dang",           utr:0, year:"", major:"", team:"C", gender:"M", role:"",           wins:0, losses:0 },
    { id:18, name:"Kevin Zarnegar",        utr:0, year:"", major:"", team:"C", gender:"M", role:"",           wins:0, losses:0 },
    { id:19, name:"Anthony Phan",          utr:0, year:"", major:"", team:"C", gender:"M", role:"",           wins:0, losses:0 },
    { id:20, name:"Kayla Solano",          utr:0, year:"", major:"", team:"C", gender:"F", role:"",           wins:0, losses:0 },
    { id:21, name:"Brooklyn Tayo",         utr:0, year:"", major:"", team:"C", gender:"F", role:"",           wins:0, losses:0 },
    { id:22, name:"Sonya Son",             utr:0, year:"", major:"", team:"C", gender:"F", role:"",           wins:0, losses:0 },
  ],
  matches: [],
  tournaments: [
    { name: "UC Berkeley Golden Bears Invitationals", date: "Mar 21–22", teams: ["A","B"],       notes: "No gas or team meal" },
    { name: "UNR Wolf-Pack Invitational",             date: "Apr 10–12", teams: ["A","B","C"],   notes: "Rental cars, gas & team meal provided" },
    { name: "UCD Cowtown Showdown",                   date: "May 1–3",   teams: ["A","B"],       notes: "Gas provided · Team C waitlisted" },
  ],
  activities: [
    { name: "SF Day-Trip",        desc: "Cal Train from near campus to San Francisco for the day",     dates: ["Fri, Mar 13", "Sun, Mar 15", "Fri, Mar 27"] },
    { name: "Santa Cruz Bonfire", desc: "Beach, boardwalk & bonfire with s'mores as the sun sets",     dates: ["Sun, Mar 29", "Fri, Apr 17", "Sun, Apr 19"] },
    { name: "Riveting Retreat",   desc: "Single-night Airbnb stayover to share laughter and memories", dates: ["Apr 24–25 (Fri–Sat)", "May 8–9 (Fri–Sat)", "May 9–10 (Sat–Sun)"] },
  ],
  bgImage: '/team.jpeg',
  announcements: '',
  schedule: 'Mon & Wed · 6:00 – 8:00 PM · Campus Courts\nThursdays: optional drop-in',
  challengeRules: [
    "Challenge up to 2 spots above your current position — work your way up the ladder.",
    "Singles set to 6, played at team practices. Doubles format determined by officers.",
    "Maximum of 3 challenge matches per week.",
    "If you challenge or are challenged, you may not challenge again that same week.",
    "If the challenger wins, the two players swap ladder positions.",
    "No-show for all possible match days: challenger automatically takes the spot.",
  ],
};

// ─── ROOT SCHOOL APP ──────────────────────────────────────────────────────────
export default function SchoolPage({ defaultSlug }) {
  const params = useParams();
  const slug = params.slug || defaultSlug;
  const [searchParams] = useSearchParams();
  const { user, login, logout: authLogout } = useAuth();
  const [school,         setSchoolState] = useState(() => {
    let data = getSchoolData(slug);
    if (!data && slug === 'sjsu') {
      saveSchoolData('sjsu', SJSU_SEED);
      data = SJSU_SEED;
    }
    // Migrate existing SJSU data that predates the default bgImage
    if (data && slug === 'sjsu' && !data.bgImage) {
      data = { ...data, bgImage: '/team.jpeg' };
      saveSchoolData('sjsu', data);
    }
    return data;
  });
  const [page,           setPage]        = useState('home');
  const [modal,          setModal]       = useState(() => searchParams.get('open') || null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Persist school data helper
  const updateSchool = useCallback(patch => {
    setSchoolState(prev => {
      const next = { ...prev, ...patch };
      saveSchoolData(slug, next);
      return next;
    });
  }, [slug]);

  const saveMatch           = m   => updateSchool({ matches: [m, ...(school?.matches || [])] });
  const saveRoster          = r   => updateSchool({ roster: r });
  const saveAnnouncements   = txt => updateSchool({ announcements: txt });
  const saveSchedule        = txt => updateSchool({ schedule: txt });
  const saveBgImage         = img => updateSchool({ bgImage: img });
  const saveChallengeRules  = r   => updateSchool({ challengeRules: r });

  // Derived auth — computed before any early returns so hooks stay stable
  const isMember  = user?.schoolSlug === slug;
  const isOfficer = isMember && user?.role === 'officer';

  // Close privileged modals whenever the user session changes (logout, switch account, back button)
  useEffect(() => {
    const officerOnly = ['results', 'roster-edit', 'edit-announcements', 'edit-schedule', 'challenge-rules'];
    const memberOnly  = ['card-edit'];
    setModal(m => {
      if (m && officerOnly.includes(m) && !isOfficer) return null;
      if (m && memberOnly.includes(m)  && !isMember)  return null;
      return m;
    });
  }, [user, isOfficer, isMember]);

  // Scroll to top on page change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

  // Inject CSS with school colors
  useEffect(() => {
    if (!school) return;
    const { accent, accentHi, accentGlow } = school.colors || { accent: '#3dba6f', accentHi: '#5dd68d', accentGlow: 'rgba(61,186,111,.15)' };
    const tag = document.createElement('style');
    tag.id = `school-styles-${slug}`;
    tag.textContent = makeCSS(accent, accentHi, accentGlow);
    document.head.appendChild(tag);
    return () => { const t = document.getElementById(`school-styles-${slug}`); if (t) t.remove(); };
  }, [slug, school]);

  if (!school) return <SchoolNotFound slug={slug} />;

  const logout = () => { authLogout(); setModal(null); setPage('home'); };

  // Compute standings — all enrolled schools, sorted by wins
  const divisionStandings = (() => {
    const allEnrolled = getAllEnrolledSchools();
    return allEnrolled
      .map(s => {
        const data = getSchoolData(s.slug) || s;
        const ms   = data.matches || [];
        return { slug: s.slug, name: s.name, wins: ms.filter(m => m.result === 'W').length, losses: ms.filter(m => m.result === 'L').length };
      })
      .sort((a, b) => b.wins - a.wins || a.losses - b.losses);
  })();

  return (
    <>
      <div className="sp-amb sp-amb-a" />
      <div className="sp-amb sp-amb-b" />

      <SchoolNav school={school} user={user} setModal={setModal} setPage={setPage} onLogout={logout} />

      <div className="page">
        {page === 'home'        && <HomePage school={school} matches={school.matches} roster={school.roster} setPage={setPage} setModal={setModal} onSelectPlayer={setSelectedPlayer} onBgUpload={saveBgImage} isMember={isMember} isOfficer={isOfficer} divisionStandings={divisionStandings} />}
        {page === 'schedule'    && <SchedulePage school={school} matches={school.matches} />}
        {page === 'roster'      && <RosterPage school={school} roster={school.roster} onSelectPlayer={setSelectedPlayer} />}
        {page === 'leaderboard' && <LeaderboardPage school={school} divisionStandings={divisionStandings} />}
        {page === 'sop'         && isMember && school.hasSOP && <SOPPage school={school} />}
      </div>

      {selectedPlayer && <PlayerModal p={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}
      {modal === 'results'            && isOfficer && <InputResultsModal       school={school} onClose={() => setModal(null)} onSave={saveMatch} />}
      {modal === 'roster-edit'        && isOfficer && <EditRosterModal         roster={school.roster} onClose={() => setModal(null)} onSave={saveRoster} />}
      {modal === 'edit-announcements' && isOfficer && <EditAnnouncementsModal  announcements={school.announcements} onClose={() => setModal(null)} onSave={saveAnnouncements} />}
      {modal === 'edit-schedule'      && isOfficer && <EditScheduleModal       schedule={school.schedule} onClose={() => setModal(null)} onSave={saveSchedule} />}
      {modal === 'challenge-rules'    && isOfficer && <EditChallengeRulesModal rules={school.challengeRules} onClose={() => setModal(null)} onSave={saveChallengeRules} />}
      {modal === 'card-edit'          && isMember  && user && <UpdatePlayerCardModal user={user} roster={school.roster} onClose={() => setModal(null)} onSave={saveRoster} />}
      {modal === 'login'              && !user     && <LoginModal              onClose={() => setModal(null)} onLogin={login} />}
      {modal === 'register'           && !user     && <RegisterModal           school={school} onClose={() => setModal(null)} onLogin={login} />}
    </>
  );
}

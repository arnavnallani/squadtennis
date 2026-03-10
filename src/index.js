import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SquadApp, { SquadHomePage, SquadStandingsPage, SquadCodesPage } from './SquadHome';
import OnboardFlow from './OnboardFlow';
import SchoolPage from './SchoolPage';
import { LoginPage, RegisterPage } from './AuthPages';
import { AuthProvider } from './AuthContext';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Squad Tennis landing */}
          <Route path="/" element={
            <SquadApp><SquadHomePage /></SquadApp>
          } />
          <Route path="/standings" element={
            <SquadApp><SquadStandingsPage /></SquadApp>
          } />
          <Route path="/codes" element={
            <SquadApp><SquadCodesPage /></SquadApp>
          } />

          {/* Auth */}
          <Route path="/login"    element={<SquadApp><LoginPage /></SquadApp>} />
          <Route path="/register" element={<SquadApp><RegisterPage /></SquadApp>} />

          {/* Onboarding flow */}
          <Route path="/onboard" element={<OnboardFlow />} />

          {/* Generated school pages */}
          <Route path="/schools/:slug" element={<SchoolPage />} />

          {/* SJSU — served by SchoolPage like all other schools */}
          <Route path="/sjsu" element={<SchoolPage defaultSlug="sjsu" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

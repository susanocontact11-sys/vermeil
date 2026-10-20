'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const champ = {
  width: '100%',
  padding: 12,
  border: '1.5px solid var(--bordure)',
  borderRadius: 12,
  background: '#fff',
  color: 'var(--encre)',
  fontSize: '1rem',
};
const etiquette = { display: 'grid', gap: 6, fontWeight: 700 };

function traduire(message) {
  if (/invalid login/i.test(message)) return 'Email ou mot de passe incorrect.';
  if (/already registered/i.test(message)) return 'Un compte existe déjà avec cet email. Connecte-toi.';
  if (/at least 6|password should be/i.test(message)) return 'Le mot de passe doit faire au moins 6 caractères.';
  if (/rate limit/i.test(message)) return 'Trop de tentatives. Réessaie dans un moment.';
  return message;
}

export default function Connexion() {
  const router = useRouter();
  const [mode, setMode] = useState('connexion'); // 'connexion' ou 'inscription'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  // Le bouton « Créer ma mini boutique » de l'accueil ouvre /connexion?mode=inscription
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('mode') === 'inscription') {
      setMode('inscription');
    }
  }, []);

  async function envoyer(e) {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    const { error } =
      mode === 'inscription'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    setChargement(false);
    if (error) {
      setErreur(traduire(error.message));
      return;
    }
    router.push('/gerer');
  }

  const pastille = (actif) => ({
    flex: 1,
    padding: '10px 8px',
    borderRadius: 999,
    fontWeight: 800,
    fontSize: '0.9rem',
    border: '2px solid var(--vermeil)',
    background: actif ? 'var(--vermeil)' : '#fff',
    color: actif ? '#fff' : 'var(--vermeil)',
  });

  return (
    <main style={{ minHeight: '100vh', padding: '24px 20px 56px' }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <Link href="/" style={{ fontWeight: 700, color: 'var(--vermeil)' }}>
          ← Accueil
        </Link>

        <header style={{ textAlign: 'center', margin: '20px 0 24px' }}>
          <h1 className="calli" style={{ fontSize: '3rem', color: 'var(--vermeil)', lineHeight: 1.1 }}>
            {mode === 'inscription' ? 'Rejoins les créateurs' : 'Content de te revoir'}
          </h1>
          <div className="ornement">◆</div>
          <p style={{ opacity: 0.8 }}>
            {mode === 'inscription'
              ? 'Crée ton compte pour ouvrir ta mini boutique.'
              : 'Connecte-toi pour gérer ta boutique.'}
          </p>
        </header>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button type="button" onClick={() => setMode('connexion')} style={pastille(mode === 'connexion')}>
            Me connecter
          </button>
          <button type="button" onClick={() => setMode('inscription')} style={pastille(mode === 'inscription')}>
            Créer un compte
          </button>
        </div>

        <form onSubmit={envoyer} className="carte" style={{ display: 'grid', gap: 16, padding: 20 }}>
          <label style={etiquette}>
            Email
            <input
              style={champ}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label style={etiquette}>
            Mot de passe
            <input
              style={champ}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 caractères minimum"
              minLength={6}
              autoComplete={mode === 'inscription' ? 'new-password' : 'current-password'}
              required
            />
          </label>

          <button
            type="submit"
            disabled={chargement}
            className="bouton"
            style={{ width: '100%', opacity: chargement ? 0.6 : 1 }}
          >
            {chargement ? 'Patiente…' : mode === 'inscription' ? "M'inscrire" : 'Me connecter'}
          </button>

          {erreur && <p style={{ color: 'crimson', fontWeight: 700 }}>{erreur}</p>}
        </form>
      </div>
    </main>
  );
                }
                

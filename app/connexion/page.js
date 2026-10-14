'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Connexion() {
  const router = useRouter();
  const [mode, setMode] = useState('connexion'); // 'connexion' ou 'inscription'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

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
      setErreur(error.message);
      return;
    }
    router.push('/gerer');
  }

  return (
    <main style={{ maxWidth: 400, margin: '60px auto', padding: 20 }}>
      <h1>{mode === 'inscription' ? 'Créer mon compte' : 'Me connecter'}</h1>

      <form onSubmit={envoyer} style={{ display: 'grid', gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe (6 caractères minimum)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button type="submit" disabled={chargement}>
          {chargement
            ? 'Patiente…'
            : mode === 'inscription'
            ? "M'inscrire"
            : 'Me connecter'}
        </button>
      </form>

      {erreur && <p style={{ color: 'crimson' }}>{erreur}</p>}

      <p>
        <button
          type="button"
          onClick={() =>
            setMode(mode === 'inscription' ? 'connexion' : 'inscription')
          }
          style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {mode === 'inscription'
            ? "J'ai déjà un compte"
            : "Je n'ai pas encore de compte"}
        </button>
      </p>
    </main>
  );
           }
            

'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MessageAccueil({ boutique }) {
  const [texte, setTexte] = useState(boutique.message_accueil || '');
  const [etat, setEtat] = useState('');

  async function enregistrer() {
    setEtat('Enregistrement…');
    const { error } = await supabase
      .from('boutiques')
      .update({ message_accueil: texte.trim() || null })
      .eq('id', boutique.id);
    setEtat(error ? error.message : 'Message enregistré ✅');
  }

  return (
    <section style={{ marginTop: 24 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Mon message aux clients</h2>
      <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
        Il s'affiche en haut de ta boutique. Ex : « Découvre ma nouvelle création sur ma story
        Facebook ! »
      </p>
      <textarea
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        maxLength={300}
        style={{
          width: '100%',
          minHeight: 80,
          padding: 12,
          marginTop: 8,
          border: '1px solid #c9b8a8',
          borderRadius: 10,
          background: '#fff',
          color: '#3a2a20',
        }}
      />
      <button
        onClick={enregistrer}
        style={{
          marginTop: 8,
          padding: '10px 16px',
          borderRadius: 12,
          background: '#b3261e',
          color: '#fff',
          fontWeight: 700,
        }}
      >
        Enregistrer le message
      </button>
      {etat && <p>{etat}</p>}
    </section>
  );
  }

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
    <div className="carte" style={{ padding: 20, marginTop: 16 }}>
      <h2 className="calli" style={{ fontSize: '2rem', color: 'var(--vermeil)' }}>
        Mon message aux clients
      </h2>
      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
        Il s'affiche en haut de ta boutique. Ex : « Découvre ma nouvelle création sur ma story
        Facebook ! »
      </p>
      <textarea
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        maxLength={300}
        style={{
          width: '100%',
          minHeight: 90,
          padding: 12,
          marginTop: 8,
          border: '1.5px solid var(--bordure)',
          borderRadius: 12,
          background: '#fff',
          color: 'var(--encre)',
        }}
      />
      <button
        onClick={enregistrer}
        className="bouton"
        style={{ width: '100%', marginTop: 10 }}
      >
        Enregistrer le message
      </button>
      {etat && <p style={{ marginTop: 8 }}>{etat}</p>}
    </div>
  );
}

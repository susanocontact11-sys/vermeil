'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Gerer() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [boutique, setBoutique] = useState(null);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/connexion');
        return;
      }
      setUser(data.session.user);
      const { data: b } = await supabase
        .from('boutiques')
        .select('*')
        .eq('owner_id', data.session.user.id)
        .maybeSingle();
      setBoutique(b);
      setPret(true);
    }
    init();
  }, [router]);

  async function deconnexion() {
    await supabase.auth.signOut();
    router.replace('/connexion');
  }

  if (!pret) return <p style={{ padding: 20 }}>Chargement…</p>;

  return (
    <main style={{ background: '#fff8f1', color: '#3a2a20', minHeight: '100vh', padding: 24 }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Gérer ma boutique</h1>
        <p>Connecté en tant que {user.email}</p>

        {boutique ? (
          <div style={{ marginTop: 16 }}>
            {boutique.logo_url && (
              <img
                src={boutique.logo_url}
                alt={boutique.nom}
                style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 12 }}
              />
            )}
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{boutique.nom}</h2>
            <p>{boutique.description}</p>
            <p>(Produits et commandes : prochaines étapes.)</p>
          </div>
        ) : (
          <p style={{ marginTop: 16 }}>
            <Link href="/creer" style={{ color: '#b3261e', fontWeight: 700 }}>
              Tu n'as pas encore de boutique : crée-la ici
            </Link>
          </p>
        )}

        <button onClick={deconnexion} style={{ marginTop: 24, textDecoration: 'underline' }}>
          Me déconnecter
        </button>
      </div>
    </main>
  );
    }

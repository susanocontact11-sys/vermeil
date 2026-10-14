'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Gerer() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/connexion');
      } else {
        setUser(data.session.user);
      }
    });
  }, [router]);

  async function deconnexion() {
    await supabase.auth.signOut();
    router.replace('/connexion');
  }

  if (!user) return <p style={{ padding: 20 }}>Chargement…</p>;

  return (
    <main style={{ maxWidth: 600, margin: '60px auto', padding: 20 }}>
      <h1>Gérer ma boutique</h1>
      <p>Connecté en tant que {user.email}</p>
      <p>(La création de boutique arrive à l'étape 3.)</p>
      <button onClick={deconnexion}>Me déconnecter</button>
    </main>
  );
}

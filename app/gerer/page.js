'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { compresserImage } from '@/lib/image';
import ProduitsGestion from '@/components/ProduitsGestion';
import CommandesGestion from '@/components/CommandesGestion';
import MessageAccueil from '@/components/MessageAccueil';

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
  async function changerLogo(e) {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const blob = await compresserImage(f, 400);
      const chemin = `${user.id}/logo-${Date.now()}.webp`;
      const { error: errUp } = await supabase.storage
        .from('images')
        .upload(chemin, blob, { contentType: 'image/webp' });
      if (errUp) throw errUp;
      const url = supabase.storage.from('images').getPublicUrl(chemin).data.publicUrl;
      const { error } = await supabase
        .from('boutiques')
        .update({ logo_url: url })
        .eq('id', boutique.id);
      if (error) throw error;
      setBoutique({ ...boutique, logo_url: url });
    } catch (err) {
      alert(err.message);
    }
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
              <Link href={`/boutique/${boutique.slug}`} style={{ display: 'block', marginTop: 12, textDecoration: 'underline' }}>
  Voir ma boutique comme un client
</Link>
                          <label style={{ display: 'block', marginTop: 12, textDecoration: 'underline', cursor: 'pointer' }}>
              {boutique.logo_url ? 'Changer le logo' : 'Ajouter un logo'}
              <input type="file" accept="image/*" onChange={changerLogo} style={{ display: 'none' }} />
            </label>
                <MessageAccueil boutique={boutique} />
                <CommandesGestion boutique={boutique} />
            <ProduitsGestion boutique={boutique} user={user} />
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

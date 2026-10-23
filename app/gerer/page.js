'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { compresserImage } from '@/lib/image';
import CommandesGestion from '@/components/CommandesGestion';
import ProduitsGestion from '@/components/ProduitsGestion';
import MessageAccueil from '@/components/MessageAccueil';

const ONGLETS = [
  { id: 'commandes', libelle: 'Commandes' },
  { id: 'produits', libelle: 'Produits' },
  { id: 'boutique', libelle: 'Ma boutique' },
];

export default function Gerer() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [boutique, setBoutique] = useState(null);
  const [pret, setPret] = useState(false);
  const [onglet, setOnglet] = useState('commandes');
  const [copie, setCopie] = useState(false);

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

  async function copierLien() {
    const url = `${window.location.origin}/boutique/${boutique.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      window.prompt('Copie ce lien :', url);
    }
  }

  if (!pret) return <p style={{ padding: 20 }}>Chargement…</p>;

  return (
    <main style={{ minHeight: '100vh', padding: '24px 20px 56px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Link href="/" style={{ fontWeight: 700, color: 'var(--vermeil)' }}>
          ← Accueil
        </Link>

        {!boutique ? (
          <div className="carte" style={{ padding: 24, textAlign: 'center', marginTop: 16 }}>
            <h1 className="calli" style={{ fontSize: '2.8rem', color: 'var(--vermeil)' }}>
              Ouvre ta boutique
            </h1>
            <div className="ornement">◆</div>
            <p style={{ opacity: 0.8 }}>Tu n'as pas encore de boutique sur Vybénia .</p>
            <Link href="/creer" className="bouton bouton-or" style={{ marginTop: 16 }}>
              Créer ma mini boutique
            </Link>
          </div>
        ) : (
          <>
            <header
              className="carte"
              style={{
                padding: 18,
                marginTop: 16,
                background: 'linear-gradient(180deg, #fff 0%, var(--creme-fonce) 100%)',
              }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                {boutique.logo_url ? (
                  <img
                    src={boutique.logo_url}
                    alt={boutique.nom}
                    style={{
                      width: 72,
                      height: 72,
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: '3px solid var(--or)',
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    className="calli"
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: 'var(--creme-fonce)',
                      color: 'var(--vermeil)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '2.4rem',
                      flexShrink: 0,
                    }}
                  >
                    {boutique.nom.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <h1
                    className="calli"
                    style={{ fontSize: '2.2rem', color: 'var(--vermeil)', lineHeight: 1.1 }}
                  >
                    {boutique.nom}
                  </h1>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <Link
                  href={`/boutique/${boutique.slug}`}
                  className="bouton"
                  style={{ flex: 1, padding: '10px 8px', fontSize: '0.9rem' }}
                >
                  Voir ma boutique comme un client 
                </Link>
                <button
                  onClick={copierLien}
                  className="bouton bouton-contour"
                  style={{ flex: 1, padding: '10px 8px', fontSize: '0.9rem' }}
                >
                  {copie ? 'Lien copié ✅' : 'Copier mon lien'}
                </button>
              </div>
            </header>

            <div style={{ display: 'flex', gap: 8, margin: '20px 0' }}>
              {ONGLETS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOnglet(o.id)}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    border: '2px solid var(--vermeil)',
                    background: onglet === o.id ? 'var(--vermeil)' : '#fff',
                    color: onglet === o.id ? '#fff' : 'var(--vermeil)',
                  }}
                >
                  {o.libelle}
                </button>
              ))}
            </div>

            <div style={{ display: onglet === 'commandes' ? 'block' : 'none' }}>
              <CommandesGestion boutique={boutique} />
            </div>

            <div style={{ display: onglet === 'produits' ? 'block' : 'none' }}>
              <ProduitsGestion boutique={boutique} user={user} />
            </div>

            <div style={{ display: onglet === 'boutique' ? 'block' : 'none' }}>
              <div className="carte" style={{ padding: 20 }}>
                <h2 className="calli" style={{ fontSize: '2rem', color: 'var(--vermeil)' }}>
                  Mon logo
                </h2>
                <label
                  className="bouton bouton-contour"
                  style={{ cursor: 'pointer', marginTop: 10 }}
                >
                  {boutique.logo_url ? 'Changer le logo' : 'Ajouter un logo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={changerLogo}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <MessageAccueil boutique={boutique} />
            </div>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <button onClick={deconnexion} style={{ textDecoration: 'underline', fontWeight: 700 }}>
            Me déconnecter
          </button>
        </div>
      </div>
    </main>
  );
          }
  

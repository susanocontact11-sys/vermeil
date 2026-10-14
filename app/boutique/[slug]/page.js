import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import CarteProduit from '@/components/CarteProduit';

export const dynamic = 'force-dynamic';

async function getBoutique(slug) {
  const { data } = await supabase
    .from('boutiques')
    .select('*')
    .eq('slug', slug)
    .eq('masquee', false)
    .maybeSingle();
  return data;
}

function lien(valeur) {
  return valeur.startsWith('http') ? valeur : `https://${valeur}`;
}

// C'est ici que se prépare l'aperçu du lien (WhatsApp, Facebook...)
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const b = await getBoutique(slug);
  if (!b) return { title: 'Boutique introuvable · Vermeil' };

  const titre = `${b.nom} · Vermeil`;
  const description = b.description || 'Créations uniques, faites main au Bénin.';
  return {
    title: titre,
    description,
    openGraph: {
      title: titre,
      description,
      images: b.logo_url ? [b.logo_url] : [],
    },
  };
}

export default async function PageBoutique({ params }) {
  const { slug } = await params;
  const b = await getBoutique(slug);
  if (!b) notFound();

  const { data: produits } = await supabase
    .from('produits')
    .select('*')
    .eq('boutique_id', b.id)
    .order('created_at', { ascending: false });

  const reseaux = [
    { nom: 'Instagram', url: b.instagram },
    { nom: 'Facebook', url: b.facebook },
    { nom: 'YouTube', url: b.youtube },
  ].filter((r) => r.url);

  const infosBoutique = { id: b.id, nom: b.nom, whatsapp: b.whatsapp };

  return (
    <main style={{ background: '#fff8f1', color: '#3a2a20', minHeight: '100vh', padding: 24 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Link href="/boutiques" style={{ textDecoration: 'underline' }}>
          ← Toutes les boutiques
        </Link>

        <header style={{ textAlign: 'center', marginTop: 20 }}>
          {b.logo_url && (
            <img
              src={b.logo_url}
              alt={b.nom}
              style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: 24 }}
            />
          )}
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '12px 0 4px' }}>{b.nom}</h1>
          <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>
            {[b.categorie, b.localisation].filter(Boolean).join(' · ')}
          </div>
          <p style={{ marginTop: 12 }}>{b.description}</p>
        </header>

        {b.message_accueil && (
          <div
            style={{
              background: '#fde7d6',
              borderRadius: 14,
              padding: 14,
              margin: '16px 0',
              fontWeight: 600,
            }}
          >
            {b.message_accueil}
          </div>
        )}

        {reseaux.length > 0 && (
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '12px 0' }}>
            {reseaux.map((r) => (
              <a
                key={r.nom}
                href={lien(r.url)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline' }}
              >
                {r.nom}
              </a>
            ))}
          </div>
        )}

        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '24px 0 12px' }}>Les créations</h2>

        {(!produits || produits.length === 0) && <p>Cette boutique n'a pas encore de produits.</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {produits?.map((p) => (
            <CarteProduit key={p.id} p={p} boutique={infosBoutique} />
          ))}
        </div>
      </div>
    </main>
  );
     }
  

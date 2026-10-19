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

const puce = {
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: 999,
  background: 'var(--creme-fonce)',
  color: 'var(--vermeil)',
  fontSize: '0.8rem',
  fontWeight: 700,
};

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
    <main style={{ minHeight: '100vh', padding: '24px 20px 56px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Link href="/boutiques" style={{ fontWeight: 700, color: 'var(--vermeil)' }}>
          ← Toutes les boutiques
        </Link>

        <header
          className="carte"
          style={{
            padding: '28px 20px',
            textAlign: 'center',
            marginTop: 16,
            background: 'linear-gradient(180deg, #fff 0%, var(--creme-fonce) 100%)',
          }}
        >
          {b.logo_url && (
            <img
              src={b.logo_url}
              alt={b.nom}
              style={{
                width: 112,
                height: 112,
                objectFit: 'cover',
                borderRadius: '50%',
                border: '3px solid var(--or)',
              }}
            />
          )}
          <h1
            className="calli"
            style={{ fontSize: '3rem', color: 'var(--vermeil)', lineHeight: 1.1, margin: '12px 0 8px' }}
          >
            {b.nom}
          </h1>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
            {b.categorie && <span style={puce}>{b.categorie}</span>}
            {b.localisation && <span style={puce}>{b.localisation}</span>}
          </div>
          <p style={{ marginTop: 14 }}>{b.description}</p>
        </header>

        {b.message_accueil && (
          <div
            style={{
              margin: '18px 0',
              padding: '14px 16px',
              borderRadius: 16,
              background: '#fff',
              borderLeft: '5px solid var(--or)',
              fontWeight: 700,
              boxShadow: '0 4px 16px rgba(120, 60, 20, 0.06)',
            }}
          >
            <span style={{ color: 'var(--or)' }}>◆ </span>
            {b.message_accueil}
          </div>
        )}

        {reseaux.length > 0 && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', margin: '16px 0' }}>
            {reseaux.map((r) => (
              <a
                key={r.nom}
                href={lien(r.url)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '6px 16px',
                  borderRadius: 999,
                  border: '2px solid var(--vermeil)',
                  color: 'var(--vermeil)',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                {r.nom}
              </a>
            ))}
          </div>
        )}

        <h2
          className="calli"
          style={{ fontSize: '2.4rem', color: 'var(--vermeil)', margin: '28px 0 4px' }}
        >
          Les créations
        </h2>
        <div className="ornement" style={{ margin: '0 0 16px', maxWidth: 160, marginLeft: 0 }}>
          ◆
        </div>

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
              

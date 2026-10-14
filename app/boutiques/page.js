import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Explorer les boutiques · Vermeil',
  description: 'Découvre des créations uniques, faites main au Bénin.',
};

export default async function Boutiques() {
  const { data: boutiques } = await supabase
    .from('boutiques')
    .select('id, slug, nom, description, logo_url, categorie, localisation')
    .eq('masquee', false)
    .order('created_at', { ascending: false });

  return (
    <main style={{ background: '#fff8f1', color: '#3a2a20', minHeight: '100vh', padding: 24 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Link href="/" style={{ textDecoration: 'underline' }}>
          ← Accueil
        </Link>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '16px 0' }}>
          Explorer les boutiques
        </h1>

        <div style={{ display: 'grid', gap: 14 }}>
          {(!boutiques || boutiques.length === 0) && <p>Aucune boutique pour l'instant.</p>}
          {boutiques?.map((b) => (
            <Link
              key={b.id}
              href={`/boutique/${b.slug}`}
              style={{
                display: 'flex',
                gap: 14,
                padding: 14,
                background: '#fff',
                borderRadius: 16,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {b.logo_url ? (
                <img
                  src={b.logo_url}
                  alt={b.nom}
                  style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 14 }}
                />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: 14, background: '#fde7d6' }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{b.nom}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                  {[b.categorie, b.localisation].filter(Boolean).join(' · ')}
                </div>
                <p
                  style={{
                    margin: '6px 0 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {b.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

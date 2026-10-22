import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Explorer les boutiques · Vybénia ',
  description: 'Découvre des créations uniques, faites main au Bénin.',
};

const puce = {
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: 999,
  background: 'var(--creme-fonce)',
  color: 'var(--vermeil)',
  fontSize: '0.75rem',
  fontWeight: 700,
};

export default async function Boutiques() {
  const { data: boutiques } = await supabase
    .from('boutiques')
    .select('id, slug, nom, description, logo_url, categorie, localisation')
    .eq('masquee', false)
    .order('created_at', { ascending: false });

  return (
    <main style={{ minHeight: '100vh', padding: '24px 20px 56px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Link href="/" style={{ fontWeight: 700, color: 'var(--vermeil)' }}>
          ← Accueil
        </Link>

        <header style={{ textAlign: 'center', margin: '20px 0 28px' }}>
          <h1
            className="calli"
            style={{ fontSize: '3rem', color: 'var(--vermeil)', lineHeight: 1.1 }}
          >
            Explorer les boutiques
          </h1>
          <div className="ornement">◆</div>
          <p style={{ opacity: 0.8 }}>
            Des créateurs béninois, des pièces uniques faites main.
          </p>
        </header>

        <div style={{ display: 'grid', gap: 16 }}>
          {(!boutiques || boutiques.length === 0) && (
            <p style={{ textAlign: 'center' }}>Aucune boutique pour l'instant.</p>
          )}

          {boutiques?.map((b) => (
            <Link
              key={b.id}
              href={`/boutique/${b.slug}`}
              className="carte"
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                padding: 14,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {b.logo_url ? (
                <img
                  src={b.logo_url}
                  alt={b.nom}
                  style={{
                    width: 76,
                    height: 76,
                    objectFit: 'cover',
                    borderRadius: 18,
                    border: '2px solid var(--or)',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  className="calli"
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 18,
                    background: 'var(--creme-fonce)',
                    color: 'var(--vermeil)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '2.6rem',
                    flexShrink: 0,
                  }}
                >
                  {b.nom.charAt(0).toUpperCase()}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{b.nom}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '4px 0' }}>
                  {b.categorie && <span style={puce}>{b.categorie}</span>}
                  {b.localisation && <span style={puce}>{b.localisation}</span>}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    opacity: 0.85,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {b.description}
                </p>
              </div>

              <span style={{ color: 'var(--or)', fontSize: '1.6rem' }}>›</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
                    }

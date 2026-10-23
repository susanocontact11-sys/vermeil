import Link from 'next/link';
import { connection } from 'next/server';
import { supabase } from '@/lib/supabase';

// Ordre d'affichage des catégories (les autres viendront après)
const ORDRE = ['Bijoux', 'Perles', 'T-shirts personnalisés', 'Autre'];

// Réglages de la "recommandation" simple
const MAX_PAR_RANGEE = 6; // nombre de produits affichés par catégorie
const MAX_PAR_BOUTIQUE = 2; // pour que toutes les boutiques aient leur chance

function melanger(tableau) {
  const t = [...tableau];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

function choisir(produits) {
  const compte = {};
  const resultat = [];
  for (const p of melanger(produits)) {
    const deja = compte[p.boutiques.id] || 0;
    if (deja >= MAX_PAR_BOUTIQUE) continue;
    compte[p.boutiques.id] = deja + 1;
    resultat.push(p);
    if (resultat.length >= MAX_PAR_RANGEE) break;
  }
  return resultat;
}

function formaterPrix(prix) {
  return `${new Intl.NumberFormat('fr-FR').format(prix)} F`;
}

export default async function VitrineProduits() {
  await connection(); // la vitrine est recalculée à chaque visite

  const { data } = await supabase
    .from('produits')
    .select('id, nom, prix, image_url, categorie, boutiques!inner(id, nom, slug, masquee)')
    .eq('disponible', true)
    .eq('boutiques.masquee', false)
    .order('created_at', { ascending: false })
    .limit(300);

  const produits = (data || []).filter((p) => p.boutiques && p.image_url);
  if (produits.length === 0) return null;

  const parCategorie = {};
  for (const p of produits) {
    const cat = p.categorie || 'Autre';
    (parCategorie[cat] ||= []).push(p);
  }

  const categories = [
    ...ORDRE.filter((c) => parCategorie[c]),
    ...Object.keys(parCategorie).filter((c) => !ORDRE.includes(c)),
  ];

  return (
    <section style={{ padding: '8px 0 32px' }}>
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <h2 className="calli" style={{ fontSize: '2.6rem', color: 'var(--vermeil)', lineHeight: 1.1 }}>
          Découvrez les créations
        </h2>
        <div className="ornement">◆</div>
      </div>

      {categories.map((cat) => {
        const choix = choisir(parCategorie[cat]);
        return (
          <div key={cat} style={{ marginTop: 20 }}>
            <h3
              className="calli"
              style={{ fontSize: '1.9rem', color: 'var(--vermeil)', padding: '0 24px' }}
            >
              {cat}
            </h3>

            <div className="rangee">
              {choix.map((p) => (
                <Link
                  key={p.id}
                  href={`/boutique/${p.boutiques.slug}`}
                  className="carte"
                  style={{
                    flex: '0 0 150px',
                    scrollSnapAlign: 'start',
                    overflow: 'hidden',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  <img
                    src={p.image_url}
                    alt={p.nom}
                    loading="lazy"
                    style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }}
                  />
                  <div style={{ padding: 10 }}>
                    <div
                      style={{
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {p.nom}
                    </div>
                    <div style={{ color: 'var(--vermeil)', fontWeight: 800 }}>
                      {formaterPrix(p.prix)}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        opacity: 0.7,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      par {p.boutiques.nom}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      <div style={{ maxWidth: 420, margin: '24px auto 0', padding: '0 24px' }}>
        <Link href="/boutiques" className="bouton bouton-contour">
          Voir toutes les boutiques
        </Link>
      </div>
    </section>
  );
}

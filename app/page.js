import Link from 'next/link';
import VitrineProduits from '@/components/VitrineProduits';
function Point({ children }) {
  return (
    <li style={{ display: 'flex', gap: 10, marginTop: 10 }}>
      <span style={{ color: 'var(--or)' }}>◆</span>
      <span>{children}</span>
    </li>
  );
}
// Remets ici ton numéro WhatsApp : indicatif 229 + numéro, sans + ni espaces
const NUMERO_WHATSAPP = '2290193517846';
const MESSAGE = "Bonjour Vermeil, j'ai besoin d'aide.";

export default function Accueil() {
  return (
    <main>
      <section className="hero">
        <div className="apparition">
          <div className="calli hero-v">V</div>
          <div className="calli" style={{ fontSize: '2.6rem', color: 'var(--vermeil)', marginTop: -8 }}>
            Vermeil
          </div>
          <div className="ornement">◆</div>
          <h1
            className="texte-degrade"
            style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.25 }}
          >
            Fait main au Bénin.
            <br />
            Chaque création est unique.
          </h1>
          <p style={{ maxWidth: 420, margin: '16px auto', opacity: 0.85 }}>
            Ici, on n'achète pas un simple produit : on vit une expérience unique, née des mains
            de jeunes créateurs béninois.
          </p>
          <div className="fleche">↓</div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: 420, margin: '0 auto', display: 'grid', gap: 16 }}>
          <Link href="/boutiques" className="bouton">
            Explorer les boutiques
            <span className="sous-titre">Trouve ton premier objet unique</span>
          </Link>
          <Link href="/connexion" className="bouton bouton-or">
            Créer ma mini boutique
            <span className="sous-titre">Fais découvrir tes créations au monde</span>
          </Link>
          <Link href="/gerer" className="bouton bouton-contour">
            Gérer ma boutique
          </Link>
        </div>
      </section>
                    <section style={{ padding: '8px 24px 40px' }}>
        <div style={{ maxWidth: 420, margin: '0 auto', display: 'grid', gap: 20 }}>
          <div className="carte" style={{ padding: 20 }}>
            <h2 className="calli" style={{ fontSize: '2rem', color: 'var(--vermeil)' }}>
              Pourquoi acheter sur Vermeil ?
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <Point>Des pièces uniques : chaque création est faite à la main, pas en série.</Point>
              <Point>Tu parles directement au créateur sur WhatsApp : questions, personnalisation, tout est possible.</Point>
              <Point>Tu t'arranges avec lui pour la livraison et le paiement, simplement.</Point>
              <Point>Tu soutiens de jeunes talents béninois.</Point>
            </ul>
          </div>

          <div className="carte" style={{ padding: 20 }}>
            <h2 className="calli" style={{ fontSize: '2rem', color: 'var(--vermeil)' }}>
              Pourquoi créer et vendre sur Vermeil ?
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <Point>Ouvre ta boutique en quelques minutes, depuis ton téléphone, gratuitement pour démarrer.</Point>
              <Point>Tu as un lien rien qu'à toi à partager sur WhatsApp, Instagram ou TikTok.</Point>
              <Point>Les commandes arrivent dans ton espace, avec le contact du client prêt sur WhatsApp.</Point>
              <Point>Tu restes libre : tes prix, tes produits, tes clients.</Point>
            </ul>
          </div>
        </div>
      </section>

      <footer style={{ padding: '8px 24px 56px', textAlign: 'center' }}>
        <a
          href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontWeight: 700, textDecoration: 'underline' }}
        >
          Service client (WhatsApp)
        </a>
      </footer>
    </main>
  );
              }

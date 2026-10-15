import Link from 'next/link';

// Remets ici ton numéro WhatsApp : indicatif 229 + numéro, sans + ni espaces
const NUMERO_WHATSAPP = '229XXXXXXXXXX';
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

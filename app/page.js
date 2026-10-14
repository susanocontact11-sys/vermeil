import Link from 'next/link';
import { Great_Vibes } from 'next/font/google';

const calli = Great_Vibes({ subsets: ['latin'], weight: '400' });

// Remplace par ton numéro WhatsApp : indicatif 229 + numéro, sans + ni espaces
const NUMERO_WHATSAPP = '22993517846';
const MESSAGE = "Bonjour, j'ai besoin d'aide.";

const bouton = {
  display: 'block',
  padding: '16px 20px',
  borderRadius: 14,
  background: '#b3261e',
  color: '#fff',
  textDecoration: 'none',
  textAlign: 'center',
  fontWeight: 700,
};

const sousTitre = { display: 'block', fontWeight: 400, fontSize: '0.85rem', opacity: 0.9 };

export default function Accueil() {
  return (
    <main style={{ background: '#fff8f1', color: '#3a2a20' }}>
      <section
        style={{
          minHeight: '100svh',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <div>
          <div
            className={calli.className}
            style={{ fontSize: '9rem', lineHeight: 1, color: '#b3261e' }}
          >
            V
          </div>
          <h1
            style={{
              fontSize: '1.4rem',
              background: 'linear-gradient(90deg, #b3261e, #e08a00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Fait main au Bénin. Chaque création est unique.
          </h1>
          <p style={{ maxWidth: 420, margin: '16px auto' }}>
            Ici, on n'achète pas un simple produit : on vit une expérience
            unique, née des mains de jeunes créateurs béninois.
          </p>
          <p style={{ fontSize: '2rem', margin: 0 }}>↓</p>
        </div>
      </section>

      <section style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 420, margin: '0 auto', display: 'grid', gap: 14 }}>
          <Link href="/boutiques" style={bouton}>
            Explorer les boutiques
            <span style={sousTitre}>Trouve ton premier objet unique</span>
          </Link>
          <Link href="/connexion" style={bouton}>
            Créer ma mini boutique
            <span style={sousTitre}>Fais découvrir tes créations au monde</span>
          </Link>
          <Link href="/gerer" style={bouton}>
            Gérer ma boutique
          </Link>
        </div>
      </section>

      <footer style={{ padding: '24px 24px 48px', textAlign: 'center' }}>
        <a
          href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#3a2a20', fontWeight: 600 }}
        >
          Service client (WhatsApp)
        </a>
      </footer>
    </main>
  );
            }

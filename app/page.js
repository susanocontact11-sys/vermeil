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

const NUMERO_WHATSAPP = '22993517846';
const MESSAGE = "Bonjour, j'ai besoin d'aide.";
const LIEN_CHAINE_WHATSAPP = 'https://whatsapp.com/channel/0029VbEEiFIBPzjc62etI53X';

export default function Accueil() {
  return (
    <main>
      <section className="hero">
        <div className="apparition">
          <div className="calli hero-v">V</div>
          <div className="calli" style={{ fontSize: '2.6rem', color: 'var(--vermeil)', marginTop: -8 }}>
            Vybénia
          </div>
          <div className="ornement">◆</div>
          <p style={{ color: 'var(--or)', fontWeight: 800, letterSpacing: '0.15em', fontSize: '0.8rem', margin: 0 }}>
            FAIT MAIN AU BÉNIN
          </p>
          <h1
            className="texte-degrade"
            style={{ fontSize: '1.7rem', fontWeight: 800, lineHeight: 1.2, marginTop: 8 }}
          >
            Trouvez des créations qui ont une histoire.
          </h1>
          <p style={{ maxWidth: 420, margin: '16px auto', opacity: 0.85 }}>
            Explorez des pièces uniques, rencontrez des créateurs passionnés et trouvez des
            produits qui vous ressemblent. Derrière chaque création, il y a une idée, un
            savoir-faire et une histoire.
          </p>
          <div className="fleche">↓</div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: 420, margin: '0 auto', display: 'grid', gap: 16 }}>
          <Link href="/boutiques" className="bouton">
            Explorer les boutiques
            <span className="sous-titre">Trouvez votre premier objet unique</span>
          </Link>
          <Link href="/connexion?mode=inscription" className="bouton bouton-or">
            Créer ma mini boutique
            <span className="sous-titre">Faites découvrir vos créations au monde</span>
          </Link>
          <Link href="/gerer" className="bouton bouton-contour">
            Gérer ma boutique
          </Link>
        </div>
      </section>

      <VitrineProduits />

      <section style={{ padding: '8px 24px 40px' }}>
        <div style={{ maxWidth: 420, margin: '0 auto', display: 'grid', gap: 20 }}>
          <div className="carte" style={{ padding: 20 }}>
            <h2 className="calli" style={{ fontSize: '2rem', color: 'var(--vermeil)' }}>
              Pourquoi acheter sur Vybénia ?
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <Point>Explorez, laissez-vous surprendre et soutenez les talents qui font vivre la créativité au Bénin.</Point>
              <Point>Des pièces faites à la main, uniques, qui ne ressemblent à aucune production en série.</Point>
              <Point>Échangez directement avec le créateur sur WhatsApp : posez vos questions, demandez une personnalisation.</Point>
            </ul>
          </div>

          <div className="carte" style={{ padding: 20 }}>
            <h2 className="calli" style={{ fontSize: '2rem', color: 'var(--vermeil)' }}>
              Pourquoi vendre sur Vybénia ?
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <Point>Créez votre boutique créative en quelques clics.</Point>
              <Point>Votre savoir-faire mérite d'être vu. Créez votre boutique sur Vybénia, présentez vos produits et donnez à vos créations la visibilité qu'elles méritent.</Point>
              <Point>Présentez vos créations, développez votre audience et échangez directement avec vos futurs clients.</Point>
            </ul>
          </div>
        </div>
      </section>

      <footer style={{ padding: '8px 24px 56px', textAlign: 'center' }}>
        <a
          href={LIEN_CHAINE_WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="bouton bouton-contour"
          style={{ maxWidth: 420, margin: '0 auto 20px' }}
        >
          Suivre les nouveautés sur WhatsApp
        </a>
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

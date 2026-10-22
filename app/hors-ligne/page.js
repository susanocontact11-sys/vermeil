export default function HorsLigne() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
      <div>
        <h1 className="calli" style={{ fontSize: '3rem', color: 'var(--vermeil)' }}>Pas de connexion</h1>
        <p>Vérifie ton réseau, puis réessaie.</p>
        <a href="/" className="bouton" style={{ marginTop: 16 }}>Réessayer</a>
      </div>
    </main>
  );
}

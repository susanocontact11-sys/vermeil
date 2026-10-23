'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const champ = {
  width: '100%',
  padding: 10,
  border: '1.5px solid var(--bordure)',
  borderRadius: 12,
  background: '#fff',
  color: 'var(--encre)',
  fontSize: '1rem',
};
const etiquette = { display: 'grid', gap: 4, fontWeight: 700, fontSize: '0.9rem' };

const puce = {
  display: 'inline-block',
  padding: '1px 8px',
  borderRadius: 999,
  background: 'var(--creme-fonce)',
  color: 'var(--vermeil)',
  fontSize: '0.7rem',
  fontWeight: 700,
};

function formaterPrix(prix) {
  return `${new Intl.NumberFormat('fr-FR').format(prix)} F`;
}

function nettoyerNumero(numero) {
  const chiffres = numero.replace(/\D/g, '');
  return chiffres.startsWith('229') ? chiffres : `229${chiffres}`;
}

export default function CarteProduit({ p, boutique }) {
  const [ouvert, setOuvert] = useState(false);
  const [form, setForm] = useState({ nom: '', whatsapp: '', quartier: '', quantite: 1, note: '' });
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState('');
  const [commande, setCommande] = useState(null);

  function maj(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function envoyer(e) {
    e.preventDefault();
    setErreur('');

    const numero = nettoyerNumero(form.whatsapp);
    if (numero.length < 11) {
      setErreur('Numéro WhatsApp trop court. Vérifie-le.');
      return;
    }

    const quantite = Math.max(1, parseInt(form.quantite, 10) || 1);
    setEnvoi(true);

    // Pas de .select() ici : le client n'a pas le droit de relire la commande
    const { error } = await supabase.from('commandes').insert({
      boutique_id: boutique.id,
      produit_id: p.id,
      produit_nom: p.nom,
      prix: p.prix,
      quantite,
      client_nom: form.nom.trim(),
      client_whatsapp: numero,
      client_quartier: form.quartier.trim() || null,
      note: form.note.trim() || null,
    });

    setEnvoi(false);
    if (error) {
      setErreur(error.message);
      return;
    }
    setCommande({ quantite, nom: form.nom.trim(), quartier: form.quartier.trim() });
  }

  let lienWhatsApp = '';
  if (commande) {
    const message =
      `Bonjour ${boutique.nom}, je viens de commander sur Vybénia  : ` +
      `${commande.quantite} × ${p.nom} (${formaterPrix(p.prix * commande.quantite)}). ` +
      `Je m'appelle ${commande.nom}` +
      (commande.quartier ? `, quartier ${commande.quartier}.` : '.');
    lienWhatsApp = `https://wa.me/${boutique.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  return (
    <div
      className="carte"
      style={{
        overflow: 'hidden',
        opacity: p.disponible ? 1 : 0.6,
        gridColumn: ouvert ? '1 / -1' : 'auto',
      }}
    >
      {p.image_url && (
        <img
          src={p.image_url}
          alt={p.nom}
          loading="lazy"
          style={{
            width: '100%',
            aspectRatio: ouvert ? '16 / 10' : '1 / 1',
            objectFit: 'cover',
          }}
        />
      )}

      <div style={{ padding: 12 }}>
        {p.categorie && <span style={puce}>{p.categorie}</span>}
        <div style={{ fontWeight: 800, marginTop: 4 }}>{p.nom}</div>
        <div style={{ color: 'var(--vermeil)', fontWeight: 800, fontSize: '1.05rem' }}>
          {formaterPrix(p.prix)}
        </div>
        {p.description && ouvert && <p style={{ margin: '6px 0' }}>{p.description}</p>}
        {p.delai_fabrication && (
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Délai : {p.delai_fabrication}</div>
        )}

        {!p.disponible && (
          <div style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: 4 }}>Indisponible</div>
        )}

        {p.disponible && !ouvert && (
          <button
            onClick={() => setOuvert(true)}
            className="bouton"
            style={{ width: '100%', marginTop: 10, padding: '10px 12px', fontSize: '0.95rem' }}
          >
            Commander
          </button>
        )}

        {ouvert && !commande && (
          <form onSubmit={envoyer} style={{ display: 'grid', gap: 12, marginTop: 14 }}>
            <label style={etiquette}>
              Votre nom
              <input style={champ} name="nom" value={form.nom} onChange={maj} required />
            </label>
            <label style={etiquette}>
              Votre numéro WhatsApp
              <input
                style={champ}
                name="whatsapp"
                value={form.whatsapp}
                onChange={maj}
                inputMode="tel"
                placeholder="Ex : 0197000000"
                required
              />
            </label>
            <label style={etiquette}>
              Quartier de livraison
              <input style={champ} name="quartier" value={form.quartier} onChange={maj} />
            </label>
            <label style={etiquette}>
              Quantité
              <input
                style={champ}
                name="quantite"
                type="number"
                min="1"
                max="20"
                value={form.quantite}
                onChange={maj}
                required
              />
            </label>
            <label style={etiquette}>
              Précision (taille, couleur, message…)
              <textarea
                style={{ ...champ, minHeight: 60 }}
                name="note"
                value={form.note}
                onChange={maj}
              />
            </label>

            <button
              type="submit"
              disabled={envoi}
              className="bouton"
              style={{ width: '100%', opacity: envoi ? 0.6 : 1 }}
            >
              {envoi ? 'Envoi…' : 'Envoyer ma commande'}
            </button>
            <button
              type="button"
              onClick={() => setOuvert(false)}
              style={{ textDecoration: 'underline', fontWeight: 700 }}
            >
              Annuler
            </button>
            {erreur && <p style={{ color: 'crimson' }}>{erreur}</p>}
          </form>
        )}

        {commande && (
          <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
            <p style={{ fontWeight: 800 }}>Commande envoyée ✅</p>
            <p style={{ fontSize: '0.9rem' }}>
              Le créateur la verra dans son espace. Vous pouvez aussi le prévenir sur
              WhatsApp :
            </p>
            <a
              href={lienWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="bouton"
              style={{
                background: 'linear-gradient(135deg, #2bb463, #1f8f4d)',
                boxShadow: '0 6px 16px rgba(31, 143, 77, 0.25)',
              }}
            >
              Prévenir le créateur sur WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
  

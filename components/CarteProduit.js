'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const champ = {
  width: '100%',
  padding: 10,
  border: '1px solid #c9b8a8',
  borderRadius: 10,
  background: '#fff',
  color: '#3a2a20',
  fontSize: '1rem',
};
const etiquette = { display: 'grid', gap: 4, fontWeight: 600, fontSize: '0.9rem' };

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
      `Bonjour ${boutique.nom}, je viens de commander sur Vermeil : ` +
      `${commande.quantite} × ${p.nom} (${formaterPrix(p.prix * commande.quantite)}). ` +
      `Je m'appelle ${commande.nom}` +
      (commande.quartier ? `, quartier ${commande.quartier}.` : '.');
    lienWhatsApp = `https://wa.me/${boutique.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
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

      <div style={{ padding: 10 }}>
        <div style={{ fontWeight: 700 }}>{p.nom}</div>
        <div>{formaterPrix(p.prix)}</div>
        {p.description && ouvert && <p style={{ margin: '6px 0' }}>{p.description}</p>}
        {p.delai_fabrication && (
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Délai : {p.delai_fabrication}</div>
        )}

        {!p.disponible && <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Indisponible</div>}

        {p.disponible && !ouvert && (
          <button
            onClick={() => setOuvert(true)}
            style={{
              marginTop: 8,
              width: '100%',
              padding: 10,
              borderRadius: 12,
              background: '#b3261e',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            Commander
          </button>
        )}

        {ouvert && !commande && (
          <form onSubmit={envoyer} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            <label style={etiquette}>
              Ton nom
              <input style={champ} name="nom" value={form.nom} onChange={maj} required />
            </label>
            <label style={etiquette}>
              Ton numéro WhatsApp
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
              style={{
                padding: 12,
                borderRadius: 12,
                background: '#b3261e',
                color: '#fff',
                fontWeight: 700,
                opacity: envoi ? 0.6 : 1,
              }}
            >
              {envoi ? 'Envoi…' : 'Envoyer ma commande'}
            </button>
            <button
              type="button"
              onClick={() => setOuvert(false)}
              style={{ textDecoration: 'underline' }}
            >
              Annuler
            </button>
            {erreur && <p style={{ color: 'crimson' }}>{erreur}</p>}
          </form>
        )}

        {commande && (
          <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
            <p style={{ fontWeight: 700 }}>Commande envoyée ✅</p>
            <p style={{ fontSize: '0.9rem' }}>
              Le créateur la verra dans son espace. Pour aller plus vite, préviens-le aussi sur
              WhatsApp :
            </p>
            <a
              href={lienWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: 12,
                borderRadius: 12,
                background: '#1f8f4d',
                color: '#fff',
                fontWeight: 700,
                textAlign: 'center',
                textDecoration: 'none',
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
  

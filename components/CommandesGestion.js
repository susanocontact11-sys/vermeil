'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const STATUTS = [
  { valeur: 'recue', libelle: 'Reçue' },
  { valeur: 'en_preparation', libelle: 'En préparation' },
  { valeur: 'livree', libelle: 'Livrée' },
  { valeur: 'annulee', libelle: 'Annulée' },
];

const COULEURS = {
  recue: 'var(--vermeil)',
  en_preparation: 'var(--or)',
  livree: '#1f8f4d',
  annulee: '#9a8c82',
};

function formaterPrix(prix) {
  return `${new Intl.NumberFormat('fr-FR').format(prix)} F`;
}

function formaterDate(iso) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CommandesGestion({ boutique }) {
  const [commandes, setCommandes] = useState([]);
  const [chargement, setChargement] = useState(true);

  async function charger() {
    setChargement(true);
    const { data } = await supabase
      .from('commandes')
      .select('*')
      .eq('boutique_id', boutique.id)
      .order('created_at', { ascending: false });
    setCommandes(data || []);
    setChargement(false);
  }

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boutique.id]);

  async function changerStatut(c, statut) {
    const { error } = await supabase.from('commandes').update({ statut }).eq('id', c.id);
    if (error) {
      alert(error.message);
      return;
    }
    setCommandes(commandes.map((x) => (x.id === c.id ? { ...x, statut } : x)));
  }

  const nouvelles = commandes.filter((c) => c.statut === 'recue').length;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="calli" style={{ fontSize: '2.2rem', color: 'var(--vermeil)' }}>
          Mes commandes
        </h2>
        <button
          onClick={charger}
          style={{ textDecoration: 'underline', fontWeight: 700, color: 'var(--vermeil)' }}
        >
          Actualiser
        </button>
      </div>
      {nouvelles > 0 && (
        <p style={{ fontWeight: 800, color: 'var(--vermeil)' }}>
          {nouvelles} nouvelle{nouvelles > 1 ? 's' : ''} commande{nouvelles > 1 ? 's' : ''} à traiter
        </p>
      )}

      <div style={{ display: 'grid', gap: 14, marginTop: 12 }}>
        {chargement && <p>Chargement…</p>}
        {!chargement && commandes.length === 0 && (
          <div className="carte" style={{ padding: 20, textAlign: 'center' }}>
            Aucune commande pour l'instant. Partage ton lien pour en recevoir !
          </div>
        )}

        {commandes.map((c) => {
          const message =
            `Bonjour ${c.client_nom}, c'est ${boutique.nom} sur Vybénia . ` +
            `J'ai bien reçu ta commande : ${c.quantite} × ${c.produit_nom}.`;
          const lien = `https://wa.me/${c.client_whatsapp}?text=${encodeURIComponent(message)}`;
          const couleur = COULEURS[c.statut] || COULEURS.recue;

          return (
            <div
              key={c.id}
              className="carte"
              style={{ padding: 16, borderLeft: `6px solid ${couleur}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontWeight: 800 }}>
                  {c.quantite} × {c.produit_nom}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7, whiteSpace: 'nowrap' }}>
                  {formaterDate(c.created_at)}
                </div>
              </div>

              <div style={{ color: 'var(--vermeil)', fontWeight: 800 }}>
                Total : {formaterPrix(c.prix * c.quantite)}
              </div>

              <div style={{ marginTop: 8 }}>
                {c.client_nom}
                {c.client_quartier ? ` · ${c.client_quartier}` : ''}
              </div>
              {c.note && <div style={{ fontStyle: 'italic', opacity: 0.85 }}>« {c.note} »</div>}

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 12 }}>
                <select
                  value={c.statut}
                  onChange={(e) => changerStatut(c, e.target.value)}
                  style={{
                    padding: 10,
                    borderRadius: 12,
                    border: `2px solid ${couleur}`,
                    background: '#fff',
                    color: 'var(--encre)',
                    fontWeight: 700,
                  }}
                >
                  {STATUTS.map((s) => (
                    <option key={s.valeur} value={s.valeur}>
                      {s.libelle}
                    </option>
                  ))}
                </select>

                <a
                  href={lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bouton"
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    fontSize: '0.9rem',
                    background: 'linear-gradient(135deg, #2bb463, #1f8f4d)',
                    boxShadow: '0 6px 16px rgba(31, 143, 77, 0.25)',
                  }}
                >
                  Contacter sur WhatsApp
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
    }
            

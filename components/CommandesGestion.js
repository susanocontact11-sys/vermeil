'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const STATUTS = [
  { valeur: 'recue', libelle: 'Reçue' },
  { valeur: 'en_preparation', libelle: 'En préparation' },
  { valeur: 'livree', libelle: 'Livrée' },
  { valeur: 'annulee', libelle: 'Annulée' },
];

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
    <section style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
          Mes commandes{nouvelles > 0 ? ` (${nouvelles} nouvelle${nouvelles > 1 ? 's' : ''})` : ''}
        </h2>
        <button onClick={charger} style={{ textDecoration: 'underline' }}>
          Actualiser
        </button>
      </div>

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        {chargement && <p>Chargement…</p>}
        {!chargement && commandes.length === 0 && <p>Aucune commande pour l'instant.</p>}

        {commandes.map((c) => {
          const message =
            `Bonjour ${c.client_nom}, c'est ${boutique.nom} sur Vermeil. ` +
            `J'ai bien reçu ta commande : ${c.quantite} × ${c.produit_nom}.`;
          const lien = `https://wa.me/${c.client_whatsapp}?text=${encodeURIComponent(message)}`;

          return (
            <div
              key={c.id}
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: 14,
                border: c.statut === 'recue' ? '2px solid #b3261e' : '2px solid transparent',
              }}
            >
              <div style={{ fontWeight: 700 }}>
                {c.quantite} × {c.produit_nom}
              </div>
              <div>Total : {formaterPrix(c.prix * c.quantite)}</div>
              <div style={{ marginTop: 6 }}>
                Client : {c.client_nom}
                {c.client_quartier ? ` · ${c.client_quartier}` : ''}
              </div>
              {c.note && <div style={{ fontStyle: 'italic' }}>« {c.note} »</div>}
              <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: 4 }}>
                {formaterDate(c.created_at)}
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
                <select
                  value={c.statut}
                  onChange={(e) => changerStatut(c, e.target.value)}
                  style={{
                    padding: 8,
                    borderRadius: 10,
                    border: '1px solid #c9b8a8',
                    background: '#fff',
                    color: '#3a2a20',
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
                  style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: '#1f8f4d',
                    color: '#fff',
                    fontWeight: 700,
                    textDecoration: 'none',
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
  

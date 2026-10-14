'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { compresserImage } from '@/lib/image';

const champ = {
  width: '100%',
  padding: 12,
  border: '1px solid #c9b8a8',
  borderRadius: 10,
  background: '#fff',
  color: '#3a2a20',
  fontSize: '1rem',
};
const etiquette = { display: 'grid', gap: 6, fontWeight: 600 };

function formaterPrix(prix) {
  return `${new Intl.NumberFormat('fr-FR').format(prix)} F`;
}

export default function ProduitsGestion({ boutique, user }) {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [form, setForm] = useState({ nom: '', prix: '', description: '', delai: '' });
  const [photo, setPhoto] = useState(null);
  const [apercu, setApercu] = useState('');
  const [cle, setCle] = useState(0); // sert à vider le champ photo
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    async function charger() {
      const { data } = await supabase
        .from('produits')
        .select('*')
        .eq('boutique_id', boutique.id)
        .order('created_at', { ascending: false });
      setProduits(data || []);
      setChargement(false);
    }
    charger();
  }, [boutique.id]);

  function maj(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function choisirPhoto(e) {
    const f = e.target.files[0];
    if (!f) return;
    setPhoto(f);
    setApercu(URL.createObjectURL(f));
  }

  async function ajouter(e) {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      const blob = await compresserImage(photo, 1000);
      const chemin = `${user.id}/produit-${Date.now()}.webp`;
      const { error: errUp } = await supabase.storage
        .from('images')
        .upload(chemin, blob, { contentType: 'image/webp' });
      if (errUp) throw errUp;
      const image_url = supabase.storage.from('images').getPublicUrl(chemin).data.publicUrl;

      const { data, error } = await supabase
        .from('produits')
        .insert({
          boutique_id: boutique.id,
          nom: form.nom.trim(),
          prix: parseInt(form.prix, 10),
          description: form.description.trim() || null,
          delai_fabrication: form.delai.trim() || null,
          image_url,
        })
        .select()
        .single();
      if (error) throw error;

      setProduits([data, ...produits]);
      setForm({ nom: '', prix: '', description: '', delai: '' });
      setPhoto(null);
      setApercu('');
      setCle(cle + 1);
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue');
    }
    setEnvoi(false);
  }

  async function basculerDispo(p) {
    const { error } = await supabase
      .from('produits')
      .update({ disponible: !p.disponible })
      .eq('id', p.id);
    if (error) {
      alert(error.message);
      return;
    }
    setProduits(produits.map((x) => (x.id === p.id ? { ...x, disponible: !p.disponible } : x)));
  }

  async function supprimer(p) {
    if (!confirm(`Supprimer « ${p.nom} » ?`)) return;
    const { error } = await supabase.from('produits').delete().eq('id', p.id);
    if (error) {
      alert(error.message);
      return;
    }
    if (p.image_url && p.image_url.includes('/images/')) {
      const chemin = p.image_url.split('/images/')[1];
      await supabase.storage.from('images').remove([chemin]);
    }
    setProduits(produits.filter((x) => x.id !== p.id));
  }

  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Mes produits</h2>

      <form onSubmit={ajouter} style={{ display: 'grid', gap: 14, marginTop: 12 }}>
        <label style={etiquette}>
          Nom du produit
          <input style={champ} name="nom" value={form.nom} onChange={maj} required />
        </label>

        <label style={etiquette}>
          Prix (en FCFA)
          <input
            style={champ}
            name="prix"
            type="number"
            inputMode="numeric"
            min="0"
            value={form.prix}
            onChange={maj}
            required
          />
        </label>

        <label style={etiquette}>
          Photo
          <input key={cle} type="file" accept="image/*" onChange={choisirPhoto} required />
          {apercu && (
            <img
              src={apercu}
              alt="Aperçu"
              style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12 }}
            />
          )}
        </label>

        <label style={etiquette}>
          Description (facultatif)
          <textarea
            style={{ ...champ, minHeight: 70 }}
            name="description"
            value={form.description}
            onChange={maj}
          />
        </label>

        <label style={etiquette}>
          Délai de fabrication (facultatif)
          <input
            style={champ}
            name="delai"
            value={form.delai}
            onChange={maj}
            placeholder="Ex : 3 jours"
          />
        </label>

        <button
          type="submit"
          disabled={envoi}
          style={{
            padding: 14,
            borderRadius: 14,
            background: '#b3261e',
            color: '#fff',
            fontWeight: 700,
            opacity: envoi ? 0.6 : 1,
          }}
        >
          {envoi ? 'Ajout en cours…' : 'Ajouter ce produit'}
        </button>
        {erreur && <p style={{ color: 'crimson' }}>{erreur}</p>}
      </form>

      <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        {chargement && <p>Chargement…</p>}
        {!chargement && produits.length === 0 && <p>Aucun produit pour l'instant.</p>}
        {produits.map((p) => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              gap: 12,
              padding: 12,
              background: '#fff',
              borderRadius: 14,
              opacity: p.disponible ? 1 : 0.6,
            }}
          >
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.nom}
                style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10 }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{p.nom}</div>
              <div>{formaterPrix(p.prix)}</div>
              <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: '0.9rem' }}>
                <button onClick={() => basculerDispo(p)} style={{ textDecoration: 'underline' }}>
                  {p.disponible ? 'Marquer indisponible' : 'Remettre en vente'}
                </button>
                <button
                  onClick={() => supprimer(p)}
                  style={{ textDecoration: 'underline', color: 'crimson' }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
            }
    

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { compresserImage } from '@/lib/image';

const CATEGORIES = ['Bijoux', 'Perles', 'T-shirts personnalisés', 'Autre'];

const champ = {
  width: '100%',
  padding: 12,
  border: '1.5px solid var(--bordure)',
  borderRadius: 12,
  background: '#fff',
  color: 'var(--encre)',
  fontSize: '1rem',
};
const etiquette = { display: 'grid', gap: 6, fontWeight: 700 };

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

export default function ProduitsGestion({ boutique, user }) {
  const categorieParDefaut = CATEGORIES.includes(boutique.categorie) ? boutique.categorie : 'Autre';

  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [form, setForm] = useState({
    nom: '',
    prix: '',
    description: '',
    delai: '',
    categorie: categorieParDefaut,
  });
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
          categorie: form.categorie,
          image_url,
        })
        .select()
        .single();
      if (error) throw error;

      setProduits([data, ...produits]);
      setForm({ nom: '', prix: '', description: '', delai: '', categorie: form.categorie });
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
    <section>
      <h2 className="calli" style={{ fontSize: '2.2rem', color: 'var(--vermeil)' }}>
        Ajouter un produit
      </h2>

      <form
        onSubmit={ajouter}
        className="carte"
        style={{ display: 'grid', gap: 14, padding: 18, marginTop: 8 }}
      >
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
          Catégorie
          <select style={champ} name="categorie" value={form.categorie} onChange={maj}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <label style={etiquette}>
          Photo
          <input key={cle} type="file" accept="image/*" onChange={choisirPhoto} required />
          {apercu && (
            <img
              src={apercu}
              alt="Aperçu"
              style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 14 }}
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
          className="bouton"
          style={{ width: '100%', opacity: envoi ? 0.6 : 1 }}
        >
          {envoi ? 'Ajout en cours…' : 'Ajouter ce produit'}
        </button>
        {erreur && <p style={{ color: 'crimson' }}>{erreur}</p>}
      </form>

      <h2 className="calli" style={{ fontSize: '2.2rem', color: 'var(--vermeil)', marginTop: 28 }}>
        Mes produits
      </h2>

      <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
        {chargement && <p>Chargement…</p>}
        {!chargement && produits.length === 0 && (
          <div className="carte" style={{ padding: 20, textAlign: 'center' }}>
            Aucun produit pour l'instant.
          </div>
        )}

        {produits.map((p) => (
          <div
            key={p.id}
            className="carte"
            style={{
              display: 'flex',
              gap: 12,
              padding: 12,
              opacity: p.disponible ? 1 : 0.6,
            }}
          >
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.nom}
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 14, flexShrink: 0 }}
              />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              {p.categorie && <span style={puce}>{p.categorie}</span>}
              <div style={{ fontWeight: 800 }}>{p.nom}</div>
              <div style={{ color: 'var(--vermeil)', fontWeight: 800 }}>{formaterPrix(p.prix)}</div>
              {!p.disponible && <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>Indisponible</div>}
              <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: '0.85rem' }}>
                <button
                  onClick={() => basculerDispo(p)}
                  style={{ textDecoration: 'underline', fontWeight: 700 }}
                >
                  {p.disponible ? 'Marquer indisponible' : 'Remettre en vente'}
                </button>
                <button
                  onClick={() => supprimer(p)}
                  style={{ textDecoration: 'underline', fontWeight: 700, color: 'crimson' }}
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
            

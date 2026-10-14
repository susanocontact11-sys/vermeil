'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

function fairesSlug(nom) {
  const base = nom
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffixe = Math.random().toString(36).slice(2, 6);
  return `${base || 'boutique'}-${suffixe}`;
}

function nettoyerNumero(numero) {
  const chiffres = numero.replace(/\D/g, '');
  return chiffres.startsWith('229') ? chiffres : `229${chiffres}`;
}

export default function Creer() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    nom: '',
    description: '',
    categorie: 'Bijoux',
    whatsapp: '',
    instagram: '',
    facebook: '',
    youtube: '',
    localisation: '',
  });
  const [logo, setLogo] = useState(null);
  const [apercu, setApercu] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/connexion');
        return;
      }
      const u = data.session.user;
      const { data: existante } = await supabase
        .from('boutiques')
        .select('id')
        .eq('owner_id', u.id)
        .maybeSingle();
      if (existante) {
        router.replace('/gerer');
        return;
      }
      setUser(u);
    }
    init();
  }, [router]);

  function maj(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function choisirLogo(e) {
    const f = e.target.files[0];
    if (!f) return;
    setLogo(f);
    setApercu(URL.createObjectURL(f));
  }

  async function envoyer(e) {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      let logo_url = null;
      if (logo) {
        const blob = await compresserImage(logo, 400);
        const chemin = `${user.id}/logo-${Date.now()}.webp`;
        const { error: errUp } = await supabase.storage
          .from('images')
          .upload(chemin, blob, { contentType: 'image/webp' });
        if (errUp) throw errUp;
        logo_url = supabase.storage.from('images').getPublicUrl(chemin).data.publicUrl;
      }

      const { error } = await supabase.from('boutiques').insert({
        owner_id: user.id,
        slug: fairesSlug(form.nom),
        nom: form.nom.trim(),
        description: form.description.trim(),
        categorie: form.categorie,
        whatsapp: nettoyerNumero(form.whatsapp),
        instagram: form.instagram.trim() || null,
        facebook: form.facebook.trim() || null,
        youtube: form.youtube.trim() || null,
        localisation: form.localisation.trim() || null,
        logo_url,
      });
      if (error) throw error;
      router.push('/gerer');
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue');
      setChargement(false);
    }
  }

  if (!user) return <p style={{ padding: 20 }}>Chargement…</p>;

  return (
    <main style={{ background: '#fff8f1', color: '#3a2a20', minHeight: '100vh', padding: 24 }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Créer ma mini boutique</h1>

        <form onSubmit={envoyer} style={{ display: 'grid', gap: 16, marginTop: 16 }}>
          <label style={etiquette}>
            Nom de la boutique
            <input style={champ} name="nom" value={form.nom} onChange={maj} required />
          </label>

          <label style={etiquette}>
            Description
            <textarea
              style={{ ...champ, minHeight: 90 }}
              name="description"
              value={form.description}
              onChange={maj}
              placeholder="Qui es-tu, que crées-tu ?"
              required
            />
          </label>

          <label style={etiquette}>
            Catégorie
            <select style={champ} name="categorie" value={form.categorie} onChange={maj}>
              <option>Bijoux</option>
              <option>Perles</option>
              <option>T-shirts personnalisés</option>
              <option>Autre</option>
            </select>
          </label>

          <label style={etiquette}>
            Logo
            <input type="file" accept="image/*" onChange={choisirLogo} />
            {apercu && (
              <img
                src={apercu}
                alt="Aperçu du logo"
                style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 12 }}
              />
            )}
          </label>

          <label style={etiquette}>
            Numéro WhatsApp
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
            Lien Instagram (facultatif)
            <input style={champ} name="instagram" value={form.instagram} onChange={maj} />
          </label>
          <label style={etiquette}>
            Lien Facebook (facultatif)
            <input style={champ} name="facebook" value={form.facebook} onChange={maj} />
          </label>
          <label style={etiquette}>
            Lien YouTube (facultatif)
            <input style={champ} name="youtube" value={form.youtube} onChange={maj} />
          </label>

          <label style={etiquette}>
            Localisation
            <input
              style={champ}
              name="localisation"
              value={form.localisation}
              onChange={maj}
              placeholder="Ex : Cotonou, Calavi…"
            />
          </label>

          <button
            type="submit"
            disabled={chargement}
            style={{
              padding: 16,
              borderRadius: 14,
              background: '#b3261e',
              color: '#fff',
              fontWeight: 700,
              opacity: chargement ? 0.6 : 1,
            }}
          >
            {chargement ? 'Création…' : 'Créer ma boutique'}
          </button>

          {erreur && <p style={{ color: 'crimson' }}>{erreur}</p>}
        </form>
      </div>
    </main>
  );
        }
        

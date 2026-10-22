export default function manifest() {
  return {
    name: 'Vermeil',
    short_name: 'Vermeil',
    description: 'Créations uniques, faites main au Bénin.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#fff8f1',
    theme_color: '#b3261e',
    lang: 'fr',
    icons: [
      { src: '/icone/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icone/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icone/512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}

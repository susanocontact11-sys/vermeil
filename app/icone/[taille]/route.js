import { ImageResponse } from 'next/og';
import { iconeV } from '@/lib/iconeV';

const TAILLES = [180, 192, 512];

export async function GET(request, { params }) {
  const { taille } = await params;
  const t = Number(taille);
  if (!TAILLES.includes(t)) return new Response('Introuvable', { status: 404 });

  return new ImageResponse(iconeV(t), {
    width: t,
    height: t,
    headers: { 'Cache-Control': 'public, max-age=86400' },
  });
}

export async function compresserImage(file, tailleMax = 1000, qualite = 0.8) {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, tailleMax / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * ratio);
  canvas.height = Math.round(bitmap.height * ratio);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Compression impossible'))),
      'image/webp',
      qualite
    );
  });
}

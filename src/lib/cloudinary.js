const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'civiclens';

/**
 * Unsigned upload (browser-safe). Requires an unsigned upload preset in Cloudinary
 * named like VITE_CLOUDINARY_UPLOAD_PRESET (default: civiclens).
 * @returns {Promise<Record<string, unknown>>} Full Cloudinary upload API JSON (secure_url, public_id, etc.)
 */
export async function uploadImageToCloudinary(file) {
  if (!cloudName?.trim()) {
    throw new Error(
      'Missing VITE_CLOUDINARY_CLOUD_NAME. Add it to your .env file.',
    );
  }

  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', uploadPreset.trim());

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`,
    { method: 'POST', body },
  );

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      json?.error?.message ||
      json?.error ||
      `Upload failed (${res.status})`;
    throw new Error(typeof msg === 'string' ? msg : 'Upload failed');
  }

  return json;
}

export function isCloudinaryConfigured() {
  return Boolean(cloudName?.trim());
}

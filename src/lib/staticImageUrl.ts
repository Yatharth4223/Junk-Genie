/**
 * Vite: PNG import is a string URL. Next.js: it's StaticImageData with `.src`.
 * Use this for native <img src={...} />.
 */
export function staticImageUrl(
  img: string | { src: string }
): string {
  return typeof img === "string" ? img : img.src;
}

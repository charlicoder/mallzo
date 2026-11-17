// Serve Amazon product photos straight from Amazon's CDN at the size needed, instead of downloading
// the 1500px original and re-encoding it on our server (the Next image optimizer): fewer hops, smaller files.
const SIZES = [240, 360, 480, 640, 800, 1080, 1500];

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!/^https:\/\/m\.media-amazon\.com\//.test(src)) return src;
  const w = SIZES.find((s) => s >= width) ?? 1500;
  // …/I/61DNOMiZpvL._AC_SL1500_.jpg  ->  …/I/61DNOMiZpvL._AC_UL480_.jpg
  return src.replace(/\._[^/]*_\.(jpe?g|png|webp)$/i, `._AC_UL${w}_.$1`);
}

export default function LogoImg({ src, name, className = '' }) {
  if (!src) return null;
  return <img src={src} alt={name} loading="lazy" className={className} />;
}

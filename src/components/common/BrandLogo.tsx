export default function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}cleanmaster-logo.png`}
      alt=""
      width={40}
      height={40}
      className={`size-10 shrink-0 rounded-xl object-contain ${className}`}
    />
  )
}

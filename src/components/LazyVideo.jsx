import useIntersectionObserver from '../hooks/useIntersectionObserver'

export default function LazyVideo({ src, poster, className = '' }) {
  const [ref, isVisible] = useIntersectionObserver()

  return (
    <video
      ref={ref}
      loop
      muted
      playsInline
      autoPlay={isVisible}
      preload="none"
      src={isVisible ? src : undefined}
      poster={poster}
      className={className}
      onCanPlay={(e) => { if (isVisible) e.target.play().catch(() => {}) }}
    />
  )
}

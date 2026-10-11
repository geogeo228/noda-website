// Плавный переход к блоку по якорю без перезагрузки страницы. Тем, кто в
// системе отключил анимацию, прокручиваем сразу, без «проезда».
export function scrollBehavior() {
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 'auto'
  return 'smooth'
}

export function goTo(e, hash) {
  e.preventDefault()
  document.querySelector(hash)?.scrollIntoView({ behavior: scrollBehavior() })
}

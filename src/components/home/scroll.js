// Плавный переход к блоку по якорю без перезагрузки страницы.
export function goTo(e, hash) {
  e.preventDefault()
  document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
}

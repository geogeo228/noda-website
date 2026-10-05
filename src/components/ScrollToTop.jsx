import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Переход по ссылке на другую страницу начинается сверху. Без этого роутер
// сохранял прокрутку: из карточки кейса внизу главной статья открывалась
// с середины, а метка «дочитал» срабатывала сразу. Кнопку «назад» (POP)
// не трогаем — там браузер возвращает прежнюю позицию.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return null
}

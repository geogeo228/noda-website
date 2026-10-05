import { useEffect, useRef } from 'react'

// Зовёт onRead один раз, когда метка в конце текста попала в экран и читатель
// при этом прокручивал страницу. Без условия про прокрутку короткая статья на
// большом мониторе засчитывалась бы дочитанной сразу после открытия.
// key — сброс при переходе на другую статью (компонент Article не
// пересоздаётся, когда меняется только slug).
export function useReadToEnd(ref, key, onRead) {
  const callback = useRef(onRead)
  callback.current = onRead

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined

    let inView = false
    let scrolled = false
    let done = false

    const check = () => {
      if (done || !inView || !scrolled) return
      done = true
      cleanup()
      callback.current()
    }
    // Считается только прокрутка после открытия статьи, а не унаследованная
    // позиция страницы
    const onScroll = () => {
      scrolled = true
      check()
    }

    const observer = new IntersectionObserver((entries) => {
      inView = entries.some((e) => e.isIntersecting)
      check()
    })
    observer.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })

    function cleanup() {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
    return cleanup
  }, [ref, key])
}

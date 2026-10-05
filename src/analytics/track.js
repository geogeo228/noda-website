// Событие в Umami. Звать только из обработчиков и эффектов, не на рендере:
// при пререндере window нет. Скрипта Umami может не быть (блокировщик,
// английская версия без счётчика) — тогда вызов ничего не делает.
// Исключение внутри трекера не должно ломать клик по ссылке.
export function track(name, data) {
  if (typeof window === 'undefined') return
  try {
    const umami = window.umami
    if (!umami || typeof umami.track !== 'function') return
    if (data === undefined) umami.track(name)
    else umami.track(name, data)
  } catch {
    // аналитика не важнее заявки
  }
}

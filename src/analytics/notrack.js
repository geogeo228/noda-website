// Свои заходы не считаем: ?notrack=1 в адресе ставит флаг Umami
// umami.disabled в localStorage этого браузера, ?notrack=0 снимает. Через
// адрес — потому что на телефоне нет консоли, где выставить флаг руками.
export function applyNoTrack(search, storage) {
  const notrack = new URLSearchParams(search).get('notrack')
  try {
    if (notrack === '1') {
      storage && storage.setItem('umami.disabled', '1')
      return true
    }
    if (notrack === '0') {
      storage && storage.removeItem('umami.disabled')
      return true
    }
  } catch {}
  return false
}

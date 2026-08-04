import ru from './ru'
import en from './en'
import { origins, enIsLive } from './config'

// Язык фиксируется на сборке, а не переключается в рантайме: русская и
// английская версии живут на разных доменах (noda-auto.com и en.noda-auto.com),
// каждая собирается своей командой. Так у каждой страницы один язык, один
// canonical и никакой мигающей подмены контента после гидрации.
//
//   npm run build       -> русская версия
//   npm run build:en    -> английская
export const lang = import.meta.env.VITE_LANG === 'en' ? 'en' : 'ru'

const dictionaries = { ru, en }

export const t = dictionaries[lang]

export const origin = origins[lang]

export { origins, enIsLive }

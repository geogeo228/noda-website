// Перелинковка: проверка, что до каждой страницы можно дойти по ссылкам.
//
// Карта сайта говорит поисковику, какие адреса существуют, но вес страницы
// он считает по входящим ссылкам. Страница без них индексируется неохотно
// и ранжируется почти никак. 11 октября 2026 у нас так жили сразу
// /giorgi (ни одной входящей ссылки) и 14 статей из 15 (главная вела
// только на одну из них, остальные держались на списке блога).
//
// Функция чистая и ничего не читает с диска: вызывает её verify-prerender.js,
// у которого HTML всех страниц уже в руках.

// Один и тот же адрес в разметке пишется тремя способами: относительно,
// со слешем на конце и полностью с доменом. Приводим к одному виду, иначе
// страж объявит сиротой связанную страницу — и его справедливо отключат.
function normalize(href) {
  let path = href.trim()

  const schemeless = path.replace(/^https?:\/\/[^/]+/, '')
  if (schemeless !== path) path = schemeless || '/'

  const hash = path.indexOf('#')
  if (hash !== -1) path = path.slice(0, hash)
  const query = path.indexOf('?')
  if (query !== -1) path = path.slice(0, query)

  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  return path === '' ? '/' : path
}

/**
 * @param {{path: string, html: string}[]} pages
 * @returns {string[]} по строке на каждую страницу без входящих ссылок
 */
export function gradeOrphans(pages) {
  const linked = new Set()

  for (const { path, html } of pages) {
    const self = normalize(path)
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const target = normalize(match[1])
      // Ссылка на себя не считается входящей: canonical и «наверх» ведут
      // на ту же страницу, и с ними сирота притворилась бы связанной.
      if (target !== self) linked.add(target)
    }
  }

  const found = []
  for (const { path } of pages) {
    // Главная — точка входа: на неё ведут внешние ссылки и прямой ввод
    // адреса, требовать входящую ссылку с самого сайта бессмысленно.
    if (normalize(path) === '/') continue
    if (!linked.has(normalize(path))) {
      found.push(`на ${path} не ведёт ни одна ссылка внутри сайта — поисковик её почти не увидит`)
    }
  }
  return found
}

/**
 * Статья не сирота — на неё ведёт список блога. Но одна входящая ссылка из
 * списка это всё, что у неё есть, и вес главной до неё не доходит. Поэтому
 * главная ведёт на каждую статью отдельно, а этот страж следит, чтобы блок
 * разборов не усох обратно до одной ссылки, как это уже случилось: из трёх
 * кейсов со статьями два стояли восьмым и девятым, а главная показывала шесть.
 *
 * @param {string} homeHtml готовый HTML главной
 * @param {string[]} articlePaths адреса статей вида /blog/<слаг>
 * @returns {string[]} по строке на каждую статью, до которой главная не ведёт
 */
export function gradeHomepageReach(homeHtml, articlePaths) {
  const linked = new Set(
    [...homeHtml.matchAll(/href="([^"]+)"/g)].map((m) => normalize(m[1])),
  )

  const found = []
  for (const path of articlePaths) {
    if (!linked.has(normalize(path))) {
      found.push(`главная не ведёт на ${path} — статья держится на одной ссылке из списка блога`)
    }
  }
  return found
}

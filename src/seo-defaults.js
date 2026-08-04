// Снимает дефолтные SEO-теги из index.html до первого рендера.
//
// Они там лежат ради краулеров без JS (превью ссылок в Telegram и т.п.),
// но Google страницу рендерит — и видел бы два title и два description
// сразу. Helmet чужие теги не трогает, так что убираем их сами.
export function removeDefaultSeoTags() {
  document.querySelectorAll('[data-default-seo]').forEach((el) => el.remove())
}

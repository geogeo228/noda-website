import { Helmet } from 'react-helmet-async'
import { lang, origins, enIsLive } from '../i18n'

// Общие мета-теги страницы. Собран в одном месте по двум причинам:
// canonical каждой версии должен указывать на себя (иначе языковая версия
// выпадает из индекса как дубль), а hreflang должен стоять на обеих версиях
// и быть взаимным.
//
// title обязательно передаём одной строкой: react-helmet-async 3.0.0 под
// React 19 не склеивает children-массив и вставляет пустой <title>.
// На этом мы уже один раз потеряли заголовки у всех статей блога.
//
// langPair={false} — у страницы нет пары в другой версии (/privacy), hreflang
// ей не ставится; то же решение в routes.js.
export default function Seo({ path = '/', title, description, ogDescription, jsonLd, langPair = true }) {
  const url = origins[lang] + path
  const withHreflang = enIsLive && langPair

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Языковые версии ссылаются друг на друга и на себя. x-default ведёт
          на английскую: для всех, кто не читает по-русски, она и есть версия
          по умолчанию. Появляется только когда поддомен реально живой. */}
      {withHreflang && <link rel="alternate" hrefLang="ru" href={origins.ru + path} />}
      {withHreflang && <link rel="alternate" hrefLang="en" href={origins.en + path} />}
      {withHreflang && <link rel="alternate" hrefLang="x-default" href={origins.en + path} />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:url" content={url} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify({ url, ...jsonLd })}
        </script>
      )}
    </Helmet>
  )
}

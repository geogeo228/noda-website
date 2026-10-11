// Проверяет ЖИВОЙ сайт, а не сборку. scripts/verify-prerender.js смотрит
// файлы на диске и поведения сервера не видит — из-за этого редирект 301
// с канонических URL на версию со слешем всплыл только случайно, вручную.
//
// Запуск:  node scripts/verify-live.js [https://noda-auto.com]
// Коды выхода: 0 — чисто, 1 — есть находки. Годится и для ручного прогона
// после деплоя, и для крона: вывод короткий и человекочитаемый.
import { getRoutes } from '../src/routes.js'
import { origins } from '../src/i18n/config.js'

// Политика обработки данных — документ оператора, а не маркетинговый текст.
// Пока счётчика Метрики нет, политика говорит «не подключена»; в день, когда
// в конфиг впишут номер, она станет ложной, и заметить это глазами некому:
// правка номера — одна строка, тесты от неё не краснеют, сборка проходит.
//
// Поэтому расхождение ловится здесь, на живом сайте: если счётчик в разметке
// есть, а политика утверждает обратное — это находка.
export function gradePolicyMatchesCounters(pageHtml, privacyHtml) {
  const counterOnSite = /ym\(\s*\d+/.test(pageHtml) || /mc\.yandex\.ru/.test(pageHtml)
  const policyDeniesIt = /Метрика[^.]*не подключена/i.test(privacyHtml)

  if (counterOnSite && policyDeniesIt) {
    return [
      'счётчик Метрики стоит на сайте, а политика утверждает, что он не подключён — ' +
        'политику и дату её редакции надо обновить тем же релизом',
    ]
  }

  return []
}

// Доступ роботов проверяется отдельно от robots.txt: разрешающий robots
// ничего не гарантирует, потому что блокировка живёт уровнем выше — в nginx
// или у Cloudflare. На 5 октября 2026 GPTBot, ClaudeBot, PerplexityBot
// и YandexBot получали 200, и эта проверка фиксирует состояние, чтобы его
// молча не потеряли при следующей правке конфига.
//
// Любой код кроме 200 — находка, включая переадресацию: 302 на заглушку
// выглядит как успех, а содержимое роботу подменено.
export function gradeCrawlerAccess(samples) {
  const found = []

  for (const { ua, path, status } of samples) {
    if (status !== 200) {
      found.push(`робот ${ua} получил ${status} на ${path} — страница ему недоступна`)
    }
  }

  return found
}

// Чистая функция: принимает уже собранные ответы и выносит приговор.
// Отделена от сети, чтобы её можно было проверить тестами без прода.
export function gradeLive(pages, extras) {
  const problems = []

  for (const page of pages) {
    if (page.status === 301 || page.status === 302) {
      problems.push(
        `${page.path}: сервер отдаёт ${page.status} на ${page.redirect || 'другой адрес'}. ` +
          'Это канонический URL — он указан в sitemap и в canonical, и редирект с него ' +
          'отправляет поисковик по кругу подсказок.',
      )
      continue
    }

    if (page.status !== 200) {
      problems.push(`${page.path}: сервер отдаёт ${page.status}, а страница должна существовать.`)
      continue
    }

    if (!page.title || page.title.trim().length === 0) {
      problems.push(`${page.path}: пустой <title> в ответе сервера, без выполнения JS.`)
      continue
    }

    if (page.title !== page.expectedTitle) {
      problems.push(
        `${page.path}: заголовок живого сайта "${page.title}" не совпадает ` +
          `с объявленным в routes.js "${page.expectedTitle}".`,
      )
    }
  }

  const nf = extras?.notFound
  if (nf) {
    if (nf.status === 200) {
      problems.push(
        'несуществующий URL отдаёт 200 — это soft 404: для поисковика страница-призрак ' +
          'выглядит валидной и попадает в индекс как мусор.',
      )
    } else if (nf.status !== 404) {
      problems.push(`несуществующий URL отдаёт ${nf.status}, ожидался 404.`)
    }

    if (!nf.hasNoindex) {
      problems.push('страница 404 не содержит <meta name="robots" content="noindex">.')
    }
  }

  return problems
}

function titleOf(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/)
  if (!m) return ''
  return m[1]
    .trim()
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

async function fetchPage(url) {
  // redirect: manual — редирект здесь не удобство, а находка: нам важно
  // увидеть именно первый ответ по каноническому адресу.
  const res = await fetch(url, { redirect: 'manual' })
  const html = res.status === 200 ? await res.text() : ''
  return { status: res.status, redirect: res.headers.get('location') || '', html }
}

async function main() {
  const origin = process.argv[2] || origins.ru
  const lang = origin === origins.en ? 'en' : 'ru'
  const routes = getRoutes(lang)

  console.log(`Проверяю живой сайт: ${origin} (${routes.length} страниц)\n`)

  const pages = []
  for (const route of routes) {
    const { status, redirect, html } = await fetchPage(origin + route.path)
    pages.push({
      path: route.path,
      status,
      redirect,
      title: titleOf(html),
      expectedTitle: route.title,
    })
  }

  const missing = await fetchPage(`${origin}/no-such-page-${Date.now()}`)
  const notFoundPage = missing.status === 404 ? await fetch(`${origin}/404.html`).then((r) => r.text()).catch(() => '') : missing.html
  const notFound = {
    status: missing.status,
    hasNoindex: /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(notFoundPage),
  }

  // Роботы проверяются на четырёх путях: главная, статья, robots.txt
  // и sitemap.xml. Одного пути мало — блокировку настраивают по шаблону,
  // и главная часто остаётся открытой, когда статьи уже закрыты. Браузерная
  // строка в списке не для красоты: без неё «робот получил 200» не с чем
  // сравнить, и тест на различие робота с браузером был бы пустым.
  //
  // Чего эта проверка НЕ видит: блокировку по IP или по проверенным ботам
  // у Cloudflare. Мы приходим со своего адреса и только подменяем строку
  // браузера, так что в nginx блокировка по этой строке поймается, а по
  // адресу — нет.
  const crawlerUAs = ['GPTBot/1.2', 'ClaudeBot/1.0', 'PerplexityBot/1.0', 'YandexBot/3.0']
  const browserUA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0 Safari/537.36'
  const article = routes.find((r) => r.path.startsWith('/blog/'))?.path || '/blog'
  const crawlerPaths = ['/', article, '/robots.txt', '/sitemap.xml']
  const samples = []

  for (const ua of [...crawlerUAs, browserUA]) {
    for (const path of crawlerPaths) {
      const res = await fetch(origin + path, {
        headers: { 'user-agent': ua },
        redirect: 'manual',
        signal: AbortSignal.timeout(15000),
      }).catch(() => ({ status: 0 }))
      samples.push({ ua: ua.split('/')[0], path, status: res.status })
    }
  }

  // Политика — на живом сайте, а не в сборке: её выпускает соседняя ветка,
  // и расхождение возникает именно между выкаченным кодом и выкаченным текстом.
  const privacy = await fetchPage(`${origin}/privacy`)
  const homeHtml = (await fetchPage(origin + '/')).html

  const problems = [
    ...gradeLive(pages, { notFound }),
    ...gradeCrawlerAccess(samples),
    ...gradePolicyMatchesCounters(homeHtml, privacy.html),
  ]

  if (problems.length === 0) {
    console.log(`✓ Живой сайт в порядке: ${routes.length} страниц отдаются с кодом 200 и своими заголовками, несуществующий URL — 404 с noindex, ${crawlerUAs.length} робота отвечают кодом 200 там же, где браузер, политика не расходится со счётчиками`)
    return
  }

  console.error(`Находок: ${problems.length}\n`)
  for (const p of problems) console.error(`  ✗ ${p}`)
  console.error('')
  process.exit(1)
}

if (process.argv[1] && process.argv[1].endsWith('verify-live.js')) {
  main().catch((error) => {
    console.error('Проверка живого сайта упала:', error.message)
    process.exit(1)
  })
}

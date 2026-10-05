import { StrictMode } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Writable } from 'node:stream'
import App from './App'

// Страницы подключены через lazy(). Синхронный renderToString не стал бы
// ждать динамический импорт и отдал бы пустой div из Suspense fallback —
// ровно ту пустую страницу, от которой мы уходим. renderToPipeableStream
// с onAllReady дожидается разрешения импортов и только потом отдаёт разметку.
//
// HelmetProvider здесь нужен лишь для того, чтобы компонент Seo не падал:
// его вывод мы не используем, метатеги пререндер берёт из src/routes.js.
export function render(url) {
  return new Promise((resolve, reject) => {
    const chunks = []

    const sink = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk))
        callback()
      },
    })

    sink.on('finish', () => resolve(Buffer.concat(chunks).toString('utf8')))
    sink.on('error', reject)

    const { pipe, abort } = renderToPipeableStream(
      <StrictMode>
        <HelmetProvider>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      </StrictMode>,
      {
        onAllReady() {
          pipe(sink)
        },
        onError(error) {
          abort()
          reject(error)
        },
      },
    )
  })
}

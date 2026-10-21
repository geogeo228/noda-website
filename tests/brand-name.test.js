import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// 21.10.2026 сайт переименован NODA → Green Pill, старое имя убрано полностью.
// Ветки, начатые до переименования, при вливании молча вернут «NODA» на сайт —
// страж ловит его в любом видимом тексте. Пропускаются только комментарии,
// домен noda-auto.com и имена в коде вроде WhyNoda (они не NODA капсом).
const ROOTS = ['src', 'scripts', 'index.html']
const EXT = /\.(jsx?|html|css)$/

function files(p) {
  if (statSync(p).isFile()) return [p]
  return readdirSync(p).flatMap((n) => files(join(p, n)))
}

const isComment = (line) => /^\s*(\/\/|\/?\*)/.test(line)

test('старое имя NODA не вернулось в видимые тексты', () => {
  const hits = []
  for (const f of ROOTS.flatMap(files).filter((f) => EXT.test(f))) {
    readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      if (isComment(line)) return
      if (/NODA|noda@matrix/.test(line)) hits.push(`${f}:${i + 1}: ${line.trim()}`)
    })
  }
  assert.deepEqual(hits, [], 'на сайте снова NODA, бренд теперь Green Pill:\n' + hits.join('\n'))
})

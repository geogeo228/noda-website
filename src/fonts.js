// Шрифты лежат на нашем сервере, а не на fonts.googleapis.com: так IP
// посетителя не уходит в Google, и политике не о чем молчать. Каждый файл
// подключает все алфавиты через unicode-range — браузер скачает только
// нужные (кириллицу и латиницу).
import '@fontsource/exo-2/300.css'
import '@fontsource/exo-2/400.css'
import '@fontsource/exo-2/500.css'
import '@fontsource/exo-2/600.css'
import '@fontsource/exo-2/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/600.css'
import '@fontsource/jetbrains-mono/700.css'

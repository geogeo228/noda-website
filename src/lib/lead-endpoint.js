// Адрес воркера заявок (worker/lead-form). Вынесен отдельно от lead.js:
// тот читают Node и воркер, а import.meta.env есть только в сборке Vite.
// Переопределяется на сборке: VITE_LEAD_ENDPOINT=http://localhost:8787 npm run dev
export const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || 'https://lead.noda-auto.com/'

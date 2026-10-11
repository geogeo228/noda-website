import { t } from '../i18n'

// Цифра в шапке. Раньше досчитывала от нуля, но в пререндеренном HTML
// стояли нули: их видели поисковые роботы и все, у кого JS ещё не загрузился.
// Решение Георгия 11.10.2026 — сразу итоговое число, без анимации.
// prefix нужен для значений вроде «от 3 дней».
export default function CountUp({ to, prefix = '', suffix = '' }) {
  return (
    <span className="v1-stat-num">
      {prefix}{to.toLocaleString(t.locale)}{suffix}
    </span>
  )
}

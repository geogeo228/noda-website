import { useEffect, useId, useRef, useState } from 'react'
import { t } from '../../i18n'
import { normalizeLead, validateLead, LIMITS } from '../../lib/lead'
import { LEAD_ENDPOINT } from '../../lib/lead-endpoint'
import { track } from '../../analytics/track'
import { leadTracking } from '../../analytics/leadTracking'

export const TELEGRAM = 'https://t.me/BlueFaceBaby99'

const EMPTY = { name: '', contact: '', task: '', consent: false }

// Заявка в три поля для собственника бизнеса: имя, как связаться, что болит,
// плюс согласие на обработку персональных данных (152-ФЗ). Уходит в воркер
// worker/lead-form, оттуда Георгию в Telegram.
//
// Галочка согласия по умолчанию снята: предзаполненная согласием не считается.
//
// Пререндер: на сервере форма рисуется целиком, но с неактивной кнопкой.
// До гидрации отправка нативным GET унесла бы имя и телефон в адрес страницы
// (и в аналитику), а неактивная кнопка отключает и отправку по Enter.
export default function LeadForm({ where = 'home', slug }) {
  const l = t.home.lead
  const ev = leadTracking(where, slug)
  const uid = useId()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done | failed
  const [ready, setReady] = useState(false)
  const openedAt = useRef(0)
  const honeypot = useRef(null)

  useEffect(() => {
    openedAt.current = Date.now()
    setReady(true)
  }, [])

  function set(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
    // Ошибка исчезает, как только поле поправили, а не при следующей отправке
    if (errors[field]) setErrors(({ [field]: _, ...rest }) => rest)
  }

  async function submit(e) {
    e.preventDefault()
    if (status === 'sending') return

    const lead = normalizeLead(values)
    const found = validateLead(lead)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...lead,
          website: honeypot.current?.value || '',
          elapsed: Date.now() - openedAt.current,
          page: window.location.pathname,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setStatus('done')
        track(ev.submit, Object.keys(ev.data).length ? ev.data : undefined)
      } else if (res.status === 400 && data.errors) {
        setErrors(data.errors)
        setStatus('idle')
        track(ev.error, { ...ev.data, reason: 'invalid' })
      } else {
        setStatus('failed')
        track(ev.error, { ...ev.data, reason: 'server' })
      }
    } catch {
      setStatus('failed')
      track(ev.error, { ...ev.data, reason: 'network' })
    }
  }

  if (status === 'done') {
    return (
      <div className="lead-done" role="status">
        <p className="lead-done-title">{l.successTitle}</p>
        <p className="lead-done-text">{l.successText}</p>
      </div>
    )
  }

  const errorText = (name) => errors[name] && l.errors[name]?.[errors[name]]

  const field = (name, { label, placeholder, optional, ...input }) => {
    const error = errorText(name)
    return (
      <label className={`lead-field lead-field-${name}${error ? ' has-error' : ''}`}>
        <span className="lead-label">
          {label}
          {optional && <span className="lead-optional"> · {l.optional}</span>}
        </span>
        {/* ym-hide-content / ym-disable-keys: Вебвизор Яндекс.Метрики не
            записывает то, что вводят в поле, — так обещает /privacy */}
        <input
          className="lead-input ym-hide-content ym-disable-keys"
          name={name}
          value={values[name]}
          onChange={(e) => set(name, e.target.value)}
          placeholder={placeholder}
          maxLength={LIMITS[name]}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${uid}-err-${name}` : undefined}
          {...input}
        />
        {error && <span className="lead-error" id={`${uid}-err-${name}`}>{error}</span>}
      </label>
    )
  }

  const consentError = errorText('consent')

  return (
    <form className="lead-form" onSubmit={submit} noValidate>
      <div className="lead-row">
        {field('name', { label: l.name, placeholder: l.namePh, autoComplete: 'name' })}
        {field('contact', { label: l.contact, placeholder: l.contactPh, autoComplete: 'tel' })}
      </div>
      {field('task', { label: l.task, placeholder: l.taskPh, optional: true, autoComplete: 'off' })}

      <div className={`lead-consent${consentError ? ' has-error' : ''}`}>
        <input
          type="checkbox"
          id={`${uid}-consent`}
          name="consent"
          checked={values.consent}
          onChange={(e) => set('consent', e.target.checked)}
          aria-invalid={consentError ? 'true' : undefined}
          aria-describedby={consentError ? `${uid}-err-consent` : undefined}
        />
        <label htmlFor={`${uid}-consent`}>
          {l.consentBefore}
          <a href="/privacy" target="_blank" rel="noopener">{l.consentLink}</a>
        </label>
        {consentError && <span className="lead-error" id={`${uid}-err-consent`}>{consentError}</span>}
      </div>

      {/* Ловушка для ботов: человек это поле не видит и не попадает в него с клавиатуры */}
      <div className="lead-hp" aria-hidden="true">
        <label>
          Website
          <input ref={honeypot} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="lead-actions">
        <button className="m-btn lead-submit" type="submit" disabled={!ready || status === 'sending'}>
          {status === 'sending' ? l.sending : l.submit}
        </button>
        <span className="lead-note">{l.note}</span>
      </div>

      {status === 'failed' && (
        <p className="lead-fail" role="alert">
          {l.failText}{' '}
          <a href={TELEGRAM} target="_blank" rel="noopener noreferrer"
            onClick={() => track(ev.telegram, { ...ev.data, place: 'form-error' })}>@BlueFaceBaby99</a>
        </p>
      )}
    </form>
  )
}

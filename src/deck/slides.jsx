import { useDeck } from './ctx'
import { Frame, Tag, AlsoDone, Figure, Phone, Browser } from './parts'
import { Scene } from './scenes'

const A = '/assets/deck'
const TELEGRAM = 'https://t.me/BlueFaceBaby99'

// Все слайды принимают c (свой кусок словаря) и active (слайд на экране).
// Тексты только из словаря; в разметке остаются картинки и подписи интерфейса.

export function Cover({ c }) {
  return (
    <div className="dk-cover">
      <Tag>{c.tag}</Tag>
      <div className="dk-logo dk-reveal" style={{ '--i': 0 }}>
        <span className="dk-logo-br">[</span>GREEN PILL<span className="dk-logo-br">]</span>
        <span className="cursor-blink" />
      </div>
      <h1 className="dk-title dk-reveal" style={{ '--i': 1 }}>{c.title}</h1>
      <p className="dk-text dk-reveal" style={{ '--i': 2 }}>{c.text}</p>
    </div>
  )
}

// Иконки плиток «с кем работаем» — контурные, в стиле остальной вёрстки.
const NICHE_ICONS = [
  // Мероприятия и HR — микрофон.
  <svg key="hr" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="25" y="8" width="14" height="26" rx="7" />
    <path d="M17 29a15 15 0 0 0 30 0" />
    <path d="M32 44v9M23 53h18" />
  </svg>,
  // Фарма и медицина — капсула-крест.
  <svg key="pharma" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="20" width="48" height="24" rx="12" transform="rotate(-45 32 32)" />
    <path d="M26 26l12 12" />
    <path d="M32 25v6M29 28h6" />
  </svg>,
  // B2B, логистика, производство — коробка.
  <svg key="b2b" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M32 8l22 11v26L32 56 10 45V19L32 8z" />
    <path d="M10 19l22 11 22-11M32 30v26" />
  </svg>,
  // Розница, магазины, туризм — тележка.
  <svg key="retail" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 12h7l7 28h24" />
    <path d="M20 20h34l-4 13H23" />
    <circle cx="26" cy="50" r="3.5" />
    <circle cx="43" cy="50" r="3.5" />
  </svg>,
]

export function Niches({ c }) {
  return (
    <div className="dk-col-fill">
      <Tag>{c.tag}</Tag>
      <h2 className="dk-title dk-reveal" style={{ '--i': 0 }}>{c.title}</h2>
      <div className="dk-niches">
        {c.tiles.map((tile, i) => {
          const [head, ...rest] = tile.split(': ')
          return (
            <Frame className="dk-niche dk-reveal" style={{ '--i': i + 1 }} key={tile}>
              <span className="dk-niche-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="dk-niche-i">{NICHE_ICONS[i]}</span>
              <span className="dk-niche-body">
                <span className="dk-niche-t">{head}</span>
                {rest.length > 0 && <span className="dk-niche-s">{rest.join(': ')}</span>}
              </span>
            </Frame>
          )
        })}
      </div>
    </div>
  )
}

// Каркас слайда-кейса: слева текст и цифра, справа картинка.
function CaseLayout({ c, visual, figure = true, className = '' }) {
  return (
    <div className={`dk-case ${className}`}>
      <div className="dk-case-text">
        <Tag>{c.tag}</Tag>
        <h2 className="dk-title dk-reveal" style={{ '--i': 0 }}>{c.title}</h2>
        <p className="dk-text dk-reveal" style={{ '--i': 1 }}>{c.text}</p>
        {figure && c.figure && <Figure>{c.figure}</Figure>}
        <AlsoDone items={c.also} />
      </div>
      <div className="dk-case-visual dk-reveal" style={{ '--i': 2 }}>{visual}</div>
    </div>
  )
}

export function CaseContractors({ c }) {
  return (
    <CaseLayout
      c={c}
      visual={<Browser className="dk-browser-lg" src={`${A}/shot-contractors.webp`} alt={c.title} />}
    />
  )
}

export function CasePassports({ c }) {
  return (
    <CaseLayout
      c={c}
      visual={
        <Browser
          className="dk-browser-lg"
          url="админка участников"
          src={`${A}/rita-admin.webp`}
          alt="Админка сбора данных: 521 участник, выгрузка в Excel, сканы в архиве"
        />
      }
    />
  )
}

const STYLES = ['neon_tokyo', 'retrowave', 'ancient_rome', 'disney', 'madmax', 'royal_ballroom', 'samurai', 'underwater']

export function CasePhotobooth({ c }) {
  const { ui } = useDeck()
  return (
    <CaseLayout
      c={c}
      className="dk-case-photo"
      visual={
        <div className="dk-photo">
          {[
            ['sasha-selfie', 'sasha-space'],
            ['tanya-selfie', 'tanya-cyberpunk'],
          ].map(([from, to]) => (
            <div className="dk-pair" key={from}>
              <figure>
                <img src={`${A}/${from}.webp`} alt="" />
                <figcaption>{ui.selfie}</figcaption>
              </figure>
              <span className="dk-pair-arrow">→</span>
              <figure className="dk-out">
                <img src={`${A}/${to}.webp`} alt="" />
                <figcaption>{ui.portrait}</figcaption>
              </figure>
            </div>
          ))}
          <div className="dk-styles">
            {STYLES.map((s) => (
              <img key={s} src={`${A}/style-${s}.webp`} alt="" />
            ))}
          </div>
        </div>
      }
    />
  )
}

export function CaseSales({ c }) {
  const l = c.leadCard
  return (
    <CaseLayout
      c={c}
      className="dk-case-sales"
      visual={
        <div className="dk-sales">
          <Browser className="dk-browser-sm" url="rbkont.ru" src={`${A}/rbkont-catalog.webp`} alt="Каталог контейнеров на rbkont.ru" />
          <Browser
            className="dk-browser-shot"
            url="rbkont.ru"
            src={`${A}/rbkont-listing.webp`}
            alt="Карточка объявления на rbkont.ru"
          />
          <Phone className="dk-phone-lead">
            <div className="dk-tg">
              <div className="dk-tg-head"><b>{l.chatName}</b></div>
              <div className="dk-tg-card">
                <div className="dk-tg-title">{l.head}</div>
                <div className="dk-tg-row"><em>{l.chat}:</em> {l.chatName}</div>
                <div className="dk-tg-row"><em>{l.msg}:</em> {l.msgText}</div>
                <div className="dk-tg-btns">
                  <span>{l.open}</span>
                  <span className="ok">{l.contact}</span>
                </div>
              </div>
            </div>
          </Phone>
        </div>
      }
    />
  )
}

export function CaseContent({ c }) {
  const { ui } = useDeck()
  return (
    <CaseLayout
      c={c}
      figure={false}
      className="dk-case-bel"
      visual={
        <div className="dk-bel">
          <span className="dk-badge">{ui.ownProject}</span>
          <div className="dk-bel-row">
            <img src={`${A}/bel-source.webp`} alt="" />
            <span className="dk-pair-arrow">→</span>
            <img src={`${A}/bel-model.webp`} alt="" />
            <img className="dk-bel-street" src={`${A}/bel-street.webp`} alt="" />
          </div>
        </div>
      }
    />
  )
}

export function Capabilities({ c, active }) {
  return (
    <div className="dk-col-fill">
      <Tag>{c.tag}</Tag>
      <h2 className="dk-title dk-title-sm dk-reveal" style={{ '--i': 0 }}>{c.title}</h2>
      <div className="dk-tiles">
        {c.tiles.map((tile, i) => (
          <Frame className="dk-tile dk-reveal" style={{ '--i': i + 1 }} key={tile.key}>
            <Scene kind={tile.key} active={active} label={tile.name} />
            <div className="dk-tile-body">
              <span className="dk-tile-name">{tile.name}</span>
              <span className="dk-tile-text">{tile.text}</span>
            </div>
          </Frame>
        ))}
      </div>
      {c.big && <p className="dk-big dk-reveal" style={{ '--i': 5 }}>{c.big}</p>}
    </div>
  )
}

export function Services({ c }) {
  return (
    <div className="dk-col-fill">
      <Tag>{c.tag}</Tag>
      <h2 className="dk-title dk-reveal" style={{ '--i': 0 }}>{c.title}</h2>
      <div className="dk-services">
        {c.cols.map((col, i) => (
          <Frame className="dk-service dk-reveal" style={{ '--i': i + 1 }} key={col.name}>
            <span className="dk-service-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="dk-service-name">{col.name}</span>
            <span className="dk-service-text">{col.text}</span>
          </Frame>
        ))}
      </div>
    </div>
  )
}

export function Why({ c }) {
  return (
    <div className="dk-col-fill">
      <Tag>{c.tag}</Tag>
      <h2 className="dk-title dk-reveal" style={{ '--i': 0 }}>{c.title}</h2>
      <ol className="dk-why">
        {c.items.map((item, i) => (
          <li className="dk-reveal" style={{ '--i': i + 1 }} key={item}>
            <span className="dk-why-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="dk-why-t">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Founder({ c }) {
  return (
    <div className="dk-founder">
      <Frame className="dk-founder-photo dk-reveal" style={{ '--i': 1 }}>
        <img src={`${A}/founder.webp`} alt={c.title} />
      </Frame>
      <div className="dk-founder-text">
        <Tag>{c.tag}</Tag>
        <h2 className="dk-title dk-reveal" style={{ '--i': 0 }}>{c.title}</h2>
        <p className="dk-text dk-text-lg dk-reveal" style={{ '--i': 2 }}>{c.text}</p>
      </div>
    </div>
  )
}

export function Contact({ c }) {
  return (
    <div className="dk-contact">
      <div className="dk-contact-text">
        <Tag>{c.tag}</Tag>
        <h2 className="dk-title dk-reveal" style={{ '--i': 0 }}>{c.title}</h2>
        <p className="dk-free dk-reveal" style={{ '--i': 1 }}>{c.text}</p>
        <div className="dk-contact-lines dk-reveal" style={{ '--i': 2 }}>
          <a href={TELEGRAM} target="_blank" rel="noopener noreferrer">{c.telegram}</a>
          <a href="https://noda-auto.com" target="_blank" rel="noopener noreferrer">{c.site}</a>
        </div>
        <a className="m-btn primary dk-contact-btn dk-reveal" style={{ '--i': 3 }} href={TELEGRAM} target="_blank" rel="noopener noreferrer">
          {c.cta}
        </a>
      </div>
      <a className="dk-qr dk-reveal" style={{ '--i': 2 }} href={TELEGRAM} target="_blank" rel="noopener noreferrer" aria-label={c.telegram}>
        <img src={`${A}/qr-telegram.svg`} alt={`QR: ${c.telegram}`} />
        <span>@BlueFaceBaby99</span>
      </a>
    </div>
  )
}

// Визитка: три результата карточками.
export function Results({ c }) {
  const visuals = [
    <div className="dk-results-pair" key="p">
      <img src={`${A}/sasha-selfie.webp`} alt="" />
      <span>→</span>
      <img src={`${A}/sasha-space.webp`} alt="" />
    </div>,
    <img className="dk-results-shot" key="c" src={`${A}/shot-contractors.webp`} alt="" />,
    <img className="dk-results-shot" key="r" src={`${A}/shot-rbkont.webp`} alt="rbkont.ru" />,
  ]
  return (
    <div className="dk-col-fill">
      <Tag>{c.tag}</Tag>
      <h2 className="dk-title dk-title-sm dk-reveal" style={{ '--i': 0 }}>{c.title}</h2>
      <div className="dk-cards">
        {c.cards.map((card, i) => (
          <Frame className="dk-card dk-reveal" style={{ '--i': i + 1 }} key={card.name}>
            <div className="dk-card-vis">{visuals[i]}</div>
            <div className="dk-card-body">
              <span className="dk-tile-name">{card.name}</span>
              <span className="dk-tile-text">{card.text}</span>
            </div>
          </Frame>
        ))}
      </div>
    </div>
  )
}

export function Together({ c }) {
  const { ui } = useDeck()
  return (
    <div className="dk-together">
      <div className="dk-together-text">
        <Tag>{c.tag}</Tag>
        <h2 className="dk-title dk-reveal" style={{ '--i': 0 }}>{c.title}</h2>
        <p className="dk-text dk-text-lg dk-reveal" style={{ '--i': 1 }}>{c.text}</p>
      </div>
      <div className="dk-together-vis dk-reveal" style={{ '--i': 2 }}>
        <Phone src={`${A}/phone-delegates.webp`} className="dk-phone-sm" />
        <div className="dk-together-pair">
          <figure><img src={`${A}/tanya-selfie.webp`} alt="" /><figcaption>{ui.selfie}</figcaption></figure>
          <span className="dk-pair-arrow dk-down">→</span>
          <figure className="dk-out"><img src={`${A}/tanya-business.webp`} alt="" /><figcaption>{ui.portrait}</figcaption></figure>
        </div>
      </div>
    </div>
  )
}

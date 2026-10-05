// Упрощённые экраны продуктов для карточек кейсов, где нет своего видео.
//
// Почему вёрстка, а не скриншоты: в живых системах лежат реальные данные людей
// (паспорта, телефоны делегатов — 152-ФЗ) и бренды клиентов, которых мы не
// называем. Поэтому экраны собраны по образцу настоящих интерфейсов — их
// устройство и палитра, — но все имена, рейсы и суммы выдуманы. Фирменные цвета
// клиентов заменены нейтральными.
//
// Размеры заданы в cqw от ширины .v1-case-visual: экран масштабируется целиком
// и одинаково выглядит в карточке на десктопе и на телефоне.

function BrowserFrame({ url, children, tone = 'light' }) {
  return (
    <div className={`cs-browser cs-${tone}`}>
      <div className="cs-browser-bar">
        <span className="cs-dot" /><span className="cs-dot" /><span className="cs-dot" />
        <span className="cs-url">{url}</span>
      </div>
      <div className="cs-browser-body">{children}</div>
    </div>
  )
}

function PhoneFrame({ children, tone = 'light' }) {
  return (
    <div className="cs-phone-stage">
      <div className={`cs-phone cs-${tone}`}>{children}</div>
    </div>
  )
}

function Passports() {
  return (
    <BrowserFrame url="anketa-uchastnika.ru/g/3">
      <div className="cs-pasp">
        <div className="cs-pasp-group">Группа 3 · заезд 12.08 — выезд 14.08</div>
        <div className="cs-field"><span>ФИО как в паспорте</span><b>Соколова Анна Викторовна</b></div>
        <div className="cs-row2">
          <div className="cs-field"><span>Дата рождения</span><b>14.03.1988</b></div>
          <div className="cs-field"><span>Серия и номер</span><b>40 12 345678</b></div>
        </div>
        <div className="cs-file">
          <i>✓</i> Группа 03_Соколова Анна Викторовна.pdf
        </div>
        <div className="cs-btn cs-pasp-btn">Отправить</div>
      </div>
    </BrowserFrame>
  )
}

function Delegates() {
  return (
    <PhoneFrame>
      <div className="cs-del">
        <div className="cs-del-head">
          <small>Поездка · 9–12 июля</small>
          <b>Добрый день, Ирина</b>
        </div>
        <div className="cs-del-card">
          <small>Ваш рейс</small>
          <b>9 июля · 08:40</b>
        </div>
        <div className="cs-del-card">
          <small>Трансфер</small>
          <b>10:55 · автобус №2</b>
        </div>
        <div className="cs-del-card cs-del-mgr">
          <small>Ваш менеджер</small>
          <b>Олег Кравцов</b>
          <div className="cs-del-actions"><span>Звонок</span><span>Чат</span></div>
        </div>
        <div className="cs-del-card">
          <small>Программа на сегодня</small>
          <b>14:00 · экскурсия по заводу</b>
        </div>
        <div className="cs-del-next">19:00 — гала-ужин</div>
      </div>
    </PhoneFrame>
  )
}

function ContractorSearch() {
  const rows = [
    ['Отели', 'Казань · 4★ · 120 номеров', 14],
    ['Площадки', 'до 300 гостей', 9],
    ['Кейтеринг', 'банкет на 280 персон', 11],
    ['Трансфер', 'аэропорт — отель', 6],
    ['Ведущие', 'русский и английский', 8],
  ]
  return (
    <BrowserFrame url="podbor.app / тендер">
      <div className="cs-tz">
        <div className="cs-tz-file">
          <span className="cs-tz-doc">PDF</span>
          <div><b>ТЗ_тендер_Казань.pdf</b><small>разобрано на 5 категорий</small></div>
        </div>
        <div className="cs-tz-list">
          {rows.map(([cat, spec, n]) => (
            <div className="cs-tz-row" key={cat}>
              <b>{cat}</b><span>{spec}</span><em>{n} найдено</em>
            </div>
          ))}
        </div>
        <div className="cs-btn cs-tz-btn">Отправить 48 запросов</div>
      </div>
    </BrowserFrame>
  )
}

function AgencyWorkspace() {
  const cols = [
    ['В работе', ['Подтвердить площадку', 'Смета кейтеринга']],
    ['Согласование', ['Программа второго дня']],
    ['Готово', ['Трансфер из аэропорта', 'Бейджи участников']],
  ]
  return (
    <BrowserFrame url="рабочее-пространство / проекты">
      <div className="cs-ws">
        <aside className="cs-ws-side">
          <small>Проекты</small>
          <b className="on">Форум «Север»</b>
          <b>Корпоратив, декабрь</b>
          <b>Выездная сессия</b>
        </aside>
        <div className="cs-ws-main">
          <div className="cs-ws-top">
            <b>Форум «Север»</b>
            <span>У тебя сегодня 3 задачи</span>
          </div>
          <div className="cs-ws-board">
            {cols.map(([name, tasks]) => (
              <div className="cs-ws-col" key={name}>
                <small>{name} · {tasks.length}</small>
                {tasks.map((t) => <div className="cs-ws-task" key={t}>{t}</div>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  )
}

function BrokerChat() {
  return (
    <PhoneFrame tone="tg">
      <div className="cs-tg">
        <div className="cs-tg-head"><b>Подбор недвижимости</b><small>бот</small></div>
        <div className="cs-tg-msgs">
          <div className="cs-msg in">Какой бюджет рассматриваете?<i>23:47</i></div>
          <div className="cs-tg-keys"><span>до 15 млн</span><span>15–30 млн</span><span>30+ млн</span></div>
          <div className="cs-msg out">15–30 млн<i>23:47</i></div>
          <div className="cs-msg in">Держите чеклист покупателя<span className="cs-tg-file">Чеклист_покупателя.pdf</span><i>23:47</i></div>
          <div className="cs-msg in">Оставьте телефон — брокер позвонит в удобное время<i>23:48</i></div>
        </div>
      </div>
    </PhoneFrame>
  )
}

const SCREENS = {
  passports: Passports,
  delegates: Delegates,
  'contractor-search': ContractorSearch,
  'agency-workspace': AgencyWorkspace,
  'broker-chat': BrokerChat,
}

export default function CaseScreen({ name, title }) {
  const Screen = SCREENS[name]
  if (!Screen) return null
  return (
    <div className="cs-root" role="img" aria-label={title}>
      <Screen />
    </div>
  )
}

import { Link } from 'react-router-dom'
import { t } from '../i18n'
import Seo from '../components/Seo'
import { OPERATOR, PRIVACY_UPDATED } from '../data/operator'

// Политика обработки персональных данных (152-ФЗ). Только русская версия:
// маршрут объявлен в routes.js с langPair: false, у английской его нет.
// Перечислены все обработки на сайте: форма заявки, Umami, Яндекс.Метрика
// с Вебвизором. Меняя набор счётчиков или путь заявки — правьте текст здесь
// и дату в src/data/operator.js.
const O = OPERATOR

export default function Privacy() {
  return (
    <div className="blog-root">
      <Seo
        path="/privacy"
        title={t.meta.privacyTitle}
        description={t.meta.privacyDesc}
        langPair={false}
      />

      <header className="blog-header">
        <Link to="/" className="blog-logo">
          <span className="v1-logo-bracket">[</span>
          <span className="v1-logo-text">NODA</span>
          <span className="v1-logo-bracket">]</span>
        </Link>
      </header>

      <main className="article-main privacy">
        <h1 className="article-title">Политика обработки персональных данных</h1>
        <p className="article-desc">
          Коротко: мы спрашиваем только имя и способ связи, чтобы ответить на вашу заявку.
          Заявка хранится в Telegram Георгия, никому не передаётся и в рассылки не попадает.
          Ниже — подробно, включая счётчики посещений.
        </p>

        <section className="article-section">
          <h2 className="article-h2">1. Кто обрабатывает данные</h2>
          <p>
            Оператор персональных данных — {O.fullName} ({O.shortName}), ИНН {O.inn},
            ОГРН {O.ogrn}, адрес: {O.address}. NODA — бренд, под которым ООО «ЭНТОРИ»
            делает проекты по автоматизации.
          </p>
          <p>
            По всем вопросам о ваших данных: Telegram{' '}
            <a href={O.telegramUrl} target="_blank" rel="noopener noreferrer">{O.telegram}</a>{' '}
            или почта {O.email}.
          </p>
        </section>

        <section className="article-section">
          <h2 className="article-h2">2. Форма заявки</h2>
          <p>
            <strong>Что собираем:</strong> имя, телефон или ник в Telegram — то, что вы сами
            впишете, — и, если захотите, одну строку о задаче. Вместе с заявкой фиксируется
            страница, с которой она отправлена.
          </p>
          <p>
            <strong>Зачем:</strong> чтобы ответить на заявку и обсудить вашу задачу. Ни для чего
            другого: без рассылок, без рекламы, без передачи третьим лицам.
          </p>
          <p>
            <strong>Основание:</strong> ваше согласие, которое вы даёте галочкой перед
            отправкой (п. 1 ч. 1 ст. 6 Федерального закона № 152-ФЗ «О персональных данных»).
            Без галочки форма не отправляется.
          </p>
          <p>
            <strong>Где хранится:</strong> заявка проходит через сервер-пересыльщик (Cloudflare
            Workers) и приходит сообщением в Telegram Георгия Андреева, основателя NODA. Пересыльщик
            ничего не сохраняет. Отдельной базы заявок у нас нет — сообщение в Telegram и есть
            единственная копия.
          </p>
          <p>
            <strong>Сколько храним:</strong> пока обсуждаем вашу задачу и ведём работу по ней.
            Если вы отзовёте согласие, удалим заявку и переписку по ней в течение 10 рабочих дней.
          </p>
        </section>

        <section className="article-section">
          <h2 className="article-h2">3. Счётчик посещений Umami</h2>
          <p>
            Чтобы понимать, какие страницы читают и какие кнопки нажимают, на сайте работает
            Umami. Это наша собственная установка (analytics.noda-auto.com), данные не уходят
            сторонней аналитической компании.
          </p>
          <p>
            Umami не ставит cookie и не узнаёт вас при следующем визите. Он записывает открытую
            страницу, откуда вы пришли, тип устройства, браузер, операционную систему и страну,
            а также нажатия на кнопки: «написать в Telegram», «отправить заявку», «дочитал
            статью». То, что вы вводите в форму, в Umami не попадает. IP-адрес в отчётах
            не хранится.
          </p>
        </section>

        <section className="article-section">
          <h2 className="article-h2">4. Яндекс.Метрика и Вебвизор</h2>
          <p>
            На сайте также работает Яндекс.Метрика. Данные она обрабатывает на стороне
            ООО «Яндекс» по его правилам. Метрика ставит cookie и собирает обезличенные сведения
            о визите: страницы, источник перехода, устройство, браузер, примерное
            местоположение по IP-адресу.
          </p>
          <p>
            Вебвизор — часть Метрики — записывает, как вы пользуетесь страницей: прокрутку,
            движения мыши, нажатия. Мы смотрим эти записи, чтобы находить неудобные места
            на сайте. Текст, который вы вводите в поля формы заявки, Вебвизору скрыт.
          </p>
          <p>
            Отказаться можно в любой момент: запретить cookie в настройках браузера, включить
            блокировщик счётчиков или поставить официальное расширение Яндекса для отказа
            от Метрики. Сайт продолжит работать.
          </p>
        </section>

        <section className="article-section">
          <h2 className="article-h2">5. Ваши права и отзыв согласия</h2>
          <p>
            Вы можете узнать, какие ваши данные у нас есть, попросить их исправить или удалить
            и отозвать согласие на обработку. Для этого напишите в Telegram{' '}
            <a href={O.telegramUrl} target="_blank" rel="noopener noreferrer">{O.telegram}</a>{' '}
            или на почту {O.email}. Ответим в течение 10 рабочих дней.
          </p>
          <p>
            Если считаете, что мы нарушаем ваши права, вы вправе обратиться в Роскомнадзор
            или в суд.
          </p>
        </section>

        <section className="article-section">
          <h2 className="article-h2">6. Изменения</h2>
          <p>
            Если мы начнём собирать что-то новое или поменяем способ хранения, обновим этот
            текст. Действующая редакция — от {PRIVACY_UPDATED}.
          </p>
        </section>

        <div className="article-nav">
          <Link to="/">{t.article.home}</Link>
          <Link to="/blog">{t.article.backToBlog}</Link>
        </div>
      </main>

      <footer className="blog-footer">
        <Link to="/">{t.blog.backHome}</Link>
      </footer>
    </div>
  )
}

export default function About() {
  return (
    <section className="v1-section" id="about">
      <div className="v1-sec-head">
        <span className="v1-sec-tag">// 01 &middot; about</span>
        <h2 className="v1-sec-title">Кто ведёт NODA</h2>
      </div>
      <div className="v1-about tframe corners">
        <span className="cnr-tl"></span><span className="cnr-br"></span>
        <div className="v1-about-body">
          <div className="v1-about-avatar">
            <img src="/assets/avatar.jpg" alt="Георгий Андреев" loading="lazy" />
          </div>
          <div className="v1-about-text">
            <div className="v1-about-line"><span className="v1-k">name</span>: <span className="v1-v">"Георгий Андреев"</span>,</div>
            <div className="v1-about-line"><span className="v1-k">role</span>: <span className="v1-v">"Founder"</span>,</div>
            <div className="v1-about-line"><span className="v1-k">bio</span>: <span className="v1-v">"Автоматизирую бизнесы с помощью ИИ. Пишу боты в Telegram, делаю процессы умнее, объясняю сложное простым языком."</span>,</div>
            <div className="v1-about-line"><span className="v1-k">contact</span>: [</div>
            <div className="v1-about-contacts">
              <a className="m-btn" href="https://t.me/BlueFaceBaby99" target="_blank" rel="noopener noreferrer">telegram &rarr; @BlueFaceBaby99</a>
              <a className="m-btn ghost" href="https://max.ru/u/f9LHodD0cOKErTtCwHY7cZOc-FEHHvmgPYuAz8TkKYXkG1W2CFudhSPnnh8" target="_blank" rel="noopener noreferrer">max &rarr;</a>
            </div>
            <div className="v1-about-line">]</div>
          </div>
        </div>
      </div>
    </section>
  )
}

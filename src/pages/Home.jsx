import Seo from '../components/Seo'
import { t, origin } from '../i18n'
import { OPERATOR_JSONLD } from '../data/operator'
import MatrixRain from '../components/MatrixRain'
import HomeHeader from '../components/home/HomeHeader'
import HomeHero from '../components/home/HomeHero'
import Results from '../components/home/Results'
import Analyses from '../components/home/Analyses'
import Services from '../components/home/Services'
import Founder from '../components/home/Founder'
import WhyNoda from '../components/home/WhyNoda'
import HomeCTA from '../components/home/HomeCTA'
import HomeFooter from '../components/home/HomeFooter'
import StickyCta from '../components/home/StickyCta'

// Главная русской версии. Порядок блоков — по разбору презентации от
// 02.07.2026 (вариант A из превью): сначала результаты клиентов, потом что мы
// делаем, кто делает, почему мы, контакт. Английская версия пока остаётся на
// прежней Landing.jsx.
export default function Home() {
  return (
    <div className="v1-root v1-ru">
      <Seo
        path="/"
        title={t.meta.siteTitle}
        description={t.meta.siteDesc}
        ogDescription={t.meta.ogDesc}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Green Pill',
          url: origin,
          description: t.meta.orgDesc,
          contactPoint: { '@type': 'ContactPoint', url: 'https://t.me/BlueFaceBaby99', contactType: 'customer service' },
          ...OPERATOR_JSONLD,
        }}
      />
      <MatrixRain />
      <HomeHeader />
      <main className="v1-main">
        <HomeHero />
        <Results />
        <Services />
        <Founder />
        <WhyNoda />
        <HomeCTA />
        <Analyses />
      </main>
      <HomeFooter />
      <StickyCta />
    </div>
  )
}

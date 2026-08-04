import Seo from '../components/Seo'
import { t, origins } from '../i18n'
import MatrixRain from '../components/MatrixRain'
import Header from '../components/Header'
import Hero from '../components/Hero'
import About from '../components/About'
import Benefits from '../components/Benefits'
import Products from '../components/Products'
import Process from '../components/Process'
import Cases from '../components/Cases'
import Why from '../components/Why'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <div className="v1-root">
      <Seo
        path="/"
        title={t.meta.siteTitle}
        description={t.meta.siteDesc}
        ogDescription={t.meta.ogDesc}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'NODA',
          url: origins.ru,
          description: t.meta.orgDesc,
          contactPoint: { '@type': 'ContactPoint', url: 'https://t.me/BlueFaceBaby99', contactType: 'customer service' },
        }}
      />
      <MatrixRain />
      <Header />
      <main className="v1-main">
        <Hero />
        <About />
        <Benefits />
        <Products />
        <Process />
        <Cases />
        <Why />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

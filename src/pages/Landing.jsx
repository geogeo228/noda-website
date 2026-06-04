import { Helmet } from 'react-helmet-async'
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
      <Helmet>
        <title>NODA — Комплексные IT и ИИ-решения для бизнеса</title>
        <meta name="description" content="Комплексные IT и ИИ-решения для бизнеса. Колдун-Бот для ивентов, мониторинг чатов, кастомные решения." />
        <link rel="canonical" href="https://noda-auto.com/" />
        <meta property="og:title" content="NODA — Комплексные IT и ИИ-решения для бизнеса" />
        <meta property="og:description" content="IT и ИИ-решения. Колдун-Бот, мониторинг чатов, кастомные решения." />
        <meta property="og:url" content="https://noda-auto.com/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "NODA",
          "url": "https://noda-auto.com",
          "description": "Комплексные IT и ИИ-решения для бизнеса",
          "contactPoint": { "@type": "ContactPoint", "url": "https://t.me/BlueFaceBaby99", "contactType": "customer service" }
        })}</script>
      </Helmet>
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

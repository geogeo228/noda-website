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

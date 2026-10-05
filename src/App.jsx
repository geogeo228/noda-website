import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { lang } from './i18n'
import NotFound from './components/NotFound'
import ScrollToTop from './components/ScrollToTop'

// Новая главная пока только у русской версии: английская живёт на своих
// данных и в этот заход не переписывалась.
const Landing = lazy(() => (lang === 'en' ? import('./pages/Landing') : import('./pages/Home')))
const Giorgi = lazy(() => import('./pages/Giorgi'))
const Blog = lazy(() => import('./pages/Blog'))
const Article = lazy(() => import('./pages/Article'))

export default function App() {
  return (
    <Suspense fallback={<div />}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/giorgi" element={<Giorgi />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Article />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

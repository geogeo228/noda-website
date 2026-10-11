import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { lang } from './i18n'
import NotFound from './components/NotFound'

// Новая главная пока только у русской версии: английская живёт на своих
// данных и в этот заход не переписывалась.
const Landing = lazy(() => (lang === 'en' ? import('./pages/Landing') : import('./pages/Home')))
const Giorgi = lazy(() => import('./pages/Giorgi'))
const Blog = lazy(() => import('./pages/Blog'))
const Article = lazy(() => import('./pages/Article'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Company = lazy(() => import('./pages/Company'))

export default function App() {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/giorgi" element={<Giorgi />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Article />} />
        {/* Политика и «О компании» только у русской версии — см. routes.js */}
        {lang === 'ru' && <Route path="/privacy" element={<Privacy />} />}
        {lang === 'ru' && <Route path="/company" element={<Company />} />}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

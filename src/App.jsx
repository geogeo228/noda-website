import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const Landing = lazy(() => import('./pages/Landing'))
const Giorgi = lazy(() => import('./pages/Giorgi'))
const Blog = lazy(() => import('./pages/Blog'))
const Article = lazy(() => import('./pages/Article'))

export default function App() {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/giorgi" element={<Giorgi />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Article />} />
      </Routes>
    </Suspense>
  )
}

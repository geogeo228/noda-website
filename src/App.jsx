import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Giorgi from './pages/Giorgi'
import Blog from './pages/Blog'
import Article from './pages/Article'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/giorgi" element={<Giorgi />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<Article />} />
    </Routes>
  )
}

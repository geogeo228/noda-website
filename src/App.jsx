import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Giorgi from './pages/Giorgi'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/giorgi" element={<Giorgi />} />
    </Routes>
  )
}

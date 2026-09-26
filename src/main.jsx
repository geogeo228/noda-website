import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { removeDefaultSeoTags } from './seo-defaults'
import './styles.css'

removeDefaultSeoTags()

const container = document.getElementById('root')

const tree = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

// В собранной версии разметка уже пришла с сервера — её надо подхватить,
// а не строить заново. При npm run dev пререндера нет, там обычный рендер.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}

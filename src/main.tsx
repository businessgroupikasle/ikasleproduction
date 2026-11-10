import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './app/App'
import './styles/global.css'
// Loaded after global.css on purpose: @import hoists its files above the file's own rules, and these two
// override rules in it (opaque page backgrounds, section decorations), so they must come later.
import './styles/site-fx.css'
import './styles/section-fx.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

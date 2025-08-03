import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import { UserProvider } from './contexts/user'
import ThemeWrapper from './ThemeWrapper'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <ThemeWrapper>
        <App />
      </ThemeWrapper>
    </UserProvider>
  </StrictMode>
)

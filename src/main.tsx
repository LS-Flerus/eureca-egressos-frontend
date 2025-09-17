import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from './components/ui/provider.tsx'
import { ThemeProvider } from 'next-themes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
    attribute="class"
    disableTransitionOnChange
    defaultTheme="dark"
    forcedTheme="dark"
    >
      <Provider>
        <App />
      </Provider>
    </ThemeProvider>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
  </StrictMode>,
)

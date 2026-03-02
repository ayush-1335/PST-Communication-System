import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ParentProvider } from './context/ParentContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <AuthProvider>
      <ParentProvider>
        <App />
      </ParentProvider>
    </AuthProvider>
    
  </StrictMode>,
)

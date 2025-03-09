import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from './loginPage/LogInPage.tsx'
import RoleSelection from './pages/RoleSelection.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoleSelection />
  </StrictMode>,
)

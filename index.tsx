import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

if (PUBLISHABLE_KEY.includes('REPLACE_WITH')) {
  createRoot(document.getElementById('root')!).render(
    <div style={{ padding: '2rem', fontFamily: 'system-ui', color: '#7f1d1d', background: '#fef2f2', height: '100vh' }}>
      <h1>⚠️ Configuration Required</h1>
      <p>You haven't set your actual <strong>Clerk Publishable Key</strong> yet.</p>
      <p>Please open <code>.env.local</code> and replace the placeholder text with your key from the Clerk Dashboard.</p>
      <pre style={{ background: '#fca5a5', padding: '1rem', borderRadius: '0.5rem' }}>{PUBLISHABLE_KEY}</pre>
    </div>
  )
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </StrictMode>,
  )
}
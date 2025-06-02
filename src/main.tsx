import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App'

const root = createRoot(document.getElementById('root')!);

// Remove StrictMode temporarily to avoid altan-auth compatibility issues
root.render(<App />)
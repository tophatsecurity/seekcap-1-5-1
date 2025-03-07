
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './lib/ThemeProvider'
import { JsonDataProvider } from './context/JsonDataContext'

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <JsonDataProvider>
      <App />
    </JsonDataProvider>
  </ThemeProvider>
);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SocketProvider } from './Contexts/SocketContext.jsx'
import { DataProvider } from './Contexts/DataContext.jsx'

createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <DataProvider>
    <App />
    </DataProvider>
  </SocketProvider>
)

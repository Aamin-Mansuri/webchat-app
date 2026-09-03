// Add these 3 lines at the VERY TOP of main.jsx
import { Buffer } from 'buffer';
import process from 'process';
window.global = window;
window.Buffer = Buffer;
window.process = process;
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider> 
          <App /> 
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
)
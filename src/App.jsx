import React from 'react'
import AppRoutes from './Routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <div>
        <AppRoutes />
      </div>
    </AuthProvider>
  )
}

export default App

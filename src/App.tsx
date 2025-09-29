import { Route, Routes } from 'react-router'
import { CompanyRegister, Dashboard, HomePage, LoginPage } from './pages'
import { Layout, PrivateRoute, PublicRoute } from './components'

import './App.css'

function App() {

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={
        <PublicRoute>
          <Layout>
            <HomePage />
          </Layout>
        </PublicRoute>
      } />
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/registro-empresa" element={
        <PublicRoute>
          <CompanyRegister />
        </PublicRoute>
      } />

      {/* Ruta protegida con rol */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App

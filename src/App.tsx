import { Route, Routes } from 'react-router'
import { CompanyRegister, Dashboard, HomePage, LoginPage } from './pages'
import { Layout, PrivateRoute } from './components'

import './App.css'

function App() {

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={
        <Layout>
          <HomePage />
        </Layout>
      } />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro-empresa" element={<CompanyRegister />} />

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

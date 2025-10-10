import { useEffect } from 'react';
import { Route, Routes } from 'react-router'

import { useAppDispatch } from '@/store/hooks';
import { loadUserThunk } from '@/store/thunks/authThunks';

import { CompanyRegister, Dashboard, HomePage, LoginPage } from '@/pages'
import { Layout, PrivateRoute, PublicRoute } from '@/components'
import LoaderBottomRight from '@/components/Loader';
import { ChatbotButton } from '@/components/ChatbotButton';
import { ChatbotSidebar } from '@/components/ChatbotSidebar';

import './App.css'

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserThunk());
  }, [dispatch]);

  return (
    <>
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
      <LoaderBottomRight />
      <ChatbotButton />
      <ChatbotSidebar />
    </>
  )
}

export default App

import { useEffect } from 'react';
import { Outlet, Route, Routes } from 'react-router'
import { Toaster } from 'sonner';

import { useAppDispatch } from '@/store/hooks';
import { loadUserThunk } from '@/store/thunks/authThunks';

import { CompanyRegister, Dashboard, HomePage, LoginPage } from '@/pages'
import { VacancyDetail } from '@/pages/dashboard/components/vancancy/VacancyDetail';
import { CompanyDetail } from '@/pages/dashboard/components/company/CompanyDetail';
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
                <Outlet />
              </Layout>
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="vacancy/:id" element={<VacancyDetail />} />
          <Route path="company/:id" element={<CompanyDetail />} />
        </Route>
      </Routes>

      <LoaderBottomRight />
      <ChatbotButton />
      <ChatbotSidebar />

      <Toaster
        position="bottom-right"
        richColors
        closeButton
        expand
      />
    </>
  )
}

export default App

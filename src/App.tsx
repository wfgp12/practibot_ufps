import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Route, Routes } from 'react-router';
import { Toaster } from 'sonner';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadUserThunk } from '@/store/thunks/authThunks';

import { VacancyDetail } from '@/pages/dashboard/components/vancancy/VacancyDetail';
import { CompanyDetail } from '@/pages/dashboard/components/company/CompanyDetail';
import { AgreementRequest } from './pages/dashboard/components/agreement/AgreementRequest';
import { Layout, PrivateRoute, PublicRoute } from '@/components';
import LoaderBottomRight from '@/components/Loader';
// import { ChatbotButton } from '@/components/ChatbotButton';
// import { ChatbotSidebar } from '@/components/ChatbotSidebar';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

import './App.css';
import Spinner from './components/Spinner';
import { useNotificationsSocket } from './hooks/useNotificationsSocket';
import { loadNotificationsThunk } from './store/thunks/notificationsThunks';
import { StudentDetail } from './pages/dashboard/components/student/StudentDetail';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const CompanyRegisterPage = lazy(() => import('@/pages/CompanyRegister'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));

function App() {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  useNotificationsSocket();

  useEffect(() => {
    dispatch(loadUserThunk())
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(loadNotificationsThunk());
    }
  }, [user, dispatch]);


  useEffect(() => {
    createChat({
      webhookUrl: 'https://n8n.applab.ufps.edu.co/webhook/d3694e2f-6241-4822-96b0-cdd33004998e/chat',
      allowFileUploads: true,
      initialMessages: [
        '¡Hola! 👋',
        'Mi nombre es PractiBOT. ¿Cómo puedo ayudarte hoy?'
      ],
      i18n: {
        en: {
          title: '¡Hola! 👋',
          subtitle: "Inicia un chat. Estamos aquí para ayudarte 24/7.",
          footer: '',
          getStarted: 'Nueva Conversación',
          inputPlaceholder: 'Escribe tu pregunta..',
          closeButtonTooltip: 'Cerrar', // <- obligatorio
        },
      },
      metadata: {
        userRole: user?.role || null,
        token: token || null,
      },
    });
  }, [user, token]);

  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={
          <PublicRoute>
            <Layout>
              <Suspense fallback={<Spinner />}>
                <HomePage />
              </Suspense>
            </Layout>
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Suspense fallback={<Spinner />}>
              <LoginPage />
            </Suspense>
          </PublicRoute>
        } />
        <Route path="/registro-empresa" element={
          <PublicRoute>
            <Suspense fallback={<Spinner />}>
              <CompanyRegisterPage />
            </Suspense>
          </PublicRoute>
        } />
        <Route path="/recuperar-password" element={
          <PublicRoute>
            <Suspense fallback={<Spinner />}>
              <ForgotPasswordPage />
            </Suspense>
          </PublicRoute>
        } />

        <Route path="/reset-password" element={
          <PublicRoute>
            <Suspense fallback={<Spinner />}>
              <ResetPasswordPage />
            </Suspense>
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
          <Route index element={
            <Suspense fallback={<Spinner />}>
              <DashboardPage />
            </Suspense>
          } />
          <Route path="agreement" element={<AgreementRequest />} />
          <Route path="agreement/:id" element={<AgreementRequest />} />
          <Route path="vacancy/:id" element={<VacancyDetail />} />
          <Route path="student/:id" element={<StudentDetail />} />
          <Route path="company/:id" element={<CompanyDetail />} />
        </Route>
      </Routes>

      <LoaderBottomRight />
      {/* <ChatbotButton />
      <ChatbotSidebar /> */}
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        expand
      />
    </>
  );
}

export default App;
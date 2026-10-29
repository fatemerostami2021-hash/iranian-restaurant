// src/App.jsx
import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import useAuthPrompt from './hooks/useAuthPrompt.js';
import AuthPromptModal from './components/AuthPromptModal.jsx';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import RouteSeo from './components/RouteSeo';
import Home from './pages/Home';

// Every page except Home is its own chunk, so the home page does not download
// Checkout / Profile / Admin code it never uses.
const Menu = lazy(() => import('./pages/Menu'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Articles = lazy(() => import('./pages/Articles'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const DessertArticle = lazy(() => import('./pages/DessertArticle'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Careers = lazy(() => import('./pages/Careers'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// ===== پنل ادمین =====
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminLogin = lazy(() => import('./admin/Login'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const MenuManagement = lazy(() => import('./admin/MenuManagement'));
const ArticlesManagement = lazy(() => import('./admin/ArticlesManagement'));
const OrdersManagement = lazy(() => import('./admin/OrdersManagement'));
const ReservationsManagement = lazy(() => import('./admin/ReservationsManagement'));
const UsersManagement = lazy(() => import('./admin/UsersManagement'));
const JobApplications = lazy(() => import('./admin/JobApplications'));

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/admin/login" />;
  return children;
};

// Layout stays mounted while a page chunk loads.
const page = (el) => (
  <Layout>
    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>{el}</Suspense>
  </Layout>
);

const admin = (el) => <Suspense fallback={null}>{el}</Suspense>;

function App() {
  const { showPrompt, dismiss } = useAuthPrompt();

  // remove the static first-screen shell once React has painted
  useEffect(() => {
    document.getElementById('app-shell')?.remove();
  }, []);

  return (
    <ThemeProvider>
      <CartProvider>
        <ScrollToTop />
        <RouteSeo />

        <Routes>
          {/* ===== مسیرهای عمومی ===== */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/menu" element={page(<Menu />)} />
          <Route path="/menu/category/:categoryKey" element={page(<CategoryPage />)} />
          <Route path="/articles" element={page(<Articles />)} />
          <Route
            path="/articles/best-ice-cream-qatar-bastani-faloodeh"
            element={page(<DessertArticle />)}
          />
          <Route path="/articles/:slug" element={page(<ArticleDetail />)} />
          <Route path="/about" element={page(<About />)} />
          <Route path="/contact" element={page(<Contact />)} />
          <Route path="/checkout" element={page(<Checkout />)} />
          <Route path="/careers" element={page(<Careers />)} />
          <Route path="/profile" element={page(<Profile />)} />

          {/* ===== مسیرهای ادمین ===== */}
          <Route path="/admin/login" element={admin(<AdminLogin />)} />
          <Route path="/admin" element={<ProtectedRoute>{admin(<AdminLayout />)}</ProtectedRoute>}>
            <Route index element={admin(<Dashboard />)} />
            <Route path="dashboard" element={admin(<Dashboard />)} />
            <Route path="menu" element={admin(<MenuManagement />)} />
            <Route path="orders" element={admin(<OrdersManagement />)} />
            <Route path="reservations" element={admin(<ReservationsManagement />)} />
            <Route path="articles" element={admin(<ArticlesManagement />)} />
            <Route path="users" element={admin(<UsersManagement />)} />
            <Route path="jobs" element={admin(<JobApplications />)} />
          </Route>

          {/* مسیر ۴۰۴ */}
          <Route path="*" element={page(<NotFound />)} />
        </Routes>

        <AuthPromptModal show={showPrompt} onDismiss={dismiss} />
        <PWAUpdatePrompt />
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;

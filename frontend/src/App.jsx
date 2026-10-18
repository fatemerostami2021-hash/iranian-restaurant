// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
// ❌ HelmetProvider حذف شد
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import useAuthPrompt from './hooks/useAuthPrompt.js';
import AuthPromptModal from './components/AuthPromptModal.jsx';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import RouteSeo from './components/RouteSeo';
import Home from './pages/Home';
import Menu from './pages/Menu';
import CategoryPage from './pages/CategoryPage';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import DessertArticle from './pages/DessertArticle';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Careers from './pages/Careers';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// ===== پنل ادمین =====
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/Login';
import Dashboard from './admin/Dashboard';
import MenuManagement from './admin/MenuManagement';
import ArticlesManagement from './admin/ArticlesManagement';
import OrdersManagement from './admin/OrdersManagement';
import ReservationsManagement from './admin/ReservationsManagement';
import UsersManagement from './admin/UsersManagement';
import JobApplications from './admin/JobApplications';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/admin/login" />;
  return children;
};

function App() {
  const { showPrompt, dismiss } = useAuthPrompt();

  return (
    // ✅ HelmetProvider از اینجا حذف شد
    <ThemeProvider>
      <CartProvider>
        <ScrollToTop />
        <RouteSeo />

        <Routes>
          {/* ===== مسیرهای عمومی ===== */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/menu" element={<Layout><Menu /></Layout>} />
          <Route path="/menu/category/:categoryKey" element={<Layout><CategoryPage /></Layout>} />
          <Route path="/articles" element={<Layout><Articles /></Layout>} />
          <Route
            path="/articles/best-ice-cream-qatar-bastani-faloodeh"
            element={<Layout><DessertArticle /></Layout>}
          />
          <Route path="/articles/:slug" element={<Layout><ArticleDetail /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
          <Route path="/careers" element={<Layout><Careers /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />

          {/* ===== مسیرهای ادمین ===== */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="reservations" element={<ReservationsManagement />} />
            <Route path="articles" element={<ArticlesManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="jobs" element={<JobApplications />} />
          </Route>

          {/* مسیر ۴۰۴ */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>

        <AuthPromptModal show={showPrompt} onDismiss={dismiss} />
        <PWAUpdatePrompt />
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
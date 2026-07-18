import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import CategoryPage from './pages/CategoryPage';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';

// ===== پنل ادمین =====
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/Login';
import Dashboard from './admin/Dashboard';
import MenuManagement from './admin/MenuManagement';
import ArticlesManagement from './admin/ArticlesManagement';
import OrdersManagement from './admin/OrdersManagement';
import ReservationsManagement from './admin/ReservationsManagement';

// محافظت از روت‌های ادمین
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/admin/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <CartProvider>
          <Routes>
            {/* ===== مسیرهای عمومی ===== */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/menu" element={<Layout><Menu /></Layout>} />
            <Route path="/menu/category/:categoryKey" element={<Layout><CategoryPage /></Layout>} />
            <Route path="/articles" element={<Layout><Articles /></Layout>} />
            <Route path="/articles/:slug" element={<Layout><ArticleDetail /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/checkout" element={<Layout><Checkout /></Layout>} />

            {/* ===== مسیرهای ادمین ===== */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="orders" element={<OrdersManagement />} />
              <Route path="reservations" element={<ReservationsManagement />} />
              <Route path="articles" element={<ArticlesManagement />} />
            </Route>
          </Routes>
        </CartProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
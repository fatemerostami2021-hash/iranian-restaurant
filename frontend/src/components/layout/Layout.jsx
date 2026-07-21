import Header from './Header';
import Footer from './Footer';
import FloatingSupport from '../ui/FloatingSupport';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-surface-dark transition-colors">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingSupport />
    </div>
  );
}

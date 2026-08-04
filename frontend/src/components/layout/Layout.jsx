import Header from './Header';
import Footer from './Footer';
import FloatingSupport from '../ui/FloatingSupport';
import FloatingBottomBar from './FloatingBottomBar'; // ← اینو اضافه کن
import InstallPromptManager from '../pwa/InstallPromptManager';
import AppOpenSplash from '../pwa/AppOpenSplash';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-surface-dark transition-colors">
       <AppOpenSplash />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingSupport />
      <FloatingBottomBar />
       <InstallPromptManager />
    </div>
  );
}
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls the window to the top (0,0) whenever the 
 * route pathname changes. Place this component inside your Router 
 * (e.g., inside BrowserRouter in App.jsx) so it works globally 
 * across all pages.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll instantly to top on every route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  // This component does not render anything visible
  return null;
}
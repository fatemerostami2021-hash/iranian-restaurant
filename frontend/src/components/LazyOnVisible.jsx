import { Suspense, useEffect, useRef, useState } from 'react';

/**
 * Mounts its children (usually React.lazy components) only when the placeholder
 * is close to the viewport. Keeps below-the-fold JS/CSS/images out of the first load.
 */
export default function LazyOnVisible({ children, minHeight = 500, rootMargin = '700px 0px' }) {
  const ref = useRef(null);
  const [show, setShow] = useState(typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (show) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  if (show) {
    return <Suspense fallback={<div style={{ minHeight }} />}>{children}</Suspense>;
  }
  return <div ref={ref} style={{ minHeight }} aria-hidden="true" />;
}

import { lazy, Suspense } from 'react';

// The Google library (and the gsi/client script) is only fetched when the button is rendered.
const Inner = lazy(() => import('./GoogleLoginButtonInner.jsx'));

export default function GoogleLoginButton(props) {
  return (
    <Suspense fallback={<div className="flex justify-center my-4" style={{ minHeight: 44 }} />}>
      <Inner {...props} />
    </Suspense>
  );
}

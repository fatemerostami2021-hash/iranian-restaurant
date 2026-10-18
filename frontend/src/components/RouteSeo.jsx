import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const ORIGIN = 'https://kababdagh.com';

// Public pages that get a self-referencing canonical.
// Checkout, profile, admin and unknown URLs get none.
const PUBLIC_PATH = /^\/(menu(\/category\/[^/]+)?|articles(\/[^/]+)?|about|contact|careers)?$/;

export default function RouteSeo() {
  const { pathname } = useLocation();
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';

  if (!PUBLIC_PATH.test(path)) return null;

  return (
    <Helmet>
      <link rel="canonical" href={`${ORIGIN}${path}`} />
    </Helmet>
  );
}

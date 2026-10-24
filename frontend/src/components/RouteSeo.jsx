import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ORIGIN = 'https://kababdagh.com';
const OG_IMAGE = `${ORIGIN}/images/application/pwa-512x512.png`;
const SITE_NAME = 'Kabab Dagh Nan Dagh';
const LOCALE = { en: 'en_US', fa: 'fa_IR', ar: 'ar_AR' };

// Public pages that get a self-referencing canonical.
// Checkout, profile, admin and unknown URLs get none.
const PUBLIC_PATH = /^\/(menu(\/category\/[^/]+)?|articles(\/[^/]+)?|about|contact|careers)?$/;

// Default title/description per page. A page that renders its own <Helmet>
// (ArticleDetail, DessertArticle) overrides these because it is deeper in the tree.
// English texts must match backend/seo/pages.js (the server-rendered version).
const PAGES = {
  '/': {
    en: {
      t: 'Kabab Dagh Nan Dagh | Iranian Restaurant in Doha, Qatar | Order Online',
      d: 'Authentic Iranian kebab and fresh nan in Doha, Qatar. Browse the menu, order online or through Talabat, and try Persian ice cream and Faloodeh Shirazi.',
    },
    fa: {
      t: 'کباب داغ نان داغ | رستوران کباب ایرانی در دوحه قطر | سفارش آنلاین',
      d: 'رستوران کباب داغ نان داغ در دوحه قطر. منوی متنوع کباب ایرانی، نان داغ تازه، سفارش آنلاین و دلیوری. طعم اصیل ایرانی را در قطر تجربه کنید.',
    },
    ar: {
      t: 'كباب داغ نان داغ | مطعم إيراني في الدوحة، قطر | اطلب أونلاين',
      d: 'كباب إيراني أصيل وخبز طازج في الدوحة، قطر. تصفح القائمة واطلب أونلاين أو عبر طلبات، وجرّب البوظة الفارسية والفالوده الشيرازية.',
    },
  },
  '/menu': {
    en: {
      t: 'Menu | Iranian Kebab, Breakfast & Combos in Doha | Kabab Dagh Nan Dagh',
      d: 'See the full Kabab Dagh Nan Dagh menu in Doha: Iranian kebabs, breakfast, combos, appetizers, drinks and Persian desserts. Order online.',
    },
    fa: {
      t: 'منو | کباب ایرانی، صبحانه و کمبو در دوحه | کباب داغ نان داغ',
      d: 'منوی کامل کباب داغ نان داغ در دوحه: کباب ایرانی، صبحانه، کمبو، پیش‌غذا، نوشیدنی و دسرهای ایرانی. آنلاین سفارش دهید.',
    },
    ar: {
      t: 'القائمة | كباب إيراني وفطور ووجبات كومبو في الدوحة | كباب داغ نان داغ',
      d: 'قائمة كباب داغ نان داغ الكاملة في الدوحة: كباب إيراني، فطور، وجبات كومبو، مقبلات، مشروبات وحلويات فارسية. اطلب أونلاين.',
    },
  },
  '/articles': {
    en: {
      t: 'Articles & Stories | Kabab Dagh Nan Dagh Doha',
      d: 'Persian food stories, recipes and guides from Kabab Dagh Nan Dagh, the Iranian restaurant in Doha, Qatar.',
    },
    fa: {
      t: 'مقالات و داستان‌ها | کباب داغ نان داغ دوحه',
      d: 'داستان‌ها، دستورها و راهنمای غذاهای ایرانی از رستوران کباب داغ نان داغ در دوحه، قطر.',
    },
    ar: {
      t: 'مقالات وقصص | كباب داغ نان داغ الدوحة',
      d: 'قصص ووصفات وأدلة عن المأكولات الفارسية من مطعم كباب داغ نان داغ الإيراني في الدوحة، قطر.',
    },
  },
  '/about': {
    en: {
      t: 'About Kabab Dagh Nan Dagh | Iranian Restaurant in Doha',
      d: 'Learn about Kabab Dagh Nan Dagh, an Iranian restaurant on Salwa Road in Doha, Qatar serving authentic kebab and fresh nan.',
    },
    fa: {
      t: 'درباره کباب داغ نان داغ | رستوران ایرانی در دوحه',
      d: 'با رستوران ایرانی کباب داغ نان داغ در خیابان سلوا دوحه، قطر آشنا شوید؛ کباب اصیل و نان داغ تازه.',
    },
    ar: {
      t: 'عن كباب داغ نان داغ | مطعم إيراني في الدوحة',
      d: 'تعرّف على مطعم كباب داغ نان داغ الإيراني في شارع سلوى بالدوحة، قطر: كباب أصيل وخبز طازج.',
    },
  },
  '/contact': {
    en: {
      t: 'Contact & Location | Kabab Dagh Nan Dagh, Doha',
      d: 'Find Kabab Dagh Nan Dagh on Salwa Road, Doha. Call +974 3300 0157, see opening hours (daily 10:00-01:00) and get directions.',
    },
    fa: {
      t: 'تماس و آدرس | کباب داغ نان داغ، دوحه',
      d: 'آدرس کباب داغ نان داغ در خیابان سلوا دوحه. تلفن ‎+974 3300 0157‎، ساعت کاری (هر روز ۱۰:۰۰ تا ۰۱:۰۰) و مسیریابی.',
    },
    ar: {
      t: 'اتصل بنا والموقع | كباب داغ نان داغ، الدوحة',
      d: 'موقع كباب داغ نان داغ في شارع سلوى بالدوحة. اتصل على ‎+974 3300 0157‎، ساعات العمل (يوميًا 10:00-01:00) والاتجاهات.',
    },
  },
  '/careers': {
    en: {
      t: 'Careers | Kabab Dagh Nan Dagh Doha',
      d: 'Join the Kabab Dagh Nan Dagh team in Doha, Qatar. See open roles and apply online.',
    },
    fa: {
      t: 'فرصت‌های شغلی | کباب داغ نان داغ دوحه',
      d: 'به تیم کباب داغ نان داغ در دوحه قطر بپیوندید. موقعیت‌های شغلی را ببینید و آنلاین درخواست دهید.',
    },
    ar: {
      t: 'وظائف | كباب داغ نان داغ الدوحة',
      d: 'انضم إلى فريق كباب داغ نان داغ في الدوحة، قطر. اطّلع على الوظائف المتاحة وقدّم أونلاين.',
    },
  },
};

export default function RouteSeo() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';

  if (!PUBLIC_PATH.test(path)) return null;

  const code = (i18n.language || 'en').slice(0, 2);
  const lang = LOCALE[code] ? code : 'en';
  const page = PAGES[path]?.[lang];
  const url = `${ORIGIN}${path}`;

  return (
    <Helmet>
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={LOCALE[lang]} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={OG_IMAGE} />
      {page && <title>{page.t}</title>}
      {page && <meta name="description" content={page.d} />}
      {page && <meta property="og:title" content={page.t} />}
      {page && <meta property="og:description" content={page.d} />}
      {page && <meta name="twitter:title" content={page.t} />}
      {page && <meta name="twitter:description" content={page.d} />}
    </Helmet>
  );
}

// backend/seed/seedArticles.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Article from '../models/Article.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// ===== ۵ مقاله کامل رستورانی =====
const articlesData = [
  // ===== مقاله ۱: قرمه‌سبزی =====
  {
    slug: 'ghormeh-sabzi-legend-of-persian-stew',
    author: 'تیم تحریریه کباب داغ نان داغ',
    category: 'food-stories',
    status: 'published',
    featured: true,
    title: {
      fa: 'قرمه‌سبزی؛ افسانه‌ای از سبزیجات، خشکبار و عشق در بشقاب ایرانی',
      en: 'Ghormeh Sabzi: A Legend of Herbs, Nuts, and Love on the Iranian Plate',
      ar: 'قرمه سبزی: أسطورة من الأعشاب والمكسرات والحب على الطبق الإيراني'
    },
    excerpt: {
      fa: 'داستان سفری که از دل کوه‌های زاگرس آغاز شد و به قلب سفره‌های ایرانی راه یافت؛ روایتی از عطر سبزی‌های تازه، گوشت لطیف و خشکباری که رنگ و بوی زندگی می‌دهد.',
      en: 'The story of a journey that began in the heart of the Zagros Mountains and found its way to the center of Iranian tables — a tale of fresh herbs, tender meat, and dried fruits that bring color and aroma to life.',
      ar: 'رحلة بدأت من أعماق جبال زاغروس واستقرت في قلب الموائد الإيرانية؛ حكاية عبق الأعشاب الطازجة، ولحم الطراوة، والمكسرات التي تمنح الحياة لوناً ونكهة.'
    },
    content: {
      fa: `<p>اگر بخواهید یک بشقاب را انتخاب کنید که تمام تاریخ، فرهنگ و احساسات یک سرزمین را در خود جای داده باشد، بی‌گمان <strong>قرمه‌سبزی</strong> آن بشقاب است. این خورش که به‌عنوان <strong>سلطان خورش‌های ایرانی</strong> شناخته می‌شود، نه فقط یک غذا، بلکه روایتی است از صبوری، عشق و هنر آشپزی که از نسل‌ها پیش به امروز رسیده است.</p>
      <blockquote><p>🍃 «قرمه‌سبزی فقط یک خورش نیست؛ بوی بهار است در دل زمستان، رنگ زندگی است در بشقاب، و طعم خاطراتی که هیچ‌وقت کهنه نمی‌شوند.»</p></blockquote>
      <h2>ریشه‌های تاریخی؛ از دل کوه‌ها تا سفره‌های پادشاهی</h2>
      <p>داستان قرمه‌سبزی به هزاران سال پیش بازمی‌گردد. برخی مورخان آشپزی معتقدند که این خورش ریشه در <strong>مناطق کوهستانی زاگرس</strong> دارد، جایی که عشایر با سبزیجات کوهی و گوشت بره، خورشتی مقوی و پرانرژی می‌پختند. اما نقطه‌ی عطف این غذا در <strong>دوره‌ی صفویه</strong> رخ داد، زمانی که آشپزان دربار این خورش را با <strong>سبزیجات تازه، گوشت گوسفندی و لوبیا قرمز</strong> به یک هنر اصیل تبدیل کردند.</p>
      <p>در متون تاریخی دوران قاجار، از قرمه‌سبزی به عنوان <strong>«غذای شاهان»</strong> یاد شده است. ناصرالدین‌شاه قاجار در سفرنامه‌های خود بارها به عشقش به این خورش اشاره کرده و حتی آشپز مخصوصی را مأمور پخت آن در سفرهای شکار کرده بود.</p>
      <h2>مواد اولیه؛ هنر انتخاب و هماهنگی</h2>
      <p>راز اصلی قرمه‌سبزی در <strong>هماهنگی بی‌نظیر مواد اولیه</strong> آن نهفته است:</p>
      <ul><li><strong>سبزیجات تازه:</strong> ترکیبی از تره، جعفری، گشنیز و اسفناج.</li><li><strong>گوشت:</strong> معمولاً گوشت گوسفندی یا گوساله با مقداری چربی.</li><li><strong>لوبیا قرمز:</strong> که به غلیظ شدن و بافت دل‌پذیر خورش کمک می‌کند.</li><li><strong>لیمو عمانی:</strong> قلب تپنده‌ی قرمه‌سبزی با عطر دودی و طعم ترش.</li></ul>
      <h2>قرمه‌سبزی در دوحه؛ سفری از ایران به قلب خلیج فارس</h2>
      <p>در قلب دوحه، قطر، رستوران <strong>«کباب داغ نان داغ»</strong> با افتخار این خورش اصیل را در منوی خود جای داده است. اینجا قرمه‌سبزی با همان <strong>دستورالعمل سنتی</strong> و با مواد اولیه‌ی تازه و باکیفیت پخته می‌شود.</p>
      <blockquote><p>🌍 «هر قاشق قرمه‌سبزی در دوحه، یادآور دیار و خاطراتی است که هیچ مرزی نمی‌شناسد.»</p></blockquote>`,
      en: `<p>If you had to choose a single dish that encapsulates the entire history, culture, and emotion of a land, it would undoubtedly be <strong>Ghormeh Sabzi</strong>. This stew, known as the <strong>king of Persian stews</strong>, is not just a meal but a narrative of patience, love, and culinary artistry passed down through generations.</p>
      <blockquote><p>🌿 "Ghormeh Sabzi is not just a stew — it is the scent of spring in the heart of winter, the color of life on a plate, and the taste of memories that never fade."</p></blockquote>
      <h2>Historical Roots</h2>
      <p>The story of Ghormeh Sabzi dates back thousands of years. Some culinary historians believe this stew originated in the <strong>mountainous regions of the Zagros</strong>, where nomadic tribes cooked a hearty, energy-rich stew using wild mountain herbs and lamb.</p>
      <h2>Ghormeh Sabzi in Doha</h2>
      <p>In the heart of Doha, Qatar, <strong>"Kabab Dagh Nan Dagh"</strong> restaurant proudly features this authentic stew on its menu.</p>`,
      ar: `<p>إذا أردت أن تختار طبقاً واحداً يجمع بين تاريخ، ثقافة، وعواطف أرض بأكملها، فإنه بلا شك <strong>قرمه سبزي</strong>. هذه اليخنة التي تُعرف باسم <strong>ملك اليخنات الفارسية</strong>، ليست مجرد وجبة، بل هي قصة من الصبر، والحب، وفن الطهي الذي تناقلته الأجيال.</p>
      <blockquote><p>🌿 "قرمه سبزي ليست مجرد يخنة؛ إنها رائحة الربيع في قلب الشتاء، ولون الحياة في الطبق، وطعم الذكريات التي لا تبهت أبداً."</p></blockquote>
      <h2>الجذور التاريخية</h2>
      <p>تعود قصة قرمه سبزي إلى آلاف السنين. يعتقد بعض مؤرخي الطهي أن هذه اليخنة نشأت في <strong>المناطق الجبلية في زاغروس</strong>، حيث كان البدو الرحل يطبخون يخنة مغذية باستخدام الأعشاب الجبلية البرية ولحم الضأن.</p>
      <h2>قرمه سبزي في الدوحة</h2>
      <p>في قلب الدوحة، قطر، يقدم مطعم <strong>"كباب داغ نان داغ"</strong> بكل فخر هذه اليخنة الأصيلة على قائمته.</p>`
    },
    tags: ['قرمه‌سبزی', 'غذای ایرانی', 'خورش ایرانی', 'آشپزی سنتی', 'فرهنگ غذایی', 'کباب داغ نان داغ', 'دوحه']
  },

  // ===== مقاله ۲: زعفران =====
  {
    slug: 'saffron-red-gold-of-persia',
    author: 'تیم تحریریه کباب داغ نان داغ',
    category: 'culture',
    status: 'published',
    featured: false,
    title: {
      fa: 'زعفران؛ طلای سرخ ایران از مزرعه تا سفره',
      en: 'Saffron: Iran\'s Red Gold from Farm to Table',
      ar: 'الزعفران: الذهب الأحمر الإيراني من المزرعة إلى المائدة'
    },
    excerpt: {
      fa: 'سفری از دل مزارع زعفران خراسان تا بشقاب‌های رنگین رستوران‌های دوحه؛ داستان گران‌بهاترین ادویه جهان که عطر و رنگ زندگی را به غذاها هدیه می‌دهد.',
      en: 'A journey from the saffron fields of Khorasan to the colorful plates of Doha\'s restaurants — the story of the world\'s most precious spice that brings aroma and color to life.',
      ar: 'رحلة من حقول الزعفران في خراسان إلى الأطباق الملونة في مطاعم الدوحة؛ قصة أغلى بهار في العالم الذي يمنح الحياة عطراً ولوناً.'
    },
    content: {
      fa: `<p>در میان تمام ادویه‌های جهان، <strong>زعفران</strong> جایگاهی بی‌نظیر دارد. این <strong>طلای سرخ</strong> که از گل‌های ظریف <em>Crocus sativus</em> به دست می‌آید، نه‌تنها گران‌بهاترین ادویه‌ی دنیاست، بلکه نمادی از <strong>فرهنگ، هنر و اصالت ایرانی</strong> محسوب می‌شود.</p>
      <blockquote><p>🌹 «زعفران لبخند خورشید است بر سفره‌های ایرانی؛ طلایی که بوی بهار می‌دهد و دل را روشن می‌کند.»</p></blockquote>
      <h2>ریشه‌های تاریخی؛ میراثی کهن از دل خراسان</h2>
      <p>قدمت کشت زعفران در ایران به <strong>۳۰۰۰ سال پیش</strong> بازمی‌گردد. اسناد تاریخی نشان می‌دهد که زعفران در <strong>دوره‌ی هخامنشیان</strong> به عنوان ادویه‌ای سلطنتی و گران‌بها مورد استفاده قرار می‌گرفته است.</p>
      <h2>زعفران در آشپزی؛ راز رنگ و عطر غذاهای ایرانی</h2>
      <p>زعفران <strong>قلب تپنده‌ی آشپزی ایرانی</strong> است. بدون زعفران، بسیاری از غذاهای ایرانی رنگ و عطر اصیل خود را از دست می‌دهند.</p>
      <h2>زعفران در دوحه؛ طلای سرخ در قلب خلیج فارس</h2>
      <p>در رستوران <strong>«کباب داغ نان داغ»</strong> در دوحه، زعفران جایگاه ویژه‌ای دارد. از <strong>برنج زعفرانی</strong> تا <strong>چای زعفرانی</strong>، زعفران اصیل ایرانی قلب این رستوران را می‌تپاند.</p>`,
      en: `<p>Among all the spices in the world, <strong>saffron</strong> holds a unique place. This <strong>red gold</strong>, derived from the delicate flowers of <em>Crocus sativus</em>, is not only the world's most expensive spice but also a symbol of <strong>Iranian culture, art, and authenticity</strong>.</p>
      <blockquote><p>🌹 "Saffron is the smile of the sun on Iranian tables — gold that smells like spring and brightens the heart."</p></blockquote>
      <h2>Historical Roots</h2>
      <p>The cultivation of saffron in Iran dates back <strong>3,000 years</strong>.</p>
      <h2>Saffron in Cooking</h2>
      <p>Saffron is the <strong>beating heart of Persian cuisine</strong>.</p>
      <h2>Saffron in Doha</h2>
      <p>At <strong>"Kabab Dagh Nan Dagh"</strong> restaurant in Doha, saffron holds a special place.</p>`,
      ar: `<p>بين جميع البهارات في العالم، يحتل <strong>الزعفران</strong> مكانة فريدة. هذا <strong>الذهب الأحمر</strong>، المستخرج من أزهار <em>Crocus sativus</em> الرقيقة، ليس فقط أغلى بهار في العالم، بل هو أيضاً رمز <strong>للثقافة والفن والأصالة الإيرانية</strong>.</p>
      <blockquote><p>🌹 "الزعفران هو ابتسامة الشمس على الموائد الإيرانية؛ ذهب تفوح منه رائحة الربيع وينير القلب."</p></blockquote>
      <h2>الجذور التاريخية</h2>
      <p>يعود تاريخ زراعة الزعفران في إيران إلى <strong>٣٠٠٠ عام</strong>.</p>
      <h2>الزعفران في الطهي</h2>
      <p>الزعفران هو <strong>القلب النابض للمطبخ الفارسي</strong>.</p>
      <h2>الزعفران في الدوحة</h2>
      <p>في مطعم <strong>"كباب داغ نان داغ"</strong> في الدوحة، يحتل الزعفران مكانة خاصة.</p>`
    },
    tags: ['زعفران', 'طلای سرخ', 'ادویه ایرانی', 'خراسان', 'آشپزی سنتی', 'فرهنگ غذایی', 'کباب داغ نان داغ', 'دوحه']
  },

  // ===== مقاله ۳: تاریخچه کباب =====
  {
    slug: 'history-of-kebab-in-iran',
    author: 'تیم تحریریه کباب داغ نان داغ',
    category: 'history',
    status: 'published',
    featured: true,
    title: {
      fa: 'رقص آتش و گوشت: داستان پیدایش کباب در تاریخ ایران',
      en: 'The Tale of Fire and Meat: The Story of Kebab in Iranian History',
      ar: 'حكاية النار واللحم: قصة نشأة الكباب في تاريخ إيران'
    },
    excerpt: {
      fa: 'سفری شگفت‌انگیز به اعماق تاریخ برای کشف ریشه‌های کباب؛ از آتشکده‌های باستانی تا سیخ‌های ذغالی که امروز سفره‌های ما را روشن می‌کنند.',
      en: 'An incredible journey into the depths of history to discover the roots of kebab — from ancient fire temples to the charcoal skewers that light up our tables today.',
      ar: 'رحلة مذهلة إلى أعماق التاريخ لاكتشاف جذور الكباب — من معابد النار القديمة إلى أسياخ الفحم التي تضيء موائدنا اليوم.'
    },
    content: {
      fa: `<p><strong>کباب</strong>، تنها یک غذای خوشمزه نیست؛ <strong>قلب تپنده تاریخ و فرهنگ ایرانی</strong> است. داستانی که هزاران سال پیش آغاز شد؛ زمانی که انسان‌های فلات ایران <strong>آتش</strong> را کشف کردند و رامش ساختند.</p>
      <blockquote><p>🔥 «آتش، زغال و دود؛ این سه عنصر جادویی هستند که روح را در کباب می‌دمند.»</p></blockquote>
      <h2>ریشه‌های باستانی؛ از میدان نبرد تا سفره پادشاهان</h2>
      <p>در دوران شکوه <strong>امپراتوری ایران باستان</strong>، سربازان هخامنشی در لشکرکشی‌های طولانی خود، تکه‌های گوشت را روی <strong>شمشیرهای آهنی</strong> خود قرار داده و روی آتش کباب می‌کردند.</p>
      <h2>آتش و زغال؛ راز جاودانگی طعم کباب ایرانی</h2>
      <p>راز اصلی کباب ایرانی، نه تنها در گوشت یا ادویه است، بلکه در <strong>"آتش"</strong> نهفته است. <strong>زغال‌های روشن، دود خوشبوی چوب</strong> و چربی سوخته گوشت، ترکیبی می‌سازند که هیچ دستگاه مدرنی قادر به شبیه‌سازی آن نیست.</p>
      <h2>کباب در دوحه؛ احیای آتش‌های باستانی در قلب قطر</h2>
      <p>در قلب دوحه، رستوران <strong>«کباب داغ نان داغ»</strong> این هنر باستانی را با همان وسعت و عشق اولیه زنده کرده است. ما <strong>آتش را در سرویس منزل شما می‌بریم</strong> تا سفره‌تان به تاریخ و اصالت پیوند بخورد.</p>`,
      en: `<p><strong>Kebab</strong> is not just a delicious meal; it is the <strong>beating heart of Iranian history and culture</strong>. A story that began thousands of years ago — when the people of the Iranian plateau <strong>discovered fire</strong> and tamed it.</p>
      <blockquote><p>🔥 "Fire, charcoal, and smoke — these three magical elements breathe the soul into kebab."</p></blockquote>
      <h2>Ancient Roots</h2>
      <p>During the glory of the <strong>Ancient Persian Empire</strong>, Achaemenid soldiers on their long campaigns placed pieces of meat on their <strong>iron swords</strong> and grilled them over the fire.</p>
      <h2>Fire and Charcoal</h2>
      <p>The true secret of Persian kebab lies not only in the meat or spices but in the <strong>"fire"</strong> itself.</p>
      <h2>Kebab in Doha</h2>
      <p>In the heart of Doha, <strong>"Kabab Dagh Nan Dagh"</strong> restaurant has brought this ancient art to life. We <strong>bring the fire to your home service</strong>.</p>`,
      ar: `<p><strong>الكباب</strong> ليس مجرد وجبة لذيذة؛ إنه <strong>القلب النابض للتاريخ والثقافة الإيرانية</strong>. قصة بدأت منذ آلاف السنين — عندما اكتشف سكان الهضبة الإيرانية <strong>النار</strong> وأخضعوها.</p>
      <blockquote><p>🔥 "النار والفحم والدخان — هذه العناصر السحرية الثلاثة هي التي تنفخ الروح في الكباب."</p></blockquote>
      <h2>الجذور القديمة</h2>
      <p>خلال فترة ازدهار <strong>الإمبراطورية الفارسية القديمة</strong>، كان الجنود الأخمينيون يضعون قطع اللحم على <strong>سيوفهم الحديدية</strong> ويشوونها على النار.</p>
      <h2>النار والفحم</h2>
      <p>السر الحقيقي للكباب الفارسي لا يكمن فقط في اللحم أو البهارات، بل في <strong>"النار"</strong> نفسها.</p>
      <h2>الكباب في الدوحة</h2>
      <p>في قلب الدوحة، مطعم <strong>"كباب داغ نان داغ"</strong> يحيي هذا الفن القديم. نحن <strong>نحضر النار إلى خدمة منزلك</strong>.</p>`
    },
    tags: ['کباب', 'تاریخ کباب', 'غذای ایرانی', 'آتش', 'زغال', 'کباب داغ نان داغ', 'دوحه', 'تاریخ و تمدن']
  },

  // ===== مقاله ۴: ناصرالدین‌شاه و آشپزخانه قاجار =====
  {
    slug: 'naser-al-din-shah-qajar-kitchen-royal-table',
    author: 'تیم تحریریه کباب داغ نان داغ',
    category: 'history',
    status: 'published',
    featured: false,
    title: {
      fa: 'ناصرالدین‌شاه و آشپزخانه قاجار: روایتی از سفره‌های پادشاهی',
      en: 'Naser al-Din Shah and the Qajar Kitchen: A Tale of Royal Tables',
      ar: 'ناصر الدين شاه والمطبخ القاجاري: حكاية الموائد الملكية'
    },
    excerpt: {
      fa: 'دربار قاجار، به‌ویژه در دوران طولانی سلطنت ناصرالدین‌شاه، نه تنها مرکز قدرت سیاسی، بلکه صحنه‌ای باشکوه از تجمل، آداب و رسوم، و لذت‌های حسی بود. آشپزخانه سلطنتی یا «خوانسالاری» نمادی از اقتدار پادشاه، مهمان‌نوازی شاهانه و ذوق هنری ایرانی بود.',
      en: 'The Qajar court, especially during the long reign of Naser al-Din Shah, was not only a center of political power but also a magnificent stage of luxury, customs, and sensory pleasures. The royal kitchen, known as "Khan-Salari," was a symbol of royal authority, Persian hospitality, and artistic taste.',
      ar: 'لم يكن البلاط القاجاري، خاصة خلال فترة حكم ناصر الدين شاه الطويلة، مركزاً للسلطة السياسية فحسب، بل كان أيضاً مسرحاً فخماً للترف والعادات والمتع الحسية. كان المطبخ الملكي، المعروف باسم "خان سالاري"، رمزاً لهيبة الملك والكرم الفارسي والذوق الفني.'
    },
    content: {
      fa: `<p>آشپزخانه سلطنتی یا «آشپزخانه» و «خوانسالاری» در دربار ناصرالدین‌شاه، یکی از مهم‌ترین ادارات درباری به شمار می‌رفت که با دقت و تشریفات فراوان اداره می‌شد. این آشپزخانه فراتر از صرف تأمین غذا، نمادی از <strong>اقتدار پادشاه، مهمان‌نوازی شاهانه و ذوق هنری ایرانی</strong> در هنر آشپزی بود.</p>
      <blockquote><p>👑 «سفره ناصرالدین‌شاه، با تمام تجمل و آدابش، روایتی زنده از ایران قاجاری است: جایی که طعم غذا با طعم قدرت آمیخته بود.»</p></blockquote>
      <h2>ساختار آشپزخانه سلطنتی</h2>
      <p>آشپزخانه قاجار با عنوان <strong>«خوانسالاری»</strong> شناخته می‌شد و سرپرست آن «خوانسالار» یا «ناظر» بود.</p>
      <h2>سفره‌های روزانه و ذائقه شاه</h2>
      <p>ناصرالدین‌شاه به غذا علاقه‌مند بود و سفره‌های او مجلل و پرتنوع توصیف شده‌اند.</p>
      <h2>آشپزخانه قاجار در دوحه؛ احیای سفره‌های پادشاهی</h2>
      <p>در رستوران <strong>«کباب داغ نان داغ»</strong> در دوحه، ما به میراث آشپزی قاجار ارج می‌نهیم.</p>`,
      en: `<p>The royal kitchen, known as <strong>"Khan-Salari"</strong> in the court of Naser al-Din Shah, was one of the most important court departments. This kitchen was far more than just food supply — it was a symbol of <strong>royal authority, Persian hospitality, and artistic taste</strong>.</p>
      <blockquote><p>👑 "The table of Naser al-Din Shah, with all its luxury and customs, is a living narrative of Qajar Iran."</p></blockquote>
      <h2>Structure of the Royal Kitchen</h2>
      <p>The Qajar kitchen was known as <strong>"Khan-Salari"</strong>.</p>
      <h2>Daily Tables</h2>
      <p>Naser al-Din Shah was passionate about food, and his tables were described as luxurious and diverse.</p>
      <h2>Qajar Kitchen in Doha</h2>
      <p>At <strong>"Kabab Dagh Nan Dagh"</strong> restaurant in Doha, we honor the culinary heritage of the Qajar era.</p>`,
      ar: `<p>كان المطبخ الملكي، المعروف باسم <strong>"خان سالاري"</strong> في بلاط ناصر الدين شاه، واحداً من أهم الدوائر البلاطية. كان هذا المطبخ أكثر من مجرد توفير الطعام — بل كان رمزاً <strong>لهيبة الملك والكرم الفارسي والذوق الفني</strong>.</p>
      <blockquote><p>👑 "مائدة ناصر الدين شاه، بكل ما فيها من ترف وعادات، هي سردية حية لإيران القاجارية."</p></blockquote>
      <h2>هيكل المطبخ الملكي</h2>
      <p>كان المطبخ القاجاري يُعرف باسم <strong>"خان سالاري"</strong>.</p>
      <h2>الموائد اليومية</h2>
      <p>كان ناصر الدين شاه شغوفاً بالطعام، ووصفت موائده بالفخامة والتنوع.</p>
      <h2>المطبخ القاجاري في الدوحة</h2>
      <p>في مطعم <strong>"كباب داغ نان داغ"</strong> في الدوحة، نكرم التراث الطهوي للعصر القاجاري.</p>`
    },
    tags: ['ناصرالدین‌شاه', 'قاجار', 'آشپزخانه قاجاری', 'سفره سلطنتی', 'تاریخ آشپزی ایران', 'فرهنگ غذایی', 'کباب داغ نان داغ', 'دوحه']
  },

  // ===== مقاله ۵: غذاهای تصادفی =====
  {
    slug: 'accidental-foods-from-italian-persian-arabic-american-cuisines',
    author: 'تیم تحریریه کباب داغ نان داغ',
    category: 'fun-facts',
    status: 'published',
    featured: false,
    title: {
      fa: 'غذاهای تصادفی از آشپزخانه‌های ایتالیایی، ایرانی، عربی/لبنانی و آمریکایی',
      en: 'Accidental Foods from Italian, Persian, Arabic/Lebanese and American Kitchens',
      ar: 'الأطعمة المصادفة من المطابخ الإيطالية والفارسية والعربية/اللبنانية والأمريكية'
    },
    excerpt: {
      fa: 'داستان‌های جذاب غذاهای جهان که بر اثر اشتباه یا تصادف خلق شدند؛ از پیتزا و تیرامیسو تا ته‌دیگ و کباب کوبیده، از فتوش و حمص تا کوکی چیپسی شکلات و چیپس سیب‌زمینی.',
      en: 'Fascinating stories of world-famous dishes born from mistakes and accidents — from Pizza and Tiramisu to Tahdig and Kebab Kubideh, from Fattoush and Hummus to Chocolate Chip Cookies and Potato Chips.',
      ar: 'قصص رائعة لأطباق عالمية شهيرة ولدت من أخطاء وصدف — من البيتزا والتيراميسو إلى التهديغ والكباب كوبيده، من الفتوش والحمص إلى كوكيز رقائق الشوكولاتة ورقائق البطاطس.'
    },
    content: {
      fa: `<p>گاهی بهترین چیزها در زندگی از <strong>تصادف</strong> به وجود می‌آیند — و غذاها هم از این قاعده مستثنی نیستند. بسیاری از محبوب‌ترین غذاهای جهان نه از روی برنامه‌ریزی دقیق، بلکه از <strong>اشتباهات آشپزی، کمبود مواد، بدخلقی مشتریان یا حتی جنگ</strong> متولد شده‌اند.</p>
      <blockquote><p>🍽️ «اشتباهات در آشپزخانه، گاهی خوش‌طعم‌ترین ابداعات تاریخ را خلق کرده‌اند.»</p></blockquote>
      <h2>🇮🇹 آشپزخانه ایتالیایی</h2>
      <h3>پیتزا مارگاریتا</h3>
      <p>در سال ۱۸۸۹، <strong>رافائل اسپادافورا</strong> برای ملکه مارگاریتا پیتزایی با رنگ‌های پرچم ایتالیا پخت.</p>
      <h3>تیرامیسو</h3>
      <p>در منطقه <strong>ونتتو</strong>، آشپزها برای استفاده از بیسکویت‌های مانده، این دسر را خلق کردند.</p>
      <h2>🇮🇷 آشپزخانه ایرانی</h2>
      <h3>ته‌دیگ</h3>
      <p>وقتی برنج کف قابلمه برشته می‌شد، به جای دور ریختن، آن را به عنوان <strong>لقمه‌ طلایی</strong> کشف کردند.</p>
      <h3>کباب کوبیده</h3>
      <p>آشپزهای قفقازی در دربار <strong>ناصرالدین‌شاه</strong> گوشت را چرخ کردند و کوبیدند.</p>
      <h2>🇱🇧 آشپزخانه عربی و لبنانی</h2>
      <h3>فتوش</h3>
      <p><strong>نان‌های خشک‌مانده</strong> را خرد کردند و به سالاد اضافه کردند.</p>
      <h3>حمص</h3>
      <p>له کردن <strong>نخود پخته</strong> با tahini برای استفاده از بقایا.</p>
      <h2>🇺🇸 آشپزخانه آمریکایی</h2>
      <h3>کوکی چیپسی شکلات</h3>
      <p><strong>روث ویکفیلد</strong> به جای پودر کاکائو، تکه‌های شکلات را داخل خمیر ریخت.</p>
      <h3>چیپس سیب‌زمینی</h3>
      <p><strong>جرج کرام</strong> از مشتری بدقلق عصبانی شد و سیب‌زمینی را نازک برش داد.</p>`,
      en: `<p>Sometimes the best things in life come from <strong>accidents</strong> — and food is no exception. Many of the world's most beloved dishes were not born from careful planning, but from <strong>culinary mistakes, ingredient shortages, cranky customers, or even war</strong>.</p>
      <blockquote><p>🍽️ "Mistakes in the kitchen have sometimes created the tastiest inventions in history."</p></blockquote>
      <h2>🇮🇹 Italian Cuisine</h2>
      <h3>Pizza Margherita</h3>
      <p>In 1889, <strong>Raffaele Esposito</strong> baked a pizza with the colors of the Italian flag for Queen Margherita.</p>
      <h3>Tiramisù</h3>
      <p>In the <strong>Veneto</strong> region, chefs created this dessert using leftover ladyfinger biscuits.</p>
      <h2>🇮🇷 Persian Cuisine</h2>
      <h3>Tahdig</h3>
      <p>When rice became crispy at the bottom of the pot, it was discovered as a <strong>golden delicacy</strong>.</p>
      <h3>Kebab Kubideh</h3>
      <p>Caucasian chefs in the court of <strong>Naser al-Din Shah</strong> ground and pounded meat.</p>
      <h2>🇱🇧 Arabic & Lebanese Cuisine</h2>
      <h3>Fattoush</h3>
      <p><strong>Stale bread</strong> was crumbled and added to salads.</p>
      <h3>Hummus</h3>
      <p>Mashing <strong>cooked chickpeas</strong> with tahini to use leftovers.</p>
      <h2>🇺🇸 American Cuisine</h2>
      <h3>Chocolate Chip Cookie</h3>
      <p><strong>Ruth Wakefield</strong> added chocolate chunks instead of cocoa powder.</p>
      <h3>Potato Chips</h3>
      <p><strong>George Crum</strong> got angry at a fussy customer and sliced potatoes paper-thin.</p>`,
      ar: `<p>أحياناً تأتي أفضل الأشياء في الحياة من <strong>الصدف</strong> — والطعام ليس استثناءً. الكثير من أشهر الأطباق في العالم لم تولد من تخطيط دقيق، بل من <strong>أخطاء طهو، نقص في المكونات، زبائن متذمرين، أو حتى الحروب</strong>.</p>
      <blockquote><p>🍽️ "أحياناً تخلق الأخطاء في المطبخ ألذ الاختراعات في التاريخ."</p></blockquote>
      <h2>🇮🇹 المطبخ الإيطالي</h2>
      <h3>بيتزا مارغريتا</h3>
      <p>في عام ١٨٨٩، خبز <strong>رافاييل إسبوزيتو</strong> بيتزا بألوان العلم الإيطالي للملكة مارغريتا.</p>
      <h3>تيراميسو</h3>
      <p>في منطقة <strong>فينيتو</strong>، صنع الطهاة هذه الحلوى باستخدام بسكويت السيدة المتبقي.</p>
      <h2>🇮🇷 المطبخ الفارسي</h2>
      <h3>تهديغ</h3>
      <p>عندما أصبح الأرز مقرمشاً في قاع القدر، تم اكتشافه كـ <strong>طبق ذهبي</strong>.</p>
      <h3>كباب كوبيده</h3>
      <p>قام طهاة قوقازيون في بلاط <strong>ناصر الدين شاه</strong> بفرم اللحم وطحنه.</p>
      <h2>🇱🇧 المطبخ العربي واللبناني</h2>
      <h3>فتوش</h3>
      <p>تم تفتيت <strong>الخبز القديم</strong> وإضافته إلى السلطة.</p>
      <h3>حمص</h3>
      <p>هرس <strong>الحمص المطبوخ</strong> مع الطحينة لاستخدام البقايا.</p>
      <h2>🇺🇸 المطبخ الأمريكي</h2>
      <h3>كوكيز رقائق الشوكولاتة</h3>
      <p><strong>روث ويكفيلد</strong> أضافت قطع الشوكولاتة بدلاً من مسحوق الكاكاو.</p>
      <h3>رقائق البطاطس</h3>
      <p><strong>جورج كرام</strong> غضب من زبون متذمر وقطع البطاطس إلى شرائح رقيقة جداً.</p>`
    },
    tags: ['غذاهای تصادفی', 'پیتزا', 'تیرامیسو', 'ته‌دیگ', 'کباب کوبیده', 'فتوش', 'حمص', 'کوکی چیپسی', 'چیپس سیب‌زمینی', 'تاریخ آشپزی', 'کباب داغ نان داغ']
  }
];

const seedArticles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/iranian-restaurant');
    console.log('✅ Connected to DB. Seeding articles...');
    
    await Article.deleteMany({});
    console.log('🗑️ All existing articles removed.');
    
    const inserted = await Article.insertMany(articlesData);
    console.log(`✅ ${inserted.length} articles seeded successfully!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding articles:', error);
    process.exit(1);
  }
};

seedArticles();
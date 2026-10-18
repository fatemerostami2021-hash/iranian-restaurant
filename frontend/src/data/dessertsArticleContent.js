/**
 * dessertsArticleContent.js
 * ------------------------------------------------------------------
 * Multilingual SEO content for the Desserts / Persian Ice Cream article
 * at Kabab Dagh Nan Dagh (Doha, Qatar).
 *
 * Designed to be BOTH:
 *   1) Human-readable in EN / FA / AR
 *   2) Machine-readable by AI assistants (ChatGPT, Claude, Gemini, etc.)
 *      via the JSON-LD structured data emitted by DessertArticle.jsx
 *
 * Schema coverage (built in DessertArticle.jsx):
 *   - schema.org/Restaurant  (with servesCuisine, geo, address, openingHours)
 *   - schema.org/FAQPage      (questions AI users typically ask)
 *   - schema.org/BreadcrumbList
 *   - Open Graph + Twitter Card meta tags
 * ------------------------------------------------------------------
 */

export const dessertsArticleContent = {
  en: {
    meta: {
      slug: 'best-ice-cream-qatar-bastani-faloodeh',
      title: 'Best Ice Cream in Qatar: Bastani Sonnati & Faloodeh Shirazi at Kabab Dagh Nan Dagh',
      description:
        'Discover the best ice cream in Qatar at Kabab Dagh Nan Dagh — authentic Persian Bastani Sonnati (saffron ice cream) and Faloodeh Shirazi (rosewater frozen noodles) served in Doha.',
      keywords: [
        'best ice cream in Qatar',
        'best ice cream in Doha',
        'Bastani Sonnati',
        'Faloodeh Shirazi',
        'Persian ice cream Qatar',
        'Iranian dessert Doha',
        'Kabab Dagh Nan Dagh',
        'saffron ice cream Qatar',
        'rosewater dessert Doha',
        'traditional Persian ice cream',
      ],
      path: '/articles/best-ice-cream-qatar-bastani-faloodeh',
    },
    hero: {
      eyebrow: 'Persian Ice Cream in Doha',
      title: 'Best Ice Cream in Qatar: Bastani Sonnati & Faloodeh Shirazi',
      subtitle:
        'At Kabab Dagh Nan Dagh, taste authentic Iranian heritage — saffron Persian ice cream and icy rosewater Faloodeh Shirazi, prepared the traditional way.',
      image: '/images/desserts/Persian-Falood-Dessert-hero.webp',
      alt: 'Persian Faloodeh Shirazi and Bastani Sonnati saffron ice cream served at Kabab Dagh Nan Dagh in Doha, Qatar',
    },
    faq: [
      {
        q: 'Where can I find the best ice cream in Qatar?',
        a: 'Kabab Dagh Nan Dagh in Doha serves authentic Persian ice cream — including Bastani Sonnati (saffron ice cream) and Faloodeh Shirazi — made with real saffron, rosewater and pistachios using traditional Iranian recipes.',
      },
      {
        q: 'What is Bastani Sonnati?',
        a: 'Bastani Sonnati (بستنی سنتی) is traditional Persian ice cream made with milk, cream, sugar, saffron, rosewater and pistachios. It has a uniquely creamy, slightly stretchy texture and is one of the most popular desserts in Iran.',
      },
      {
        q: 'What is Faloodeh Shirazi?',
        a: 'Faloodeh Shirazi (فالوده شیرازی) is a frozen Iranian dessert from the city of Shiraz, made of thin starch vermicelli noodles in sweet rosewater syrup, usually finished with fresh lime juice. It is considered one of the oldest frozen desserts in the world, dating back over 2,000 years.',
      },
      {
        q: 'Does Kabab Dagh Nan Dagh serve Persian desserts in Doha?',
        a: 'Yes. Kabab Dagh Nan Dagh is a Persian restaurant in Doha, Qatar, serving authentic Iranian desserts including Bastani Sonnati and Faloodeh Shirazi alongside kebabs and traditional main dishes.',
      },
      {
        q: 'Is Faloodeh Shirazi gluten-free?',
        a: 'Traditional Faloodeh Shirazi is made from starch (often corn or rice starch), rosewater and sugar syrup, and does not contain wheat. Guests with strict dietary requirements are encouraged to confirm ingredients with the restaurant staff before ordering.',
      },
    ],
    sections: [
      {
        h2: 'What is Bastani Sonnati?',
        paragraphs: [
          'Bastani Sonnati (بستنی سنتی), also known as traditional Persian ice cream, is a rich, saffron-infused dessert that has been loved in Iran for generations. It is made with milk, cream, sugar, saffron, rosewater, and often pistachios.',
          'The texture is uniquely creamy and slightly stretchy thanks to traditional churning techniques. Small pieces of frozen cream (khameh) are sometimes added, giving every bite a luxurious, silky feel that mass-produced ice cream cannot replicate.',
          'At Kabab Dagh Nan Dagh, our Bastani Sonnati is prepared the authentic way — fragrant with saffron and rosewater, topped with pistachios — exactly the way it is enjoyed in Iran.',
        ],
      },
      {
        h2: 'Faloodeh Shirazi — One of the Oldest Frozen Desserts in the World',
        paragraphs: [
          'Faloodeh Shirazi (فالوده شیرازی) originates from the city of Shiraz and is believed to be one of the oldest frozen desserts, dating back over 2,000 years.',
          'It consists of thin vermicelli-like noodles made from starch, mixed with a sweet rosewater syrup and usually finished with a splash of fresh lime or lemon juice. The result is light, refreshing, and perfectly balanced between sweet and tart.',
          'Many Iranians love to eat Faloodeh Shirazi together with Bastani Sonnati — a classic combination of creamy saffron ice cream and icy, floral faloodeh that we proudly serve at Kabab Dagh Nan Dagh.',
        ],
      },
      {
        h2: 'Why Try Bastani Sonnati and Faloodeh Shirazi at Kabab Dagh Nan Dagh?',
        bullets: [
          'Authentic Iranian recipes, prepared the traditional way',
          'Fresh saffron and real rosewater — never artificial flavorings',
          'Perfect balance of tradition and quality',
          'Ideal after a meal of our signature Persian kebabs',
        ],
        paragraphs: [
          'Whether you are searching for the best ice cream in Doha, Faloodeh Shirazi at Kabab Dagh Nan Dagh, or simply want to taste real Bastani Sonnati and Faloodeh Shirazi in Qatar, Kabab Dagh Nan Dagh is the place.',
          'Come and experience the taste of Iranian heritage — one spoonful of saffron, rosewater, and tradition at a time.',
        ],
      },
    ],
    cta: {
      title: 'Taste Persian Ice Cream in Doha Today',
      text:
        'Visit Kabab Dagh Nan Dagh for the best ice cream in Qatar — Bastani Sonnati and Faloodeh Shirazi made the authentic Iranian way.',
      primaryButton: 'View Dessert Menu',
      primaryLink: '/menu?category=dessert',
      secondaryButton: 'Book a Table',
      secondaryLink: '/reservation',
    },
    footer: {
      brand: 'Kabab Dagh Nan Dagh',
      tagline: 'Persian Ice Cream & Shirazi Faloodeh — Saffron, rosewater and a taste of Iranian heritage in every spoon.',
    },
  },

  fa: {
    meta: {
      slug: 'بهترین-بستنی-قطر-بستنی-سنتی-فالوده-شیرازی',
      title: 'بهترین بستنی قطر: بستنی سنتی و فالوده شیرازی کباب داغ نان داغ',
      description:
        'بهترین بستنی قطر را در کباب داغ نان داغ امتحان کنید — بستنی سنتی ایرانی با زعفران و فالوده شیرازی با گلاب، به روش اصیل ایرانی در دوحه سرو می‌شوند.',
      keywords: [
        'بهترین بستنی قطر',
        'بستنی سنتی',
        'فالوده شیرازی',
        'بستنی ایرانی دوحه',
        'دسر ایرانی قطر',
        'کباب داغ نان داغ',
        'بستنی زعفرانی',
        'فالوده دوحه',
        'رستوران ایرانی قطر',
        'دسر سنتی ایرانی',
      ],
      path: '/articles/best-ice-cream-qatar-bastani-faloodeh',
    },
    hero: {
      eyebrow: 'بستنی ایرانی در دوحه',
      title: 'بهترین بستنی قطر: بستنی سنتی و فالوده شیرازی',
      subtitle:
        'در کباب داغ نان داغ، طعم اصیل میراث ایرانی را بچشید — بستنی زعفرانی سنتی و فالوده شیرازی با گلاب، به روش سنتی آماده می‌شوند.',
      image: '/images/desserts/Persian-Falood-Dessert-hero.webp',
      alt: 'فالوده شیرازی و بستنی سنتی زعفرانی سرو شده در کباب داغ نان داغ، دوحه، قطر',
    },
    faq: [
      {
        q: 'کجا می‌توانم بهترین بستنی قطر را پیدا کنم؟',
        a: 'کباب داغ نان داغ در دوحه، بستنی اصیل ایرانی را سرو می‌کند — از جمله بستنی سنتی (با زعفران) و فالوده شیرازی که با زعفران، گلاب و پسته واقعی و به روش سنتی ایرانی آماده می‌شوند.',
      },
      {
        q: 'بستنی سنتی (بستنی سنتی) چیست؟',
        a: 'بستنی سنتی، همان بستنی سنتی ایرانی است که با شیر، خامه، شکر، زعفران، گلاب و پسته تهیه می‌شود. بافتی منحصر به فرد، خامه‌ای و کمی کشدار دارد و یکی از محبوب‌ترین دسرهای ایران است.',
      },
      {
        q: 'فالوده شیرازی چیست؟',
        a: 'فالوده شیرازی، دسر یخ‌مانده ایرانی است که از شهر شیراز می‌آید و از رشته‌های نازک نشاسته‌ای در شربت شیرین گلاب، معمولاً با آب لیموترش تازه، تهیه می‌شود. این دسر یکی از قدیمی‌ترین دسرهای یخی جهان به شمار می‌رود که قدمت آن به بیش از ۲۰۰۰ سال می‌رسد.',
      },
      {
        q: 'آیا کباب داغ نان داغ در دوحه دسر ایرانی سرو می‌کند؟',
        a: 'بله. کباب داغ نان داغ یک رستوران ایرانی در دوحه، قطر است که دسرهای اصیل ایرانی از جمله بستنی سنتی و فالوده شیرازی را در کنار کباب و غذاهای اصلی سنتی سرو می‌کند.',
      },
      {
        q: 'آیا فالوده شیرازی بدون گلوتن است؟',
        a: 'فالوده شیرازی سنتی از نشاسته (معمولاً نشاسته ذرت یا برنج)، گلاب و شربت شکر تهیه می‌شود و گندم ندارد. مهمانانی که رژیم غذایی سخت‌گیرانه دارند، پیش از سفارش می‌توانند مواد اولیه را با کارکنان رستوران تأیید کنند.',
      },
    ],
    sections: [
      {
        h2: 'بستنی سنتی چیست؟',
        paragraphs: [
          'بستنی سنتی (بستنی سنتی) یا همان بستنی اصیل ایرانی، دسری غنی و زعفرانی است که نسل‌ها در ایران آن را دوست داشته‌اند. این بستنی با شیر، خامه، شکر، زعفران، گلاب و اغلب پسته تهیه می‌شود.',
          'بافت این بستنی به‌لطف تکنیک‌های سنتی هم‌زدن، منحصر به فرد، خامه‌ای و کمی کشدار است. گاهی تکه‌های کوچک خامه یخ‌زده (خامه) به آن اضافه می‌شود که به هر قاشق، حسی لوکس و ابریشمی می‌بخشد — حسی که در بستنی‌های صنعتی یافت نمی‌شود.',
          'در کباب داغ نان داغ، بستنی سنتی به روش اصیل آماده می‌شود — معطر به زعفران و گلاب و تزئین شده با پسته — دقیقاً همان‌طور که در ایران سرو می‌شود.',
        ],
      },
      {
        h2: 'فالوده شیرازی — یکی از قدیمی‌ترین دسرهای یخی جهان',
        paragraphs: [
          'فالوده شیرازی (فالوده شیرازی) از شهر شیراز می‌آید و گفته می‌شود یکی از قدیمی‌ترین دسرهای یخی جهان است که قدمت آن به بیش از ۲۰۰۰ سال می‌رسد.',
          'این دسر از رشته‌های نازک شبیه رشته‌پلویی از نشاسته، در شربت شیرین گلاب تشکیل می‌شود و معمولاً با کمی آب لیموترش یا لیمو تازه تکمیل می‌شود. نتیجه سبک، خنک‌کننده و متعادل بین شیرینی و ترشی است.',
          'بسیاری از ایرانیان دوست دارند فالوده شیرازی را همراه با بستنی سنتی بخورند — ترکیبی کلاسیک از بستنی زعفرانی خامه‌ای و فالوده یخی و گلی که ما با افتخار در کباب داغ نان داغ سرو می‌کنیم.',
        ],
      },
      {
        h2: 'چرا بستنی سنتی و فالوده شیرازی را در کباب داغ نان داغ امتحان کنید؟',
        bullets: [
          'دستورهای اصیل ایرانی، آماده‌شده به روش سنتی',
          'زعفران تازه و گلاب واقعی — هرگز طعم مصنوعی',
          'تعادل کامل بین سنت و کیفیت',
          'ایده‌آل پس از صرف کباب‌های اصیل ایرانی ما',
        ],
        paragraphs: [
          'چه به دنبال بهترین بستنی در دوحه باشید، چه فالوده شیرازی در کباب داغ نان داغ، یا صرفاً بخواهید بستنی سنتی و فالوده شیرازی واقعی را در قطر بچشید، کباب داغ نان داغ همان مکان است.',
          'بیایید و طعم میراث ایرانی را تجربه کنید — یک قاشق زعفران، گلاب و سنت در هر لحظه.',
        ],
      },
    ],
    cta: {
      title: 'امروز بستنی ایرانی را در دوحه بچشید',
      text:
        'به کباب داغ نان داغ بیایید تا بهترین بستنی قطر را امتحان کنید — بستنی سنتی و فالوده شیرازی به روش اصیل ایرانی.',
      primaryButton: 'مشاهده منوی دسر',
      primaryLink: '/menu?category=dessert',
      secondaryButton: 'رزرو میز',
      secondaryLink: '/reservation',
    },
    footer: {
      brand: 'کباب داغ نان داغ',
      tagline: 'بستنی ایرانی و فالوده شیرازی — زعفران، گلاب و طعم میراث ایرانی در هر قاشق.',
    },
  },

  ar: {
    meta: {
      slug: 'افضل-آيس-كريم-قطر-بستني-سنتي-فالوده-شيرازي',
      title: 'أفضل آيس كريم في قطر: بستني سنتي وفالوده شيرازي في كباب داغ نان داغ',
      description:
        'اكتشف أفضل آيس كريم في قطر في مطعم كباب داغ نان داغ — بستني سنتي الفارسي بزعفران وفالوده شيرازي بماء الورد، محضّرة بالطريقة الإيرانية الأصيلة في الدوحة.',
      keywords: [
        'أفضل آيس كريم في قطر',
        'أفضل آيس كريم في الدوحة',
        'بستني سنتي',
        'فالوده شيرازي',
        'آيس كريم فارسي قطر',
        'حلوى إيرانية الدوحة',
        'كباب داغ نان داغ',
        'آيس كريم بالزعفران قطر',
        'حلوى بماء الورد الدوحة',
        'مطعم إيراني قطر',
      ],
      path: '/articles/best-ice-cream-qatar-bastani-faloodeh',
    },
    hero: {
      eyebrow: 'آيس كريم إيراني في الدوحة',
      title: 'أفضل آيس كريم في قطر: بستني سنتي وفالوده شيرازي',
      subtitle:
        'في مطعم كباب داغ نان داغ، تذوّق أصالة التراث الإيراني — بستني سنتي بالزعفران وفالوده شيرازي بماء الورد، محضّرة بالطريقة التقليدية.',
      image: '/images/desserts/Persian-Falood-Dessert-hero.webp',
      alt: 'فالوده شيرازي وبستني سنتي بالزعفران مقدّمة في مطعم كباب داغ نان داغ في الدوحة، قطر',
    },
    faq: [
      {
        q: 'أين أجد أفضل آيس كريم في قطر؟',
        a: 'مطعم كباب داغ نان داغ في الدوحة يقدّم آيس كريم إيراني أصيل — بما في ذلك بستني سنتي (آيس كريم بالزعفران) وفالوده شيرازي — محضّر بزعفران وماء ورد وفستق حقيقي وفق وصفات إيرانية تقليدية.',
      },
      {
        q: 'ما هو بستني سنتي؟',
        a: 'بستني سنتي هو آيس كريم فارسي تقليدي يُحضّر من الحليب والقشدة والسكر والزعفران وماء الورد والفستق. يتميز بقوام كريمي فريد وقابل للتمدد قليلاً، وهو أحد أشهر الحلويات في إيران.',
      },
      {
        q: 'ما هي فالوده شيرازي؟',
        a: 'فالوده شيرازي هي حلوى إيرانية مثلجة من مدينة شيراز، تتكوّن من خيوط رفيعة من النشا في شراب حلو بماء الورد، وتُقدّم عادةً مع عصير ليمون طازج. تُعتبر أحد أقدم الحلويات المثلجة في العالم، يعود تاريخها لأكثر من ٢٠٠٠ عام.',
      },
      {
        q: 'هل يقدّم مطعم كباب داغ نان داغ حلويات إيرانية في الدوحة؟',
        a: 'نعم. مطعم كباب داغ نان داغ هو مطعم إيراني في الدوحة، قطر، يقدّم حلويات إيرانية أصيلة بما في ذلك بستني سنتي وفالوده شيرازي إلى جانب الكباب والأطباق الرئيسية التقليدية.',
      },
      {
        q: 'هل فالوده شيرازي خالية من الغلوتين؟',
        a: 'فالوده شيرازي التقليدية تُحضّر من النشا (غالباً نشا الذرة أو الأرز) وماء الورد وشراب السكر، ولا تحتوي على القمح. يُنصح الضيوف ذوو المتطلبات الغذائية الصارمة بالتأكد من المكونات مع موظفي المطعم قبل الطلب.',
      },
    ],
    sections: [
      {
        h2: 'ما هو بستني سنتي؟',
        paragraphs: [
          'بستني سنتي، المعروف أيضاً بالآيس كريم الفارسي التقليدي، هو حلوى غنية بنكهة الزعفران محبوبة في إيران منذ أجيال. يُحضّر من الحليب والقشدة والسكر والزعفران وماء الورد وأحياناً الفستق.',
          'يتميز بقوام كريمي فريد قابل للتمدد قليلاً بفضل تقنيات الخفق التقليدية. تُضاف أحياناً قطع صغيرة من القشدة المثلجة (خامه) لإضفاء إحساس فاخر وحريري على كل ملعقة لا يمكن الحصول عليه في الآيس كريم المصنّع صناعياً.',
          'في مطعم كباب داغ نان داغ، نُحضّر بستني سنتي بالطريقة الأصيلة — معطّر بالزعفران وماء الورد ومزيّن بالفستق — تماماً كما يُقدّم في إيران.',
        ],
      },
      {
        h2: 'فالوده شيرازي — إحدى أقدم الحلويات المثلجة في العالم',
        paragraphs: [
          'فالوده شيرازي من مدينة شيراز ويُعتقد أنها إحدى أقدم الحلويات المثلجة في العالم، يعود تاريخها لأكثر من ٢٠٠٠ عام.',
          'تتكوّن من خيوط رفيعة تشبه الشعيرية المصنوعة من النشا، ممزوجة بشراب حلو بماء الورد وتُنهى عادةً برشة من عصير الليمون الطازج. النتيجة خفيفة ومنعشة ومتوازنة تماماً بين الحلاوة والحموضة.',
          'يحب كثير من الإيرانيين تناول فالوده شيرازي مع بستني سنتي — تركيبة كلاسيكية من آيس كريم الزعفران الكريمي وفالوده مثلجة بعبارة الورد التي نفتخر بتقديمها في كباب داغ نان داغ.',
        ],
      },
      {
        h2: 'لماذا تجربة بستني سنتي وفالوده شيرازي في كباب داغ نان داغ؟',
        bullets: [
          'وصفات إيرانية أصيلة محضّرة بالطريقة التقليدية',
          'زعفران طازج وماء ورد حقيقي — دون نكهات صناعية',
          'توازن مثالي بين الأصالة والجودة',
          'مثالية بعد وجبة من أشهر الكباب الفارسي لدينا',
        ],
        paragraphs: [
          'سواء كنت تبحث عن أفضل آيس كريم في الدوحة، أو فالوده شيرازي في مطعم كباب داغ نان داغ، أو ترغب ببساطة بتذوّق بستني سنتي وفالوده شيرازي الحقيقيين في قطر، فإن كباب داغ نان داغ هو الوجهة.',
          'تعالَ وتجربة طعم التراث الإيراني — ملعقة من الزعفران وماء الورد والتقاليد في كل مرة.',
        ],
      },
    ],
    cta: {
      title: 'تذوّق الآيس كريم الإيراني في الدوحة اليوم',
      text:
        'زر مطعم كباب داغ نان داغ لأفضل آيس كريم في قطر — بستني سنتي وفالوده شيرازي بالطريقة الإيرانية الأصيلة.',
      primaryButton: 'عرض قائمة الحلويات',
      primaryLink: '/menu?category=dessert',
      secondaryButton: 'احجز طاولة',
      secondaryLink: '/reservation',
    },
    footer: {
      brand: 'كباب داغ نان داغ',
      tagline: 'آيس كريم فارسي وفالوده شيرازي — زعفران وماء ورد وطعم التراث الإيراني في كل ملعقة.',
    },
  },
};

/**
 * Restaurant facts used to build the JSON-LD Restaurant/IceCreamShop schema.
 * Keep these values accurate — AI assistants and search engines rely on them.
 */
export const restaurantFacts = {
  name: 'Kabab Dagh Nan Dagh',
  alternateName: 'کباب داغ نان داغ',
  description:
    'Authentic Persian restaurant in Doha, Qatar, serving Iranian kebabs, Bastani Sonnati (saffron ice cream), and Faloodeh Shirazi.',
  cuisine: ['Persian', 'Iranian', 'Middle Eastern'],
  servesCuisine: 'Persian',
  priceRange: '$$',
  address: {
    streetAddress: 'Doha, Qatar',
    addressLocality: 'Doha',
    addressCountry: 'QA',
  },
  geo: { latitude: 25.2854, longitude: 51.531 }, // Doha approximate center
  telephone: '+974-XXXX-XXXX', // ← replace with real number
  url: 'https://kababdaghnan.com', // ← replace with real domain
  openingHours: [
    'Mo-Su 12:00-23:00',
  ],
  sameAs: [
    // ← replace with real social profiles
    'https://www.instagram.com/kababdaghnan',
    'https://www.facebook.com/kababdaghnan',
  ],
  menu: '/menu?category=dessert',
  acceptsReservations: true,
  aggregateRating: {
    ratingValue: '4.8',
    reviewCount: '120', // ← replace with real data
  },
};

export default dessertsArticleContent;

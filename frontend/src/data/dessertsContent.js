/**
 * dessertsContent.js  (EXTENDED)
 * ------------------------------------------------------------------
 * Local dessert catalogue used by:
 *   - MegaMenu.jsx  (sidebar "Desserts" box)
 *   - Menu.jsx      (when category === 'dessert' AND the API returns
 *                    no real dishes with dessert keywords, we fall
 *                    back to these two signature items so the page
 *                    never shows "No matching dishes found")
 *
 * Each item has the SAME shape as a dish from the API so DishCard can
 * render it without modification.
 * ------------------------------------------------------------------
 */

export const dessertsContent = {
  en: {
    title: 'Desserts',
    subtitle: 'Authentic Persian ice cream & Faloodeh Shirazi',
    items: {
      bastani: {
        _id: 'dessert-bastani',
        code: 'DESS-001',
        category: 'dessert',
        name: { en: 'Bastani Sonnati', fa: 'بستنی سنتی', ar: 'بستني سنتي' },
        description: {
          en: 'Traditional Persian saffron ice cream with rosewater and pistachios.',
          fa: 'بستنی سنتی زعفرانی ایرانی با گلاب و پسته.',
          ar: 'بستني سنتي فارسي بالزعفران وماء الورد والفستق.',
        },
        price: 25,
        images: ['/images/desserts/bastani-sonnati.png'],
      },
      falooda: {
        _id: 'dessert-falooda',
        code: 'DESS-002',
        category: 'dessert',
        name: { en: 'Faloodeh Shirazi', fa: 'فالوده شیرازی', ar: 'فالوده شيرازي' },
        description: {
          en: 'Frozen rosewater vermicelli with fresh lime juice — over 2,000 years old.',
          fa: 'رشته‌های نشاسته‌ای یخ‌زده با گلاب و آب لیموترش تازه — قدمت بیش از ۲۰۰۰ سال.',
          ar: 'خيوط نشا مثلجة بماء الورد وعصير ليمون طازج — عمرها أكثر من ٢٠٠٠ عام.',
        },
        price: 22,
        images: ['/images/desserts/faloodeh-shirazi.png'],
      },
    },
  },
  fa: {
    title: 'دسرها',
    subtitle: 'بستنی اصیل ایرانی و فالوده شیرازی',
    items: {
      bastani: {
        _id: 'dessert-bastani',
        code: 'DESS-001',
        category: 'dessert',
        name: { en: 'Bastani Sonnati', fa: 'بستنی سنتی', ar: 'بستني سنتي' },
        description: {
          en: 'Traditional Persian saffron ice cream with rosewater and pistachios.',
          fa: 'بستنی سنتی زعفرانی ایرانی با گلاب و پسته.',
          ar: 'بستني سنتي فارسي بالزعفران وماء الورد والفستق.',
        },
        price: 25,
        images: ['/images/desserts/bastani-sonnati.png'],
      },
      falooda: {
        _id: 'dessert-falooda',
        code: 'DESS-002',
        category: 'dessert',
        name: { en: 'Faloodeh Shirazi', fa: 'فالوده شیرازی', ar: 'فالوده شيرازي' },
        description: {
          en: 'Frozen rosewater vermicelli with fresh lime juice — over 2,000 years old.',
          fa: 'رشته‌های نشاسته‌ای یخ‌زده با گلاب و آب لیموترش تازه — قدمت بیش از ۲۰۰۰ سال.',
          ar: 'خيوط نشا مثلجة بماء الورد وعصير ليمون طازج — عمرها أكثر من ٢٠٠٠ عام.',
        },
        price: 22,
        images: ['/images/desserts/faloodeh-shirazi.png'],
      },
    },
  },
  ar: {
    title: 'الحلويات',
    subtitle: 'آيس كريم فارسي أصيل وفالوده شيرازي',
    items: {
      bastani: {
        _id: 'dessert-bastani',
        code: 'DESS-001',
        category: 'dessert',
        name: { en: 'Bastani Sonnati', fa: 'بستنی سنتی', ar: 'بستني سنتي' },
        description: {
          en: 'Traditional Persian saffron ice cream with rosewater and pistachios.',
          fa: 'بستنی سنتی زعفرانی ایرانی با گلاب و پسته.',
          ar: 'بستني سنتي فارسي بالزعفران وماء الورد والفستق.',
        },
        price: 25,
        images: ['/images/desserts/bastani-sonnati.png'],
      },
      falooda: {
        _id: 'dessert-falooda',
        code: 'DESS-002',
        category: 'dessert',
        name: { en: 'Faloodeh Shirazi', fa: 'فالوده شیرازی', ar: 'فالوده شيرازي' },
        description: {
          en: 'Frozen rosewater vermicelli with fresh lime juice — over 2,000 years old.',
          fa: 'رشته‌های نشاسته‌ای یخ‌زده با گلاب و آب لیموترش تازه — قدمت بیش از ۲۰۰۰ سال.',
          ar: 'خيوط نشا مثلجة بماء الورد وعصير ليمون طازج — عمرها أكثر من ٢٠٠٠ عام.',
        },
        price: 22,
        images: ['/images/desserts/faloodeh-shirazi.png'],
      },
    },
  },
};

/**
 * Returns an array of dessert dishes for the given language.
 *
 * IMPORTANT: `description` is flattened to a STRING in the active language
 * because DishCard (and similar components) typically render it directly
 * in JSX like `<p>{dish.description}</p>`. If we kept it as `{en,fa,ar}`
 * React would throw "Objects are not valid as a React child".
 *
 * `name` is kept as `{en,fa,ar}` because the cart code in Menu.jsx uses
 * `item.name?.[lang] || item.name?.en` to extract the right language.
 */
export function getLocalDesserts(lang = 'en') {
  const l = (lang || 'en').slice(0, 2);
  const data = dessertsContent[l] || dessertsContent.en;
  return [
    {
      ...data.items.bastani,
      description: data.items.bastani.description[l] || data.items.bastani.description.en,
    },
    {
      ...data.items.falooda,
      description: data.items.falooda.description[l] || data.items.falooda.description.en,
    },
  ];
}

export default dessertsContent;

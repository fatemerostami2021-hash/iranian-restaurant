import { useTranslation } from 'react-i18next';
import { MdPhoneInTalk, MdEmail, MdLocationOn } from 'react-icons/md';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <MdPhoneInTalk size={32} className="text-primary" />
        <h1 className="text-3xl font-bold text-primary-dark dark:text-primary-light">
          {t('nav.contact')}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* اطلاعات تماس */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="flex items-center gap-3">
            <MdLocationOn size={24} className="text-primary" />
            <span className="text-gray-600 dark:text-gray-300">Salwa Road, Doha, Qatar</span>
          </div>
          <div className="flex items-center gap-3">
            <MdPhoneInTalk size={24} className="text-primary" />
            <span className="text-gray-600 dark:text-gray-300" dir="ltr">+974 3300 0157</span>
          </div>
          <div className="flex items-center gap-3">
            <MdEmail size={24} className="text-primary" />
            <span className="text-gray-600 dark:text-gray-300">rostamy141@gmail.com</span>
          </div>
        </div>

        {/* فرم تماس */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">
            فرم تماس در حال ساخت است...
          </p>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { MdArrowBack, MdVisibility, MdAccessTime, MdCalendarToday, MdShare, MdContentCopy, MdOutlineWhatsapp } from 'react-icons/md';
import { FaFacebookF, FaTwitter } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const lang = i18n.language;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/articles/${slug}`);
        setArticle(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  const bgClass = isDark ? 'bg-[#1C1C1C]' : 'bg-[#F7F0E6]';
  const cardBg = isDark ? 'bg-[#2D2D2D]' : 'bg-white';
  const textColor = isDark ? 'text-[#F7F0E6]' : 'text-[#3E2723]';
  const mutedColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-[#3E2723]' : 'border-[#E0D5C8]';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
        <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${bgClass} ${textColor} p-4`}>
        <h1 className="text-2xl font-bold mb-4">{error || 'مقاله یافت نشد'}</h1>
        <Link to="/articles" className="text-[#FFD700] hover:underline flex items-center gap-2">
          <MdArrowBack /> {t('articles.backToList', 'بازگشت به لیست مقالات')}
        </Link>
      </div>
    );
  }

  const title = article.title?.[lang] || article.title?.fa || 'بدون عنوان';
  const content = article.content?.[lang] || article.content?.fa || '';
  const excerpt = article.excerpt?.[lang] || article.excerpt?.fa || '';
  const category = typeof article.category === 'object' ? (article.category?.[lang] || article.category?.fa || '') : (article.category || '');
  const image = article.images && article.images.length > 0
    ? (article.images[0].startsWith('http') ? article.images[0] : `${API_URL}${article.images[0]}`)
    : '/images/articles/placeholder.jpg';
  const date = article.publishedAt ? new Date(article.publishedAt) : new Date();
  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(title);

  return (
    <div className={`min-h-screen pt-24 pb-16 ${bgClass} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/articles" className={`inline-flex items-center gap-2 text-sm font-medium hover:text-[#FFD700] transition-colors mb-8 ${mutedColor}`}>
          <MdArrowBack /> {t('articles.backToList', 'بازگشت به لیست مقالات')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* === ستون اصلی مقاله === */}
          <div className="lg:col-span-2">
            <article className={`${cardBg} rounded-2xl overflow-hidden shadow-lg border ${borderColor}`}>
              <div className="relative h-96 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="inline-block text-white text-xs font-bold bg-[#FFD700] px-3 py-1 rounded-full mb-4">
                    {category}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
                    {title}
                  </h1>
                </div>
              </div>

              <div className="p-6 md:p-10">
                {excerpt && <p className={`text-xl font-medium mb-8 leading-relaxed ${mutedColor} border-r-4 border-[#FFD700] pr-4`}>{excerpt}</p>}
                
                {/* رندر HTML با استایل‌های مجله‌ای */}
                <div 
                  className={`prose prose-lg max-w-none ${isDark ? 'prose-invert' : ''} 
                    prose-headings:font-black prose-headings:text-[#FFD700] 
                    prose-p:leading-loose prose-a:text-[#FFD700] 
                    prose-blockquote:border-[#FFD700] prose-blockquote:bg-[#FFD700]/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-xl
                    prose-strong:text-[#FFD700]
                  `}
                  dangerouslySetInnerHTML={{ __html: content }} 
                />
              </div>
            </article>
          </div>

          {/* === سایدبار (Sidebar) === */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* اطلاعات نویسنده و تاریخ */}
              <div className={`${cardBg} rounded-2xl p-6 border ${borderColor} shadow-lg`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#FFD700] flex items-center justify-center text-2xl font-black text-black">
                    {article.author ? article.author.charAt(0) : 'K'}
                  </div>
                  <div>
                    <p className={`font-bold ${textColor}`}>{article.author || 'مدیریت رستوران'}</p>
                    <p className={`text-sm ${mutedColor}`}>نویسنده</p>
                  </div>
                </div>
                <div className={`flex flex-col gap-3 text-sm ${mutedColor} border-t ${borderColor} pt-4`}>
                  <span className="flex items-center gap-2">
                    <MdCalendarToday size={18} className="text-[#FFD700]" />
                    {date.toLocaleDateString(lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-2">
                    <MdAccessTime size={18} className="text-[#FFD700]" />
                    {article.readTime || 5} {t('articles.readTime', 'دقیقه مطالعه')}
                  </span>
                  <span className="flex items-center gap-2">
                    <MdVisibility size={18} className="text-[#FFD700]" />
                    {article.views || 0} {t('articles.views', 'بازدید')}
                  </span>
                </div>
              </div>

              {/* اشتراک‌گذاری */}
              <div className={`${cardBg} rounded-2xl p-6 border ${borderColor} shadow-lg`}>
                <h3 className={`font-bold mb-4 flex items-center gap-2 ${textColor}`}>
                  <MdShare className="text-[#FFD700]" /> اشتراک‌گذاری
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  <a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noreferrer" className="flex items-center justify-center p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500/20 transition-colors">
                    <MdOutlineWhatsapp size={20} />
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="flex items-center justify-center p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500/20 transition-colors">
                    <FaFacebookF size={16} />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noreferrer" className="flex items-center justify-center p-3 bg-sky-500/10 text-sky-500 rounded-xl hover:bg-sky-500/20 transition-colors">
                    <FaTwitter size={16} />
                  </a>
                  <button onClick={handleCopyLink} className="flex items-center justify-center p-3 bg-gray-500/10 text-gray-500 rounded-xl hover:bg-gray-500/20 transition-colors">
                    {copied ? '✓' : <MdContentCopy size={18} />}
                  </button>
                </div>
              </div>

              {/* تگ‌ها */}
              {article.tags && article.tags.length > 0 && (
                <div className={`${cardBg} rounded-2xl p-6 border ${borderColor} shadow-lg`}>
                  <h3 className={`font-bold mb-4 ${textColor}`}>تگ‌های مرتبط</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, i) => (
                      <span key={i} className={`px-3 py-1 text-sm rounded-full ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
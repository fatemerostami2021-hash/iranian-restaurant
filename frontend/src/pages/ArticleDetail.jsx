import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import {
  MdArrowBack,
  MdVisibility,
  MdAccessTime,
  MdCalendarToday,
  MdShare,
  MdContentCopy,
  MdOutlineWhatsapp,
  MdArrowUpward,
  MdBookmarkBorder,
  MdCheckCircle,
  MdOutlineAccessTimeFilled,
  MdStar,
  MdStarBorder,
  MdThumbUp,
  MdThumbUpOffAlt,
  MdComment,
  MdSend,
  MdPerson,
  MdVerified,
  MdOutlineReportProblem,
} from 'react-icons/md';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import DOMPurify from 'dompurify';

const API_URL = import.meta.env.VITE_API_URL || '';

// ============================================================
// 🎯 کامپوننت ستاره‌ها (امتیازدهی)
// ============================================================
function StarRating({ rating, onRating, readonly = false, size = 'md', isDark = false }) {
  const [hovered, setHovered] = useState(0);
  const { t } = useTranslation();

  const sizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRating?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          disabled={readonly}
          className={`transition-all duration-200 ${!readonly && 'hover:scale-125'} ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          {star <= (hovered || rating) ? (
            <MdStar className={`${sizes[size]} text-[#F4B41A] drop-shadow-[0_0_8px_rgba(244,180,26,0.3)]`} />
          ) : (
            <MdStarBorder className={`${sizes[size]} ${isDark ? 'text-gray-500' : 'text-gray-300'}`} />
          )}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// 🎯 کامپوننت نظر
// ============================================================
function CommentItem({ comment, isDark, onLike, onReport }) {
  const [liked, setLiked] = useState(false);
  const { t } = useTranslation();

  const handleLike = () => {
    setLiked(!liked);
    onLike?.(comment.id);
  };

  return (
    <div className={`p-4 rounded-xl border ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-gray-50'}`}>
      <div className="flex items-start gap-3">
        {/* آواتار */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-black ${
          isDark ? 'bg-[#F4B41A]/20 text-[#F4B41A]' : 'bg-[#D32F2F]/10 text-[#D32F2F]'
        }`}>
          {comment.userName?.charAt(0) || 'U'}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* نام کاربر و تاریخ */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
              {comment.userName || t('comments.anonymous', 'ناشناس')}
            </span>
            {comment.isVerified && (
              <MdVerified className="text-blue-500 text-sm" title={t('comments.verified', 'تایید شده')} />
            )}
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
            </span>
          </div>
          
          {/* امتیاز */}
          <div className="mb-1">
            <StarRating 
              rating={comment.rating} 
              readonly 
              size="sm"
              isDark={isDark}
            />
          </div>
          
          {/* متن نظر */}
          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {comment.text}
          </p>
          
          {/* دکمه‌های تعامل */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                liked 
                  ? 'text-blue-500' 
                  : isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {liked ? <MdThumbUp size={14} /> : <MdThumbUpOffAlt size={14} />}
              <span>{comment.likes || 0}</span>
            </button>
            <button
              onClick={() => onReport?.(comment.id)}
              className={`text-xs ${isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
            >
              <MdOutlineReportProblem size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🎯 کامپوننت اصلی مقاله با نظرات
// ============================================================
export default function ArticleDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const lang = i18n.language;
  const isRtl = lang === 'fa' || lang === 'ar';

  // ===== State های مقاله =====
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);
  const contentRef = useRef(null);

  // ===== State های کامنت و لایک =====
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentRating, setCommentRating] = useState(0);
  const [commentUserName, setCommentUserName] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [articleLiked, setArticleLiked] = useState(false);
  const [articleLikes, setArticleLikes] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [showAllComments, setShowAllComments] = useState(false);
  const commentsRef = useRef(null);

  // ===== دریافت مقاله =====
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/articles/${slug}`);
        setArticle(res.data);
        setArticleLikes(res.data.likes || 0);
        setComments(res.data.comments || []);
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

  // ===== استخراج سرفصل‌ها =====
  useEffect(() => {
    if (!article?.content) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(article.content, 'text/html');
    const hTags = Array.from(doc.querySelectorAll('h2, h3'));
    setHeadings(
      hTags.map((h, i) => ({
        id: h.id || `heading-${i}`,
        text: h.textContent,
        level: h.tagName,
      }))
    );
  }, [article]);

  // ===== اسکرول =====
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowBackTop(scrollTop > 600);

      if (!contentRef.current) return;
      const hElements = contentRef.current.querySelectorAll('h2, h3');
      let current = '';
      hElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140) current = el.id;
      });
      if (current) setActiveHeading(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [article]);

  // ===== کپی لینک =====
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ===== اسکرول به سرفصل =====
  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ===== ارسال نظر =====
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const token = localStorage.getItem('customerToken');
      const response = await axios.post(
        `${API_URL}/api/articles/${article._id}/comments`,
        {
          text: newComment,
          rating: commentRating,
          userName: commentUserName || 'ناشناس',
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      setComments([response.data, ...comments]);
      setNewComment('');
      setCommentRating(0);
      setCommentUserName('');
      
      // اسکرول به بخش نظرات
      commentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      alert('خطا در ارسال نظر: ' + err.response?.data?.message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // ===== لایک مقاله =====
  const handleLikeArticle = async () => {
    try {
      const token = localStorage.getItem('customerToken');
      await axios.post(
        `${API_URL}/api/articles/${article._id}/like`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setArticleLiked(!articleLiked);
      setArticleLikes(prev => articleLiked ? prev - 1 : prev + 1);
    } catch (err) {
      alert('خطا در ثبت لایک');
    }
  };

  // ===== امتیازدهی به مقاله =====
  const handleRateArticle = async (rating) => {
    try {
      const token = localStorage.getItem('customerToken');
      await axios.post(
        `${API_URL}/api/articles/${article._id}/rate`,
        { rating },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setUserRating(rating);
    } catch (err) {
      alert('خطا در ثبت امتیاز');
    }
  };

  // ===== حذف نظر =====
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('آیا از حذف این نظر مطمئن هستید؟')) return;
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('customerToken');
      await axios.delete(`${API_URL}/api/articles/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      alert('خطا در حذف نظر');
    }
  };

  // ============================================================
  // ===== رندر =====
  // ============================================================

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#F7F0E6]'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-[3px] border-[#F4B41A] border-t-transparent rounded-full animate-spin" />
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('loading', 'در حال بارگذاری...')}
          </p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-[#0A0A0A] text-[#F7F0E6]' : 'bg-[#F7F0E6] text-[#1A1A1A]'} p-6`}>
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <MdBookmarkBorder size={36} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-black mb-3">{error || t('articles.notFound', 'مقاله یافت نشد')}</h1>
        <Link
          to="/articles"
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black transition-all hover:scale-105"
          style={{ background: isDark ? '#F4B41A' : '#D32F2F' }}
        >
          <MdArrowBack /> {t('articles.backToList', 'بازگشت به لیست مقالات')}
        </Link>
      </div>
    );
  }

  const title = article.title?.[lang] || article.title?.fa || t('articles.untitled', 'بدون عنوان');
  const content = article.content?.[lang] || article.content?.fa || '';
  const excerpt = article.excerpt?.[lang] || article.excerpt?.fa || '';
  const category = typeof article.category === 'object'
    ? article.category?.[lang] || article.category?.fa || ''
    : article.category || '';

  const rawImage = article.images?.[0];
  let image = '/images/articles/placeholder.svg';
  if (rawImage) {
    image = rawImage.startsWith('http')
      ? rawImage
      : `${API_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
  }

  const date = article.publishedAt ? new Date(article.publishedAt) : new Date();
  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(title);

  const averageRating = comments.length > 0
    ? (comments.reduce((acc, c) => acc + (c.rating || 0), 0) / comments.length).toFixed(1)
    : 0;

  // ============================================================
  // ===== بازگشت رندر اصلی =====
  // ============================================================

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#F7F0E6]'} transition-colors duration-500`}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
        <div
          className="h-full transition-all duration-150"
          style={{
            width: `${readingProgress}%`,
            background: isDark
              ? 'linear-gradient(90deg, #F4B41A, #FFE082)'
              : 'linear-gradient(90deg, #D32F2F, #FF8A80)',
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] max-h-[600px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/articles/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/30" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <div className={`flex items-center gap-2 text-xs font-medium mb-4 ${isDark ? 'text-gray-400' : 'text-gray-200'}`}>
              <Link to="/" className="hover:text-[#F4B41A] transition-colors">{t('nav.home', 'خانه')}</Link>
              <span>/</span>
              <Link to="/articles" className="hover:text-[#F4B41A] transition-colors">{t('nav.articles', 'مقالات')}</Link>
              <span>/</span>
              <span className="text-[#F4B41A]">{category}</span>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-3 bg-[#F4B41A]/15 text-[#F4B41A] border border-[#F4B41A]/30">
              {category}
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight max-w-4xl drop-shadow-2xl">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-gray-200">
              <span className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#F4B41A] flex items-center justify-center text-black font-black text-xs">
                  {article.author ? article.author.charAt(0) : 'K'}
                </div>
                <span className="font-bold text-white">{article.author || t('articles.defaultAuthor', 'مدیریت')}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MdCalendarToday size={14} className="text-[#F4B41A]" />
                {date.toLocaleDateString(isRtl ? 'fa-IR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <MdOutlineAccessTimeFilled size={14} className="text-[#F4B41A]" />
                {article.readTime || 5} {t('articles.minRead', 'دقیقه')}
              </span>
              <span className="flex items-center gap-1.5">
                <MdVisibility size={14} className="text-[#F4B41A]" />
                {(article.views || 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <MdThumbUp size={14} className="text-[#F4B41A]" />
                {articleLikes}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* TOC */}
              {headings.length > 0 && (
                <div className={`rounded-2xl border p-5 shadow-xl ${isDark ? 'bg-[#141414]/80 border-white/10 backdrop-blur-xl' : 'bg-white/80 border-black/5 backdrop-blur-xl'}`}>
                  <h3 className={`font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2 ${isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]'}`}>
                    <MdBookmarkBorder size={18} className="text-[#F4B41A]" />
                    {t('articles.tableOfContents', 'فهرست مطالب')}
                  </h3>
                  <nav className="space-y-1">
                    {headings.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => scrollToHeading(h.id)}
                        className={`block w-full text-right text-sm font-medium py-2 px-3 rounded-xl transition-all duration-200 ${
                          activeHeading === h.id
                            ? isDark
                              ? 'bg-[#F4B41A]/15 text-[#F4B41A] font-bold'
                              : 'bg-[#D32F2F]/10 text-[#D32F2F] font-bold'
                            : isDark
                            ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                            : 'text-gray-500 hover:bg-black/5 hover:text-gray-800'
                        } ${h.level === 'H3' ? 'pr-6 text-xs' : ''}`}
                      >
                        {h.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Author */}
              <div className={`rounded-2xl border p-5 shadow-xl ${isDark ? 'bg-[#141414]/80 border-white/10 backdrop-blur-xl' : 'bg-white/80 border-black/5 backdrop-blur-xl'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#F4B41A] flex items-center justify-center text-lg font-black text-black shrink-0">
                    {article.author ? article.author.charAt(0) : 'K'}
                  </div>
                  <div>
                    <p className={`font-bold ${isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]'}`}>{article.author || t('articles.defaultAuthor', 'مدیریت رستوران')}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('articles.authorRole', 'نویسنده و کارشناس آشپزی')}</p>
                  </div>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('articles.authorBio', 'با بیش از ۱۵ سال تجربه در آشپزی سنتی ایرانی و عربی، دستورهای اصیل و رازهای طعم‌دار کردن غذاها را با شما به اشتراک می‌گذارد.')}
                </p>
              </div>

              {/* Share */}
              <div className={`rounded-2xl border p-5 shadow-xl ${isDark ? 'bg-[#141414]/80 border-white/10 backdrop-blur-xl' : 'bg-white/80 border-black/5 backdrop-blur-xl'}`}>
                <h3 className={`font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2 ${isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]'}`}>
                  <MdShare size={18} className="text-[#F4B41A]" />
                  {t('articles.shareArticle', 'اشتراک‌گذاری')}
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { icon: MdOutlineWhatsapp, color: 'bg-green-500', href: `https://wa.me/?text=${shareText}%20${shareUrl}` },
                    { icon: FaFacebookF, color: 'bg-blue-600', href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
                    { icon: FaTwitter, color: 'bg-sky-500', href: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}` },
                    { icon: FaLinkedinIn, color: 'bg-blue-700', href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noreferrer" className={`${s.color} p-2.5 rounded-xl text-white flex items-center justify-center transition-transform hover:scale-110`}>
                      <s.icon size={16} />
                    </a>
                  ))}
                  <button
                    onClick={handleCopyLink}
                    className={`p-2.5 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${
                      copied ? 'bg-green-500 text-white' : isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-black/5 text-gray-600 hover:bg-black/10'
                    }`}
                  >
                    {copied ? <MdCheckCircle size={16} /> : <MdContentCopy size={16} />}
                  </button>
                </div>
              </div>

              {/* Tags */}
              {article.tags?.length > 0 && (
                <div className={`rounded-2xl border p-5 shadow-xl ${isDark ? 'bg-[#141414]/80 border-white/10 backdrop-blur-xl' : 'bg-white/80 border-black/5 backdrop-blur-xl'}`}>
                  <h3 className={`font-black text-sm uppercase tracking-wider mb-4 ${isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]'}`}>
                    {t('articles.relatedTags', 'تگ‌های مرتبط')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, i) => (
                      <span key={i} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${isDark ? 'bg-white/5 text-gray-300 hover:bg-[#F4B41A]/10 hover:text-[#F4B41A]' : 'bg-black/5 text-gray-600 hover:bg-[#D32F2F]/10 hover:text-[#D32F2F]'}`}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Article Body */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            {/* Excerpt */}
            {excerpt && (
              <div className={`rounded-2xl p-6 md:p-8 mb-8 border-r-4 ${isDark ? 'bg-[#F4B41A]/8 border-[#F4B41A]' : 'bg-[#D32F2F]/5 border-[#D32F2F]'}`}>
                <p className={`text-lg md:text-xl font-bold leading-relaxed ${isDark ? 'text-gray-100' : 'text-[#3E2723]'}`}>
                  {excerpt}
                </p>
              </div>
            )}

            {/* Content */}
            <article
              ref={contentRef}
              className={`article-content ${isDark ? 'text-gray-200' : 'text-[#3E2723]'}`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content, { ADD_ATTR: ['id'] }),
              }}
            />

            {/* ============================================================
                🎯 بخش تعامل با مقاله (لایک + امتیاز)
                ============================================================ */}
            <div className={`mt-10 p-6 rounded-2xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-gray-50'}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  {/* لایک */}
                  <button
                    onClick={handleLikeArticle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 ${
                      articleLiked
                        ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                        : isDark
                        ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                        : 'bg-black/5 text-gray-600 hover:bg-black/10'
                    }`}
                  >
                    {articleLiked ? <MdThumbUp size={18} /> : <MdThumbUpOffAlt size={18} />}
                    <span>{articleLikes}</span>
                  </button>

                  {/* امتیازدهی */}
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('articles.rate', 'امتیاز شما:')}
                    </span>
                    <StarRating 
                      rating={userRating} 
                      onRating={handleRateArticle} 
                      size="md"
                      isDark={isDark}
                    />
                  </div>
                </div>

                {/* میانگین امتیاز */}
                {comments.length > 0 && (
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="font-bold text-[#F4B41A]">{averageRating}</span>
                    {t('articles.averageRating', 'از ۵ ستاره')}
                  </div>
                )}
              </div>
            </div>

            {/* ============================================================
                🎯 بخش نظرات
                ============================================================ */}
            <div ref={commentsRef} className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <MdComment size={24} className={isDark ? 'text-[#F4B41A]' : 'text-[#D32F2F]'} />
                  <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                    {t('articles.comments', 'نظرات')}
                    <span className={`text-sm font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({comments.length})
                    </span>
                  </h3>
                </div>
                {comments.length > 3 && (
                  <button
                    onClick={() => setShowAllComments(!showAllComments)}
                    className={`text-sm font-bold ${isDark ? 'text-[#F4B41A] hover:text-[#FFD700]' : 'text-[#D32F2F] hover:text-[#B71C1C]'}`}
                  >
                    {showAllComments ? t('articles.showLess', 'نمایش کمتر') : t('articles.showAll', 'نمایش همه')}
                  </button>
                )}
              </div>

              {/* فرم نظر جدید */}
              <form onSubmit={handleSubmitComment} className={`p-6 rounded-2xl border mb-6 ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-gray-50'}`}>
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('comments.yourRating', 'امتیاز شما')}
                  </label>
                  <StarRating 
                    rating={commentRating} 
                    onRating={setCommentRating} 
                    size="md"
                    isDark={isDark}
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder={t('comments.yourName', 'نام شما (اختیاری)')}
                    value={commentUserName}
                    onChange={(e) => setCommentUserName(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                      isDark
                        ? 'bg-[#0A0A0A] border-white/10 text-white placeholder-gray-500 focus:border-[#F4B41A]/50'
                        : 'bg-white border-black/5 text-[#1A1A1A] placeholder-gray-400 focus:border-[#D32F2F]/30'
                    }`}
                  />
                </div>

                <div className="flex gap-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t('comments.writeComment', 'نظر خود را بنویسید...')}
                    rows="2"
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm outline-none border transition-all resize-none ${
                      isDark
                        ? 'bg-[#0A0A0A] border-white/10 text-white placeholder-gray-500 focus:border-[#F4B41A]/50'
                        : 'bg-white border-black/5 text-[#1A1A1A] placeholder-gray-400 focus:border-[#D32F2F]/30'
                    }`}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !newComment.trim()}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-105 disabled:opacity-50 shrink-0"
                    style={{ background: isDark ? '#F4B41A' : '#D32F2F' }}
                  >
                    {isSubmittingComment ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MdSend size={18} />
                    )}
                  </button>
                </div>
              </form>

              {/* لیست نظرات */}
              <div className="space-y-3">
                {(showAllComments ? comments : comments.slice(0, 3)).map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    isDark={isDark}
                    onLike={() => {}}
                    onReport={() => {}}
                  />
                ))}
              </div>

              {comments.length === 0 && (
                <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p>{t('comments.noComments', 'هنوز نظری ثبت نشده است. اولین نفر باشید!')}</p>
                </div>
              )}
            </div>

            {/* Bottom */}
            <div className={`mt-10 pt-6 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className={`text-sm font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('articles.foundHelpful', 'این مقاله مفید بود؟')}
                </p>
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : isDark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-black/5 text-[#1A1A1A] hover:bg-black/10'
                  }`}
                >
                  {copied ? <MdCheckCircle size={16} /> : <MdContentCopy size={16} />}
                  {copied ? t('articles.copied', 'کپی شد') : t('articles.copyLink', 'کپی لینک')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          showBackTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        } ${isDark ? 'bg-[#F4B41A] text-black hover:bg-[#FFD700]' : 'bg-[#D32F2F] text-white hover:bg-[#B71C1C]'}`}
      >
        <MdArrowUpward size={18} />
      </button>

      {/* ── Styles ── */}
      <style>{`
        .article-content h2 {
          font-size: 1.5rem;
          font-weight: 900;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
          color: ${isDark ? '#F4B41A' : '#D32F2F'};
          letter-spacing: -0.02em;
        }
        .article-content h3 {
          font-size: 1.25rem;
          font-weight: 800;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
          color: ${isDark ? '#FFD700' : '#B71C1C'};
        }
        .article-content p {
          font-size: 1.05rem;
          line-height: 2;
          margin-bottom: 1.25rem;
          font-weight: 500;
          color: ${isDark ? '#E5E5E5' : '#3E2723'};
        }
        .article-content strong,
        .article-content b {
          font-weight: 900;
          color: ${isDark ? '#FFD700' : '#B71C1C'};
          background: ${isDark ? 'rgba(244,180,26,0.12)' : 'rgba(211,47,47,0.08)'};
          padding: 0.125rem 0.375rem;
          border-radius: 0.375rem;
        }
        .article-content a {
          color: ${isDark ? '#F4B41A' : '#D32F2F'};
          font-weight: 700;
          text-decoration: none;
          border-bottom: 2px solid ${isDark ? 'rgba(244,180,26,0.3)' : 'rgba(211,47,47,0.3)'};
          transition: all 0.2s;
        }
        .article-content a:hover {
          border-bottom-color: ${isDark ? '#F4B41A' : '#D32F2F'};
        }
        .article-content blockquote {
          border-right: 4px solid ${isDark ? '#F4B41A' : '#D32F2F'};
          background: ${isDark ? 'rgba(244,180,26,0.06)' : 'rgba(211,47,47,0.04)'};
          padding: 1.25rem 1.5rem;
          margin: 1.5rem 0;
          border-radius: 0 0.75rem 0.75rem 0;
          font-weight: 700;
          font-style: normal;
          color: ${isDark ? '#E5E5E5' : '#3E2723'};
        }
        .article-content ul, .article-content ol {
          margin: 1rem 0;
          padding-right: 1.5rem;
        }
        .article-content li {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: ${isDark ? '#D4D4D4' : '#4A4A4A'};
        }
        .article-content li::marker {
          color: ${isDark ? '#F4B41A' : '#D32F2F'};
          font-size: 1.2em;
        }
        .article-content img {
          border-radius: 1rem;
          margin: 1.5rem 0;
          box-shadow: 0 8px 30px -8px ${isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)'};
        }
        .article-content hr {
          border: none;
          height: 1px;
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          margin: 2rem 0;
        }
        .article-content code {
          font-family: monospace;
          font-size: 0.9em;
          padding: 0.125rem 0.375rem;
          border-radius: 0.375rem;
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
          color: ${isDark ? '#FFD700' : '#D32F2F'};
        }
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.95rem;
        }
        .article-content th {
          background: ${isDark ? 'rgba(244,180,26,0.15)' : 'rgba(211,47,47,0.08)'};
          color: ${isDark ? '#F4B41A' : '#D32F2F'};
          font-weight: 800;
          padding: 0.75rem 1rem;
          text-align: right;
        }
        .article-content td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
          color: ${isDark ? '#D4D4D4' : '#4A4A4A'};
        }
      `}</style>
    </div>
  );
}
import { useState, useEffect, useRef } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, 
  FiX, FiRefreshCw, FiImage, FiVideo, 
  FiUpload, FiTrash, FiEye, FiClock,
  FiCalendar, FiTag, FiUser, FiSave,
  FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import axios from 'axios';

// ===== کامپوننت فرم افزودن/ویرایش مقاله =====
function ArticleForm({ article, onSave, onCancel, isEditing }) {
  const [formData, setFormData] = useState({
    title: { fa: '', en: '', ar: '' },
    slug: '', // در فرم ورودی، اسلاگ را به عنوان رشته می‌گیریم
    excerpt: { fa: '', en: '', ar: '' },
    content: { fa: '', en: '', ar: '' },
    category: 'news',
    tags: [],
    status: 'draft',
    featured: false,
    images: [],
    video: null,
    author: '',
    publishedAt: new Date().toISOString().split('T')[0]
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    if (article) {
      // هندل کردن اسلاگ اگر آبجکت باشد
      const slugValue = typeof article.slug === 'object' 
        ? (article.slug?.fa || article.slug?.en || '') 
        : (article.slug || '');

      setFormData({
        title: article.title || { fa: '', en: '', ar: '' },
        slug: slugValue,
        excerpt: article.excerpt || { fa: '', en: '', ar: '' },
        content: article.content || { fa: '', en: '', ar: '' },
        category: typeof article.category === 'object' ? article.category?.fa : (article.category || 'news'),
        tags: article.tags || [],
        status: article.status || 'draft',
        featured: article.featured || false,
        images: article.images || [],
        video: article.video || null,
        author: article.author || '',
        publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
      setPreviewImages(article.images || []);
      setPreviewVideo(article.video || null);
    }
  }, [article]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTitleChange = (lang, value) => {
    setFormData(prev => ({ ...prev, title: { ...prev.title, [lang]: value } }));
  };

  const handleExcerptChange = (lang, value) => {
    setFormData(prev => ({ ...prev, excerpt: { ...prev.excerpt, [lang]: value } }));
  };

  const handleContentChange = (lang, value) => {
    setFormData(prev => ({ ...prev, content: { ...prev.content, [lang]: value } }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    setUploadProgress(0);
    const uploadedImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) { alert(`حجم عکس ${i + 1} بیشتر از 5MB است`); continue; }
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        const token = localStorage.getItem('adminToken');
        const response = await axios.post('http://localhost:5000/api/admin/upload/image', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
          onUploadProgress: (progressEvent) => setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        });
        uploadedImages.push(response.data.url);
        setPreviewImages(prev => [...prev, response.data.url]);
      } catch (error) {
        console.error('خطا در آپلود عکس:', error);
      }
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
    setUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { alert('حجم ویدیو نباید بیشتر از 50MB باشد'); return; }
    setUploading(true);
    setUploadProgress(0);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('video', file);
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost:5000/api/admin/upload/video', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
      });
      setPreviewVideo(response.data.url);
      setFormData(prev => ({ ...prev, video: response.data.url }));
    } catch (error) {
      console.error('خطا در آپلود ویدیو:', error);
    }
    setUploading(false);
    setUploadProgress(0);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleRemoveImage = (index) => {
    const newImages = [...previewImages];
    newImages.splice(index, 1);
    setPreviewImages(newImages);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleRemoveVideo = () => {
    setPreviewVideo(null);
    setFormData(prev => ({ ...prev, video: null }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const languages = [
    { key: 'fa', label: 'فارسی', dir: 'rtl' },
    { key: 'en', label: 'English', dir: 'ltr' },
    { key: 'ar', label: 'العربية', dir: 'rtl' }
  ];

  const categoryOptions = [
    { value: 'news', label: 'اخبار' }, { value: 'blog', label: 'وبلاگ' },
    { value: 'recipes', label: 'دستور پخت' }, { value: 'events', label: 'رویدادها' },
    { value: 'promotions', label: 'تخفیف‌ها و پیشنهادها' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'پیش‌نویس' }, { value: 'published', label: 'منتشر شده' }, { value: 'archived', label: 'بایگانی شده' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{isEditing ? '✏️ ویرایش مقاله' : '➕ افزودن مقاله جدید'}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"><FiX size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">اسلاگ (آدرس)</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none" placeholder="مثلاً: article-title" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">نویسنده</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none" placeholder="نام نویسنده" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">دسته‌بندی</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none">
                {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">وضعیت</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none">
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">تاریخ انتشار</label>
              <input type="date" name="publishedAt" value={formData.publishedAt} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">عنوان (۳ زبان)</label>
            {languages.map(({ key, label, dir }) => (
              <div key={key} className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-gray-400 w-16">{label}</span>
                <input type="text" value={formData.title[key] || ''} onChange={(e) => handleTitleChange(key, e.target.value)} dir={dir} className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none" placeholder={`عنوان به ${label}`} required />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">خلاصه (۳ زبان)</label>
            {languages.map(({ key, label, dir }) => (
              <div key={key} className="flex items-start gap-2 mb-2">
                <span className="text-xs font-bold text-gray-400 w-16 pt-2">{label}</span>
                <textarea value={formData.excerpt[key] || ''} onChange={(e) => handleExcerptChange(key, e.target.value)} dir={dir} rows="2" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none" placeholder={`خلاصه به ${label}`} />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">محتوا (۳ زبان)</label>
            {languages.map(({ key, label, dir }) => (
              <div key={key} className="flex items-start gap-2 mb-2">
                <span className="text-xs font-bold text-gray-400 w-16 pt-2">{label}</span>
                <textarea value={formData.content[key] || ''} onChange={(e) => handleContentChange(key, e.target.value)} dir={dir} rows="4" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none" placeholder={`محتوا به ${label}`} />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2"><FiTag className="inline mr-1" /> تگ‌ها</label>
            <div className="flex items-center gap-2">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={handleTagKeyPress} className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none" placeholder="تگ جدید را وارد کنید و Enter بزنید" />
              <button type="button" onClick={handleAddTag} className="bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#FFC700]">افزودن</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <span key={tag} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="text-gray-500 hover:text-red-500"><FiX size={14} /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 p-3 bg-gray-800 rounded-lg">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 accent-[#FFD700]" />
              <span>مقاله ویژه</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2"><FiImage className="inline mr-1" /> عکس شاخص</label>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50" disabled={uploading}>
                <FiUpload size={16} /> {uploading ? `در حال آپلود... ${uploadProgress}%` : 'انتخاب عکس'}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              <span className="text-gray-400 text-sm">(حداکثر 5 مگابایت)</span>
            </div>
            {previewImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {previewImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt={`عکس ${index + 1}`} className="w-20 h-20 object-cover rounded-lg border border-gray-700" />
                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600"><FiTrash size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2"><FiVideo className="inline mr-1" /> ویدیو</label>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => videoInputRef.current?.click()} className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50" disabled={uploading}>
                <FiUpload size={16} /> {uploading ? `در حال آپلود... ${uploadProgress}%` : 'انتخاب ویدیو'}
              </button>
              <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
              <span className="text-gray-400 text-sm">(حداکثر 50 مگابایت)</span>
            </div>
            {previewVideo && (
              <div className="relative mt-3">
                <video src={previewVideo} controls className="w-full max-w-sm rounded-lg border border-gray-700" />
                <button type="button" onClick={handleRemoveVideo} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"><FiTrash size={14} /></button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button type="submit" className="flex-1 bg-[#FFD700] text-black font-bold p-2 rounded-lg hover:bg-[#FFC700] disabled:opacity-50" disabled={uploading}>
              <FiSave className="inline mr-2" />{isEditing ? 'ذخیره تغییرات' : 'افزودن مقاله'}
            </button>
            <button type="button" onClick={onCancel} className="px-6 bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600">❌ انصراف</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===== صفحه اصلی مدیریت مقالات =====
export default function ArticlesManagement() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const token = localStorage.getItem('adminToken');

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/articles', { headers: { Authorization: `Bearer ${token}` } });
      setArticles(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در دریافت لیست مقالات');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleSave = async (formData) => {
    try {
      if (editingArticle) {
        await axios.put(`http://localhost:5000/api/admin/articles/${editingArticle._id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('http://localhost:5000/api/admin/articles', formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchArticles();
      setShowForm(false);
      setEditingArticle(null);
    } catch (err) {
      alert('خطا در ذخیره مقاله: ' + err.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این مقاله مطمئن هستید؟')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/articles/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchArticles();
    } catch (err) {
      alert('خطا در حذف مقاله');
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title?.fa?.includes(search) || a.title?.en?.includes(search);
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length,
    archived: articles.filter(a => a.status === 'archived').length,
    featured: articles.filter(a => a.featured).length
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return 'bg-green-500/30 text-green-400';
      case 'draft': return 'bg-yellow-500/30 text-yellow-400';
      case 'archived': return 'bg-gray-500/30 text-gray-400';
      default: return 'bg-gray-500/30 text-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'published': return 'منتشر شده';
      case 'draft': return 'پیش‌نویس';
      case 'archived': return 'بایگانی شده';
      default: return status;
    }
  };

  // اصلاح شده برای هندل کردن آبجکت‌ها
  const getCategoryLabel = (category) => {
    if (!category) return 'بدون دسته';
    if (typeof category === 'object') return category.fa || category.en || 'بدون دسته';
    const map = { news: 'اخبار', blog: 'وبلاگ', recipes: 'دستور پخت', events: 'رویدادها', promotions: 'تخفیف‌ها' };
    return map[category] || category;
  };

  // تابع کمکی برای استخراج اسلاگ
  const getSlugString = (slug) => {
    if (!slug) return '-';
    if (typeof slug === 'object') return slug.fa || slug.en || '-';
    return slug;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
    </div>
  );

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">📝 مدیریت مقالات</h2>
          <p className="text-gray-400 text-sm">مدیریت مقالات به ۳ زبان (فارسی، انگلیسی، عربی)</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingArticle(null); }} className="flex items-center gap-2 bg-[#FFD700] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#FFC700]">
          <FiPlus size={18} /> افزودن مقاله جدید
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-gray-800 px-4 py-3 rounded-lg text-center"><p className="text-gray-400 text-sm">کل مقالات</p><p className="text-2xl font-bold text-[#FFD700]">{stats.total}</p></div>
        <div className="bg-gray-800 px-4 py-3 rounded-lg text-center"><p className="text-gray-400 text-sm">منتشر شده</p><p className="text-2xl font-bold text-green-400">{stats.published}</p></div>
        <div className="bg-gray-800 px-4 py-3 rounded-lg text-center"><p className="text-gray-400 text-sm">پیش‌نویس</p><p className="text-2xl font-bold text-yellow-400">{stats.draft}</p></div>
        <div className="bg-gray-800 px-4 py-3 rounded-lg text-center"><p className="text-gray-400 text-sm">بایگانی</p><p className="text-2xl font-bold text-gray-400">{stats.archived}</p></div>
        <div className="bg-gray-800 px-4 py-3 rounded-lg text-center"><p className="text-gray-400 text-sm">ویژه</p><p className="text-2xl font-bold text-purple-400">{stats.featured}</p></div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6 bg-gray-800 rounded-lg p-3">
        <div className="flex-1 min-w-[200px] flex items-center gap-2">
          <FiSearch className="text-gray-400" size={20} />
          <input type="text" placeholder="جستجو در عنوان مقاله..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent outline-none text-white" />
        </div>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]">
          <option value="all">همه دسته‌ها</option><option value="news">اخبار</option><option value="blog">وبلاگ</option><option value="recipes">دستور پخت</option><option value="events">رویدادها</option><option value="promotions">تخفیف‌ها</option>
        </select>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]">
          <option value="all">همه وضعیت‌ها</option><option value="published">منتشر شده</option><option value="draft">پیش‌نویس</option><option value="archived">بایگانی</option>
        </select>
        <button onClick={fetchArticles} className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg"><FiRefreshCw size={18} /></button>
      </div>

      {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-4">⚠️ {error}</div>}

      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-700/50">
              <tr className="text-right text-gray-400 text-sm">
                <th className="p-3 text-center">عکس</th><th className="p-3">عنوان</th><th className="p-3">دسته‌بندی</th><th className="p-3">وضعیت</th><th className="p-3">تاریخ</th><th className="p-3 text-center">ویژه</th><th className="p-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-gray-400 p-8">{search ? '🔍 هیچ مقاله‌ای با این نام پیدا نشد' : '📭 هنوز مقاله‌ای ثبت نشده است'}</td></tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article._id} className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                    <td className="p-3">
                      {article.images && article.images.length > 0 ? (
                        <img src={article.images[0]} alt={article.title?.fa || 'article'} className="w-16 h-12 object-cover rounded-lg border border-gray-600 mx-auto" />
                      ) : (
                        <div className="w-16 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 mx-auto"><FiImage size={20} /></div>
                      )}
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{article.title?.fa || '-'}</p>
                        <p className="text-xs text-gray-500 font-mono">{getSlugString(article.slug)}</p>
                        {article.video && <span className="text-xs text-blue-400 flex items-center gap-1 mt-1"><FiVideo size={12} /> ویدیو</span>}
                      </div>
                    </td>
                    <td className="p-3"><span className="px-2 py-1 bg-gray-700 rounded-full text-xs">{getCategoryLabel(article.category)}</span></td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(article.status)}`}>
                        {article.status === 'published' ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}{getStatusLabel(article.status)}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-400">
                      <div className="flex flex-col items-center">
                        <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('fa-IR') : '-'}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">{article.featured ? <span className="text-purple-400">⭐ ویژه</span> : <span className="text-gray-500">-</span>}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => window.open(`/articles/${getSlugString(article.slug)}`, '_blank')} className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30" title="مشاهده"><FiEye size={16} /></button>
                        <button onClick={() => { setEditingArticle(article); setShowForm(true); }} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30" title="ویرایش"><FiEdit2 size={16} /></button>
                        <button onClick={() => handleDelete(article._id)} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30" title="حذف"><FiTrash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <ArticleForm article={editingArticle} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingArticle(null); }} isEditing={!!editingArticle} />
      )}
    </div>
  );
}
import { useState, useEffect, useRef } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, 
  FiX, FiRefreshCw, FiImage, FiVideo, 
  FiUpload, FiTrash, FiCheckCircle, FiXCircle 
} from 'react-icons/fi';
import axios from 'axios';

// ===== کامپوننت فرم افزودن/ویرایش با آپلود عکس و ویدیو =====
function DishForm({ dish, onSave, onCancel, isEditing }) {
  const [formData, setFormData] = useState({
    code: '',
    name: { fa: '', en: '', ar: '' },
    category: 'main',
    price: 0,
    unit: 'پرس',
    description: { fa: '', en: '', ar: '' },
    inStock: true,
    images: [],
    video: null
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    if (dish) {
      setFormData({
        code: dish.code || '',
        name: dish.name || { fa: '', en: '', ar: '' },
        category: dish.category || 'main',
        price: dish.price || 0,
        unit: dish.unit || 'پرس',
        description: dish.description || { fa: '', en: '', ar: '' },
        inStock: dish.inStock !== undefined ? dish.inStock : true,
        images: dish.images || [],
        video: dish.video || null
      });
      setPreviewImages(dish.images || []);
      setPreviewVideo(dish.video || null);
    }
  }, [dish]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNameChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      name: { ...prev.name, [lang]: value }
    }));
  };

  const handleDescChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      description: { ...prev.description, [lang]: value }
    }));
  };

  // ===== آپلود عکس =====
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const uploadedImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        const token = localStorage.getItem('adminToken');
        const response = await axios.post(
          'http://localhost:5000/api/admin/upload/image',
          formDataUpload,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            }
          }
        );

        uploadedImages.push(response.data.url);
        setPreviewImages(prev => [...prev, response.data.url]);
      } catch (error) {
        console.error('خطا در آپلود عکس:', error);
        alert(`خطا در آپلود عکس ${i + 1}`);
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedImages]
    }));
    setUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ===== آپلود ویدیو =====
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('حجم ویدیو نباید بیشتر از 50MB باشد');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('video', file);

      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        'http://localhost:5000/api/admin/upload/video',
        formDataUpload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      );

      setPreviewVideo(response.data.url);
      setFormData(prev => ({ ...prev, video: response.data.url }));
    } catch (error) {
      console.error('خطا در آپلود ویدیو:', error);
      alert('خطا در آپلود ویدیو');
    }
    setUploading(false);
    setUploadProgress(0);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  // ===== حذف عکس =====
  const handleRemoveImage = (index) => {
    const newImages = [...previewImages];
    newImages.splice(index, 1);
    setPreviewImages(newImages);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  // ===== حذف ویدیو =====
  const handleRemoveVideo = () => {
    setPreviewVideo(null);
    setFormData(prev => ({ ...prev, video: null }));
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
    { value: 'breakfast', label: 'صبحانه' },
    { value: 'main', label: 'غذای اصلی' },
    { value: 'combo', label: 'سینی‌ها' },
    { value: 'appetizer', label: 'پیش‌غذا' },
    { value: 'drinks', label: 'نوشیدنی‌ها' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? '✏️ ویرایش غذا' : '➕ افزودن غذای جدید'}
          </h2>
          <button 
            onClick={onCancel} 
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* کد و قیمت */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">کد غذا</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none"
                placeholder="مثلاً: FOOD-001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">قیمت (QR)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none"
                required
                min="0"
              />
            </div>
          </div>

          {/* دسته‌بندی و واحد */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">دسته‌بندی</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none"
              >
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">واحد</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none"
                placeholder="مثلاً: پرس، عدد، لیوان"
              />
            </div>
          </div>

          {/* نام به ۳ زبان */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">نام غذا (۳ زبان)</label>
            {languages.map(({ key, label, dir }) => (
              <div key={key} className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-gray-400 w-16">{label}</span>
                <input
                  type="text"
                  value={formData.name[key] || ''}
                  onChange={(e) => handleNameChange(key, e.target.value)}
                  dir={dir}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none"
                  placeholder={`نام به ${label}`}
                  required
                />
              </div>
            ))}
          </div>

          {/* توضیحات به ۳ زبان */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">توضیحات (۳ زبان)</label>
            {languages.map(({ key, label, dir }) => (
              <div key={key} className="flex items-start gap-2 mb-2">
                <span className="text-xs font-bold text-gray-400 w-16 pt-2">{label}</span>
                <textarea
                  value={formData.description[key] || ''}
                  onChange={(e) => handleDescChange(key, e.target.value)}
                  dir={dir}
                  rows="2"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFD700] focus:outline-none"
                  placeholder={`توضیحات به ${label}`}
                />
              </div>
            ))}
          </div>

          {/* ===== آپلود عکس شاخص ===== */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiImage className="inline mr-1" /> عکس شاخص
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                disabled={uploading}
              >
                <FiUpload size={16} />
                {uploading ? `در حال آپلود... ${uploadProgress}%` : 'انتخاب عکس'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="text-gray-400 text-sm">(حداکثر 5 مگابایت، فرمت‌های مجاز: jpg, png, webp)</span>
            </div>
            
            {/* پیش‌نمایش عکس‌ها */}
            {previewImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {previewImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`عکس ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <FiTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== آپلود ویدیو ===== */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FiVideo className="inline mr-1" /> ویدیو
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                disabled={uploading}
              >
                <FiUpload size={16} />
                {uploading ? `در حال آپلود... ${uploadProgress}%` : 'انتخاب ویدیو'}
              </button>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
              <span className="text-gray-400 text-sm">(حداکثر 50 مگابایت، فرمت‌های مجاز: mp4, webm)</span>
            </div>
            
            {/* پیش‌نمایش ویدیو */}
            {previewVideo && (
              <div className="relative mt-3">
                <video
                  src={previewVideo}
                  controls
                  className="w-full max-w-sm rounded-lg border border-gray-700"
                />
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <FiTrash size={14} />
                </button>
              </div>
            )}
          </div>

          {/* موجودی */}
          <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                className="w-4 h-4 accent-[#FFD700]"
              />
              <span>موجود در انبار</span>
            </label>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              type="submit"
              className="flex-1 bg-[#FFD700] text-black font-bold p-2 rounded-lg hover:bg-[#FFC700] transition-colors disabled:opacity-50"
              disabled={uploading}
            >
              {isEditing ? '💾 ذخیره تغییرات' : '➕ افزودن غذا'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              ❌ انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===== صفحه اصلی مدیریت منو =====
export default function MenuManagement() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const token = localStorage.getItem('adminToken');

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/dishes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDishes(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در دریافت لیست غذاها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingDish) {
        await axios.put(`http://localhost:5000/api/admin/dishes/${editingDish._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/admin/dishes', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchDishes();
      setShowForm(false);
      setEditingDish(null);
    } catch (err) {
      alert('خطا در ذخیره غذا: ' + err.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این غذا مطمئن هستید؟')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/dishes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDishes();
    } catch (err) {
      alert('خطا در حذف غذا');
    }
  };

  const filteredDishes = dishes.filter(d => {
    const matchesSearch = 
      d.name?.fa?.includes(search) || 
      d.name?.en?.includes(search) || 
      d.code?.includes(search);
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // آمار دسته‌بندی
  const categoryStats = dishes.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {});

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
    </div>
  );

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">🍽️ مدیریت منو</h2>
          <p className="text-gray-400 text-sm">مدیریت غذاها به ۳ زبان (فارسی، انگلیسی، عربی)</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingDish(null); }}
          className="flex items-center gap-2 bg-[#FFD700] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#FFC700] transition-colors"
        >
          <FiPlus size={18} />
          افزودن غذای جدید
        </button>
      </div>

      {/* فیلترها و جستجو */}
      <div className="flex flex-wrap items-center gap-4 mb-6 bg-gray-800 rounded-lg p-3">
        <div className="flex-1 min-w-[200px] flex items-center gap-2">
          <FiSearch className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="جستجو در نام یا کد غذا..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
        >
          <option value="all">همه دسته‌ها</option>
          <option value="breakfast">صبحانه</option>
          <option value="main">غذای اصلی</option>
          <option value="combo">سینی‌ها</option>
          <option value="appetizer">پیش‌غذا</option>
          <option value="drinks">نوشیدنی‌ها</option>
        </select>
        
        <button 
          onClick={fetchDishes} 
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
        >
          <FiRefreshCw size={18} />
        </button>
      </div>

      {/* آمار */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-gray-400">کل غذاها: </span>
          <span className="font-bold text-[#FFD700]">{dishes.length}</span>
        </div>
        {Object.entries(categoryStats).map(([category, count]) => (
          <div key={category} className="bg-gray-800 px-4 py-2 rounded-lg">
            <span className="text-gray-400">{category}: </span>
            <span className="font-bold text-[#FFD700]">{count}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* جدول غذاها */}
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-700/50">
              <tr className="text-right text-gray-400 text-sm">
                <th className="p-3 text-center">عکس</th>
                <th className="p-3">کد</th>
                <th className="p-3">نام (فارسی)</th>
                <th className="p-3">نام (انگلیسی)</th>
                <th className="p-3">قیمت</th>
                <th className="p-3">دسته‌بندی</th>
                <th className="p-3 text-center">وضعیت</th>
                <th className="p-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredDishes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-gray-400 p-8">
                    {search ? '🔍 هیچ غذایی با این نام پیدا نشد' : '📭 هنوز غذایی ثبت نشده است'}
                  </td>
                </tr>
              ) : (
                filteredDishes.map((dish) => (
                  <tr key={dish._id} className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                    <td className="p-3">
                      {dish.images && dish.images.length > 0 ? (
                        <img
                          src={dish.images[0]}
                          alt={dish.name.fa}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-600 mx-auto"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 mx-auto">
                          <FiImage size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-mono text-sm text-[#FFD700]">{dish.code}</td>
                    <td className="p-3">{dish.name.fa || '-'}</td>
                    <td className="p-3 text-gray-400">{dish.name.en || '-'}</td>
                    <td className="p-3 font-bold text-[#FFD700]">{dish.price} QR</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                        {dish.category}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                          dish.inStock 
                            ? 'bg-green-500/30 text-green-400' 
                            : 'bg-red-500/30 text-red-400'
                        }`}>
                          {dish.inStock ? (
                            <><FiCheckCircle size={12} /> موجود</>
                          ) : (
                            <><FiXCircle size={12} /> ناموجود</>
                          )}
                        </span>
                        {dish.video && (
                          <span className="px-2 py-1 bg-blue-500/30 text-blue-400 rounded-full text-xs flex items-center gap-1">
                            <FiVideo size={12} />
                            ویدیو
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setEditingDish(dish); setShowForm(true); }}
                          className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                          title="ویرایش"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(dish._id)}
                          className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          title="حذف"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* تعداد کل */}
      <div className="mt-4 text-gray-400 text-sm flex justify-between items-center">
        <span>نمایش {filteredDishes.length} غذا از {dishes.length} عدد</span>
        <span className="text-xs text-gray-500">
          آخرین بروزرسانی: {new Date().toLocaleTimeString('fa-IR')}
        </span>
      </div>

      {/* فرم افزودن/ویرایش */}
      {showForm && (
        <DishForm
          dish={editingDish}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingDish(null); }}
          isEditing={!!editingDish}
        />
      )}
    </div>
  );
}
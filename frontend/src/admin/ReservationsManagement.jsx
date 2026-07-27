import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiCalendar,
  FiCheck,
  FiX,
  FiUsers,
  FiPhone,
  FiRefreshCw,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiEye,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiBell,
  FiMapPin,
  FiMessageSquare,
} from 'react-icons/fi';
import { reservationApi } from "../services/api";

const STATUS_CONFIG = {
  pending:   { labelKey: 'orderStatus.pending',   color: 'text-yellow-400',  bg: 'bg-yellow-400/10',  border: 'border-yellow-400/20',  icon: FiClock },
  confirmed: { labelKey: 'orderStatus.confirmed', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: FiCheckCircle },
  canceled:  { labelKey: 'orderStatus.canceled',  color: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/20',     icon: FiXCircle },
};

const LIMIT = 10;
const POLL_INTERVAL = 30000;

export default function ReservationsManagement() {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, canceled: 0, today: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const prevCountRef = useRef(0);
  const searchTimeout = useRef(null);

  const fetchData = useCallback(async (opts = {}) => {
    try {
      if (!opts.silent) setLoading(true);
      setError(null);

      const [resList, resStats] = await Promise.all([
        reservationApi.getAll({
          status: filter === 'all' ? undefined : filter,
          search: search.trim() || undefined,
          page,
          limit: LIMIT,
        }),
        reservationApi.getStats(),
      ]);

      const list = resList.data?.reservations || resList.data || [];
      const meta = resList.data?.pagination || {};

      setReservations(list);
      setTotalPages(meta.totalPages || 1);
      setStats(resStats.data || {});

      const currentCount = meta.total || list.length;
      if (prevCountRef.current > 0 && currentCount > prevCountRef.current) {
        const diff = currentCount - prevCountRef.current;
        addToast(t('reservations.newArrived', '{{count}} رزرو جدید', { count: diff }));
      }
      prevCountRef.current = currentCount;
    } catch (err) {
      setError(err.response?.data?.message || t('admin.fetchError', 'خطا در دریافت اطلاعات'));
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [filter, search, page, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const id = setInterval(() => fetchData({ silent: true }), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchData]);

  const handleSearch = (val) => {
    setSearch(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
    }, 400);
  };

  const addToast = (msg) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await reservationApi.updateStatus(id, status);
      setReservations((prev) =>
        prev.map((r) => (r._id === id || r.id === id ? { ...r, status } : r))
      );
      addToast(t('reservations.statusUpdated', 'وضعیت به‌روزرسانی شد'));
      fetchData({ silent: true });
    } catch {
      addToast(t('reservations.updateFailed', 'خطا در به‌روزرسانی'));
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const exportCSV = () => {
    const headers = ['ID', 'Customer', 'Phone', 'Date', 'Time', 'Guests', 'Status'];
    const rows = reservations.map((r) => [
      r._id || r.id,
      r.customerName || r.customer,
      r.phone,
      r.date,
      r.time,
      r.guests,
      r.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const BOM = "\ufeff";
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = reservations;

  return (
    <div className="text-white min-h-full">
      {/* Toasts */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FFD700] text-black font-bold text-sm shadow-2xl animate-bounce"
          >
            <FiBell size={16} />
            {toast.msg}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <FiCalendar className="text-[#FFD700]" size={28} />
            {t('admin.reservations', 'مدیریت رزروها')}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{t('reservations.subtitle', 'مشاهده و مدیریت رزروهای میز و سالن')}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm font-bold transition-colors"
          >
            <FiDownload size={16} />
            <span className="hidden sm:inline">{t('reservations.export', 'خروجی')}</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFD700] text-black text-sm font-bold hover:bg-[#FFE082] transition-all disabled:opacity-50"
          >
            <FiRefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{t('reservations.refresh', 'بروزرسانی')}</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { key: 'total', label: t('reservations.total', 'کل رزروها'), value: stats.total || 0, color: 'bg-blue-500', text: 'text-blue-400', bgSoft: 'bg-blue-500/10' },
          { key: 'today', label: t('reservations.today', 'امروز'), value: stats.today || 0, color: 'bg-[#FFD700]', text: 'text-[#FFD700]', bgSoft: 'bg-[#FFD700]/10' },
          { key: 'pending', label: t('reservations.pending', 'در انتظار'), value: stats.pending || 0, color: 'bg-yellow-500', text: 'text-yellow-400', bgSoft: 'bg-yellow-500/10' },
          { key: 'confirmed', label: t('reservations.confirmed', 'تایید شده'), value: stats.confirmed || 0, color: 'bg-emerald-500', text: 'text-emerald-400', bgSoft: 'bg-emerald-500/10' },
        ].map((s) => (
          <div key={s.key} className={`${s.bgSoft} border border-gray-800 rounded-2xl p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
              <FiUsers size={18} className="text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-[11px] font-medium">{s.label}</p>
              <p className={`text-xl font-black ${s.text}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t('reservations.searchPlaceholder', 'جستجو بر اساس نام یا شماره...')}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 outline-none focus:border-[#FFD700]/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['all', 'pending', 'confirmed', 'canceled'].map((key) => (
            <button
              key={key}
              onClick={() => { setFilter(key); setPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                filter === key
                  ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-lg shadow-[#FFD700]/20'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
              }`}
            >
              {t(`reservations.filter.${key}`, key === 'all' ? 'همه' : key)}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-2">
          <FiXCircle size={18} />
          {error}
          <button onClick={fetchData} className="mr-auto underline hover:text-red-300">{t('retry', 'تلاش مجدد')}</button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !reservations.length ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-800 rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-1/3" />
                  <div className="h-3 bg-gray-700 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-gray-800/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr className="text-gray-400 text-xs font-bold">
                    <th className="p-4">{t('reservations.code', 'کد')}</th>
                    <th className="p-4">{t('reservations.customer', 'مشتری')}</th>
                    <th className="p-4">{t('reservations.dateTime', 'تاریخ / ساعت')}</th>
                    <th className="p-4">{t('reservations.guests', 'نفرات')}</th>
                    <th className="p-4">{t('reservations.status', 'وضعیت')}</th>
                    <th className="p-4 text-center">{t('reservations.actions', 'عملیات')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-gray-500">
                        <FiCalendar className="mx-auto mb-3 text-gray-600" size={40} />
                        <p className="font-bold">{t('reservations.empty', 'رزروی یافت نشد')}</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((res) => {
                      const cfg = STATUS_CONFIG[res.status] || STATUS_CONFIG.pending;
                      const StatusIcon = cfg.icon;
                      return (
                        <tr key={res._id || res.id} className="border-b border-gray-800/50 hover:bg-gray-700/20 transition-colors text-sm">
                          <td className="p-4 font-mono text-[#FFD700] font-bold">#{res._id || res.id}</td>
                          <td className="p-4">
                            <div className="font-bold">{res.customerName || res.customer}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <FiPhone size={10} /> {res.phone}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <FiCalendar size={14} className="text-gray-400" />
                              <span>{res.date}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <FiClock size={10} /> {res.time}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="flex items-center gap-1.5">
                              <FiUsers size={14} className="text-gray-400" />
                              <span className="font-bold">{res.guests}</span>
                              <span className="text-gray-500 text-xs">{t('reservations.person', 'نفر')}</span>
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                              <StatusIcon size={12} />
                              {t(cfg.labelKey, cfg.labelKey)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelected(res)}
                                className="p-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                                title={t('reservations.view', 'مشاهده')}
                              >
                                <FiEye size={16} />
                              </button>
                              {res.status !== 'confirmed' && (
                                <button
                                  onClick={() => handleStatusChange(res._id || res.id, 'confirmed')}
                                  className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                                  title={t('reservations.confirm', 'تایید')}
                                >
                                  <FiCheck size={16} />
                                </button>
                              )}
                              {res.status !== 'canceled' && (
                                <button
                                  onClick={() => handleStatusChange(res._id || res.id, 'canceled')}
                                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                  title={t('reservations.cancel', 'لغو')}
                                >
                                  <FiX size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FiCalendar className="mx-auto mb-3 text-gray-600" size={40} />
                <p className="font-bold">{t('reservations.empty', 'رزروی یافت نشد')}</p>
              </div>
            ) : (
              filtered.map((res) => {
                const cfg = STATUS_CONFIG[res.status] || STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                return (
                  <div
                    key={res._id || res.id}
                    className="bg-gray-800/50 border border-gray-800 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#FFD700] font-bold text-sm">#{res._id || res.id}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        <StatusIcon size={10} />
                        {t(cfg.labelKey)}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{res.customerName || res.customer}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <FiPhone size={10} /> {res.phone}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} /> {res.date} · {res.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUsers size={12} /> {res.guests} {t('reservations.person', 'نفر')}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-gray-800">
                      <button
                        onClick={() => setSelected(res)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-700/50 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-colors"
                      >
                        <FiEye size={14} /> {t('reservations.view', 'مشاهده')}
                      </button>
                      {res.status !== 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(res._id || res.id, 'confirmed')}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
                        >
                          <FiCheck size={14} /> {t('reservations.confirm', 'تایید')}
                        </button>
                      )}
                      {res.status !== 'canceled' && (
                        <button
                          onClick={() => handleStatusChange(res._id || res.id, 'canceled')}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
                        >
                          <FiX size={14} /> {t('reservations.cancel', 'لغو')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-800 border border-gray-700 text-gray-300 hover:border-[#FFD700]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all border ${
                    page === p
                      ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-lg shadow-[#FFD700]/25'
                      : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-800 border border-gray-700 text-gray-300 hover:border-[#FFD700]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#141414] border border-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[#FFD700]">
                {t('reservations.detail', 'جزئیات رزرو')} #{selected._id || selected.id}
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
                <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center text-black font-black">
                  {(selected.customerName || selected.customer)?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{selected.customerName || selected.customer}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FiPhone size={10} /> {selected.phone}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-800/50 text-center">
                  <FiCalendar className="mx-auto mb-1 text-gray-400" size={18} />
                  <p className="text-xs text-gray-500">{t('reservations.date', 'تاریخ')}</p>
                  <p className="font-bold text-sm mt-1">{selected.date}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-800/50 text-center">
                  <FiClock className="mx-auto mb-1 text-gray-400" size={18} />
                  <p className="text-xs text-gray-500">{t('reservations.time', 'ساعت')}</p>
                  <p className="font-bold text-sm mt-1">{selected.time}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-800/50 text-center">
                  <FiUsers className="mx-auto mb-1 text-gray-400" size={18} />
                  <p className="text-xs text-gray-500">{t('reservations.guests', 'تعداد')}</p>
                  <p className="font-bold text-sm mt-1">{selected.guests} {t('reservations.person', 'نفر')}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-800/50 text-center">
                  <FiMapPin className="mx-auto mb-1 text-gray-400" size={18} />
                  <p className="text-xs text-gray-500">{t('reservations.table', 'میز')}</p>
                  <p className="font-bold text-sm mt-1">{selected.table || t('reservations.notAssigned', 'تعیین نشده')}</p>
                </div>
              </div>

              {selected.note && (
                <div className="p-3 rounded-xl bg-gray-800/50">
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                    <FiMessageSquare size={10} /> {t('reservations.note', 'یادداشت')}
                  </p>
                  <p className="text-sm text-gray-300">{selected.note}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {selected.status !== 'confirmed' && (
                  <button
                    onClick={() => { handleStatusChange(selected._id || selected.id, 'confirmed'); setSelected(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors"
                  >
                    <FiCheck className="inline ml-1" size={14} />
                    {t('reservations.confirm', 'تایید رزرو')}
                  </button>
                )}
                {selected.status !== 'canceled' && (
                  <button
                    onClick={() => { handleStatusChange(selected._id || selected.id, 'canceled'); setSelected(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
                  >
                    <FiX className="inline ml-1" size={14} />
                    {t('reservations.cancel', 'لغو رزرو')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
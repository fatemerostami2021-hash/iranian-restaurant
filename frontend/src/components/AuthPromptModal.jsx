import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLogIn } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function AuthPromptModal({ show, onDismiss }) {
  const navigate = useNavigate();
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-[#1C1C1C] border border-[#FFD700]/20 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
        >
          <button onClick={onDismiss} className="absolute top-4 left-4 text-gray-400 hover:text-white">
            <FiX size={20} />
          </button>

          <h3 className="text-xl font-black text-[#FFD700] mb-2">
            عضو کباب داغ شو!
          </h3>
          <p className="text-gray-300 text-sm mb-6">
            با ثبت‌نام، سفارش سریع‌تر، ذخیره آدرس و اطلاع از تخفیف‌ها رو داشته باش.
          </p>

          <button
            onClick={() => { onDismiss(); navigate('/login'); }}
            className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl hover:bg-[#FFC700] transition flex items-center justify-center gap-2 mb-3"
          >
            <FiLogIn />
            ورود / ثبت‌نام
          </button>

          <button
            onClick={onDismiss}
            className="text-gray-400 text-sm hover:text-white transition"
          >
            فعلاً نه، ممنون
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

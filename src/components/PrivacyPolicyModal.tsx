import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
              Chính Sách Quyền Riêng Tư (Privacy Policy)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Cập nhật lần cuối: Tháng 7 năm 2026
          </p>

          <section className="space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">1. Thu thập dữ liệu cá nhân</h4>
            <p>
              Ứng dụng <strong>Quiz Vocab</strong> hoạt động hoàn toàn ngoại tuyến (offline). Chúng tôi <strong>không thu thập, lưu trữ hoặc chia sẻ</strong> bất kỳ thông tin cá nhân nào của người dùng (như tên, email, số điện thoại, vị trí địa lý hoặc danh bạ).
            </p>
          </section>

          <section className="space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">2. Dữ liệu lưu trữ trên thiết bị</h4>
            <p>
              Các thông tin như điểm số quiz, chuỗi ngày học tập (streak), danh sách từ cần ôn lại và cài đặt âm thanh/giao diện được lưu trữ cục bộ (local storage / SharedPreferences) trực tiếp trên bộ nhớ thiết bị của bạn. Dữ liệu này sẽ mất đi nếu bạn gỡ cài đặt ứng dụng hoặc chọn "Đặt lại tiến độ".
            </p>
          </section>

          <section className="space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">3. Quyền hạn ứng dụng (Permissions)</h4>
            <p>
              Ứng dụng chỉ yêu cầu quyền kết nối Internet cơ bản nếu cần cập nhật thư viện từ vựng hoặc phát âm. Ứng dụng không yêu cầu các quyền nhạy cảm như Camera, Micro, Bộ nhớ ngoài hay Vị trí.
            </p>
          </section>

          <section className="space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">4. Quyền riêng tư của trẻ em</h4>
            <p>
              Quiz Vocab phù hợp cho mọi lứa tuổi, bao gồm học sinh và trẻ em. Chúng tôi tuân thủ nghiêm ngặt các quy định về bảo vệ quyền riêng tư của trẻ em (COPPA).
            </p>
          </section>

          <section className="space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">5. Liên hệ</h4>
            <p>
              Nếu bạn có bất kỳ câu hỏi nào về chính sách quyền riêng tư này, vui lòng liên hệ qua email hỗ trợ nhà phát triển tại Google Play Console.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
          >
            Tôi đã hiểu & Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};

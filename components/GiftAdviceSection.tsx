
import React, { useState } from 'react';
import { Gift, Heart, User, Wallet, Loader2, Sparkles, Send } from 'lucide-react';
import { getGiftAdvice } from '../services/geminiService';

const GiftAdviceSection: React.FC = () => {
  const [recipient, setRecipient] = useState('Cha mẹ');
  const [budget, setBudget] = useState('2-5 triệu VNĐ');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAdvice = async () => {
    setLoading(true);
    try {
      const data = await getGiftAdvice(recipient, budget);
      setResult(data);
    } catch (err) {
      alert("Lỗi khi tư vấn quà tặng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn pb-20 px-4">
      <div className="text-center">
        <h2 className="text-4xl lg:text-5xl font-cursive text-yellow-400 mb-3 drop-shadow-md">Tư Vấn Quà Tết</h2>
        <p className="text-red-100 opacity-80 italic">Trao gửi yêu thương qua những món quà tinh tế và ý nghĩa</p>
      </div>

      <div className="bg-red-950/40 p-8 rounded-[3rem] border border-yellow-500/20 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-yellow-500 uppercase tracking-widest flex items-center gap-2">
              <User size={14}/> Bạn tặng quà cho ai?
            </label>
            <input 
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-red-900/30 border border-yellow-500/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
              placeholder="VD: Sếp, Người yêu, Đồng nghiệp..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-yellow-500 uppercase tracking-widest flex items-center gap-2">
              <Wallet size={14}/> Ngân sách dự kiến?
            </label>
            <input 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-red-900/30 border border-yellow-500/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
              placeholder="VD: Dưới 1 triệu, 10 triệu..."
            />
          </div>
        </div>

        <button 
          onClick={handleAdvice}
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 disabled:opacity-50 py-5 rounded-2xl font-black text-xl transition-all flex justify-center items-center gap-3 shadow-xl border-b-4 border-red-950"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
          {loading ? "ĐANG SUY NGHĨ..." : "NHẬN GỢI Ý QUÀ TẾT"}
        </button>
      </div>

      {result && (
        <div className="bg-[#fefce8] text-red-950 p-10 rounded-[3rem] shadow-2xl border-[10px] border-red-800 relative overflow-hidden animate-page-entry">
          <div className="absolute top-0 right-0 p-8 text-red-800/10 scale-150 pointer-events-none">
            <Gift size={100} />
          </div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-red-200 pb-4">
            <Sparkles className="text-yellow-600" /> Cố vấn AI phản hồi:
          </h3>
          <div className="text-lg leading-relaxed whitespace-pre-wrap italic text-red-900">
            {result}
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs text-red-800/40 uppercase font-black">
            <Heart size={14} className="fill-red-800/40" /> Chúc bạn chọn được món quà ưng ý!
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftAdviceSection;

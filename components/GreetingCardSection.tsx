
import React, { useState, useEffect } from 'react';
import { ImageIcon, Download, Loader2, Wand2, Key, AlertCircle, Clock, Sparkles, Zap } from 'lucide-react';
import { generateTetGreetingCard } from '../services/geminiService';

const GreetingCardSection: React.FC = () => {
  const [desc, setDesc] = useState('Gia đình sum vầy bên nồi bánh chưng rực rỡ sắc xuân');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; type: 'quota' | 'error' | null }>({ message: '', type: null });
  const [hasKey, setHasKey] = useState<boolean>(true);
  const [quality, setQuality] = useState<'standard' | 'high'>('standard');

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
      setError({ message: '', type: null });
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError({ message: '', type: null });
    
    // Nếu chọn chất lượng cao mà chưa chọn Key, nhắc người dùng
    if (quality === 'high' && !hasKey && window.aistudio) {
        await handleSelectKey();
    }

    try {
      const url = await generateTetGreetingCard(desc, quality === 'high');
      if (url) {
        setImageUrl(url);
      } else {
        setError({ message: "AI không tạo được ảnh. Hãy thử mô tả khác chi tiết hơn.", type: 'error' });
      }
    } catch (err: any) {
      if (err.message === "QUOTA_EXCEEDED") {
        setError({ 
          message: "Hạn mức miễn phí hiện tại đã hết. Bạn hãy thử lại sau 1 phút hoặc nhấn nút 'CHỌN API KEY' cá nhân để tiếp tục ngay!", 
          type: 'quota' 
        });
      } else if (err.message === "MODEL_NOT_FOUND") {
        setError({ message: "Tính năng 1K yêu cầu API Key bản quyền. Vui lòng chọn Key cá nhân của bạn.", type: 'error' });
      } else {
        setError({ message: err.message || "Không thể kết nối với máy chủ AI. Hãy thử lại sau.", type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn px-4">
      <div className="text-center">
        <h2 className="text-4xl lg:text-5xl font-cursive text-yellow-400 mb-3 drop-shadow-md">Sáng Tạo Thiệp Tết AI</h2>
        <p className="text-red-100 opacity-80 italic">Kiến tạo nghệ thuật Xuân rực rỡ trong tích tắc</p>
      </div>

      {error.message && (
        <div className={`p-6 rounded-3xl border-2 flex flex-col md:flex-row items-center gap-4 transition-all animate-shake ${
          error.type === 'quota' 
          ? 'bg-orange-500/10 border-orange-500/40 text-orange-100' 
          : 'bg-red-500/10 border-red-500/40 text-red-100'
        }`}>
          <div className={`p-3 rounded-full ${error.type === 'quota' ? 'bg-orange-500' : 'bg-red-500'}`}>
            {error.type === 'quota' ? <Clock size={24} /> : <AlertCircle size={24} />}
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <p className="font-bold text-lg">{error.type === 'quota' ? "Đã đạt giới hạn hạn mức" : "Gặp sự cố nhỏ"}</p>
            <p className="text-sm opacity-90">{error.message}</p>
          </div>
          {error.type === 'quota' && (
            <button 
              onClick={handleSelectKey}
              className="bg-yellow-500 text-red-950 px-6 py-2 rounded-full font-black hover:scale-105 transition-transform shrink-0 shadow-lg"
            >
              DÙNG API KEY CÁ NHÂN
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-red-950/40 p-8 rounded-[2.5rem] border border-yellow-600/20 space-y-6 flex flex-col">
          <div className="space-y-4 flex-1">
            <label className="block text-xs font-black text-yellow-500 uppercase tracking-widest">Ý tưởng thiệp của bạn</label>
            <textarea 
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="VD: Một chú ngựa vàng dũng mãnh giữa vườn hoa mai rực rỡ..."
              className="w-full bg-red-900/30 border border-yellow-600/20 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none resize-none leading-relaxed"
            />
            
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-yellow-500/50 uppercase tracking-widest">Độ phân giải</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setQuality('standard')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                    quality === 'standard' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-white/5 border-transparent text-white/40'
                  }`}
                >
                  <Zap size={16} /> Tiêu chuẩn
                </button>
                <button 
                  onClick={() => setQuality('high')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                    quality === 'high' ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'bg-white/5 border-transparent text-white/40'
                  }`}
                >
                  <Sparkles size={16} /> Cao cấp 1K
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-xl transition-all flex justify-center items-center gap-3 shadow-2xl group ${
                quality === 'high' 
                ? 'bg-gradient-to-r from-pink-500 to-rose-700 shadow-pink-500/20' 
                : 'bg-gradient-to-r from-yellow-500 to-orange-600 shadow-yellow-500/20 text-red-950'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
            {loading ? "ĐANG SÁNG TẠO..." : `TẠO THIỆP XUÂN ${quality === 'high' ? '1K' : ''}`}
          </button>
        </div>

        <div className="bg-red-950/60 rounded-[2.5rem] border-2 border-dashed border-yellow-600/20 aspect-square flex items-center justify-center relative group overflow-hidden shadow-inner">
          {imageUrl ? (
            <>
              <img src={imageUrl} alt="AI Art" className="w-full h-full object-cover animate-fadeIn" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <a 
                  href={imageUrl} 
                  download="tet-2026-card.png"
                  className="bg-yellow-500 text-red-950 p-5 rounded-full hover:scale-110 transition-transform shadow-2xl"
                >
                  <Download size={32} />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center p-10 space-y-4">
              <div className="relative">
                <ImageIcon size={80} className={`mx-auto text-red-900/40 ${loading ? 'animate-pulse' : ''}`} />
                {loading && (
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                   </div>
                )}
              </div>
              <p className="text-red-300/50 font-bold uppercase tracking-widest text-[10px]">Kiệt tác của bạn sẽ xuất hiện ở đây</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
         <button 
          onClick={handleSelectKey}
          className="text-xs text-yellow-500/40 hover:text-yellow-400 flex items-center gap-2 uppercase tracking-widest font-black transition-colors"
         >
           <Key size={14} /> Cấu hình API Key của bạn
         </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default GreetingCardSection;

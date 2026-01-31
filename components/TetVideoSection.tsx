
import React, { useState } from 'react';
import { Video, Wand2, Loader2, Download, Key, AlertCircle, PlayCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const TetVideoSection: React.FC = () => {
  const [prompt, setPrompt] = useState('Một cảnh quay cinematic về múa lân rộn rã trong phố cổ rực rỡ hoa mai và pháo hoa đêm giao thừa Bính Ngọ 2026.');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  const generateVideo = async () => {
    if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await window.aistudio.openSelectKey();
            return;
        }
    }

    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setStatus('Khởi tạo model Veo 3.1...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Cinematic Tet 2026: ${prompt}, high quality, vibrant red and gold colors, 4k detail.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setStatus('Đang kiến tạo những thước phim Xuân... (Có thể mất 1-2 phút)');
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
        setStatus('Hoàn tất!');
      } else {
        throw new Error("Không thể tải video.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra. Vui lòng kiểm tra API Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn py-12 px-6">
      <div className="text-center">
        <h2 className="text-4xl lg:text-6xl font-cursive text-yellow-400 mb-4 drop-shadow-xl">Phim Xuân AI</h2>
        <p className="text-red-100 italic opacity-80">Sáng tạo video chúc Tết độc bản bằng công nghệ Veo 3.1</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="bg-red-950/40 p-8 rounded-[3rem] border border-yellow-500/20 space-y-6 shadow-2xl">
          <div>
            <label className="block text-xs font-black text-yellow-500 uppercase tracking-widest mb-3">Mô tả cảnh quay mơ ước</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-red-900/30 border border-yellow-500/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-yellow-500 outline-none resize-none h-40 leading-relaxed"
              placeholder="VD: Gia đình sum vầy bên nồi bánh chưng, ánh lửa hồng lung linh..."
            />
          </div>

          <button 
            onClick={generateVideo}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 disabled:opacity-50 py-5 rounded-2xl font-black text-xl transition-all flex justify-center items-center gap-3 shadow-xl"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
            {loading ? "ĐANG DỰNG PHIM..." : "TẠO VIDEO TẾT"}
          </button>
          
          <div className="flex items-center gap-2 text-[10px] text-yellow-500/50 uppercase font-black tracking-tighter">
            <Key size={12} /> Cần API Key bản quyền để sử dụng
          </div>
        </div>

        <div className="aspect-video bg-red-950/60 rounded-[3rem] border-4 border-dashed border-yellow-500/20 flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
          {videoUrl ? (
            <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-10 space-y-4">
              <div className="relative">
                <Video size={80} className={`mx-auto text-red-900/40 ${loading ? 'animate-pulse' : ''}`} />
                {loading && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-yellow-500" size={40} /></div>}
              </div>
              <p className="text-red-300/50 text-xs font-bold uppercase tracking-widest leading-relaxed">
                {status || "Kiệt tác video Xuân của bạn sẽ xuất hiện tại đây"}
              </p>
            </div>
          )}
          
          {videoUrl && (
            <a 
              href={videoUrl} 
              download="Tet2026.mp4"
              className="absolute bottom-6 right-6 bg-yellow-500 text-red-950 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
            >
              <Download size={24} />
            </a>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl flex items-center gap-3 text-red-200 justify-center">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default TetVideoSection;

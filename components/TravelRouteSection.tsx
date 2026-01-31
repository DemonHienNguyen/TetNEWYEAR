
import React, { useState } from 'react';
import { Map, Compass, Loader2, MapPin, ExternalLink, Navigation, Sparkles } from 'lucide-react';
import { getTravelRoute } from '../services/geminiService';

const TravelRouteSection: React.FC = () => {
  const [city, setCity] = useState('Hà Nội');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, grounding: any[] } | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await getTravelRoute(city);
      setResult(data);
    } catch (err) {
      alert("Lỗi khi tìm lộ trình du xuân.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-20 px-4">
      <div className="text-center">
        <h2 className="text-4xl lg:text-5xl font-cursive text-yellow-400 mb-3 drop-shadow-md">Lộ Trình Du Xuân</h2>
        <p className="text-red-100 opacity-80 italic">Khám phá những điểm đến rực rỡ nhất Tết 2026 qua lăng kính AI</p>
      </div>

      <div className="bg-red-900/30 p-8 rounded-[2.5rem] border border-yellow-500/20 backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={20} />
            <input 
              type="text" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Nhập tỉnh/thành phố bạn muốn du xuân..."
              className="w-full bg-red-950 border border-yellow-500/20 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-800 px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Compass size={20} />}
            {loading ? "ĐANG TÌM..." : "XEM GỢI Ý"}
          </button>
        </div>

        {result && (
          <div className="mt-10 space-y-8 animate-page-entry">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <div className="flex items-center gap-2 text-yellow-400 mb-4 font-bold uppercase tracking-widest text-xs">
                <Sparkles size={16} /> Hành trình du xuân AI đề xuất:
              </div>
              <div className="text-red-50 leading-relaxed whitespace-pre-wrap italic text-lg">
                {result.text}
              </div>
            </div>

            {result.grounding.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.grounding.map((chunk, i) => {
                  const mapsUri = chunk.maps?.uri;
                  const title = chunk.maps?.title || "Địa điểm du xuân";
                  if (!mapsUri) return null;
                  return (
                    <a 
                      key={i} 
                      href={mapsUri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-red-950/40 hover:bg-red-900/60 p-5 rounded-2xl flex items-center justify-between group transition-all border border-yellow-500/10 hover:border-yellow-500/40"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                          <Navigation size={18} />
                        </div>
                        <span className="font-bold text-red-100 truncate max-w-[200px]">{title}</span>
                      </div>
                      <ExternalLink size={14} className="text-yellow-500/40 group-hover:text-yellow-500" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelRouteSection;

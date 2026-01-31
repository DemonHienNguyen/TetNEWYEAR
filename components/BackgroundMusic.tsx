
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Disc, Loader2, Music, Volume1, Play, Pause } from 'lucide-react';

const BackgroundMusic: React.FC = () => {
  /**
   * =========================================================================
   * HƯỚNG DẪN CHÈN NHẠC:
   * 1. Copy file MP3 của bạn vào thư mục 'public'.
   * 2. Thay link dưới đây bằng tên file, ví dụ: "/nhac-tet.mp3"
   * =========================================================================
   */
  const SOUND_URL = "/music/tet-music.mp3"; // Thay đổi đường dẫn tới file nhạc tại đây

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (audio.paused) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn("Autoplay blocked:", err);
          alert("Nhấn vào đĩa nhạc để bắt đầu âm hưởng Tết!");
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100] flex flex-col items-center gap-3 group">
      <audio 
        ref={audioRef}
        src={SOUND_URL}
        loop
        preload="auto"
        onCanPlayThrough={() => setIsLoaded(true)}
        className="hidden"
      />

      {/* Volume Control UI */}
      <div className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center bg-red-950/95 backdrop-blur-md p-3 rounded-2xl border border-yellow-500/20 shadow-2xl gap-3">
        <button onClick={() => setVolume(v => v === 0 ? 0.4 : 0)} className="text-yellow-500 transition-transform active:scale-90">
          {volume === 0 ? <VolumeX size={18} /> : volume < 0.5 ? <Volume1 size={18} /> : <Volume2 size={18} />}
        </button>
        <input 
          type="range" min="0" max="1" step="0.01" value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 h-1.5 accent-yellow-400 cursor-pointer bg-red-900/50 rounded-full appearance-none outline-none"
        />
      </div>

      {/* Main Disc Button */}
      <div className="flex flex-col items-center gap-2">
        {isPlaying && (
          <div className="bg-red-600 text-yellow-300 text-[9px] font-black px-3 py-1 rounded-full shadow-lg border border-yellow-400/30 uppercase tracking-[0.2em] animate-pulse">
            On Air
          </div>
        )}
        
        <button
          onClick={togglePlay}
          disabled={!isLoaded}
          className={`relative p-0 rounded-full transition-all duration-700 shadow-2xl overflow-hidden border-4 ${
            isPlaying 
            ? 'border-yellow-400 scale-110 shadow-yellow-500/40' 
            : 'border-red-900/50 grayscale opacity-80 hover:opacity-100 hover:grayscale-0'
          } ${!isLoaded ? 'cursor-wait' : 'cursor-pointer'}`}
          style={{ width: '64px', height: '64px' }}
        >
          <div className={`absolute inset-0 bg-black flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
             <div className="w-full h-full bg-[radial-gradient(circle,_#333_0%,_#000_100%)] flex items-center justify-center">
                <div className="w-8 h-8 bg-red-700 rounded-full border-2 border-yellow-500 flex items-center justify-center relative z-10">
                    {!isLoaded ? <Loader2 size={18} className="text-yellow-400 animate-spin" /> : <Music size={20} className="text-yellow-400" />}
                </div>
             </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            {isPlaying ? <Pause className="text-white" /> : <Play className="text-white" />}
          </div>
        </button>

        <div className="flex gap-1 h-3 items-end">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className={`w-1 rounded-full bg-yellow-400/80 transition-all ${isPlaying ? 'animate-music-bar' : 'h-1 opacity-20'}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes music-bar { 0%, 100% { height: 4px; } 50% { height: 12px; } }
        .animate-music-bar { animation: music-bar 0.6s ease-in-out infinite; transform-origin: bottom; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default BackgroundMusic;

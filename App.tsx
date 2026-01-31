
import React, { useState, useEffect } from 'react';
import { Home, Sparkles, Image as ImageIcon, Gift, BookOpen, Menu, X, Phone, PenTool, Utensils, Map, Users, Target, Dices, HelpCircle, ChevronDown, Layout, Video, Compass, ShoppingBag } from 'lucide-react';
import { Page } from './types';
import Petals from './components/Petals';
import TetCountdown from './components/TetCountdown';
import FortuneSection from './components/FortuneSection';
import GreetingCardSection from './components/GreetingCardSection';
import LuckyMoneySection from './components/LuckyMoneySection';
import TraditionSection from './components/TraditionSection';
import LiveCallSection from './components/LiveCallSection';
import PoetrySection from './components/PoetrySection';
import FoodExplorerSection from './components/FoodExplorerSection';
import FlowerMapSection from './components/FlowerMapSection';
import ZodiacCompatibilitySection from './components/ZodiacCompatibilitySection';
import DragonHuntSection from './components/DragonHuntSection';
import BauCuaSection from './components/BauCuaSection';
import TetQuizSection from './components/TetQuizSection';
import TetDecorateSection from './components/TetDecorateSection';
import TetVideoSection from './components/TetVideoSection';
import TravelRouteSection from './components/TravelRouteSection';
import GiftAdviceSection from './components/GiftAdviceSection';
import BackgroundMusic from './components/BackgroundMusic';
import { playSound } from './services/audioService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: Page) => {
    playSound('click');
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: Page.HOME, label: 'Trang Chủ', icon: Home },
    { id: Page.DECORATE, label: 'Trang Trí', icon: Layout },
    { id: Page.BAU_CUA, label: 'Bầu Cua', icon: Dices },
    { id: Page.TRAVEL, label: 'Du Xuân', icon: Compass },
    { id: Page.DRAGON_HUNT, label: 'Săn Long', icon: Target },
    { id: Page.LUCKY_MONEY, label: 'Hái Lộc', icon: Gift },
    { id: Page.VIRTUAL_CALL, label: 'Gọi AI', icon: Phone },
    { id: 'video' as any, label: 'Phim AI', icon: Video },
    { id: Page.QUIZ, label: 'Thử Thách', icon: HelpCircle },
    { id: Page.FORTUNE, label: 'Xin Quẻ', icon: Sparkles },
    { id: Page.GIFT_ADVICE, label: 'Chọn Quà', icon: ShoppingBag },
    { id: Page.ZODIAC, label: 'Xông Đất', icon: Users },
    { id: Page.POETRY, label: 'Thơ Xuân', icon: PenTool },
    { id: Page.CARDS, label: 'Thiệp AI', icon: ImageIcon },
    { id: Page.FOOD, label: 'Mâm Cỗ', icon: Utensils },
  ];

  return (
    <div className="min-h-screen relative selection:bg-yellow-500 selection:text-red-900">
      <Petals />
      <BackgroundMusic />

      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'py-2 bg-red-950/95 backdrop-blur-xl shadow-2xl border-b border-yellow-600/30' : 'py-6 bg-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          <button onClick={() => handleNavClick(Page.HOME)} className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-red-900">
              <span className="text-red-900 font-black text-xl">BN</span>
            </div>
            <div className="text-left">
              <h1 className="font-cursive text-2xl lg:text-3xl text-yellow-400 leading-none drop-shadow-md">Tết Bính Ngọ</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-red-200 opacity-70">Xuân Vạn Phúc 2026</p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.slice(0, 7).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-5 py-2 rounded-full flex items-center gap-2 transition-all font-bold text-sm ${
                    currentPage === item.id 
                    ? 'bg-yellow-500 text-red-950 shadow-lg' 
                    : 'text-red-100 hover:bg-white/10'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
            
            <div className="relative group ml-2">
              <button className="px-5 py-2 rounded-full flex items-center gap-2 text-red-100 hover:bg-white/10 transition-all font-bold text-sm">
                Khám Phá <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                <div className="bg-red-950 border border-yellow-600/30 rounded-2xl shadow-2xl p-4 w-64 grid grid-cols-1 gap-1">
                  {navItems.slice(7).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-900 text-left text-sm transition-colors"
                    >
                      <item.icon size={16} className="text-yellow-500" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-3 bg-red-900/50 rounded-2xl border border-yellow-600/30 text-yellow-400">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 z-[90] bg-red-950 transition-all duration-500 lg:hidden ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="pt-32 px-8 h-full overflow-y-auto pb-20">
          <div className="grid grid-cols-2 gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${
                  currentPage === item.id 
                  ? 'bg-yellow-500 text-red-950 border-yellow-400' 
                  : 'bg-red-900/40 border-yellow-600/20 text-red-100'
                }`}
              >
                <item.icon size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="min-h-screen pt-32 lg:pt-40 pb-20 relative z-10">
        <div className={`mx-auto transition-all duration-700 ${
          currentPage === Page.LUCKY_MONEY || currentPage === Page.DRAGON_HUNT || currentPage === Page.DECORATE ? 'max-w-full' : 'max-w-6xl px-6'
        }`}>
          {currentPage === Page.HOME && (
            <div className="text-center space-y-12 animate-fadeIn">
              <div className="relative">
                <h1 className="text-6xl lg:text-[10rem] font-cursive text-yellow-400 mb-6 drop-shadow-2xl animate-title-float">
                  Cung Chúc Tân Xuân
                </h1>
                <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto opacity-90 italic font-light tracking-wide">
                  Trải nghiệm Tết Bính Ngọ 2026 rực rỡ cùng công nghệ AI đỉnh cao
                </p>
              </div>

              <TetCountdown />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                 <FeatureCard title="Du Xuân AI" icon={<Compass size={32}/>} onClick={() => handleNavClick(Page.TRAVEL)} color="from-teal-600 to-emerald-700" desc="Tìm lộ trình check-in Tết đẹp nhất." />
                 <FeatureCard title="Tạo Phim Tết AI" icon={<Video size={32}/>} onClick={() => handleNavClick('video' as any)} color="from-orange-600 to-red-600" desc="Dựng video cinematic chúc Tết độc bản." />
                 <FeatureCard title="Săn Long Đoạt Lộc" icon={<Target size={32}/>} onClick={() => handleNavClick(Page.DRAGON_HUNT)} color="from-yellow-600 to-orange-700" desc="Game bắn rồng rinh phúc lộc đầu năm." />
              </div>
            </div>
          )}

          <div className="animate-page-entry">
            {currentPage === Page.DECORATE && <TetDecorateSection />}
            {currentPage === Page.TRAVEL && <TravelRouteSection />}
            {currentPage === Page.GIFT_ADVICE && <GiftAdviceSection />}
            {currentPage === ( 'video' as any ) && <TetVideoSection />}
            {currentPage === Page.DRAGON_HUNT && <DragonHuntSection />}
            {currentPage === Page.BAU_CUA && <BauCuaSection />}
            {currentPage === Page.QUIZ && <TetQuizSection />}
            {currentPage === Page.VIRTUAL_CALL && <LiveCallSection />}
            {currentPage === Page.ZODIAC && <ZodiacCompatibilitySection />}
            {currentPage === Page.FORTUNE && <FortuneSection />}
            {currentPage === Page.POETRY && <PoetrySection />}
            {currentPage === Page.FOOD && <FoodExplorerSection />}
            {currentPage === Page.CARDS && <GreetingCardSection />}
            {currentPage === Page.LUCKY_MONEY && <LuckyMoneySection />}
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-yellow-900/30 text-center bg-red-950/40 relative z-10">
        <p className="text-yellow-500 font-cursive text-3xl mb-2">Mã Đáo Thành Công 2026</p>
        <p className="text-red-300 text-[10px] opacity-60 uppercase tracking-widest">© 2026 Tết Việt Digital Experience</p>
      </footer>

      <style>{`
        @keyframes title-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-title-float { animation: title-float 4s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-page-entry { animation: pageEntry 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes pageEntry { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ title, icon, onClick, color, desc }: any) => (
  <button 
    onClick={onClick}
    className={`group relative overflow-hidden p-8 rounded-[3rem] text-left transition-all hover:-translate-y-2 shadow-xl bg-gradient-to-br ${color}`}
  >
    <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-white/20 transition-all scale-150">
      {icon}
    </div>
    <div className="relative z-10">
      <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-6 border border-white/20">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-2">{title}</h3>
      <p className="text-sm text-white/70 italic font-light">{desc}</p>
    </div>
  </button>
);

export default App;

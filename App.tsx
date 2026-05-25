import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Trophy, Sparkles, HelpCircle, Award, Volume2, Calendar, Hash, ArrowLeft } from 'lucide-react';
import { APP_BACKGROUNDS, ActiveTab } from './types';
import DaysGame from './DaysGame';
import NumbersGame from './NumbersGame';
import GenderGame from './GenderGame';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('welcome');
  const [bgIndex, setBgIndex] = useState<number>(0);
  
  // Game scores (forces state sync on return to dashboard)
  const [scores, setScores] = useState({
    days: 999,
    numbers: 0,
    gender: 0
  });

  const loadScores = () => {
    const dScore = Number(localStorage.getItem('daysGameHighScore') || '999');
    const nScore = Number(localStorage.getItem('numbersGameHighScore') || '0');
    const gScore = Number(localStorage.getItem('genderGameHighScore') || '0');
    setScores({ days: dScore, numbers: nScore, gender: gScore });
  };

  useEffect(() => {
    loadScores();
  }, [activeTab]);

  const activeBackground = APP_BACKGROUNDS[bgIndex];

  return (
    <div
      id="main-app-shell"
      className="min-h-screen text-[#1A1A1A] flex flex-col justify-between relative transition-all duration-1000 bg-cover bg-center bg-no-repeat font-sans selection:bg-[#FFCE00] selection:text-[#1A1A1A]"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(43, 43, 43, 0.72), rgba(26, 26, 26, 0.88)), url("${activeBackground.url}")`
      }}
    >


      {/* Main Header with stark block top structure */}
      <header id="app-header" className="w-full bg-[#1A1A1A] border-b-4 border-[#FFCE00] py-4 px-4 sm:px-6 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Stark Logo / Emblem Pairing */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('welcome')}>
            <div className="w-12 h-12 bg-[#FFCE00] border-2 border-white flex items-center justify-center text-slate-950 font-black shadow-md text-xl relative shrink-0">
              🇪🇸
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#DD0000]" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg font-display font-extrabold tracking-tight text-white flex flex-wrap items-center gap-2 leading-none">
                <span>Իսպաներենի Ինտերակտիվ Ուսուցում</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FFCE00] text-black uppercase tracking-wider">
                  Español Game Trainer
                </span>
              </h1>
              <span className="text-4xs sm:text-2xs text-gray-300 font-light mt-1">
                Սովորենք շաբաթվա օրերը, թվերը և գոյականների քերականական սեռերը ինտերակտիվ խաղերով
              </span>
            </div>
          </div>

          {/* Stark Controls Container */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white uppercase tracking-widest font-bold font-display hidden md:inline-block">
              ՖՈՆԻ ԸՆՏՐՈՒԹՅՈՒՆ:
            </span>
            <div className="flex bg-[#2B2B2B] p-1 border border-gray-600">
              {APP_BACKGROUNDS.map((bg, idx) => (
                <button
                  key={bg.id}
                  onClick={() => setBgIndex(idx)}
                  title={bg.nameHy}
                  className={`w-7 h-7 mx-0.5 text-xs font-bold font-display transition-all ${
                    bgIndex === idx
                      ? 'bg-[#FFCE00] text-[#1A1A1A] border-2 border-black scale-105 font-extrabold'
                      : 'bg-[#1A1A1A] text-gray-400 hover:text-white border border-transparent'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Stark return to welcome */}
            {activeTab !== 'welcome' && (
              <button
                onClick={() => setActiveTab('welcome')}
                className="px-4 py-2 bg-[#DD0000] hover:bg-black text-white text-xs font-bold uppercase tracking-wider border-2 border-white active:translate-y-0.5 transition-all flex items-center gap-1.5 geo-flat-shadow-sm"
              >
                <ArrowLeft size={13} />
                <span>Գլխավոր</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Stark Geometric Workspace Window */}
      <main id="app-viewport" className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 relative z-20 flex flex-col justify-center">
        
        {/* Centered Board Game Container with strong borders like cardboard/slate */}
        <div id="app-cardboard-board" className="w-full bg-[#F4F4F2] border-4 border-[#1A1A1A] p-6 sm:p-8 flex flex-col justify-center geo-flat-shadow relative">
          
          {/* Strips of design details in core corners */}
          <div className="absolute top-0 left-0 w-3 h-3 bg-[#DD0000]" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-[#FFCE00]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#FFCE00]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#DD0000]" />

          <AnimatePresence mode="wait">
            {activeTab === 'welcome' && (
              <motion.div
                key="welcome-dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col gap-10"
              >
                {/* Introduction Geometric Header */}
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-4">
                  <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={11} className="text-[#FFCE00]" />
                    <span>Բարի գալուստ Իսպաներենի խաղ-մարզիչ</span>
                  </span>
                  
                  <h2 className="text-3xl sm:text-4xl font-serif italic font-normal tracking-tight text-[#1A1A1A] leading-tight">
                    Սովորի՛ր Իսպաներեն <span className="font-sans font-black uppercase text-[#DD0000] border-b-4 border-[#FFCE00] not-italic">Խաղալով</span>
                  </h2>
                  
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans font-medium">
                    Ինտերակտիվ խաղային մարզիչ նախատեսված հատուկ հայախոսների համար։ Յուրաքանչյուր խաղ ունի ուսումնական դասագիրք ՝ բաղձալի արտասանության ձայնագրություններով և գործնական խաղային փուլերով։
                  </p>
                </div>

                {/* Game Selection Cards in Geometric Flat Grid */}
                <div id="games-selection-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* GAME 1: DAYS CARD */}
                  <div
                    onClick={() => setActiveTab('days-game')}
                    className="group bg-white border-3 border-[#1A1A1A] p-6 cursor-pointer hover:bg-[#EBEBE8] transition-all duration-200 relative flex flex-col justify-between geo-flat-shadow"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-[#FFCE00] border-2 border-[#1A1A1A] flex items-center justify-center text-xl font-bold">
                          📅
                        </div>
                        <span className="text-[9px] font-bold font-mono uppercase bg-black text-white px-2 py-0.5">
                          ԽԱՂ 1
                        </span>
                      </div>

                      <h3 className="text-lg font-display font-extrabold text-[#1A1A1A] group-hover:text-[#DD0000] transition-colors leading-tight">
                        📅 Շաբաթվա Օրեր
                      </h3>
                      <span className="block text-[10px] text-[#DD0000] font-mono tracking-widest font-bold mt-0.5">
                        DÍAS DE LA SEMANA
                      </span>
                      
                      <p className="text-xs text-gray-700 mt-4 leading-relaxed font-sans">
                        Մտապահեք շաբաթվա օրերի ճիշտ թարգմանություններն ու զուգակցեք զույգերը հիշողության քարտերով (ինչպես Lunes, Martes):
                      </p>
                    </div>

                    <div>
                      <div className="w-full h-[2px] bg-[#1A1A1A] my-5" />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Ռեկորդային քայլ</span>
                        <span className="text-xs font-mono font-bold text-black bg-[#EBEBE8] px-2 py-0.5 border border-gray-300">
                          {scores.days === 999 ? 'Դեռ չկա' : `${scores.days} քայլ`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* GAME 2: NUMBERS CARD */}
                  <div
                    onClick={() => setActiveTab('numbers-game')}
                    className="group bg-white border-3 border-[#1A1A1A] p-6 cursor-pointer hover:bg-[#EBEBE8] transition-all duration-200 relative flex flex-col justify-between geo-flat-shadow"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-[#FFCE00] border-2 border-[#1A1A1A] flex items-center justify-center text-xl font-bold">
                          🔢
                        </div>
                        <span className="text-[9px] font-bold font-mono uppercase bg-black text-white px-2 py-0.5">
                          ԽԱՂ 2
                        </span>
                      </div>

                      <h3 className="text-lg font-display font-extrabold text-[#1A1A1A] group-hover:text-[#DD0000] transition-colors leading-tight">
                        🔢 Թվեր և Հաշվարկ
                      </h3>
                      <span className="block text-[10px] text-[#DD0000] font-mono tracking-widest font-bold mt-0.5">
                        LOS NÚMEROS
                      </span>
                      
                      <p className="text-xs text-gray-700 mt-4 leading-relaxed font-sans">
                        Սովորեք իսպաներեն հաշվել 1-ից 20-ը: Փորձեք ճիշտ պայթեցնել թվային փուչիկները արագավազ թեստավորման մեջ:
                      </p>
                    </div>

                    <div>
                      <div className="w-full h-[2px] bg-[#1A1A1A] my-5" />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Մաքսիմալ Միավոր</span>
                        <span className="text-xs font-mono font-bold text-black bg-[#EBEBE8] px-2 py-0.5 border border-gray-300">
                          {scores.numbers} միավոր
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* GAME 3: GENDER SORTING CARD */}
                  <div
                    onClick={() => setActiveTab('gender-game')}
                    className="group bg-white border-3 border-[#1A1A1A] p-6 cursor-pointer hover:bg-[#EBEBE8] transition-all duration-200 relative flex flex-col justify-between geo-flat-shadow"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-[#FFCE00] border-2 border-[#1A1A1A] flex items-center justify-center text-xl font-bold">
                          🤵
                        </div>
                        <span className="text-[9px] font-bold font-mono uppercase bg-black text-white px-2 py-0.5">
                          ԽԱՂ 3
                        </span>
                      </div>

                      <h3 className="text-lg font-display font-extrabold text-[#1A1A1A] group-hover:text-[#DD0000] transition-colors leading-tight">
                        🤵 / 👩 Գոյականի Սեռեր
                      </h3>
                      <span className="block text-[10px] text-[#DD0000] font-mono tracking-widest font-bold mt-0.5">
                        EL VS LA SENDER
                      </span>
                      
                      <p className="text-xs text-gray-700 mt-4 leading-relaxed font-sans">
                        Իսպաներենում գրեթե ցանկացած գոյական ունի սեռ: Խաղացեք ստուգատես և դասակարգեք El և La զամբյուղներում:
                      </p>
                    </div>

                    <div>
                      <div className="w-full h-[2px] bg-[#1A1A1A] my-5" />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Մաքսիմալ Միավոր</span>
                        <span className="text-xs font-mono font-bold text-black bg-[#EBEBE8] px-2 py-0.5 border border-gray-300">
                          {scores.gender} միավոր
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Stark Panel */}
                <div className="p-6 bg-white border-2 border-[#1A1A1A] flex flex-col md:flex-row gap-5 items-center justify-between geo-flat-shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-[#DD0000] shrink-0 animate-ping" />
                    <div>
                      <span className="text-xs font-bold text-[#1A1A1A] block font-display uppercase tracking-wider">ԽԱՂԱՅԻՆ ՄԻԱՎՈՐՆԵՐ</span>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Ձեր բոլոր ռեկորդները և միավորները պահպանվում են տեղային հիշողության մեջ: Ցանկության դեպքում կարող եք զրոյացնել դրանք այստեղից:
                      </p>
                    </div>
                  </div>

                  {/* Reset Scores Stark Button */}
                  <button
                    onClick={() => {
                      if (window.confirm('Համոզվա՞ծ եք, որ ցանկանում եք զրոյացնել բոլոր հավաքած միավորները և ռեկորդները:')) {
                        localStorage.clear();
                        loadScores();
                      }
                    }}
                    className="px-4 py-2 border-2 border-[#1A1A1A] bg-white hover:bg-black text-black hover:text-white text-3xs sm:text-2xs font-bold uppercase tracking-widest transition-colors shrink-0 active:translate-y-0.5"
                  >
                    Զրոյացնել Ռեկորդները
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'days-game' && (
              <motion.div
                key="days"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-dashed border-gray-300">
                  <button
                    onClick={() => setActiveTab('welcome')}
                    className="p-2.5 bg-white hover:bg-[#EBEBE8] border-2 border-[#1A1A1A] text-black transition-all active:translate-y-0.5"
                    title="Գլխավոր էջ"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h3 className="text-xl font-serif italic text-black flex flex-wrap items-center gap-3">
                      <span className="text-xs font-sans font-black uppercase tracking-wider bg-[#FFCE00] text-black px-2.5 py-1 border border-black not-italic">ԽԱՂ 1</span>
                      <span>Շաբաթվա Օրերին Տրենաժոր (Días de la semana)</span>
                    </h3>
                    <span className="text-4xs text-[#DD0000] tracking-widest font-mono font-bold uppercase block mt-1">Հայերենից Իսպաներեն Զույգերի Միացում</span>
                  </div>
                </div>
                <DaysGame />
              </motion.div>
            )}

            {activeTab === 'numbers-game' && (
              <motion.div
                key="numbers"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-dashed border-gray-300">
                  <button
                    onClick={() => setActiveTab('welcome')}
                    className="p-2.5 bg-white hover:bg-[#EBEBE8] border-2 border-[#1A1A1A] text-black transition-all active:translate-y-0.5"
                    title="Գլխավոր էջ"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h3 className="text-xl font-serif italic text-black flex flex-wrap items-center gap-3">
                      <span className="text-xs font-sans font-black uppercase tracking-wider bg-[#FFCE00] text-black px-2.5 py-1 border border-black not-italic">ԽԱՂ 2</span>
                      <span>Թվերի և Հաշվման Փուչիկներ (Los Números)</span>
                    </h3>
                    <span className="text-4xs text-[#DD0000] tracking-widest font-mono font-bold uppercase block mt-1">1-ԻՑ 20-Ի ԻՆՏԵՐԱԿՏԻՎ ԹԵՍՏԱՎՈՐՈՒՄ</span>
                  </div>
                </div>
                <NumbersGame />
              </motion.div>
            )}

            {activeTab === 'gender-game' && (
              <motion.div
                key="gender"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-dashed border-gray-300">
                  <button
                    onClick={() => setActiveTab('welcome')}
                    className="p-2.5 bg-white hover:bg-[#EBEBE8] border-2 border-[#1A1A1A] text-black transition-all active:translate-y-0.5"
                    title="Գլխավոր էջ"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h3 className="text-xl font-serif italic text-black flex flex-wrap items-center gap-3">
                      <span className="text-xs font-sans font-black uppercase tracking-wider bg-[#FFCE00] text-black px-2.5 py-1 border border-black not-italic">ԽԱՂ 3</span>
                      <span>Գոյականների Սեռերի Տեսակավորում (Género de Sustantivos)</span>
                    </h3>
                    <span className="text-4xs text-[#DD0000] tracking-widest font-mono font-bold uppercase block mt-1">EL (ԱՐԱԿԱՆ) ԵՎ LA (ԻԳԱԿԱՆ) ԿԱՆՈՆՆԵՐԻ ԽԱՂ</span>
                  </div>
                </div>
                <GenderGame />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Footer Block */}
      <footer id="app-footer" className="w-full bg-[#1A1A1A] border-t-4 border-[#DD0000] py-4 px-4 text-center z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-2xs text-[#D1D1CB] font-mono">
          <p className="uppercase tracking-widest font-bold">
            © 2026 Armenian-Spanish Trainer • Crafted of Geometric Balance Theme
          </p>
          <p className="flex items-center gap-1.5 font-mono">
            <span>ՖՈՆԻ ՏԵՂԱԴՐՈՒԹՅՈՒՆ ՝</span>
            <span className="text-[#FFCE00] font-bold">{activeBackground.nameEn} (Իսպանիա 🇪🇸)</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

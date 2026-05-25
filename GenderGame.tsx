import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trophy, Sparkles, RefreshCw, HelpCircle, Check, X, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { NOUNS_GENDER } from './data';
import { playSuccessSound, playErrorSound, playFanfareSound, speakSpanishWord } from './audio';

export default function GenderGame() {
  const [isStudyMode, setIsStudyMode] = useState<boolean>(true);
  
  // Game states
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [showAnswerResult, setShowAnswerResult] = useState<boolean>(false);
  const [wasCorrect, setWasCorrect] = useState<boolean>(false);
  const [userSelection, setUserSelection] = useState<'el' | 'la' | null>(null);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [shuffledNouns, setShuffledNouns] = useState<typeof NOUNS_GENDER>([]);
  
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('genderGameHighScore') || '0');
  });

  const initializeGame = () => {
    // Pick 15 random nouns for the round
    const pool = [...NOUNS_GENDER].sort(() => Math.random() - 0.5).slice(0, 15);
    setShuffledNouns(pool);
    setCurrentIndex(0);
    setScore(0);
    setLives(3);
    setShowAnswerResult(false);
    setUserSelection(null);
    setGameCompleted(false);
  };

  const handleGenderSelect = (selected: 'el' | 'la') => {
    if (showAnswerResult || gameCompleted) return;

    const currentNoun = shuffledNouns[currentIndex];
    setUserSelection(selected);
    
    // Pronounce the word with its correct article
    speakSpanishWord(`${currentNoun.gender} ${currentNoun.word}`);

    const isCorrectChoice = selected === currentNoun.gender;
    setWasCorrect(isCorrectChoice);
    setShowAnswerResult(true);

    if (isCorrectChoice) {
      playSuccessSound();
      setScore((prev) => {
        const nextScore = prev + 15;
        if (nextScore > highScore) {
          setHighScore(nextScore);
          localStorage.setItem('genderGameHighScore', String(nextScore));
        }
        return nextScore;
      });
    } else {
      playErrorSound();
      setLives((p) => Math.max(0, p - 1));
    }
  };

  const handleNextWord = () => {
    setShowAnswerResult(false);
    setUserSelection(null);

    const nextIdx = currentIndex + 1;
    if (nextIdx >= shuffledNouns.length || lives <= 0) {
      setGameCompleted(true);
      playFanfareSound();
    } else {
      setCurrentIndex(nextIdx);
    }
  };

  const currentNoun = shuffledNouns[currentIndex];

  return (
    <div id="gender-game-container" className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      
      {/* Selector tab bar */}
      <div className="flex flex-col sm:flex-row gap-3 pb-3 border-b-2 border-gray-300">
        <button
          id="btn-gender-study"
          onClick={() => setIsStudyMode(true)}
          className={`flex items-center justify-center gap-2 px-6 py-3 border-2 border-black font-bold uppercase tracking-wider text-xs transition-all ${
            isStudyMode
              ? 'bg-[#FFCE00] text-black shadow-[2px_2px_0px_0px_#1A1A1A] scale-[1.02]'
              : 'bg-white hover:bg-[#EBEBE8] text-gray-700'
          }`}
        >
          <BookOpen size={14} />
          <span>Սեռերի Կանոններ (Grammar Study)</span>
        </button>
        <button
          id="btn-gender-play"
          onClick={() => {
            setIsStudyMode(false);
            initializeGame();
          }}
          className={`flex items-center justify-center gap-2 px-6 py-3 border-2 border-black font-bold uppercase tracking-wider text-xs transition-all ${
            !isStudyMode
              ? 'bg-[#FFCE00] text-black shadow-[2px_2px_0px_0px_#1A1A1A] scale-[1.02]'
              : 'bg-white hover:bg-[#EBEBE8] text-gray-700'
          }`}
        >
          <Trophy size={14} />
          <span>Խաղալ Տեսակավորում (Gender Sorting)</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isStudyMode ? (
          /* STUDY WORLD */
          <motion.div
            key="study-genders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white border-3 border-[#1A1A1A] p-6 geo-flat-shadow-sm flex flex-col gap-6 text-[#1A1A1A]"
          >
            <div>
              <h2 className="text-xl font-serif italic text-black flex items-center gap-3">
                <span>🤵 / 👩 Գոյականների Սեռերը</span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 bg-black text-white not-italic">
                  Género gramatical
                </span>
              </h2>
              <p className="text-xs text-gray-600 mt-2 font-medium">
                Իսպաներենում գոյականներն ունեն <strong>Արական (Masculine)</strong> կամ <strong>Իգական (Feminine)</strong> սեռ։ Հայերենում քերականական սեռ չկա, ուստի սա շատ կարևոր է սովորել!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* EL card rules */}
              <div className="bg-[#EBEBE8] border-2 border-black p-5 flex flex-col gap-3 geo-flat-shadow-sm text-black">
                <span className="text-xs font-black text-blue-800 font-display flex items-center gap-1.5 uppercase tracking-widest bg-blue-100 border border-blue-400 px-2 py-1 leading-none self-start">
                  <span>el</span>
                  <span className="text-slate-400">•</span>
                  <span>ԱՐԱԿԱՆ</span>
                </span>
                <p className="text-xs text-gray-700 leading-relaxed font-sans font-medium mt-1">
                  Սովորաբար <strong>-o</strong> տառով վերջացող բառերն արական սեռի են և գործածվում են <strong>el</strong> որոշիչ հոդի հետ:
                </p>
                <div className="flex flex-col gap-2 bg-white p-3.5 border border-black text-xs font-medium">
                  <div className="flex justify-between">
                    <span className="font-extrabold text-black">el libro 📖</span>
                    <span className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">(գիրքը)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-extrabold text-black">el sol ☀️</span>
                    <span className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">(արևը)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-extrabold text-black">el perro 🐶</span>
                    <span className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">(շունը)</span>
                  </div>
                </div>
              </div>

              {/* LA card rules */}
              <div className="bg-[#EBEBE8] border-2 border-black p-5 flex flex-col gap-3 geo-flat-shadow-sm text-black">
                <span className="text-xs font-black text-fuchsia-800 font-display flex items-center gap-1.5 uppercase tracking-widest bg-fuchsia-100 border border-fuchsia-400 px-2 py-1 leading-none self-start">
                  <span>la</span>
                  <span className="text-slate-400">•</span>
                  <span>ԻԳԱԿԱՆ</span>
                </span>
                <p className="text-xs text-gray-700 leading-relaxed font-sans font-medium mt-1">
                  Սովորաբար <strong>-a</strong> տառով վերջացող բառերն իգական սեռի են և գործածվում են <strong>la</strong> որոշիչ հոդի հետ:
                </p>
                <div className="flex flex-col gap-2 bg-white p-3.5 border border-black text-xs font-medium">
                  <div className="flex justify-between">
                    <span className="font-extrabold text-black">la mesa 🪑</span>
                    <span className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">(սեղանը)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-extrabold text-black">la luna 🌙</span>
                    <span className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">(լուսինը)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-extrabold text-black">la casa 🏠</span>
                    <span className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">(տունը)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FFCE00] border-2 border-black text-black text-xs font-medium geo-flat-shadow-sm">
              <span className="text-xs uppercase tracking-widest font-black text-black block mb-1">💡 Օգտակար Խորհուրդ (Exception rule)</span>
              <p className="text-xs text-gray-950 font-sans leading-relaxed">
                Չնայած կանոնին ՝ կան բացառություններ, ինչպես օրինակ ՝ <strong>la flor</strong> (ծաղիկը), որը չի վերջանում <strong>-a</strong>-ով, բայց իգական սեռի է, կամ բառեր, որոնք ունեն երկու ձևեր կախված կենդանու սեռից (օր.՝ <strong>el gato</strong> ՝ արու կատու, <strong>la gata</strong> ՝ էգ կատու):
              </p>
            </div>

            <button
              onClick={() => {
                setIsStudyMode(false);
                initializeGame();
              }}
              className="w-full py-4 bg-[#DD0000] hover:bg-black text-white font-extrabold uppercase tracking-widest text-xs border-2 border-black transition-all geo-flat-shadow active:translate-y-0.5"
            >
              <Trophy size={16} className="inline-block mr-2 -mt-0.5" />
              <span>Սկսել Տեսակավորման Խաղը</span>
            </button>
          </motion.div>
        ) : (
          /* GAME WORKSPACE */
          <motion.div
            key="play-genders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            {/* Top Stat display row */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 border-2 border-[#1A1A1A] geo-flat-shadow-sm gap-4 text-[#1A1A1A]">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest font-display">Կյանքեր ՝</span>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < lives ? 'opacity-100 scale-100' : 'opacity-20 scale-90'
                      } transition-all`}
                    >
                      ❤️
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs font-bold font-mono text-[#1A1A1A] uppercase tracking-wider bg-[#EBEBE8] px-3 py-1 border border-black">
                Բառ ՝ <span className="font-extrabold text-[#DD0000]">{currentIndex + 1}</span> / {shuffledNouns.length}
              </div>

              <div className="flex gap-4">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block leading-none">
                  Միավորներ ՝ <strong className="text-lg font-black font-mono bg-[#EBEBE8] px-2 py-0.5 border border-gray-400 text-black leading-none inline-block ml-1">{score}</strong>
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block leading-none">
                  Ռեկորդ ՝ <strong className="text-lg font-black font-mono bg-[#EBEBE8] px-2 py-0.5 border border-gray-400 text-black leading-none inline-block ml-1">{highScore}</strong>
                </span>
              </div>
            </div>

            {gameCompleted ? (
              /* SCREEN: COMPLETED MODULE */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-4 border-[#1A1A1A] p-8 text-center geo-flat-shadow flex flex-col items-center text-black"
              >
                <div className="w-16 h-16 bg-[#FFCE00] border-2 border-black flex items-center justify-center text-3xl mb-4 text-[#1A1A1A] animate-pulse relative shadow-md">
                  🏅
                </div>
                <h3 className="text-xl font-serif italic font-extrabold text-black">
                  {lives > 0 ? 'Հրաշալի՛ է, ավարտվեց' : 'Խաղն ավարտվեց'}
                </h3>
                <p className="text-xs text-gray-600 mt-2 max-w-sm font-sans font-medium">
                  Դուք սովորեցիք իսպաներենի գոյականների արական և իգական սեռերի ճիշտ կանոնները։
                </p>

                <div className="grid grid-cols-2 gap-8 my-6 bg-[#EBEBE8] border-2 border-[#1A1A1A] p-6 w-full max-w-sm shadow-sm text-center font-sans">
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">ՄԻԱՎՈՐՆԵՐ</span>
                    <span className="text-2xl font-black font-mono text-black block mt-1">{score}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">ՍԽԱԼՆԵՐ</span>
                    <span className="text-2xl font-black font-mono text-[#DD0000] block mt-1">{3 - lives}</span>
                  </div>
                </div>

                <div className="flex gap-3 w-full max-w-sm">
                  <button
                    onClick={initializeGame}
                    className="flex-1 py-3 bg-[#DD0000] hover:bg-black text-white font-extrabold uppercase tracking-widest text-xs border-2 border-black transition-all shadow-sm active:translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} />
                    <span>Փորձել Նորից</span>
                  </button>
                  <button
                    onClick={() => setIsStudyMode(true)}
                    className="flex-1 py-3 bg-white hover:bg-[#EBEBE8] text-[#1A1A1A] font-extrabold uppercase tracking-wider text-xs border-2 border-[#1A1A1A] transition-colors"
                  >
                    Դիտել Կանոնները
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ACTIVE NOUN SORTING ZONE */
              currentNoun && (
                <div className="flex flex-col gap-6">
                  {/* Sorting Arena Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch my-4">
                    {/* Left Bucket Option (EL) */}
                    <div
                      onClick={() => handleGenderSelect('el')}
                      className={`md:col-span-3 min-h-[140px] md:h-auto bg-white border-2 border-[#1A1A1A] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#FFCE00]/25 hover:scale-[1.01] text-[#1A1A1A] ${
                        userSelection === 'el' && currentNoun.gender === 'el'
                          ? 'bg-blue-50 border-[#1A1A1A] border-l-8 border-l-blue-600 shadow-inner'
                          : 'geo-flat-shadow-sm'
                      }`}
                    >
                      <span className="text-base font-black text-blue-800 font-display uppercase tracking-widest bg-blue-100 px-4 py-1.5 border border-blue-400 mb-2 leading-none">
                        EL
                      </span>
                      <span className="text-xs text-[#1A1A1A] font-black uppercase tracking-wider">Արական Սեռ</span>
                      <span className="text-[9px] text-gray-400 mt-1 uppercase font-mono tracking-widest">«Սեղմիր Ընտրելու»</span>
                    </div>

                    {/* Central Word Card */}
                    <div className="md:col-span-6 flex justify-center items-center">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentNoun.id}
                          initial={{ opacity: 0, scale: 0.98, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          className={`w-full max-w-sm p-6 bg-white border-3 border-[#1A1A1A] text-center relative flex flex-col items-center gap-5 ${
                            showAnswerResult
                              ? wasCorrect
                                ? 'bg-emerald-50 border-emerald-500 border-l-8'
                                : 'bg-rose-50 border-rose-500 border-l-8'
                              : 'geo-flat-shadow'
                          }`}
                        >
                          <HelpCircle className="text-gray-400 absolute top-4 right-4 animate-pulse shrink-0" size={18} />

                          <div className="flex flex-col items-center gap-1 mt-2">
                            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">
                              Ի՞ՆՉ ՔԵՐԱԿԱՆԱԿԱՆ ՀՈԴ Է ՕԳՏԱԳՈՐԾՎՈՒՄ
                            </span>
                            <span className="text-3xl sm:text-4xl font-extrabold font-serif italic text-black tracking-wide my-1 leading-none">
                              {currentNoun.word}
                            </span>
                            <span className="text-xs font-mono text-gray-500 leading-none block">
                              [{currentNoun.phonetic}]
                            </span>
                          </div>

                          <div className="w-full h-[1px] bg-gray-200" />

                          <div className="flex flex-col items-center gap-1">
                            <span className="text-base font-black text-black leading-none">
                              {currentNoun.armenian}
                            </span>
                            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-mono font-bold leading-none mt-1">թարգմանություն</span>
                          </div>

                          {/* Quick decision UI actions under layout */}
                          {!showAnswerResult && (
                            <div className="flex gap-4 w-full mt-3">
                              <button
                                onClick={() => handleGenderSelect('el')}
                                className="flex-1 py-3 bg-blue-600 hover:bg-black text-white font-extrabold uppercase tracking-widest text-xs border-2 border-black transition-all active:translate-y-0.5 shadow-sm"
                              >
                                EL (ar")
                              </button>
                              <button
                                onClick={() => handleGenderSelect('la')}
                                className="flex-1 py-3 bg-fuchsia-600 hover:bg-black text-white font-extrabold uppercase tracking-widest text-xs border-2 border-black transition-all active:translate-y-0.5 shadow-sm"
                              >
                                LA (eg")
                              </button>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Right Bucket Option (LA) */}
                    <div
                      onClick={() => handleGenderSelect('la')}
                      className={`md:col-span-3 min-h-[140px] md:h-auto bg-white border-2 border-[#1A1A1A] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#FFCE00]/25 hover:scale-[1.01] text-[#1A1A1A] ${
                        userSelection === 'la' && currentNoun.gender === 'la'
                          ? 'bg-fuchsia-100 border-[#1A1A1A] border-l-8 border-l-fuchsia-600 shadow-inner'
                          : 'geo-flat-shadow-sm'
                      }`}
                    >
                      <span className="text-base font-black text-fuchsia-800 font-display uppercase tracking-widest bg-fuchsia-100 px-4 py-1.5 border border-fuchsia-400 mb-2 leading-none">
                        LA
                      </span>
                      <span className="text-xs text-[#1A1A1A] font-black uppercase tracking-wider">Իգական Սեռ</span>
                      <span className="text-[9px] text-gray-400 mt-1 uppercase font-mono tracking-widest">«Սեղմիր Ընտրելու»</span>
                    </div>
                  </div>

                  {/* Feedback on gender rule in Armenian */}
                  <AnimatePresence>
                    {showAnswerResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-5 bg-white border-2 border-black flex flex-col gap-3 mt-4 text-black ${
                          wasCorrect ? 'border-emerald-500' : 'border-rose-500'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 bg-black text-white shrink-0 ${wasCorrect ? 'bg-emerald-700' : 'bg-[#DD0000]'}`}>
                            {wasCorrect ? <Check size={16} /> : <X size={16} />}
                          </div>
                          
                          <div className="flex-1">
                            <span className={`text-sm font-black uppercase tracking-wider ${wasCorrect ? 'text-emerald-700' : 'text-[#DD0000]'}`}>
                              {wasCorrect ? 'ՃԻՇՏ Է՛:' : 'ՍԽԱԼ Է՛:'}
                            </span>
                            <span className="text-base font-extrabold text-[#1A1A1A] block mt-1">
                              {currentNoun.gender === 'el' ? 'el' : 'la'} {currentNoun.word}
                            </span>
                            <div className="text-xs text-gray-700 my-1 bg-[#EBEBE8] border border-gray-300 p-4 font-medium leading-relaxed leading-relaxed mt-2.5">
                              <strong className="text-black block mb-1 uppercase tracking-wider text-[10px] font-black">Կանոն/Բացատրություն ՝</strong>
                              {currentNoun.hint}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleNextWord}
                          className="self-end px-6 py-2.5 bg-[#DD0000] hover:bg-black text-white font-extrabold uppercase tracking-widest text-xs border-2 border-black transition-transform active:translate-y-0.5 geo-flat-shadow-sm flex items-center justify-center gap-1.5 mt-2"
                        >
                          <span>Հաջորդ բառը</span>
                          <ArrowRight size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

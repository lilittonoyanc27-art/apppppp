import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RefreshCw, Eye, BookOpen, Trophy, Clock, CheckCircle, Info } from 'lucide-react';
import { DAYS_OF_WEEK } from './data';
import { MemoryCard } from './types';
import { playSuccessSound, playErrorSound, playFanfareSound, speakSpanishWord } from './audio';

// Dynamic color pairings for the memory card matches (Geometric solid tones)
const CARD_BG_COLORS = [
  'bg-emerald-200 border-emerald-900 text-emerald-950',
  'bg-amber-200 border-amber-900 text-amber-950',
  'bg-blue-200 border-blue-900 text-blue-950',
  'bg-fuchsia-200 border-fuchsia-900 text-fuchsia-950',
  'bg-orange-200 border-orange-900 text-orange-950',
  'bg-[#FFCE00] border-black text-black',
  'bg-rose-200 border-rose-900 text-rose-950',
];

export default function DaysGame() {
  const [isStudyMode, setIsStudyMode] = useState<boolean>(true);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('daysGameHighScore') || '999');
  });

  // Sound generator timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && !gameCompleted) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, gameCompleted]);

  // Handle word selection and speech synthesis
  const handleHearPronunciation = (word: string) => {
    speakSpanishWord(word);
  };

  // Create & shuffle deck of memory cards
  const initializeGame = () => {
    const list: MemoryCard[] = [];
    
    // Duplicate 15 terms into 30 items
    DAYS_OF_WEEK.forEach((day, index) => {
      const color = CARD_BG_COLORS[index % CARD_BG_COLORS.length];
      // Spanish version
      list.push({
        id: `es-${day.id}`,
        termId: day.id,
        text: day.spanish,
        language: 'es',
        isFlipped: false,
        isMatched: false,
        colorClass: color
      });

      // Armenian version
      list.push({
        id: `hy-${day.id}`,
        termId: day.id,
        text: day.armenian,
        language: 'hy',
        isFlipped: false,
        isMatched: false,
        colorClass: color
      });
    });

    // Shuffle
    const shuffled = list.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setMoves(0);
    setSeconds(0);
    setIsTimerActive(true);
    setGameCompleted(false);
  };

  // Fire when user clicks a card
  const handleCardClick = (clickedIndex: number) => {
    if (!isTimerActive) setIsTimerActive(true);

    // Prevent clicking matched, already flipped cards, or when 2 are already selected
    if (
      cards[clickedIndex].isMatched ||
      cards[clickedIndex].isFlipped ||
      selectedCards.length >= 2
    ) {
      return;
    }

    // Sound effect for flip
    speakSpanishWord(cards[clickedIndex].language === 'es' ? cards[clickedIndex].text : '');

    const updatedCards = [...cards];
    updatedCards[clickedIndex].isFlipped = true;
    setCards(updatedCards);

    const newSelected = [...selectedCards, clickedIndex];
    setSelectedCards(newSelected);

    // Check match if 2 cards selected
    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1);
      const firstIndex = newSelected[0];
      const secondIndex = newSelected[1];

      if (cards[firstIndex].termId === cards[secondIndex].termId) {
        // MATCH FOUND
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setSelectedCards([]);
          playSuccessSound();

          // Check if game complete
          const allMatched = matchedCards.every((c) => c.isMatched);
          if (allMatched) {
            setGameCompleted(true);
            setIsTimerActive(false);
            playFanfareSound();
            
            // Save high score if moves is lower than previous high score
            if (moves + 1 < highScore) {
              setHighScore(moves + 1);
              localStorage.setItem('daysGameHighScore', String(moves + 1));
            }
          }
        }, 500);
      } else {
        // MATCH FAILS
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setSelectedCards([]);
          playErrorSound();
        }, 1000);
      }
    }
  };

  // Format stopwatch format MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="days-game-container" className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      
      {/* Stark Tab Selector Row */}
      <div className="flex flex-col sm:flex-row gap-3 pb-3 border-b-2 border-gray-300">
        <button
          id="btn-study-mode"
          onClick={() => setIsStudyMode(true)}
          className={`flex items-center justify-center gap-2 px-6 py-3 border-2 border-black font-bold uppercase tracking-wider text-xs transition-all ${
            isStudyMode
              ? 'bg-[#FFCE00] text-black shadow-[2px_2px_0px_0px_#1A1A1A] scale-[1.02]'
              : 'bg-white hover:bg-[#EBEBE8] text-gray-700'
          }`}
        >
          <BookOpen size={14} />
          <span>Սովորել Դասագիրք (Study Mode)</span>
        </button>
        <button
          id="btn-play-mode"
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
          <span>Խաղալ Զույգերի Միացում (Play Game)</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isStudyMode ? (
          /* STUDY MODE MODULE - Solid Clean White Card, crisp borders */
          <motion.div
            key="study-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white border-3 border-[#1A1A1A] p-6 geo-flat-shadow-sm flex flex-col gap-6 text-[#1A1A1A]"
          >
            <div>
              <h2 className="text-xl font-serif italic text-black flex items-center gap-3">
                <span>📅 Շաբաթվա Օրեր</span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 bg-black text-white not-italic">
                  Días de la semana
                </span>
              </h2>
              <p className="text-xs text-gray-600 mt-2 font-sans font-medium">
                Սեղմեք իսպաներեն բառի վրա ՝ լսելու համար ճիշտ արտասանությունը: Փորձեք մտապահել դրանք, ապա սկսել խաղալ:
              </p>
            </div>

            {/* Flat high contrast cards list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DAYS_OF_WEEK.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleHearPronunciation(item.spanish)}
                  className="group flex items-center justify-between p-4 bg-white border-2 border-[#1A1A1A] hover:bg-[#FFCE00]/30 transition-all cursor-pointer geo-flat-shadow-sm active:translate-y-0.5"
                >
                  <div className="flex flex-col gap-1 pl-1">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase font-mono tracking-widest">Օր {index + 1}</span>
                    <span className="text-lg font-display font-extrabold text-black group-hover:text-[#DD0000] transition-colors leading-tight">
                      {item.spanish}
                    </span>
                    <span className="text-xs text-gray-500 font-mono tracking-wide leading-none">
                      [{item.phonetic}]
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right flex flex-col">
                      <span className="text-base font-extrabold text-black">{item.armenian}</span>
                      <span className="text-[9px] text-gray-400 font-mono uppercase tracking-wider">ՀԱՅԵՐԵՆ</span>
                    </div>
                    
                    {/* Retro blocky volume button */}
                    <div className="p-2.5 bg-black text-white group-hover:bg-[#DD0000] border-2 border-black transition-colors rounded-none">
                      <Volume2 size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Blocky Linguistic Fact Card (Solid Yellow `#FFCE00`) */}
            <div className="p-5 bg-[#FFCE00] border-2 border-[#1A1A1A] flex gap-4 items-start geo-flat-shadow-sm text-black">
              <Info className="text-black shrink-0 mt-0.5" size={18} />
              <div className="text-xs leading-relaxed font-sans font-medium">
                <p className="font-extrabold uppercase tracking-widest text-[#1A1A1A] mb-1">Լեզվաբանական Փաստ:</p>
                Իսպաներենում շաբաթվա օրերի անունները (բացի շաբաթից և կիրակիից) կապված են տիեզերական մարմինների հետ.
                <ul className="list-disc pl-4 mt-2 flex flex-col gap-1 text-gray-950">
                  <li><strong>Lunes</strong> - Լուսին (Luna)</li>
                  <li><strong>Martes</strong> - Մարս (Marte)</li>
                  <li><strong>Miércoles</strong> - Մերկուրի (Mercurio)</li>
                  <li><strong>Jueves</strong> - Յուպիտեր (Júpiter)</li>
                  <li><strong>Viernes</strong> - Վեներա (Venus)</li>
                </ul>
              </div>
            </div>

            {/* Crisp heavy solid button */}
            <button
              onClick={() => {
                setIsStudyMode(false);
                initializeGame();
              }}
              className="w-full py-4 bg-[#DD0000] hover:bg-black text-white font-extrabold uppercase tracking-widest text-xs border-2 border-black transition-all geo-flat-shadow active:translate-y-0.5"
            >
              <Trophy size={16} className="inline-block mr-2 -mt-0.5" />
              <span>Անցնել Խաղին ՝ Ստուգելու Գիտելիքները</span>
            </button>
          </motion.div>
        ) : (
          /* PLAY MODE MODULE */
          <motion.div
            key="play-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Top Stat display row: stark white boxes with thick borders */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b-2 border-dashed border-gray-300">
              <div className="bg-white p-4 border-2 border-[#1A1A1A] flex flex-col items-center justify-center text-center geo-flat-shadow-sm">
                <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Շարժումներ (Moves)</span>
                <span className="text-xl font-display font-black text-black mt-1 leading-none">{moves}</span>
              </div>
              <div className="bg-white p-4 border-2 border-[#1A1A1A] flex flex-col items-center justify-center text-center geo-flat-shadow-sm">
                <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Ժամանակ (Time)</span>
                <span className="text-xl font-mono font-bold text-black mt-1 flex items-center gap-1.5 leading-none">
                  <Clock size={15} className="text-[#DD0000]" />
                  {formatTime(seconds)}
                </span>
              </div>
              <div className="bg-white p-4 border-2 border-[#1A1A1A] flex flex-col items-center justify-center text-center geo-flat-shadow-sm">
                <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Ռեկորդ (Record)</span>
                <span className="text-xl font-display font-black text-black mt-1 leading-none">
                  {highScore === 999 ? '—' : `${highScore} քայլ`}
                </span>
              </div>
              
              <button
                onClick={initializeGame}
                className="bg-[#DD0000] hover:bg-black text-white border-2 border-black font-extrabold uppercase tracking-widest text-xs transition-colors py-4 flex flex-col items-center justify-center cursor-pointer geo-flat-shadow-sm text-center"
              >
                <RefreshCw size={16} className="animate-spin-hover" />
                <span className="mt-1">Խաղալ Նորից</span>
              </button>
            </div>

            {/* Grid of memory cards - crisp cards with sharp corners */}
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 gap-3 sm:gap-4 my-4">
              {cards.map((card, idx) => {
                const isFlippedOrMatched = card.isFlipped || card.isMatched;
                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    className="h-24 sm:h-28 cursor-pointer perspective-800 touch-none select-none relative"
                  >
                    <motion.div
                      className={`w-full h-full duration-300 transform-style-3d relative flex items-center justify-center`}
                      animate={{ rotateY: isFlippedOrMatched ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Front of card (Revealed content) */}
                      <div
                        className={`absolute inset-0 w-full h-full backface-hidden flex flex-col justify-center items-center p-2 text-center rotate-y-180 border-2 border-black ${
                          card.isMatched
                             ? 'bg-emerald-100 text-emerald-950 shadow-inner'
                            : 'bg-[#FFCE00] text-black shadow-md'
                        }`}
                      >
                        <span className="text-[8px] sm:text-[9px] uppercase text-gray-950 font-mono tracking-widest font-extrabold mb-0.5">
                          {card.language === 'es' ? 'Spanish 🇪🇸' : 'Armenian 🇦🇲'}
                        </span>
                        <span className={`font-extrabold tracking-tight leading-tight ${card.language === 'es' ? 'text-sm sm:text-base font-display' : 'text-xs sm:text-sm font-sans'}`}>
                          {card.text}
                        </span>
                        {card.isMatched && (
                          <div className="absolute top-1 right-1 p-0.5 bg-emerald-800 text-white rounded-none">
                            <CheckCircle size={8} />
                          </div>
                        )}
                      </div>

                      {/* Back of Card (Geometric Cover Face) */}
                      <div className="absolute inset-0 w-full h-full backface-hidden bg-white border-2 border-[#1A1A1A] p-2 flex flex-col items-center justify-center transition-all hover:bg-[#FFCE00] group geo-flat-shadow-sm">
                        <span className="text-xl sm:text-2xl text-black font-black font-display group-hover:scale-110 transition-transform">📅</span>
                        <span className="text-[8px] sm:text-[10px] text-gray-800 tracking-widest font-bold uppercase mt-0.5 leading-none">
                          ԲԱՑԵԼ
                        </span>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Completion fireworks Stark Modal Box */}
            {gameCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-4 border-[#1A1A1A] p-8 text-center geo-flat-shadow mt-4 relative"
              >
                <div className="absolute top-2 right-2 w-4 h-4 bg-[#FFCE00]" />
                <div className="absolute bottom-2 left-2 w-4 h-4 bg-[#DD0000]" />
                
                <div className="text-4xl animate-bounce mb-3">🎉</div>
                <h3 className="text-xl font-serif italic font-extrabold text-black">
                  Կեցցե՛ս։ Բոլոր զույգերը գտնված են։
                </h3>
                <p className="text-xs text-gray-600 mt-1 max-w-lg mx-auto font-sans font-medium">
                  Դուք հաջողությամբ զուգակցեցիք շաբաթվա բոլոր օրերը իսպաներենով և հայերենով:
                </p>
                
                <div className="flex gap-8 justify-center items-center mt-6 bg-[#EBEBE8] border-2 border-[#1A1A1A] p-4 max-w-sm mx-auto shadow-md">
                  <div>
                    <span className="block text-gray-500 font-bold uppercase tracking-widest text-[10px]">Քայլեր</span>
                    <span className="text-2xl font-black font-mono text-black">{moves}</span>
                  </div>
                  <div className="w-[2px] h-8 bg-black/20" />
                  <div>
                    <span className="block text-gray-500 font-bold uppercase tracking-widest text-[10px]">Ժամանակ</span>
                    <span className="text-2xl font-black font-mono text-black">{formatTime(seconds)}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={initializeGame}
                    className="px-6 py-3 bg-[#DD0000] hover:bg-black text-white border-2 border-black font-extrabold uppercase tracking-wider text-xs transition-transform active:translate-y-0.5 geo-flat-shadow-sm flex items-center gap-2"
                  >
                    <RefreshCw size={14} />
                    <span>Փորձել Նորից</span>
                  </button>
                  <button
                    onClick={() => setIsStudyMode(true)}
                    className="px-6 py-3 bg-white hover:bg-[#EBEBE8] text-[#1A1A1A] border-2 border-black font-extrabold uppercase tracking-wider text-xs transition-colors shadow-sm"
                  >
                    Վերադառնալ Դասագրքին
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RefreshCw, Trophy, Heart, Award, Sparkles, BookOpen, ChevronRight, Check, X } from 'lucide-react';
import { NUMBERS_LESSON } from './data';
import { playSuccessSound, playErrorSound, playFanfareSound, speakSpanishWord } from './audio';

export default function NumbersGame() {
  const [isStudyMode, setIsStudyMode] = useState<boolean>(true);
  
  // Game state
  const [score, setScore] = useState<number>(0);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('numbersGameHighScore') || '0');
  });

  // Quiz questions generation
  const [options, setOptions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<typeof NUMBERS_LESSON[0] | null>(null);

  // Encouraging feedback phrases in Armenian
  const ENCOURAGEMENTS = ['Հրաշալի՛ է:', 'Ճիշտ է:', 'Գերազանց:', 'Ապրե՛ս:', 'Փայլո՛ւն է:'];
  const [feedbackText, setFeedbackText] = useState<string>('');

  // Start new round
  const startNewQuiz = () => {
    setScore(0);
    setQuestionIndex(0);
    setLives(3);
    setGameCompleted(false);
    setSelectedOption(null);
    setIsCorrect(null);
    generateQuestion(0);
  };

  const generateQuestion = (index: number) => {
    if (index >= 15) {
      setGameCompleted(true);
      playFanfareSound();
      return;
    }

    setSelectedOption(null);
    setIsCorrect(null);

    // Pick a number from data
    const randomIndex = Math.floor(Math.random() * NUMBERS_LESSON.length);
    const questionItem = NUMBERS_LESSON[randomIndex];
    setCurrentQuestion(questionItem);

    // Form multiple choice options (1 correct, 3 distractor)
    const answers = new Set<string>();
    answers.add(questionItem.spanish);

    while (answers.size < Math.min(4, NUMBERS_LESSON.length)) {
      const distractorIndex = Math.floor(Math.random() * NUMBERS_LESSON.length);
      answers.add(NUMBERS_LESSON[distractorIndex].spanish);
    }

    // Convert to array and shuffle
    setOptions(Array.from(answers).sort(() => Math.random() - 0.5));
  };

  const handleHearPronunciation = (word: string) => {
    speakSpanishWord(word);
  };

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null || !currentQuestion) return;

    setSelectedOption(option);
    
    // Play pronunciation of selected item
    speakSpanishWord(option);

    const correct = option === currentQuestion.spanish;
    setIsCorrect(correct);

    if (correct) {
      playSuccessSound();
      setScore((prev) => {
        const newScore = prev + 10;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('numbersGameHighScore', String(newScore));
        }
        return newScore;
      });
      // Set random congratulations in Armenian
      setFeedbackText(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
    } else {
      playErrorSound();
      setLives((prev) => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          setTimeout(() => {
            setGameCompleted(true);
            playFanfareSound();
          }, 800);
        }
        return nextLives;
      });
    }
  };

  const handleNextQuestion = () => {
    const nextIdx = questionIndex + 1;
    setQuestionIndex(nextIdx);
    generateQuestion(nextIdx);
  };

  return (
    <div id="numbers-game-container" className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      
      {/* Selector tab bar */}
      <div className="flex flex-col sm:flex-row gap-3 pb-3 border-b-2 border-gray-300">
        <button
          id="btn-numbers-study"
          onClick={() => setIsStudyMode(true)}
          className={`flex items-center justify-center gap-2 px-6 py-3 border-2 border-black font-bold uppercase tracking-wider text-xs transition-all ${
            isStudyMode
              ? 'bg-[#FFCE00] text-black shadow-[2px_2px_0px_0px_#1A1A1A] scale-[1.02]'
              : 'bg-white hover:bg-[#EBEBE8] text-gray-700'
          }`}
        >
          <BookOpen size={14} />
          <span>Սովորել Թվեր (Numbers Study)</span>
        </button>
        <button
          id="btn-numbers-play"
          onClick={() => {
            setIsStudyMode(false);
            startNewQuiz();
          }}
          className={`flex items-center justify-center gap-2 px-6 py-3 border-2 border-black font-bold uppercase tracking-wider text-xs transition-all ${
            !isStudyMode
              ? 'bg-[#FFCE00] text-black shadow-[2px_2px_0px_0px_#1A1A1A] scale-[1.02]'
              : 'bg-white hover:bg-[#EBEBE8] text-gray-700'
          }`}
        >
          <Trophy size={14} />
          <span>Խաղալ Թվերի Փուչիկներ (Pop Quiz)</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isStudyMode ? (
          /* STUDY MODE FOR NUMBERS */
          <motion.div
            key="study-numbers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white border-3 border-[#1A1A1A] p-6 geo-flat-shadow-sm flex flex-col gap-6 text-[#1A1A1A]"
          >
            <div>
              <h2 className="text-xl font-serif italic text-black flex items-center gap-3">
                <span>🔢 Թվեր և Մաթեմատիկա</span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 bg-black text-white not-italic">
                  Los Números
                </span>
              </h2>
              <p className="text-xs text-gray-600 mt-2 font-medium">
                Սեղմեք իսպաներեն թղթադրամի վրա ՝ լսելու ճիշտ արտասանությունը: Սովորեք հաշվել 1-ից մինչև 20-ը:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {NUMBERS_LESSON.map((num) => (
                <div
                  key={num.id}
                  onClick={() => handleHearPronunciation(num.spanish)}
                  className="group flex flex-col items-center justify-center p-5 bg-white border-2 border-[#1A1A1A] hover:bg-[#FFCE00]/30 transition-all cursor-pointer text-center relative geo-flat-shadow-sm active:translate-y-0.5"
                >
                  <span className="absolute top-2 right-2 text-3xl font-black text-black/5 group-hover:text-black/10 select-none transition-colors leading-none font-display">
                    {num.value}
                  </span>
                  
                  <div className="w-14 h-14 bg-[#FFCE00] border-2 border-black flex items-center justify-center text-xl font-black font-display text-black mb-3 group-hover:scale-105 transition-transform shadow-sm">
                    {num.value}
                  </div>
                  
                  <span className="text-lg font-display font-extrabold text-black group-hover:text-[#DD0000] transition-colors leading-tight">
                    {num.spanish}
                  </span>
                  
                  <span className="text-xs font-mono text-gray-500 mt-0.5">
                    [{num.phonetic}]
                  </span>

                  <div className="w-full h-[1px] bg-gray-200 my-2.5" />

                  <span className="text-sm font-bold text-gray-800 font-sans leading-none">{num.armenian}</span>
                  
                  <div className="mt-3 text-[9px] font-black uppercase tracking-wider px-2 py-1 bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Volume2 size={10} />
                    <span>Լսել</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setIsStudyMode(false);
                startNewQuiz();
              }}
              className="w-full py-4 bg-[#DD0000] hover:bg-black text-white font-extrabold uppercase tracking-widest text-xs border-2 border-black transition-all geo-flat-shadow active:translate-y-0.5"
            >
              <Trophy size={16} className="inline-block mr-2 -mt-0.5" />
              <span>Անցնել Մրցաշարին (Start Training Pop Quiz)</span>
            </button>
          </motion.div>
        ) : (
          /* PLAY MODE FOR NUMBERS */
          <motion.div
            key="play-numbers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* HUD Status Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 border-2 border-[#1A1A1A] geo-flat-shadow-sm gap-4 text-[#1A1A1A]">
              <div className="flex items-center gap-2 font-display">
                <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Կյանքեր ՝</span>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart
                      key={i}
                      size={18}
                      className={i < lives ? 'fill-[#DD0000] text-[#DD0000]' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest font-mono block font-bold">Հարց ՝ {questionIndex + 1}/15</span>
                <div className="w-32 bg-gray-200 border border-black h-2.5 rounded-none mt-1.5 overflow-hidden">
                  <div
                    className="bg-[#DD0000] h-full transition-all duration-300"
                    style={{ width: `${((questionIndex + 1) / 15) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block leading-none">Միավորներ</span>
                  <span className="text-lg font-black font-mono bg-[#EBEBE8] px-2 py-0.5 border border-gray-400 text-black leading-none inline-block mt-1">{score}</span>
                </div>
                <div className="h-6 w-[2px] bg-gray-300" />
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block leading-none">Ռեկորդ</span>
                  <span className="text-lg font-black font-mono bg-[#EBEBE8] px-2 py-0.5 border border-gray-400 text-black leading-none inline-block mt-1">{highScore}</span>
                </div>
              </div>
            </div>

            {gameCompleted ? (
              /* SCREEN: GAME COMPLETED */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-4 border-[#1A1A1A] p-8 text-center geo-flat-shadow flex flex-col items-center text-black"
              >
                <div className="w-16 h-16 bg-[#FFCE00] border-2 border-black flex items-center justify-center text-3xl mb-4 text-[#1A1A1A] animate-pulse relative shadow-md">
                  🏆
                </div>
                <h3 className="text-xl font-serif italic font-extrabold text-black">
                  {lives > 0 ? 'Շնորհավորո՛ւմ ենք:' : 'Խաղն ավարտվեց'}
                </h3>
                <p className="text-xs text-gray-600 mt-2 max-w-sm font-sans font-medium">
                  {lives > 0
                    ? 'Դուք փայլուն կերպով ավարտեցիք թվերի իսպաներեն թեստավորումը:'
                    : 'Սովորեք նորից ՝ ավելի բարձր արդյունք գրանցելու համար:'}
                </p>

                <div className="grid grid-cols-2 gap-8 my-6 bg-[#EBEBE8] border-2 border-[#1A1A1A] p-6 w-full max-w-sm shadow-sm text-center">
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest font-mono">Միավորներ</span>
                    <span className="text-3xl font-black font-mono text-black block mt-2">{score}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest font-mono">Մնացած կյանքեր</span>
                    <span className="text-3xl font-black font-mono text-[#DD0000] block mt-2">
                      {lives} / 3
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 w-full max-w-sm">
                  <button
                    onClick={startNewQuiz}
                    className="flex-1 py-3 bg-[#DD0000] hover:bg-black text-white font-extrabold uppercase tracking-widest text-xs border-2 border-black transition-all shadow-sm active:translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} />
                    <span>Սկսել Նորից</span>
                  </button>
                  <button
                    onClick={() => setIsStudyMode(true)}
                    className="flex-1 py-3 bg-white hover:bg-[#EBEBE8] text-[#1A1A1A] font-extrabold uppercase tracking-wider text-xs border-2 border-[#1A1A1A] transition-colors"
                  >
                    Սովորել Թվերը
                  </button>
                </div>
              </motion.div>
            ) : (
              /* SCREEN: ACTIVE QUIZ WORKSPACE */
              currentQuestion && (
                <div className="bg-white border-3 border-[#1A1A1A] p-6 geo-flat-shadow-sm flex flex-col gap-6 text-[#1A1A1A]">
                  
                  {/* Central question layout */}
                  <div className="text-center py-6 flex flex-col items-center gap-4 bg-[#EBEBE8] border-2 border-black relative overflow-hidden">
                    <div className="absolute -top-4 -left-4 text-7xl font-black text-black/5 select-none font-display leading-none">
                      {currentQuestion.value}
                    </div>
                    
                    <span className="text-[10px] uppercase font-mono tracking-widest bg-black text-white px-3 py-1 border border-black font-black leading-none">
                      Գտի՛ր Համապատասխան Թիվը
                    </span>
                    
                    <h2 className="text-3xl sm:text-4xl font-extrabold font-serif italic text-[#1A1A1A] flex flex-col sm:flex-row items-center justify-center gap-3">
                      <span className="font-sans font-black bg-[#FFCE00] text-black border-2 border-black px-4 py-1.5 shadow-sm not-italic leading-none">
                        {currentQuestion.value}
                      </span>
                      <span className="mt-1 sm:mt-0">({currentQuestion.armenian})</span>
                    </h2>
                    
                    <p className="text-xs text-gray-500 mt-1 max-w-sm font-sans font-medium">
                      Ընտրեք ներքևի տարբերակներից այն մեկը, որը իսպաներենով նշանակում է այս թիվը:
                    </p>
                  </div>

                  {/* Options select grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {options.map((option, opIdx) => {
                      const isOptionSelected = selectedOption === option;
                      const isCorrectAnswer = option === currentQuestion.spanish;
                      
                      let appearanceClass = 'bg-white border-2 border-black text-[#1A1A1A] hover:bg-[#FFCE00]/20';
                      
                      if (selectedOption !== null) {
                        if (isCorrectAnswer) {
                          // Green highlight for the correct answer
                          appearanceClass = 'bg-emerald-100 border-[#1A1A1A] text-emerald-950 font-extrabold border-l-8 border-emerald-600 scale-[1.01]';
                        } else if (isOptionSelected) {
                          // Red highlight if user selected wrong option
                          appearanceClass = 'bg-rose-100 border-[#1A1A1A] text-rose-950 border-l-8 border-rose-600';
                        } else {
                          // Muted option
                          appearanceClass = 'bg-[#EBEBE8]/40 border-gray-300 text-gray-400 font-medium cursor-not-allowed';
                        }
                      }

                      return (
                        <motion.button
                          key={opIdx}
                          disabled={selectedOption !== null}
                          onClick={() => handleOptionClick(option)}
                          whileHover={selectedOption === null ? { scale: 1.012 } : {}}
                          whileTap={selectedOption === null ? { scale: 0.988 } : {}}
                          className={`flex items-center justify-between p-4 rounded-none text-sm font-extrabold uppercase tracking-wide transition-all relative cursor-pointer ${appearanceClass}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-black text-white flex items-center justify-center border border-black text-xs font-mono font-bold shrink-0">
                              {String.fromCharCode(65 + opIdx)}
                            </span>
                            <span>{option}</span>
                          </span>

                          <div className="flex items-center gap-2">
                            {selectedOption !== null && isCorrectAnswer && (
                              <div className="p-1 bg-emerald-700 text-white rounded-none">
                                <Check size={12} />
                              </div>
                            )}
                            {selectedOption !== null && isOptionSelected && !isCorrectAnswer && (
                              <div className="p-1 bg-[#DD0000] text-white rounded-none">
                                <X size={12} />
                              </div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Feedback Action Row */}
                  <AnimatePresence>
                    {selectedOption !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-white border-2 border-black flex flex-col sm:flex-row justify-between items-center gap-4 mt-2 geo-flat-shadow-sm text-black"
                        style={{
                          borderColor: isCorrect ? '#10B981' : '#EF4444'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`text-2xl ${isCorrect ? 'text-emerald-600' : 'text-[#DD0000]'}`}>
                            {isCorrect ? '🌟' : '💡'}
                          </div>
                          <div>
                            <span className={`text-sm font-black uppercase tracking-wider ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {isCorrect ? feedbackText : 'Ճիշտ պատասխանն է ՝'}
                            </span>
                            <p className="text-xs text-gray-700 mt-0.5 font-medium leading-normal">
                              {isCorrect
                                ? `«${currentQuestion.spanish}» նշանակում է ${currentQuestion.value} (${currentQuestion.armenian}):`
                                : `«${currentQuestion.spanish}» = ${currentQuestion.value} (${currentQuestion.armenian}):`}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={handleNextQuestion}
                          className="w-full sm:w-auto px-5 py-3 bg-[#DD0000] hover:bg-black text-white font-extrabold uppercase tracking-widest text-xs border-2 border-black transition-transform active:translate-y-0.5 geo-flat-shadow-sm flex items-center justify-center gap-2"
                        >
                          <span>Շարունակել</span>
                          <ChevronRight size={14} />
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

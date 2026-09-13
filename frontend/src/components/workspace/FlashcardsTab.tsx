import React, { useState, useEffect } from 'react';
import { 
  RotateCw, ArrowLeft, ArrowRight, HelpCircle, Check, 
  Sparkles 
} from 'lucide-react';
import type { Flashcard } from '../../types/revision';

interface FlashcardsTabProps {
  flashcards: Flashcard[];
}

export const FlashcardsTab: React.FC<FlashcardsTabProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
  };

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, flashcards.length]);

  if (!currentCard) {
    return <div className="text-center py-12 text-slate-400">No flashcards available.</div>;
  }

  const isMastered = masteredIds.has(currentCard.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Controls & Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-white">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <span>&bull;</span>
          <span className="text-emerald-400 font-medium">
            {masteredIds.size} Mastered
          </span>
        </div>

        <button
          onClick={() => toggleMastered(currentCard.id)}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            isMastered
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-surface-850 hover:bg-surface-800 text-slate-400 border border-surface-700'
          }`}
        >
          <Check className="h-3 w-3" />
          <span>{isMastered ? 'Mastered' : 'Mark as Mastered'}</span>
        </button>
      </div>

      {/* 3D Flip Card Container */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer perspective-1000 min-h-[280px] sm:min-h-[320px] relative select-none"
      >
        <div 
          className={`relative w-full h-full min-h-[280px] sm:min-h-[320px] rounded-2xl glass-panel p-8 sm:p-10 border transition-all duration-500 transform-style-3d flex flex-col justify-between shadow-2xl ${
            isFlipped 
              ? 'border-violet-500/40 bg-surface-900/90 rotate-y-180' 
              : 'border-surface-700 hover:border-brand-500/40'
          }`}
        >
          
          {!isFlipped ? (
            /* FRONT OF CARD */
            <div className="flex flex-col justify-between h-full space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="uppercase tracking-wider font-semibold text-brand-400 flex items-center space-x-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Active Recall Prompt</span>
                </span>
                <span className="text-[11px] text-slate-400">Click or Space to flip</span>
              </div>

              <div className="flex-1 flex items-center justify-center my-auto">
                <h3 className="text-lg sm:text-xl font-display font-medium text-white text-center leading-relaxed">
                  {currentCard.front}
                </h3>
              </div>

              {/* Hint section if available */}
              <div className="flex items-center justify-between pt-4 border-t border-surface-800">
                {currentCard.hint ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHint(!showHint);
                    }}
                    className="text-xs text-slate-400 hover:text-brand-300 flex items-center space-x-1"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>{showHint ? `Hint: ${currentCard.hint}` : 'Show Hint'}</span>
                  </button>
                ) : <span />}

                <div className="flex items-center space-x-1 text-slate-400 text-xs">
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Reveal Answer</span>
                </div>
              </div>
            </div>
          ) : (
            /* BACK OF CARD */
            <div className="flex flex-col justify-between h-full space-y-6 [transform:rotateY(180deg)]">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="uppercase tracking-wider font-semibold text-violet-400 flex items-center space-x-1.5">
                  <Check className="h-3.5 w-3.5" />
                  <span>Synthesized Solution</span>
                </span>
                <span className="text-[11px] text-slate-400">Click or Space to flip back</span>
              </div>

              <div className="flex-1 flex items-center justify-center my-auto">
                <p className="text-sm sm:text-base text-slate-200 text-center leading-relaxed font-normal">
                  {currentCard.back}
                </p>
              </div>

              <div className="text-center pt-4 border-t border-surface-800 text-xs text-slate-400 flex items-center justify-center space-x-1">
                <RotateCw className="h-3.5 w-3.5" />
                <span>Return to question</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-surface-900 hover:bg-surface-850 border border-surface-800 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </button>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          Use &larr; / &rarr; arrow keys
        </div>

        <button
          onClick={handleNext}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all"
        >
          <span>Next Card</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

    </div>
  );
};

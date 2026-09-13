import React, { useState, useEffect } from 'react';
import { 
  Check, X, ArrowRight, ArrowLeft, CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import type { QuizQuestion } from '../../types/revision';

interface QuizArenaProps {
  quiz: QuizQuestion[];
  onCompleteQuiz: (answers: Record<string, number>) => void;
  onExitQuiz: () => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  quiz,
  onCompleteQuiz,
  onExitQuiz,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentQ = quiz[currentIdx];

  // Reset selection state when question changes
  useEffect(() => {
    const existingAnswer = answers[currentQ.id];
    if (existingAnswer !== undefined) {
      setSelectedOption(existingAnswer);
      setIsAnswerChecked(true);
    } else {
      setSelectedOption(null);
      setIsAnswerChecked(false);
    }
  }, [currentIdx, currentQ.id]);

  const handleSelectOption = (idx: number) => {
    if (!isAnswerChecked) {
      setSelectedOption(idx);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerChecked(true);
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: selectedOption,
    }));
  };

  const handleNext = () => {
    if (currentIdx < quiz.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onCompleteQuiz(answers);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAnswerChecked) {
        if (e.key === '1' || e.key.toLowerCase() === 'a') handleSelectOption(0);
        if (e.key === '2' || e.key.toLowerCase() === 'b') handleSelectOption(1);
        if (e.key === '3' || e.key.toLowerCase() === 'c') handleSelectOption(2);
        if (e.key === '4' || e.key.toLowerCase() === 'd') handleSelectOption(3);
        if (e.key === 'Enter' && selectedOption !== null) {
          e.preventDefault();
          handleCheckAnswer();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswerChecked, selectedOption, currentIdx, answers]);

  const progressPercent = Math.round(((currentIdx + 1) / quiz.length) * 100);
  const optionLetters = ['A', 'B', 'C', 'D'];
  const isCorrect = selectedOption !== null && selectedOption === currentQ.correct_answer_index;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      
      {/* Top Header: Progress & Exit */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">
              Question {currentIdx + 1} of {quiz.length}
            </span>
            <span>&bull;</span>
            <span className="text-brand-300 font-medium">
              {currentQ.topic_title}
            </span>
          </div>

          <button
            onClick={onExitQuiz}
            className="hover:text-slate-200 transition-colors text-xs"
          >
            Exit to Workspace
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-surface-850 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-surface-800 space-y-6 shadow-2xl">
        
        {/* Topic Badge & Difficulty */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-brand-300 bg-brand-500/10 px-2.5 py-1 rounded-md border border-brand-500/20">
            Topic Focus: {currentQ.topic_title}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {currentQ.difficulty}
          </span>
        </div>

        {/* Question Prompt */}
        <h3 className="text-lg sm:text-xl font-display font-medium text-white leading-relaxed">
          {currentQ.question}
        </h3>

        {/* 4 Selectable Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isTargetCorrect = currentQ.correct_answer_index === optIdx;

            let optionClasses = 'border border-surface-700/80 bg-surface-900/80 hover:border-brand-500/60 hover:bg-surface-850 text-slate-100 shadow-sm';

            if (isAnswerChecked) {
              if (isTargetCorrect) {
                optionClasses = 'border-2 border-emerald-500 bg-emerald-500/20 text-emerald-50 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40';
              } else if (isSelected && !isTargetCorrect) {
                optionClasses = 'border-2 border-rose-500 bg-rose-500/20 text-rose-50 shadow-lg shadow-rose-500/20 ring-1 ring-rose-400/40';
              } else {
                optionClasses = 'border border-surface-800/60 bg-surface-950/40 text-slate-400 opacity-50';
              }
            } else if (isSelected) {
              optionClasses = 'border-2 border-brand-500 bg-brand-500/20 text-white shadow-lg shadow-brand-500/20 ring-1 ring-brand-400/40';
            }

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswerChecked}
                className={`w-full text-left p-4 sm:p-4.5 rounded-xl transition-all flex items-start space-x-3.5 cursor-pointer ${optionClasses}`}
              >
                <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors shadow-sm ${
                  isAnswerChecked && isTargetCorrect
                    ? 'bg-emerald-500 text-white'
                    : isAnswerChecked && isSelected && !isTargetCorrect
                      ? 'bg-rose-500 text-white'
                      : isSelected
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                        : 'bg-surface-800 text-slate-200 border border-surface-700'
                }`}>
                  {isAnswerChecked && isTargetCorrect ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : isAnswerChecked && isSelected && !isTargetCorrect ? (
                    <X className="h-4 w-4 stroke-[3]" />
                  ) : (
                    optionLetters[optIdx]
                  )}
                </div>

                <span className="text-sm font-medium leading-relaxed pt-0.5 flex-1 text-slate-100">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback & Grounded Explanation Banner */}
        {isAnswerChecked && (
          <div className={`p-4 rounded-xl border space-y-2 animate-scale-in ${
            isCorrect 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : 'bg-surface-900 border-surface-700/80'
          }`}>
            <div className="flex items-center space-x-2 text-xs font-semibold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-300">Correct Answer</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-rose-400" />
                  <span className="text-rose-300">Incorrect</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
              {currentQ.explanation}
            </p>
          </div>
        )}

      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </button>

        {!isAnswerChecked ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedOption === null}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-brand-500/20 transition-all transform active:scale-95"
          >
            <span>Check Answer</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/20 transition-all transform active:scale-95"
          >
            <span>{currentIdx < quiz.length - 1 ? 'Next Question' : 'Finish & View Diagnostics'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

    </div>
  );
};

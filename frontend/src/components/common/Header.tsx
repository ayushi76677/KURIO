import React from 'react';
import { BookOpen, Printer, RotateCcw } from 'lucide-react';

interface HeaderProps {
  hasPack: boolean;
  onReset: () => void;
  onOpenExport: () => void;
  geminiReady: boolean;
  backendOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  hasPack,
  onReset,
  onOpenExport,
  geminiReady,
  backendOnline
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-800/80 bg-surface-950/80 backdrop-blur-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div 
          onClick={hasPack ? onReset : undefined}
          className={`flex items-center space-x-3 ${hasPack ? 'cursor-pointer' : ''}`}
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div className="flex items-baseline space-x-2.5">
            <span className="font-display font-bold text-xl tracking-tight text-white">
              KURIO
            </span>
            <span className="hidden md:inline text-xs text-slate-400 font-normal">
              Turn lectures into knowledge.
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-medium px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
              PromptWars 2026
            </span>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Backend / AI Status Pill */}
          <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-mono bg-surface-900 border border-surface-800">
            <span 
              className={`h-2 w-2 rounded-full ${
                backendOnline 
                  ? geminiReady 
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' 
                    : 'bg-amber-400' 
                  : 'bg-rose-400'
              }`} 
            />
            <span className="text-slate-400 hidden sm:inline">
              {backendOnline 
                ? geminiReady 
                  ? 'Gemini Active' 
                  : 'Sample / Demo Ready' 
                : 'Connecting...'}
            </span>
          </div>

          {hasPack && (
            <>
              <button
                onClick={onOpenExport}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-surface-850 hover:bg-surface-800 border border-surface-700 transition-colors"
                title="Download or Print Revision Pack"
              >
                <Printer className="h-3.5 w-3.5 text-brand-400" />
                <span className="hidden sm:inline">Download Pack</span>
              </button>

              <button
                onClick={onReset}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-transparent hover:bg-surface-850 transition-colors"
                title="Upload another lecture"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New Lecture</span>
              </button>
            </>
          )}

        </div>

      </div>
    </header>
  );
};

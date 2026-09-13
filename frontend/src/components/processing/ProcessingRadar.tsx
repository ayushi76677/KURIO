import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, BookOpen, Brain, Sparkles, Layers, CheckSquare } from 'lucide-react';

interface ProcessingRadarProps {
  fileName?: string;
}

const STAGES = [
  { id: 1, label: "Reading lecture", icon: Layers, detail: "Extracting slides and preserving structural boundaries" },
  { id: 2, label: "Understanding concepts", icon: BookOpen, detail: "Synthesizing foundational themes and key terminology" },
  { id: 3, label: "Building revision notes", icon: Brain, detail: "Formulating concise summaries and active recall flashcards" },
  { id: 4, label: "Identifying revision priorities", icon: Sparkles, detail: "Ranking core topics and isolating common confusion points" },
  { id: 5, label: "Creating practice quiz", icon: CheckSquare, detail: "Designing conceptual multiple-choice questions with explanations" },
];

export const ProcessingRadar: React.FC<ProcessingRadarProps> = ({ fileName }) => {
  const [activeStage, setActiveStage] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev < 5 ? prev + 1 : prev));
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center animate-fade-in">
      
      {/* Radar Animation Graphic */}
      <div className="relative w-36 h-36 mx-auto mb-8 flex items-center justify-center">
        {/* Concentric rings */}
        <div className="absolute inset-0 rounded-full border border-surface-700/60" />
        <div className="absolute inset-3 rounded-full border border-surface-700/80" />
        <div className="absolute inset-7 rounded-full border border-brand-500/30 bg-brand-950/20" />
        
        {/* Radar beam sweep */}
        <div className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none">
          <div className="w-1/2 h-1/2 bg-gradient-to-tr from-brand-500/40 to-transparent rounded-tl-full origin-bottom-right" />
        </div>

        {/* Center icon */}
        <div className="relative z-10 h-11 w-11 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/30">
          <Brain className="h-5 w-5 animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl font-display font-bold text-white mb-1.5">
        Synthesizing Revision Pack
      </h2>

      <p className="text-xs text-slate-400 max-w-sm mx-auto mb-8 truncate">
        {fileName ? `Processing "${fileName}"` : "KURIO is converting lecture content into active knowledge..."}
      </p>

      {/* Stage-Based Progress Checklist */}
      <div className="space-y-2.5 max-w-md mx-auto text-left glass-card p-4 rounded-xl border border-surface-800 shadow-xl">
        {STAGES.map((stage) => {
          const isDone = stage.id < activeStage;
          const isCurrent = stage.id === activeStage;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`flex items-start space-x-3 p-2.5 rounded-lg transition-all ${
                isCurrent 
                  ? 'bg-brand-500/10 border border-brand-500/30 text-white' 
                  : isDone 
                    ? 'text-slate-300' 
                    : 'text-slate-500 opacity-60'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isDone ? (
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 text-brand-400 animate-spin" />
                ) : (
                  <Icon className="h-4 w-4 text-surface-700" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold">{stage.label}</div>
                <div className="text-[11px] text-slate-400 truncate">{stage.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 mt-6">
        Stage-based extraction grounded directly in your lecture material
      </p>
    </div>
  );
};

import React from 'react';
import { ArrowRightLeft, AlertTriangle, Lightbulb, MapPin } from 'lucide-react';
import type { ConfusionPoint } from '../../types/revision';

interface ConfusionPointsTabProps {
  confusionPoints: ConfusionPoint[];
}

export const ConfusionPointsTab: React.FC<ConfusionPointsTabProps> = ({ confusionPoints }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="pb-2 border-b border-surface-800">
        <h2 className="text-lg font-display font-bold text-white">
          Common Confusion Points
        </h2>
        <p className="text-xs text-slate-400">
          Nuances, contrasting mechanisms, and subtle distinctions from this lecture that are frequently conflated
        </p>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 gap-5">
        {confusionPoints.map((point) => (
          <div 
            key={point.id}
            className="glass-card rounded-2xl p-6 border border-surface-800 hover:border-violet-500/30 transition-all space-y-5"
          >
            {/* Header: Concept A vs Concept B */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-800/80">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-surface-850 border border-surface-700 font-semibold text-xs text-white">
                  {point.concept_a}
                </span>

                <ArrowRightLeft className="h-3.5 w-3.5 text-violet-400 mx-1 flex-shrink-0" />

                <span className="px-3 py-1.5 rounded-lg bg-surface-850 border border-surface-700 font-semibold text-xs text-white">
                  {point.concept_b}
                </span>
              </div>

              {point.source_page && (
                <span className="inline-flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded bg-surface-800 text-slate-400 border border-surface-700">
                  <MapPin className="h-3 w-3 text-violet-400" />
                  <span>Slide {point.source_page}</span>
                </span>
              )}
            </div>

            {/* Context topic */}
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Lecture Topic Context: <span className="text-slate-200">{point.topic_ref}</span>
            </div>

            {/* Key Distinction */}
            <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-violet-300">
                <Lightbulb className="h-3.5 w-3.5" />
                <span>The Definitive Conceptual Difference:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-5">
                {point.key_distinction}
              </p>
            </div>

            {/* Common Misconception Warning */}
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-300">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Common Student Misconception:</span>
              </div>
              <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed pl-5">
                {point.common_misconception}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

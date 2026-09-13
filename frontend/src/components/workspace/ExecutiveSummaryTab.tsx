import React from 'react';
import { BookOpen, CheckCircle2, ListChecks, Key, MapPin } from 'lucide-react';
import type { ExecutiveSummary, KeyConcept } from '../../types/revision';

interface ExecutiveSummaryTabProps {
  summary: ExecutiveSummary;
  keyConcepts: KeyConcept[];
}

export const ExecutiveSummaryTab: React.FC<ExecutiveSummaryTabProps> = ({ 
  summary, 
  keyConcepts 
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Overview Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-surface-800 space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center">
            <BookOpen className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-display font-bold text-white">
            Concise Overview & Lecture Thesis
          </h2>
        </div>
        
        <p className="text-sm text-slate-300 leading-relaxed sm:text-base font-normal max-w-4xl">
          {summary.overview}
        </p>
      </div>

      {/* Key Concepts Grid */}
      {keyConcepts && keyConcepts.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center space-x-2">
            <Key className="h-4 w-4 text-brand-400" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Core Vocabulary & Key Concepts
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {keyConcepts.map((concept) => (
              <div 
                key={concept.id}
                className="glass-card rounded-xl p-4 border border-surface-800 hover:border-brand-500/30 transition-all flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-white">
                      {concept.name}
                    </span>
                    {concept.source_page && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-900 text-slate-400 border border-surface-750 flex items-center space-x-1">
                        <MapPin className="h-2.5 w-2.5 text-brand-400" />
                        <span>Slide {concept.source_page}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {concept.definition}
                  </p>
                </div>

                <div className="pt-2 border-t border-surface-800/60 text-[11px] text-brand-300/90 italic">
                  {concept.importance_summary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Takeaways and Prerequisites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Key Takeaways */}
        <div className="glass-card rounded-2xl p-6 border border-surface-800 flex flex-col">
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Core Takeaways
            </h3>
          </div>

          <ul className="space-y-3 flex-1">
            {summary.key_takeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Foundational Prerequisites */}
        <div className="glass-card rounded-2xl p-6 border border-surface-800 flex flex-col">
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="h-7 w-7 rounded-lg bg-violet-500/15 text-violet-400 flex items-center justify-center">
              <ListChecks className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Foundational Prerequisites
            </h3>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Concepts assumed by the instructor to be understood prior to this lecture:
          </p>

          <ul className="space-y-3 flex-1">
            {summary.foundational_prerequisites.map((prereq, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                <span className="leading-relaxed">{prereq}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};

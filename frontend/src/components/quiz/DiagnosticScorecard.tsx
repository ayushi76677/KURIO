import React, { useEffect } from 'react';
import { 
  Award, RotateCcw, CheckCircle2, AlertTriangle, 
  BookOpen, Printer, ArrowRight, Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { QuizDiagnosticResult } from '../../types/revision';

interface DiagnosticScorecardProps {
  diagnostic: QuizDiagnosticResult;
  onRetake: () => void;
  onReturnToWorkspace: () => void;
  onOpenExport: () => void;
}

export const DiagnosticScorecard: React.FC<DiagnosticScorecardProps> = ({
  diagnostic,
  onRetake,
  onReturnToWorkspace,
  onOpenExport,
}) => {
  useEffect(() => {
    if (diagnostic.percentage >= 70) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#818cf8'],
      });
    }
  }, [diagnostic.percentage]);

  const getStatusBadge = (status: "MASTERED" | "NEEDS_REVIEW" | "CRITICAL_GAP") => {
    switch (status) {
      case 'MASTERED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" />
            <span>Mastered</span>
          </span>
        );
      case 'NEEDS_REVIEW':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="h-3 w-3" />
            <span>Needs Review</span>
          </span>
        );
      case 'CRITICAL_GAP':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="h-3 w-3" />
            <span>Critical Gap</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Hero Revision Check Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-surface-800 text-center space-y-4 shadow-2xl relative overflow-hidden">
        
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-lg shadow-brand-500/30 mb-1">
          <Award className="h-7 w-7" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono text-brand-300 uppercase tracking-wider font-semibold">
            Revision Check
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Diagnostic Performance Analysis
          </h2>
        </div>

        {/* Score & Accuracy Numbers */}
        <div className="flex items-center justify-center space-x-6 py-2">
          <div>
            <div className="text-4xl font-display font-extrabold text-white">
              {diagnostic.score} <span className="text-2xl text-slate-400 font-normal">/ {diagnostic.total_questions}</span>
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Score</div>
          </div>

          <div className="h-10 w-px bg-surface-800" />

          <div>
            <div className="text-4xl font-display font-extrabold text-brand-400">
              {diagnostic.percentage}%
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Accuracy</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-surface-800">
          <button
            onClick={onReturnToWorkspace}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all flex items-center space-x-1.5 shadow-md shadow-brand-500/20"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Return to Workspace</span>
          </button>

          <button
            onClick={onRetake}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-surface-850 hover:bg-surface-800 border border-surface-700 transition-all flex items-center space-x-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retake Quiz</span>
          </button>

          <button
            onClick={onOpenExport}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-surface-850 hover:bg-surface-800 border border-surface-700 transition-all flex items-center space-x-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Download Pack</span>
          </button>
        </div>

      </div>

      {/* Strong Areas vs Needs Review Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* STRONG AREAS */}
        <div className="glass-card rounded-2xl p-5 border border-surface-800 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4" />
            <span>Strong Areas</span>
          </div>

          {diagnostic.strong_areas.length > 0 ? (
            <div className="space-y-2">
              {diagnostic.strong_areas.map((area, idx) => (
                <div 
                  key={idx}
                  className="flex items-center space-x-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 font-medium"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No topics attained 80%+ accuracy yet. Review the topics below to build mastery.
            </p>
          )}
        </div>

        {/* NEEDS REVIEW */}
        <div className="glass-card rounded-2xl p-5 border border-surface-800 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4" />
            <span>Needs Review</span>
          </div>

          {diagnostic.needs_review.length > 0 ? (
            <div className="space-y-2">
              {diagnostic.needs_review.map((area, idx) => (
                <div 
                  key={idx}
                  className="flex items-center space-x-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 font-medium"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-300 font-medium">
              Excellent! No conceptual gaps detected across the tested topics.
            </p>
          )}
        </div>

      </div>

      {/* "What Should I Revise Next?" Action Card */}
      {diagnostic.what_to_revise_next && diagnostic.what_to_revise_next.length > 0 && (
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-brand-500/30 bg-brand-950/20 space-y-3">
          <div className="flex items-center space-x-2 text-brand-300 font-semibold text-sm">
            <ArrowRight className="h-4 w-4 text-brand-400" />
            <span>What should I revise next?</span>
          </div>

          <div className="space-y-2">
            {diagnostic.what_to_revise_next.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-200 bg-surface-900/80 p-3 rounded-xl border border-surface-800"
              >
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-brand-500/20 text-brand-300 font-bold text-xs flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic-by-Topic Knowledge Diagnostics Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-surface-800">
          <h3 className="text-base font-display font-bold text-white">
            Detailed Topic Diagnostics
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {diagnostic.topics_breakdown.length} Topics
          </span>
        </div>

        <div className="space-y-3">
          {diagnostic.topics_breakdown.map((topic) => (
            <div 
              key={topic.topic_id}
              className="glass-card rounded-xl p-5 border border-surface-800 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-white">
                    {topic.topic_title}
                  </h4>
                  <div className="text-xs text-slate-400">
                    Accuracy: {topic.correct_questions} of {topic.total_questions} questions ({topic.mastery_percentage}%)
                  </div>
                </div>

                <div>
                  {getStatusBadge(topic.status)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-surface-900 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    topic.mastery_percentage >= 80 
                      ? 'bg-emerald-400' 
                      : topic.mastery_percentage >= 50 
                        ? 'bg-amber-400' 
                        : 'bg-rose-400'
                  }`}
                  style={{ width: `${topic.mastery_percentage}%` }}
                />
              </div>

              {/* Actionable Revision Recommendation */}
              <div className="p-2.5 rounded-lg bg-surface-900/90 border border-surface-800/80 text-xs text-slate-300">
                <span className="font-semibold text-slate-200">Revision Action: </span>
                {topic.recommendation}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

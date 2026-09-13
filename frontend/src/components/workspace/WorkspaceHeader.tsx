import React from 'react';
import { Clock, Layers, BookOpen, CheckCircle2, Play, Printer } from 'lucide-react';
import type { LectureMetadata } from '../../types/revision';

interface WorkspaceHeaderProps {
  metadata: LectureMetadata;
  totalTopics: number;
  totalQuestions: number;
  onStartQuiz: () => void;
  onOpenExport: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  metadata,
  totalTopics,
  totalQuestions,
  onStartQuiz,
  onOpenExport,
}) => {
  return (
    <div className="border-b border-surface-800 bg-surface-900/50 backdrop-blur pb-6 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Title & Metadata */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/25">
              {metadata.subject}
            </span>

            {metadata.has_reliable_page_numbers ? (
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center space-x-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>Verified Slide Mapping</span>
              </span>
            ) : (
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-300 border border-slate-500/20">
                Grounded Conceptual Mapping
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            {metadata.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>~{metadata.estimated_study_time_mins} min active revision</span>
            </div>
            <span>&bull;</span>
            <div className="flex items-center space-x-1.5">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <span>{metadata.total_pages_detected} Slides / Pages</span>
            </div>
            <span>&bull;</span>
            <div className="flex items-center space-x-1.5">
              <BookOpen className="h-3.5 w-3.5 text-slate-400" />
              <span>{totalTopics} High-Priority Topics</span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <button
            onClick={onOpenExport}
            className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-surface-850 hover:bg-surface-800 border border-surface-700 transition-all"
            title="Download Revision Pack"
          >
            <Printer className="h-3.5 w-3.5 text-brand-400" />
            <span>Download Pack</span>
          </button>

          <button
            onClick={onStartQuiz}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-500/20 transition-all transform active:scale-95"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Launch Practice Quiz ({totalQuestions} Qs)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

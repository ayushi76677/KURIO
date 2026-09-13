import React, { useState } from 'react';
import { Terminal, MapPin } from 'lucide-react';
import type { RevisionTopic, TopicPriority } from '../../types/revision';

interface HighPriorityTopicsTabProps {
  topics: RevisionTopic[];
}

export const HighPriorityTopicsTab: React.FC<HighPriorityTopicsTabProps> = ({ topics }) => {
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TopicPriority>('ALL');

  const filteredTopics = priorityFilter === 'ALL' 
    ? topics 
    : topics.filter((t) => t.priority === priorityFilter);

  const getPriorityBadge = (priority: TopicPriority) => {
    switch (priority) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span>HIGH-PRIORITY REVISION TOPIC</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span>CORE SUPPORTING TOPIC</span>
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-700/40 text-slate-300 border border-slate-600/30">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span>SUPPLEMENTARY DETAIL</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-800">
        <div>
          <h2 className="text-lg font-display font-bold text-white">
            High-Priority Revision Topics
          </h2>
          <p className="text-xs text-slate-400">
            Concepts prioritized strictly by foundational weight and structural centrality in this lecture
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-surface-900 border border-surface-800">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setPriorityFilter(filter)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                priorityFilter === filter
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter === 'ALL' ? `All (${topics.length})` : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Cards List */}
      <div className="space-y-4">
        {filteredTopics.map((topic, index) => (
          <div 
            key={topic.id}
            className="glass-card rounded-2xl p-5 sm:p-6 border border-surface-800 hover:border-brand-500/30 transition-all space-y-4"
          >
            {/* Card Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    #{index + 1}
                  </span>
                  {getPriorityBadge(topic.priority)}

                  {/* Reliable location reference */}
                  {topic.source_page ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded bg-surface-800 text-slate-300 border border-surface-700">
                      <MapPin className="h-3 w-3 text-brand-400" />
                      <span>Slide / Page {topic.source_page}</span>
                    </span>
                  ) : topic.source_section ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded bg-surface-800 text-slate-300 border border-surface-700">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>Section: {topic.source_section}</span>
                    </span>
                  ) : null}
                </div>

                <h3 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
                  {topic.title}
                </h3>
              </div>
            </div>

            {/* Why High Priority Banner */}
            <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-200">
              <span className="font-semibold text-brand-300">Why High Priority: </span>
              {topic.why_important}
            </div>

            {/* Core Explanation */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
              {topic.core_summary}
            </div>

            {/* Formulas / Procedural Rules (if any) */}
            {topic.key_formulas_or_rules && topic.key_formulas_or_rules.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-surface-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <Terminal className="h-3 w-3 text-brand-400" />
                  <span>Key Formulations & Rules</span>
                </span>
                <div className="space-y-1.5">
                  {topic.key_formulas_or_rules.map((rule, rIdx) => (
                    <div 
                      key={rIdx}
                      className="p-2.5 rounded-lg bg-surface-900 border border-surface-800 font-mono text-xs text-brand-300"
                    >
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};

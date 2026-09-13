import React, { useRef, useState } from 'react';
import { 
  UploadCloud, FileText, ArrowRight, Sparkles, CheckCircle2, 
  AlertCircle, ShieldCheck, Zap, BookOpen, ChevronRight 
} from 'lucide-react';
import type { SampleLectureSummary } from '../../types/revision';

interface UploadHeroProps {
  onFileSelect: (file: File) => void;
  onSelectSample: (sampleId: string) => void;
  sampleLectures: SampleLectureSummary[];
  isProcessing: boolean;
  errorMessage?: string | null;
}

export const UploadHero: React.FC<UploadHeroProps> = ({
  onFileSelect,
  onSelectSample,
  sampleLectures,
  isProcessing,
  errorMessage,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sampleSectionRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF lecture document.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert('File size exceeds 50MB limit.');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const scrollToSamples = () => {
    sampleSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      
      {/* Hero Hierarchy */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI-Powered Student Workspace</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-display font-extrabold tracking-tight text-white leading-tight">
          KURIO
        </h1>

        <p className="text-xl sm:text-2xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-indigo-200 to-slate-200">
          Turn lectures into knowledge.
        </p>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Upload a lecture and turn it into concise revision material, key concepts and practice questions grounded in the same lecture.
        </p>

        {/* Quick Action Navigation */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all"
          >
            Upload Lecture
          </button>
          <button
            onClick={scrollToSamples}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-surface-900 hover:bg-surface-850 border border-surface-800 transition-all"
          >
            Try a Sample
          </button>
        </div>
      </div>

      {/* Central Upload Card */}
      <div className="relative">
        
        {/* Subtle glow accent */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-600/15 via-indigo-600/15 to-violet-600/15 blur-xl opacity-75 pointer-events-none" />

        <div className="relative glass-panel rounded-2xl p-6 sm:p-10 border border-surface-700/70 shadow-2xl">
          
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleInputChange}
          />

          {!selectedFile ? (
            /* Dropzone State */
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                dragActive 
                  ? 'border-brand-400 bg-brand-500/10 scale-[1.01]' 
                  : 'border-surface-700 hover:border-brand-500/50 hover:bg-surface-900/60'
              }`}
            >
              <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-surface-850 flex items-center justify-center border border-surface-700 text-brand-400 shadow-inner">
                <UploadCloud className="h-8 w-8" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-1">
                Drop your lecture PDF here, or <span className="text-brand-400 underline decoration-brand-400/40 underline-offset-4">browse</span>
              </h3>
              
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Accepts university slides, handouts, and typed notes up to 50MB
              </p>

              <div className="inline-flex items-center space-x-2 text-[11px] text-slate-400 font-medium px-2.5 py-1 rounded-md bg-surface-900 border border-surface-800">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Strictly grounded in lecture content &bull; No unsupported exam predictions</span>
              </div>
            </div>
          ) : (
            /* Selected File Preview State */
            <div className="space-y-6">
              <div className="flex items-start justify-between p-4 rounded-xl bg-surface-850 border border-surface-700">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 flex-shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {selectedFile.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; PDF Document Ready for Ingestion
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors p-1"
                >
                  Remove / Change
                </button>
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isProcessing}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-500/25 transition-all transform active:scale-[0.99] disabled:opacity-50"
              >
                <Zap className="h-4 w-4" />
                <span>Generate Revision Pack</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2.5 text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

        </div>

      </div>

      {/* One-Click Sample Lectures Section */}
      <div ref={sampleSectionRef} className="mt-12 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-400">
              Try a Sample Lecture
            </h3>
            <p className="text-[11px] text-slate-400">
              One-click instant demonstration with zero external API dependencies
            </p>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Instant Demo Ready</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {sampleLectures.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample.id)}
              disabled={isProcessing}
              className="flex items-start text-left p-4 rounded-xl glass-card hover:bg-surface-800/80 transition-all border border-surface-700/80 group"
            >
              <div className="h-10 w-10 rounded-lg bg-surface-800 group-hover:bg-brand-500/20 group-hover:text-brand-400 flex items-center justify-center text-slate-400 mr-3 flex-shrink-0 transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-white group-hover:text-brand-300 transition-colors truncate">
                    {sample.title}
                  </h4>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-300 transition-colors flex-shrink-0 ml-1" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {sample.subject} &bull; {sample.total_pages} Slides &bull; {sample.total_topics} Topics &bull; {sample.total_questions} Qs
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

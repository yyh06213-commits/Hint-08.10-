import React, { useState } from 'react';
import { JOB_RECOMMENDATION_EXEMPLARS } from '../data/anchors';
import { CheckCircle2, Briefcase, Zap, Info, Loader2, Sparkles } from 'lucide-react';

interface JobInputViewProps {
  onSubmitJob: (jobRole: string) => void;
  isLoading: boolean;
}

export const JobInputView: React.FC<JobInputViewProps> = ({ onSubmitJob, isLoading }) => {
  const [jobRole, setJobRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobRole.trim()) return;
    onSubmitJob(jobRole.trim());
  };

  const handleSelectChip = (title: string) => {
    setJobRole(title);
  };

  return (
    <div className="w-full max-w-[768px] mx-auto px-container-margin py-stack-md flex-1 flex flex-col items-center justify-center relative animate-fade-in">
      {/* Background Decorative Blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center opacity-30">
        <div className="w-[500px] h-[500px] bg-growth-mint/20 rounded-full blur-[90px]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 sm:p-8">
        {/* Completion Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-growth-mint/15 flex items-center justify-center text-growth-mint mb-1 animate-bounce-short">
            <CheckCircle2 className="w-9 h-9 text-growth-mint stroke-[2.5]" />
          </div>

          <div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile text-primary font-bold tracking-tight">
              진단이 완료되었습니다!
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
              희망하시는 직무를 입력하시면<br />맞춤형 AI 리포트를 생성해 드립니다.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <div className="space-y-2 w-full">
            <label htmlFor="job-role" className="block font-label-md text-label-md text-primary font-bold ml-1">
              희망 직무
            </label>
            <div className="relative w-full group">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-growth-mint transition-colors w-5 h-5" />
              <input
                id="job-role"
                type="text"
                required
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="예: 서비스 기획자, 데이터 분석가"
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md text-primary placeholder:text-on-surface-variant/60 focus:outline-none focus:border-growth-mint focus:ring-2 focus:ring-growth-mint/20 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!jobRole.trim() || isLoading}
            className="w-full py-4 px-6 bg-growth-mint hover:bg-growth-mint/90 text-primary font-headline-md font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>진단 결과 및 AI 맞춤 해설 보기</span>
            <Zap className="w-5 h-5 fill-primary" />
          </button>
        </form>

        {/* Quick Recommendation Chips */}
        <div className="mt-6 space-y-2">
          <p className="font-label-sm text-label-sm text-on-surface-variant ml-1 font-semibold">
            추천 직무 예시
          </p>
          <div className="flex flex-wrap gap-1.5">
            {JOB_RECOMMENDATION_EXEMPLARS.map((job) => (
              <button
                key={job}
                type="button"
                onClick={() => handleSelectChip(job)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                  jobRole === job
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-growth-mint hover:bg-growth-mint/10'
                }`}
              >
                {job}
              </button>
            ))}
          </div>
        </div>

        {/* Contextual Info */}
        <div className="mt-6 flex items-start gap-2.5 bg-surface-container-low p-4 rounded-xl border border-outline-variant/60">
          <Info className="w-4 h-4 text-info-blue shrink-0 mt-0.5" />
          <p className="font-label-sm text-xs text-on-surface-variant leading-relaxed">
            입력하신 직무와 40문항 진단 데이터를 교차 분석하여 맞춤형 커리어 시너지 및 자소서/면접 핵심 어필 가이드를 제공합니다.
          </p>
        </div>
      </div>

      {/* Full-screen Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-surface/90 backdrop-blur-md flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="flex flex-col items-center space-y-6 text-center max-w-sm px-4">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-growth-mint/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-growth-mint rounded-full border-t-transparent animate-spin" />
              <Sparkles className="w-8 h-8 text-growth-mint animate-pulse" />
            </div>

            <div>
              <h3 className="font-headline-md text-headline-md text-primary font-bold mb-2">
                AI가 맞춤 리포트를 생성 중입니다...
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant animate-pulse">
                8가지 커리어 앵커와 {jobRole} 직무 간의 시너지를 정밀하게 분석하고 있어요
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

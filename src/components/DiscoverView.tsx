import React, { useState } from 'react';
import { ANCHOR_DEFINITIONS } from '../data/anchors';
import { AnchorCode, AnchorInfo } from '../types';
import { ArrowRight, BrainCircuit, Radar, Sparkles, CheckCircle2, ChevronRight, X, Clock, HelpCircle } from 'lucide-react';

interface DiscoverViewProps {
  onStartAssessment: (isQuickMode?: boolean) => void;
  savedCount: number;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({ onStartAssessment, savedCount }) => {
  const [selectedAnchor, setSelectedAnchor] = useState<AnchorInfo | null>(null);

  const anchorList = Object.values(ANCHOR_DEFINITIONS);

  return (
    <div className="w-full flex flex-col items-center animate-fade-in pb-12">
      {/* Hero Logo & Heading */}
      <div className="text-center mt-4 mb-8 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-growth-mint/10 border border-growth-mint/30 text-secondary text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-growth-mint" />
          <span>에드가 샤인(Edgar Schein)의 8가지 커리어 앵커 진단</span>
        </div>

        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4 tracking-tight">
          나만의 커리어 앵커를 찾으세요
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          과학적인 8가지 앵커 진단을 통해 당신의 핵심 직무 동기를 발견하세요.
          커리어에 대한 막막함을 데이터와 AI 코칭으로 해결해 드립니다.
        </p>
      </div>

      {/* Primary CTA Buttons */}
      <div className="w-full max-w-md flex flex-col items-center gap-3 mb-12">
        <button
          onClick={() => onStartAssessment(false)}
          className="w-full bg-growth-mint text-primary font-headline-md text-headline-md py-4 px-8 rounded-xl shadow-[0_4px_20px_rgba(45,212,191,0.25)] hover:bg-growth-mint/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 font-bold group"
        >
          <span>정밀 진단 시작하기</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="flex items-center justify-between w-full text-xs text-on-surface-variant px-2">
          <span className="flex items-center gap-1 opacity-80">
            <Clock className="w-3.5 h-3.5 text-growth-mint" />
            약 10분 소요 · 총 40개 정밀 문항
          </span>

          <button
            onClick={() => onStartAssessment(true)}
            className="text-secondary hover:underline font-semibold flex items-center gap-1"
          >
            <span>빠른 16문항 모드</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Value Proposition Bento Grid */}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col items-start gap-4 hover:border-growth-mint/40 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-growth-mint/15 flex items-center justify-center text-growth-mint">
            <BrainCircuit className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-primary mb-1.5">
              심층 인사이트
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-normal">
              에드가 샤인의 모델을 바탕으로 당신의 커리어 선택과 만족도를 결정짓는 8가지 잠재 동기를 정확히 도출합니다.
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col items-start gap-4 hover:border-info-blue/40 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-info-blue/15 flex items-center justify-center text-info-blue">
            <Radar className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-primary mb-1.5">
              명확한 데이터 & AI
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-normal">
              직관적인 레이더 차트와 Gemini AI의 맞춤형 심층 가이드(직무 시너지, 스트레스 원인, 자소서 팁)를 한눈에 시각화합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 8 Career Anchors Explorer */}
      <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary font-bold">
              8가지 커리어 앵커 미리보기
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              각 앵커 카드를 클릭하여 핵심 동기와 특징을 탐색해 보세요.
            </p>
          </div>
          <HelpCircle className="w-5 h-5 text-on-surface-variant/60" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {anchorList.map((item) => (
            <button
              key={item.code}
              onClick={() => setSelectedAnchor(item)}
              className="p-3.5 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container-low hover:border-growth-mint transition-all flex flex-col items-center text-center group"
            >
              <span className="text-xs font-bold text-growth-mint mb-1">
                {item.code}
              </span>
              <span className="font-headline-md text-sm font-bold text-primary group-hover:text-secondary">
                {item.shortName}
              </span>
              <span className="text-[11px] text-on-surface-variant/80 mt-1 line-clamp-1">
                {item.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal for Anchor Info */}
      {selectedAnchor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 max-w-md w-full shadow-xl animate-scale-up relative">
            <button
              onClick={() => setSelectedAnchor(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-container-low text-on-surface-variant"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-growth-mint/20 text-secondary font-bold text-xs rounded-full">
                {selectedAnchor.code}
              </span>
              <h3 className="font-headline-md text-headline-md text-primary font-bold">
                {selectedAnchor.name}
              </h3>
            </div>

            <p className="text-xs text-on-surface-variant italic mb-3">
              {selectedAnchor.englishName}
            </p>

            <p className="text-sm text-on-surface-variant leading-relaxed mb-6 bg-surface-container-low p-4 rounded-xl">
              {selectedAnchor.description}
            </p>

            <button
              onClick={() => {
                setSelectedAnchor(null);
                onStartAssessment(false);
              }}
              className="w-full bg-growth-mint text-primary font-bold py-3 rounded-xl hover:bg-growth-mint/90 transition-colors flex items-center justify-center gap-2"
            >
              <span>이 앵커 진단하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { AssessmentAnswers, LikertValue, Question } from '../types';
import { LIKERT_OPTIONS } from '../data/anchors';
import { ArrowLeft, ArrowRight, Quote, X, Check } from 'lucide-react';

interface DiagnosticViewProps {
  questions: Question[];
  answers: AssessmentAnswers;
  onAnswer: (questionId: number, value: LikertValue) => void;
  onComplete: () => void;
  onCancel: () => void;
}

export const DiagnosticView: React.FC<DiagnosticViewProps> = ({
  questions,
  answers,
  onAnswer,
  onComplete,
  onCancel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentAnswer = answers[currentQuestion.id];

  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Handle option selection
  const handleSelectOption = (value: LikertValue) => {
    onAnswer(currentQuestion.id, value);

    // Auto advance after slight delay for smooth feel
    if (!isLastQuestion) {
      setTimeout(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
      }, 180);
    }
  };

  // Keyboard navigation for Likert (1, 2, 3, 4 keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        handleSelectOption(parseInt(e.key, 10) as LikertValue);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < totalQuestions - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalQuestions, currentQuestion]);

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="w-full max-w-[768px] mx-auto px-container-margin py-stack-md flex-1 flex flex-col justify-between animate-fade-in min-h-[calc(100vh-120px)]">
      {/* Top Header Bar inside Diagnostic */}
      <div className="mb-stack-md">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
              직무 성향 진단
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-growth-mint/15 text-secondary font-bold">
              {answeredCount}/{totalQuestions} 답변 완료
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
              {currentIndex + 1} / {totalQuestions}
            </span>
            <button
              onClick={onCancel}
              className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors"
              title="진단 취소"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-growth-mint transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Diagnostic Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-10 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex-1 flex flex-col justify-center items-center text-center my-2 transition-all">
        <div className="mb-6 w-full max-w-xl">
          <Quote className="w-10 h-10 text-growth-mint mx-auto mb-4 opacity-80 stroke-[1.5]" />
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary leading-relaxed font-bold tracking-tight min-h-[90px] flex items-center justify-center">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Likert Scale Container */}
        <div className="w-full max-w-xl mt-4">
          <div className="flex justify-between items-end mb-3 px-1 text-xs text-on-surface-variant font-medium opacity-80">
            <span>전혀 아니다</span>
            <span>아니다</span>
            <span>그렇다</span>
            <span>항상 그렇다</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {LIKERT_OPTIONS.map((opt) => {
              const isSelected = currentAnswer === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelectOption(opt.value)}
                  className={`h-16 rounded-xl flex flex-col items-center justify-center font-bold text-base transition-all border ${
                    isSelected
                      ? 'bg-anchor-deep-indigo text-white border-anchor-deep-indigo shadow-md scale-[1.02]'
                      : 'border-[#CBD5E1] bg-surface-container-lowest text-on-surface-variant hover:border-growth-mint hover:bg-growth-mint/5'
                  }`}
                >
                  <span className="text-lg font-extrabold">{opt.number}</span>
                  <span className="text-[11px] font-medium opacity-90 hidden sm:inline">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-on-surface-variant/70 mt-3 text-center">
            💡 키보드 숫자키 (1, 2, 3, 4)로 빠르게 선택하실 수 있습니다.
          </p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-6 flex justify-between items-center pb-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-5 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!currentAnswer}
          className={`px-8 py-3 rounded-xl font-label-md text-label-md font-bold transition-all flex items-center gap-2 shadow-sm ${
            isLastQuestion
              ? 'bg-anchor-deep-indigo text-white hover:bg-anchor-deep-indigo/90'
              : 'bg-growth-mint text-primary hover:bg-growth-mint/90'
          } disabled:opacity-40`}
        >
          <span>{isLastQuestion ? '진단 완료하기' : '다음'}</span>
          {isLastQuestion ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

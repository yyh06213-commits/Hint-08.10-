import React from 'react';
import { TabType } from '../types';
import { Compass, HelpCircle, LineChart, History } from 'lucide-react';

interface BottomNavProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  hasCompletedAssessment: boolean;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  hasCompletedAssessment,
  savedCount,
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 flex justify-around items-center px-4 py-2 max-w-[768px] mx-auto left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-outline-variant md:hidden">
      {/* 탐색 Tab */}
      <button
        onClick={() => onNavigate('discover')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentTab === 'discover'
            ? 'text-growth-mint font-bold bg-primary-container scale-95'
            : 'text-on-surface-variant hover:bg-surface-container-low'
        }`}
      >
        <Compass className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-medium">탐색</span>
      </button>

      {/* 진단 Tab */}
      <button
        onClick={() => onNavigate('assessment')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentTab === 'assessment' || currentTab === 'job_input'
            ? 'text-growth-mint font-bold bg-primary-container scale-95'
            : 'text-on-surface-variant hover:bg-surface-container-low'
        }`}
      >
        <HelpCircle className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-medium">진단</span>
      </button>

      {/* 결과 Tab */}
      <button
        onClick={() => {
          if (hasCompletedAssessment) {
            onNavigate('report');
          } else {
            onNavigate('assessment');
          }
        }}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentTab === 'report'
            ? 'text-growth-mint font-bold bg-primary-container scale-95'
            : 'text-on-surface-variant hover:bg-surface-container-low'
        }`}
      >
        <LineChart className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-medium">결과</span>
      </button>

      {/* 이력 Tab */}
      <button
        onClick={() => onNavigate('history')}
        className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentTab === 'history'
            ? 'text-growth-mint font-bold bg-primary-container scale-95'
            : 'text-on-surface-variant hover:bg-surface-container-low'
        }`}
      >
        <History className="w-5 h-5 mb-0.5" />
        <span className="text-[11px] font-medium">이력</span>
        {savedCount > 0 && (
          <span className="absolute top-1 right-2 w-2 h-2 bg-growth-mint rounded-full" />
        )}
      </button>
    </nav>
  );
};

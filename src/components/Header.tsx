import React from 'react';
import { TabType } from '../types';
import { Anchor, RotateCcw, History, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  onReset: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onReset,
  savedCount,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-container-margin h-16 max-w-[768px] mx-auto left-0 right-0 bg-surface/90 backdrop-blur-md border-b border-outline-variant text-primary">
      {/* Brand Logo */}
      <button
        onClick={() => onNavigate('discover')}
        className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity focus:outline-none group"
      >
        <div className="w-9 h-9 rounded-lg bg-growth-mint/10 flex items-center justify-center text-growth-mint group-hover:scale-105 transition-transform">
          <Anchor className="w-5 h-5 text-growth-mint stroke-[2.5]" />
        </div>
        <div>
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
            AnchorMe
          </span>
          <span className="hidden sm:inline-block ml-2 text-xs font-medium text-on-surface-variant/70">
            Career Coaching
          </span>
        </div>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* History Drawer Trigger */}
        <button
          onClick={() => onNavigate('history')}
          className={`relative p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
            currentTab === 'history'
              ? 'bg-primary text-white'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
          title="진단 이력"
        >
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">이력</span>
          {savedCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 bg-growth-mint text-primary font-bold text-[10px] rounded-full">
              {savedCount}
            </span>
          )}
        </button>

        {/* Reset / New Test */}
        <button
          onClick={onReset}
          className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-error-rose transition-colors flex items-center gap-1 text-xs font-medium"
          title="진단 초기화 / 새로 시작"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">새로 시작</span>
        </button>
      </div>
    </header>
  );
};

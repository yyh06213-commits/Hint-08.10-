import React from 'react';
import { SavedResult } from '../types';
import { History, Calendar, Briefcase, Trash2, ChevronRight, X, Sparkles } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedResults: SavedResult[];
  onSelectResult: (result: SavedResult) => void;
  onDeleteResult: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedResults,
  onSelectResult,
  onDeleteResult,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="bg-surface-container-lowest w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-outline-variant animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold">
            <History className="w-5 h-5 text-growth-mint" />
            <h3 className="font-headline-md text-headline-md">진단 이력 ({savedResults.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container-low text-on-surface-variant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedResults.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
              <History className="w-12 h-12 text-outline-variant mb-3 opacity-60" />
              <p className="font-headline-md text-sm font-bold text-primary mb-1">
                저장된 진단 이력이 없습니다.
              </p>
              <p className="text-xs">
                진단을 완료하시면 이곳에서 언제든지 지난 리포트를 다시 확인하실 수 있습니다.
              </p>
            </div>
          ) : (
            savedResults.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-outline-variant bg-surface hover:border-growth-mint transition-all flex flex-col gap-2 group cursor-pointer"
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
              >
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.createdAt}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteResult(item.id);
                    }}
                    className="p-1 hover:text-error-rose transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-growth-mint shrink-0" />
                  <span className="font-bold text-primary text-sm line-clamp-1">
                    {item.targetJob}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-1">
                  {item.topAnchors?.slice(0, 3).map((a) => (
                    <span
                      key={a.code}
                      className="px-2.5 py-0.5 bg-growth-mint/15 text-secondary text-[11px] font-bold rounded-full"
                    >
                      {a.tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-end text-xs font-semibold text-growth-mint mt-1 group-hover:translate-x-1 transition-transform">
                  <span>리포트 보기</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedResults.length > 0 && (
          <div className="p-4 border-t border-outline-variant bg-surface">
            <button
              onClick={onClearAll}
              className="w-full py-2.5 text-xs text-error-rose hover:bg-error-rose/10 rounded-xl transition-colors font-semibold"
            >
              전체 이력 삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

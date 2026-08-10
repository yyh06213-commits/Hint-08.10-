import React, { useState, useEffect } from 'react';
import { TabType, AssessmentAnswers, LikertValue, Question, AIReport, SavedResult, AnchorScore } from './types';
import { DIAGNOSTIC_QUESTIONS, getAnchorScoresList, getAnchorScoresListFromRecord } from './data/anchors';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DiscoverView } from './components/DiscoverView';
import { DiagnosticView } from './components/DiagnosticView';
import { JobInputView } from './components/JobInputView';
import { ReportView } from './components/ReportView';
import { HistoryDrawer } from './components/HistoryDrawer';

const LOCAL_STORAGE_KEY = 'anchorme_saved_results_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('discover');
  const [questions, setQuestions] = useState<Question[]>(DIAGNOSTIC_QUESTIONS);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [targetJob, setTargetJob] = useState<string>('');
  const [report, setReport] = useState<AIReport | null>(null);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(true);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [selectedHistoryResult, setSelectedHistoryResult] = useState<SavedResult | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Load saved results from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedResults(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load saved results from localStorage:', e);
    }
  }, []);

  // Save results to localStorage helper
  const persistResults = (newList: SavedResult[]) => {
    setSavedResults(newList);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  // Start Assessment Flow
  const handleStartAssessment = (isQuickMode = false) => {
    setSelectedHistoryResult(null);
    if (isQuickMode) {
      // Pick 2 questions per anchor (16 total)
      const condensed: Question[] = [];
      const counts: Record<string, number> = {};
      DIAGNOSTIC_QUESTIONS.forEach((q) => {
        counts[q.anchorCode] = (counts[q.anchorCode] || 0);
        if (counts[q.anchorCode] < 2) {
          condensed.push(q);
          counts[q.anchorCode]++;
        }
      });
      setQuestions(condensed);
    } else {
      setQuestions(DIAGNOSTIC_QUESTIONS);
    }

    setAnswers({});
    setTargetJob('');
    setReport(null);
    setCurrentTab('assessment');
  };

  const handleAnswer = (questionId: number, value: LikertValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Assessment Completed -> Proceed to Job Input View
  const handleAssessmentComplete = () => {
    setCurrentTab('job_input');
  };

  // Submit Job -> Request AI Report Analysis
  const handleSubmitJob = async (jobRole: string) => {
    setTargetJob(jobRole);
    setIsLoadingReport(true);

    const scoresList = getAnchorScoresList(answers);
    const topAnchors = scoresList.slice(0, 3);
    const scoresRecord: any = {};
    scoresList.forEach((s) => (scoresRecord[s.code] = s.score));

    try {
      const response = await fetch('/api/analyze-career-anchor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anchorScores: scoresRecord,
          targetJob: jobRole,
          topAnchors: topAnchors,
        }),
      });

      const data = await response.json();

      if (data.success && data.report) {
        setReport(data.report);
        setIsAiGenerated(!!data.isAiGenerated);

        // Create saved item
        const newResult: SavedResult = {
          id: Date.now().toString(),
          createdAt: new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          targetJob: jobRole,
          scores: scoresRecord,
          topAnchors: topAnchors,
          report: data.report,
          isAiGenerated: !!data.isAiGenerated,
          answers: answers,
        };

        setSelectedHistoryResult(newResult);
        const updatedList = [newResult, ...savedResults];
        persistResults(updatedList);
        setCurrentTab('report');
      } else {
        throw new Error('Analysis failed');
      }
    } catch (err) {
      console.error('API call failed, generating offline report:', err);
      // Fallback offline report
      const fallbackReport: AIReport = {
        primaryProfileSummary: `${topAnchors.map((a) => a.tag).join(', ')} 성향이 강합니다. 스스로의 고유한 역량을 가지고 자율적인 판단 하에 최고 성과를 이끌어내는 프로페셔널 정체성을 지니고 계십니다.`,
        jobSynergy: `${jobRole} 직무는 당신의 핵심 앵커 동기와 강한 시너지를 이룹니다. 독립적인 프로젝트 권한이 부여되고 자신의 전문 지식이 실제 성과 지표로 연결될 때 최대의 몰입감과 자부심을 얻으실 수 있습니다.`,
        stressFactors: `과도한 세부 간섭(마이크로매니지먼트)이나 불필요한 비효율성 절차가 반복되는 직장 환경은 커다란 스트레스 요인이 됩니다. 자율권과 전문성을 존중하는 문화의 조직을 선택하시는 것이 중요합니다.`,
        interviewTips: `'특정 난제를 자율성과 깊이 있는 전문 역량으로 극복했던 구체적 프로젝트 성공 사례'를 자소서와 면접에서 적극 강조해 보세요.`,
        roadmap: [
          `1단계: ${jobRole} 직무의 전문 스킬셋 고도화 및 포트폴리오 다듬기`,
          '2단계: 자기주도적 문제 해결 사례 및 정량적 성과 데이터 누적',
          '3단계: 자율적 권한을 가질 수 있는 프로젝트 리드 또는 전문가(Specialist) 트랙 진입',
        ],
        recommendedJobs: [jobRole, '전문 전략 컨설턴트', 'R&D 연구원', '데이터 분석가'],
      };

      setReport(fallbackReport);
      setIsAiGenerated(false);

      const fallbackSaved: SavedResult = {
        id: Date.now().toString(),
        createdAt: new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        targetJob: jobRole,
        scores: scoresRecord,
        topAnchors: topAnchors,
        report: fallbackReport,
        isAiGenerated: false,
        answers: answers,
      };

      setSelectedHistoryResult(fallbackSaved);
      persistResults([fallbackSaved, ...savedResults]);
      setCurrentTab('report');
    } finally {
      setIsLoadingReport(false);
    }
  };

  const handleReset = () => {
    setSelectedHistoryResult(null);
    setAnswers({});
    setTargetJob('');
    setReport(null);
    setCurrentTab('discover');
  };

  const handleSelectHistoryItem = (item: SavedResult) => {
    setSelectedHistoryResult(item);
    setTargetJob(item.targetJob);
    setReport(item.report);
    setIsAiGenerated(!!item.isAiGenerated);
    if (item.answers) {
      setAnswers(item.answers);
    }
    setCurrentTab('report');
  };

  const handleDeleteHistoryItem = (id: string) => {
    if (selectedHistoryResult?.id === id) {
      setSelectedHistoryResult(null);
    }
    const updated = savedResults.filter((r) => r.id !== id);
    persistResults(updated);
  };

  const handleClearAllHistory = () => {
    if (confirm('모든 진단 이력을 삭제하시겠습니까?')) {
      setSelectedHistoryResult(null);
      persistResults([]);
    }
  };

  const handleNavigate = (tab: TabType) => {
    if (tab === 'history') {
      setIsHistoryOpen(true);
    } else {
      setIsHistoryOpen(false);
      setCurrentTab(tab);
    }
  };

  const computedScoresList = getAnchorScoresList(answers);

  // Compute active scores list to display
  let activeAllScores = computedScoresList;
  if (selectedHistoryResult && selectedHistoryResult.scores) {
    const fromRecord = getAnchorScoresListFromRecord(selectedHistoryResult.scores);
    if (fromRecord.length > 0 && fromRecord.some((s) => s.score > 0)) {
      activeAllScores = fromRecord;
    }
  }

  let activeTopAnchors = activeAllScores.slice(0, 3);
  if (selectedHistoryResult && selectedHistoryResult.topAnchors && selectedHistoryResult.topAnchors.length > 0) {
    activeTopAnchors = selectedHistoryResult.topAnchors;
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans selection:bg-growth-mint selection:text-primary">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onReset={handleReset}
        savedCount={savedResults.length}
      />

      {/* Main View Area */}
      <main className="flex-grow pt-20 pb-24 md:pb-8 flex flex-col items-center">
        {currentTab === 'discover' && (
          <DiscoverView
            onStartAssessment={handleStartAssessment}
            savedCount={savedResults.length}
          />
        )}

        {currentTab === 'assessment' && (
          <DiagnosticView
            questions={questions}
            answers={answers}
            onAnswer={handleAnswer}
            onComplete={handleAssessmentComplete}
            onCancel={() => setCurrentTab('discover')}
          />
        )}

        {currentTab === 'job_input' && (
          <JobInputView
            onSubmitJob={handleSubmitJob}
            isLoading={isLoadingReport}
          />
        )}

        {currentTab === 'report' && report && (
          <ReportView
            targetJob={targetJob}
            topAnchors={activeTopAnchors}
            allScores={activeAllScores}
            report={report}
            isAiGenerated={isAiGenerated}
            onRetake={handleReset}
          />
        )}
      </main>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedResults={savedResults}
        onSelectResult={handleSelectHistoryItem}
        onDeleteResult={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {/* Bottom Navigation Bar for Mobile */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
        hasCompletedAssessment={!!report}
        savedCount={savedResults.length}
      />
    </div>
  );
}

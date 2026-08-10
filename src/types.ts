export type AnchorCode = 'TF' | 'GM' | 'AU' | 'SE' | 'EC' | 'SV' | 'CH' | 'LS';

export interface AnchorInfo {
  code: AnchorCode;
  name: string; // e.g., "전문가/기술 역량"
  shortName: string; // e.g., "전문가"
  tag: string; // e.g., "#전문가형"
  englishName: string; // e.g., "Technical / Functional"
  description: string;
  icon: string; // Lucide icon name or Material Symbol name
  color: string; // hex color or tailwind color
  bgClass: string;
  badgeClass: string;
}

export interface Question {
  id: number;
  text: string;
  anchorCode: AnchorCode;
}

export type LikertValue = 1 | 2 | 3 | 4;

export interface AssessmentAnswers {
  [questionId: number]: LikertValue;
}

export interface AnchorScore {
  code: AnchorCode;
  name: string;
  shortName: string;
  tag: string;
  score: number; // Max 20 for 5 questions * 4
  percentage: number; // 0-100
}

export interface AIReport {
  primaryProfileSummary: string;
  jobSynergy: string;
  stressFactors: string;
  interviewTips: string;
  roadmap: string[];
  recommendedJobs: string[];
}

export interface SavedResult {
  id: string;
  createdAt: string;
  targetJob: string;
  scores: Record<AnchorCode, number>;
  topAnchors: AnchorScore[];
  report: AIReport;
  isAiGenerated?: boolean;
  answers?: AssessmentAnswers;
}

export type TabType = 'discover' | 'assessment' | 'job_input' | 'report' | 'history';

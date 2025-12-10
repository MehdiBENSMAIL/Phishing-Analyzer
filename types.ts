export interface EmailData {
  sender: string;
  subject: string;
  content: string;
}

export interface AnalysisResult {
  xgboostScore: number;
  riskLevel: 'Safe' | 'Suspicious' | 'Dangerous';
  aiAnalysis: string;
  timestamp: Date;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}
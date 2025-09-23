export interface Score {
  success: number;
  error: number;
}

export interface ScoreBoardProps {
  timeFormatted: string;
  score: Score;
  totalNotes: number;
  hasAnswer: boolean;
  isStart: boolean;
  currentNoteName?: string;
}

export default ScoreBoardProps;

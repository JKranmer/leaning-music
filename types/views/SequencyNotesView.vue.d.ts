export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface GameState {
  isGameActive: boolean;
  currentPosition: number;
  availablePositions: number[];
  isStart: { value: boolean };
  classOutPauta: { value: string };
  messageEnd: { value: boolean };
}

export interface Note {
  name: string;
  cifra: string;
  position_sol?: number[];
  position_fa?: number[];
  position_do?: number[];
  position_do_3?: number[];
  sol_cifra?: string[];
}

export {};

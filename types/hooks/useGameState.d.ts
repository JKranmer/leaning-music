import { Ref, ComputedRef } from 'vue';

interface GameState {
  isGameActive: boolean;
  currentPosition: number;
  availablePositions: number[];
}

export declare const useGameState: () => {
  isStart: Ref<boolean>;
  messageEnd: Ref<boolean>;
  positionNota: Ref<number>;
  positionNotas: Ref<number[]>;
  gameState: ComputedRef<GameState>;
  positionNotaStyle: ComputedRef<{ top: string }>;
  classOutPauta: ComputedRef<string>;
  initGame: () => void;
  endGame: () => void;
  proceedToNextNote: () => void;
};

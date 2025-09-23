interface GameState {
  isGameActive: boolean;
  currentPosition: number;
  availablePositions: number[];
}

export declare const useKeyboardInput: (
  gameState: () => GameState,
  onNoteSelected: (noteIndex: number) => void,
) => void;

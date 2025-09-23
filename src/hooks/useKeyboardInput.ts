import { onMounted, onUnmounted } from 'vue';
import { notas } from '../common/AllPositionNotas.js';

interface GameState {
  isGameActive: boolean;
  currentPosition: number;
  availablePositions: number[];
}

export const useKeyboardInput = (
  gameState: () => GameState,
  onNoteSelected: (noteIndex: number) => void,
) => {
  const handleKeyPress = (event: KeyboardEvent): void => {
    if (!gameState().isGameActive) return;

    const pressedKey = event.key.toUpperCase();
    const noteIndex = notas.findIndex(nota => nota.cifra === pressedKey);

    if (noteIndex !== -1) {
      event.preventDefault();
      onNoteSelected(noteIndex);
    }
  };

  onMounted(() => {
    const body = document.querySelector('body') as HTMLBodyElement;
    if (body) {
      body.addEventListener('keyup', handleKeyPress);
    }
  });

  onUnmounted(() => {
    const body = document.querySelector('body') as HTMLBodyElement;
    if (body) {
      body.removeEventListener('keyup', handleKeyPress);
    }
  });
};

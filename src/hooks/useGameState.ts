import { ref, computed } from 'vue';
import { allPositionNotas } from '../common/AllPositionNotas.js';

interface GameState {
  isGameActive: boolean;
  currentPosition: number;
  availablePositions: number[];
}

export const useGameState = () => {
  const isStart = ref(false);
  const messageEnd = ref(false);
  const positionNota = ref(0);
  const positionNotas = ref<number[]>([]);

  const gameState = computed<GameState>(() => ({
    isGameActive: isStart.value && !messageEnd.value,
    currentPosition: positionNotas.value[positionNota.value],
    availablePositions: positionNotas.value,
  }));

  const positionNotaStyle = computed(() => {
    return { top: positionNotas.value[positionNota.value] + 'px' };
  });

  const classOutPauta = computed(() => {
    let res = '';
    if (positionNotas.value[positionNota.value] < -23) {
      res = 'out top';
      if (positionNotas.value[positionNota.value] < -47)
        res = res + ' second_line';
    } else if (positionNotas.value[positionNota.value] > 108)
      res = 'out bottom';
    if (positionNotas.value[positionNota.value] > 122)
      res = res + ' second_line';
    return res;
  });

  const randomPosition = (): number => {
    const availablePositions = positionNotas.value.length;

    if (availablePositions === 0) {
      throw new Error('Nenhuma posição disponível para seleção aleatória');
    }

    return Math.floor(Math.random() * availablePositions);
  };

  const initGame = (): void => {
    positionNotas.value = [...allPositionNotas];
    messageEnd.value = false;
    positionNota.value = randomPosition();
  };

  const endGame = (): void => {
    messageEnd.value = true;
  };

  const removeCurrentNoteFromPool = (): void => {
    positionNotas.value.splice(positionNota.value, 1);
  };

  const selectNextRandomNote = (): void => {
    positionNota.value = randomPosition();
  };

  const proceedToNextNote = (): void => {
    const remainingNotes = gameState.value.availablePositions.length;

    if (remainingNotes === 1) {
      endGame();
      return;
    }

    removeCurrentNoteFromPool();
    selectNextRandomNote();
  };

  return {
    isStart,
    messageEnd,
    positionNota,
    positionNotas,
    gameState,
    positionNotaStyle,
    classOutPauta,
    initGame,
    endGame,
    proceedToNextNote,
  };
};

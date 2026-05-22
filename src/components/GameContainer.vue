<template>
  <div>
    <slot
      :game-state="gameState"
      :timer="timer"
      :audio="audio"
      :score="score"
      :feedback="feedback"
      :game-settings="gameSettings"
      :note-name="noteName"
      :toggle-start="toggleStart"
      :on-note-selected="handleNoteSelection"
      :repeat-synth="repeatSynth"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useTimer } from '@/hooks/useTimer.js';
import { useAudio } from '@/hooks/useAudio.js';
import { useScore } from '@/hooks/useScore.js';
import { useFeedback } from '@/hooks/useFeedback.js';
import { useGameSettings } from '@/hooks/useGameSettings.js';
import { useGameState } from '@/hooks/useGameState.js';
import { useNoteName } from '@/hooks/useNoteName.js';
import { useKeyboardInput } from '@/hooks/useKeyboardInput.js';
import { useChords } from '@/hooks/useChords.js';

interface GameState {
  isGameActive: boolean;
  currentPosition: number;
  availablePositions: number[];
}

// Emits para comunicar com componente pai sobre a validação
const emit = defineEmits<{
  validateNote: [noteIndex: number, gameState: GameState, claveType: string];
}>();

// Props para receber resultado da validação
const props = defineProps<{
  validationResult?: { isValid: boolean; error?: string };
  useCustomEndGameLogic?: boolean;
  totalExercises?: number;
}>();

const timer = useTimer();
const audio = useAudio();
const score = useScore();
const feedback = useFeedback();
const gameSettings = useGameSettings();
const gameState = useGameState();
const noteName = useNoteName();
const { typeClave } = useChords();

const currentNoteName = computed(() => {
  return noteName.getNoteName(
    gameState.gameState.value.currentPosition,
    typeClave.value.value,
  );
});

const startGame = (): void => {
  gameState.initGame();
  timer.resetTimer();
  score.resetScore();
  gameState.isStart.value = true;
  timer.initTimer();

  if (audio.hasVolume.value && currentNoteName.value) {
    audio.playNote(currentNoteName.value);
  }
};

const stopGame = (): void => {
  timer.stopTimer();
  gameState.isStart.value = false;
};

const toggleStart = (): void => {
  if (gameState.isStart.value) {
    stopGame();
  } else {
    startGame();
  }
};

const repeatSynth = (): void => {
  if (audio.hasVolume.value && currentNoteName.value) {
    audio.playNote(currentNoteName.value);
  }
};

// Função chamada quando uma nota é selecionada
const handleNoteSelection = (noteIndex: number): void => {
  if (!gameState.gameState.value.isGameActive) {
    console.warn('Tentativa de selecionar nota com jogo inativo');
    return;
  }

  // Emit para o componente pai fazer a validação
  emit(
    'validateNote',
    noteIndex,
    gameState.gameState.value,
    typeClave.value.value,
  );
};

// Watcher para reagir ao resultado da validação
watch(
  () => props.validationResult,
  result => {
    if (!result) return;

    if (result.error) {
      console.error('Erro na validação:', result.error);
      return;
    }

    // Processar feedback e atualizar score
    feedback.processFeedback(result.isValid);
    score.updateScore(result.isValid);

    // Proceder para próxima nota
    proceedToNextNote();
  },
);

const proceedToNextNote = (): void => {
  // Se está usando lógica customizada (para acordes)
  if (props.useCustomEndGameLogic && props.totalExercises) {
    const totalAttempts = score.score.value.success + score.score.value.error;

    if (totalAttempts >= props.totalExercises) {
      timer.stopTimer();
      gameState.isStart.value = false;
      gameState.messageEnd.value = true;
      return;
    }

    // Para lógica customizada, não chamamos gameState.proceedToNextNote()
    // pois a navegação é controlada pela view
    return;
  }

  // Lógica original para notas individuais
  const remainingNotes = gameState.gameState.value.availablePositions.length;

  if (remainingNotes === 1) {
    timer.stopTimer();
    gameState.isStart.value = false;
    gameState.messageEnd.value = true;
    return;
  }

  gameState.proceedToNextNote();

  // Tocar nova nota
  if (audio.hasVolume.value && currentNoteName.value) {
    audio.playNote(currentNoteName.value);
  }
};

// Configurar keyboard input
useKeyboardInput(() => gameState.gameState.value, handleNoteSelection);
</script>

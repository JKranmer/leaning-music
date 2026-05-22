<template>
  <GameContainer
    :validation-result="validationResult"
    @validate-note="handleValidateNote"
  >
    <template
      #default="{
        gameState,
        timer,
        audio,
        score,
        feedback,
        gameSettings,
        noteName,
        toggleStart,
        onNoteSelected,
        repeatSynth,
      }"
    >
      <div
        class="transition sm:flex sm:justify-center sm:items-center bg-primary-950 h-full min-h-screen"
        :class="feedback.classFeedback.value"
      >
        <div class="box-border my-0 mx-auto max-w-[40.625rem] p-8 w-full">
          <div>
            <GameSettings
              :type-clave="typeClave"
              :is-cifra="isCifra"
              :has-volume="audio.hasVolume.value"
              :has-answer="gameSettings.hasAnswer.value"
              :is-start="gameState.isStart.value"
              :is-interval-mode="isIntervalMode"
              :interval-filter="intervalFilterLabel"
              @toggle-clave="toggleClave"
              @toggle-cifra="toggleCifra"
              @toggle-volume="audio.toggleVolume"
              @toggle-answer="gameSettings.toggleAnswer"
              @toggle-interval-mode="toggleIntervalMode"
              @toggle-interval-filter="toggleIntervalFilter"
            />

            <ScoreBoard
              :time-formatted="timer.timeFormatted.value"
              :score="score.score.value"
              :total-notes="allPositionNotas.length"
              :has-answer="gameSettings.hasAnswer.value"
              :is-start="gameState.isStart.value"
              :current-note-name="
                noteName.getNoteName(
                  gameState.gameState.value.currentPosition,
                  typeClave.value,
                )
              "
            />
            <div
              v-if="isIntervalMode && gameState.isStart.value"
              class="text-white text-center mt-3 text-base"
            >
              Qual nota está uma
              <strong class="text-primary-300">{{
                currentInterval.name
              }}</strong>
              acima da nota na pauta?
            </div>
          </div>
          <div
            class="flex flex-wrap w-full box-border justify-center gap-8 border-2 border-primary-900 rounded-lg pt-12 pb-4 pl-4 pr-4 sm:px-12 sm:py-8 bg-primary-900 my-12"
          >
            <div class="flex justify-center flex-col h-[9.375rem]">
              <Staff :class="gameState.classOutPauta.value">
                <MusicalNote
                  v-show="gameState.isStart.value"
                  :position="gameState.positionNotaStyle.value"
                />
                <ChordsType
                  class="absolute"
                  :class="typeClave.value"
                  :src="typeClave.url"
                  :type="typeClave.value"
                />
              </Staff>
            </div>
            <!-- btn group -->
            <NotesButtonGroup
              :is-start="gameState.isStart.value"
              :is-cifra="isCifra"
              @note-selected="onNoteSelected"
            />
          </div>
          <div class="flex gap-4">
            <btn
              @click="toggleStart"
              class="w-full sm:w-auto"
              :background="
                gameState.isStart.value ? 'bg-rose-900' : 'bg-primary-500'
              "
            >
              {{ gameState.isStart.value ? 'Cancelar' : 'Iniciar' }}
            </btn>
            <btn
              @click="repeatSynth"
              v-if="
                audio.hasVolume.value &&
                noteName.getNoteName(
                  gameState.gameState.value.currentPosition,
                  typeClave.value,
                ) &&
                gameState.isStart.value
              "
              class="pt-0 pb-0"
            >
              <svg-icon type="mdi" :path="mdilPlay"></svg-icon>
            </btn>
          </div>
          <div v-show="gameState.messageEnd.value">
            <h1>Fim do jogo</h1>
          </div>
        </div>
      </div>
    </template>
  </GameContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import GameContainer from '@/components/GameContainer.vue';
import MusicalNote from '@/components/MusicalNote.vue';
import ChordsType from '@/components/ChordsType.vue';
import Staff from '@/components/Staff.vue';
import GameSettings from '@/components/GameSettings.vue';
import ScoreBoard from '@/components/ScoreBoard.vue';
import Btn from '@/components/Btn.vue';
import NotesButtonGroup from '@/components/NotesButtonGroup.vue';
import {
  allPositionNotas,
  ClaveLabel,
  notas,
} from '@/common/AllPositionNotas.js';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdilPlay } from '@mdi/light-js';
import { useChords } from '@/hooks/useChords.js';

const {
  toggleClave,
  typeClave,
  toggleCifra,
  isCifra,
  currentInterval,
  regenerateInterval,
  intervalFilterLabel,
  toggleIntervalFilter,
  resetState,
} = useChords();

onMounted(() => {
  resetState();
});

// Estado da validação
const validationResult = ref<{ isValid: boolean; error?: string } | undefined>(
  undefined,
);

// Tipos para melhor type safety
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface GameState {
  isGameActive: boolean;
  currentPosition: number;
  availablePositions: number[];
}

// Constantes para validação
const VALIDATION_MODES = {
  CLAVE: 0,
  INTERVAL: 1,
} as const;

const type_interval = ref<0 | 1>(VALIDATION_MODES.CLAVE);
const isIntervalMode = computed(
  () => type_interval.value === VALIDATION_MODES.INTERVAL,
);
const toggleIntervalMode = () => {
  type_interval.value = isIntervalMode.value
    ? VALIDATION_MODES.CLAVE
    : VALIDATION_MODES.INTERVAL;
};

// Função principal de validação chamada pelo GameContainer
const handleValidateNote = (
  noteIndex: number,
  gameState: GameState,
  claveType: string,
): void => {
  const result = validateNoteSelection(noteIndex, gameState, claveType);

  if (!result.isValid && !result.error) {
    const selectedName = notas[noteIndex]?.name ?? '?';
    const claveKey = ClaveLabel[
      claveType as keyof typeof ClaveLabel
    ] as keyof (typeof notas)[0];
    if (type_interval.value === VALIDATION_MODES.CLAVE) {
      const correct = notas.find(n =>
        (n[claveKey] as number[] | undefined)?.includes(
          gameState.currentPosition,
        ),
      );
      console.error(
        `Errou! Nota na pauta: "${correct?.name ?? '?'}" (pos: ${gameState.currentPosition}px) | Selecionado: "${selectedName}" | Correto: "${correct?.name ?? '?'}"`,
      );
    } else {
      const claveKey2 = ClaveLabel[
        claveType as keyof typeof ClaveLabel
      ] as keyof (typeof notas)[0];
      const currentNote = notas.find(n =>
        (n[claveKey2] as number[] | undefined)?.includes(
          gameState.currentPosition,
        ),
      );
      const currentNoteIdx = currentNote ? notas.indexOf(currentNote) : -1;
      const targetNoteIdx =
        currentNoteIdx >= 0
          ? (currentNoteIdx + currentInterval.value.steps) % notas.length
          : -1;
      const correctName = targetNoteIdx >= 0 ? notas[targetNoteIdx].name : '?';
      console.error(
        `Errou! Nota na pauta: "${currentNote?.name ?? '?'}" (pos: ${gameState.currentPosition}px) | Selecionado: "${selectedName}" | Correto (${currentInterval.value.name} acima): "${correctName}"`,
      );
    }
  }

  validationResult.value = result;

  // Limpar o resultado após processar e regenerar intervalo para a próxima nota
  setTimeout(() => {
    validationResult.value = undefined;
    if (isIntervalMode.value) regenerateInterval();
  }, 100);
};

// Validação principal com melhor estrutura
const validateNoteSelection = (
  noteIndex: number,
  gameState: GameState,
  claveType: string,
): ValidationResult => {
  if (!isValidNoteIndex(noteIndex)) {
    return {
      isValid: false,
      error: `Índice de nota inválido: ${noteIndex}`,
    };
  }

  if (!gameState.currentPosition && gameState.currentPosition !== 0) {
    return {
      isValid: false,
      error: 'Posição atual da nota não definida',
    };
  }

  try {
    const isValid =
      type_interval.value === VALIDATION_MODES.CLAVE
        ? validateClaveNote(noteIndex, gameState.currentPosition, claveType)
        : validateIntervalNote(noteIndex, gameState.currentPosition, claveType);

    return { isValid };
  } catch (error) {
    return {
      isValid: false,
      error: `Erro durante validação: ${error}`,
    };
  }
};

// Validação de nota por clave - refatorada para ser mais limpa
const validateClaveNote = (
  noteIndex: number,
  currentPosition: number,
  claveType: string,
): boolean => {
  const selectedNote = notas[noteIndex];

  const positionProperty = ClaveLabel[
    claveType as keyof typeof ClaveLabel
  ] as keyof typeof selectedNote;

  if (!positionProperty || !selectedNote[positionProperty]) {
    throw new Error(`Propriedade de posição inválida para clave ${claveType}`);
  }

  const validPositions = selectedNote[positionProperty] as number[];
  return validPositions.includes(currentPosition);
};

// Validação de intervalo: abordagem diatônica — a Nª acima de uma nota
// é calculada pelo nome da nota (7 notas no ciclo), não por posição física no array.
// Ex: 7ª acima de Dó = Si (índice 0+6=6), independente de oitava.
const validateIntervalNote = (
  noteIndex: number,
  currentPosition: number,
  claveType: string,
): boolean => {
  const claveProperty = ClaveLabel[
    claveType as keyof typeof ClaveLabel
  ] as keyof (typeof notas)[0];
  const currentNote = notas.find(n =>
    (n[claveProperty] as number[] | undefined)?.includes(currentPosition),
  );
  if (!currentNote) return false;

  const currentNoteIndex = notas.indexOf(currentNote);
  const targetNoteIndex =
    (currentNoteIndex + currentInterval.value.steps) % notas.length;
  return notas[noteIndex].name === notas[targetNoteIndex].name;
};

// Funções auxiliares
const isValidNoteIndex = (index: number): boolean => {
  return index >= 0 && index < notas.length;
};
</script>

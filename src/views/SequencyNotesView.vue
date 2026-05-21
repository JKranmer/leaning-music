<template>
  <GameContainer
    :validation-result="validationResult"
    :use-custom-end-game-logic="true"
    :total-exercises="allChords.length"
    @validate-note="handleValidateNoteFromContainer"
  >
    <template
      #default="{
        gameState,
        timer,
        audio,
        score,
        feedback,
        gameSettings,
        toggleStart,
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
              :current-difficulty="currentDifficulty"
              @toggle-clave="toggleClave"
              @toggle-cifra="toggleCifra"
              @toggle-volume="audio.toggleVolume"
              @toggle-answer="gameSettings.toggleAnswer"
              @toggle-difficulty="toggleDifficulty"
            />

            <ScoreBoard
              :time-formatted="timer.timeFormatted.value"
              :score="score.score.value"
              :total-notes="allChords.length"
              :has-answer="gameSettings.hasAnswer.value"
              :is-start="gameState.isStart.value"
              :current-note-name="getCurrentChordName()"
            />
          </div>
          <div
            class="flex flex-wrap w-full box-border justify-center gap-8 border-2 border-primary-900 rounded-lg pt-12 pb-4 pl-4 pr-4 sm:px-12 sm:py-8 bg-primary-900 my-12"
          >
            <div class="flex justify-center flex-col h-[12.5rem]">
              <Staff :class="classOutPautaChord">
                <ChordNotes
                  v-show="gameState.isStart.value"
                  :positions="currentChordPositions"
                  :isActive="true"
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
              @note-selected="onSequenceNoteSelected"
            />
          </div>
          <div class="flex gap-4">
            <btn
              @click="() => handleToggleStart(toggleStart, gameState)"
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
                getCurrentChordName() &&
                gameState.isStart.value
              "
              class="pt-0 pb-0"
            >
              <svg-icon type="mdi" :path="mdilPlay"></svg-icon>
            </btn>
          </div>
          <!-- Instrução para o jogador -->
          <div v-if="gameState.isStart.value" class="mt-4">
            <div class="text-white text-center mb-2">
              Clique na <strong>tônica</strong> (nota principal) do acorde
              mostrado na pauta
            </div>
            <div class="text-gray-300 text-center text-sm">
              Acorde {{ currentGameIndex + 1 }}/{{ allChords.length }}:
              {{ getCurrentChordName() }} ({{ currentChord[0]?.name }},
              {{ currentChord[1]?.name }}, {{ currentChord[2]?.name }})
            </div>
          </div>
          <div
            v-show="
              gameState.messageEnd.value ||
              (currentGameIndex >= allChords.length && allChords.length > 0)
            "
          >
            <h1 class="text-white text-center">Fim do jogo!</h1>
            <p class="text-gray-300 text-center mt-2">
              Você completou todos os {{ allChords.length }} acordes!
            </p>
          </div>
        </div>
      </div>
    </template>
  </GameContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import GameContainer from '@/components/GameContainer.vue';
import ChordNotes from '@/components/ChordNotes.vue';
import ChordsType from '@/components/ChordsType.vue';
import Staff from '@/components/Staff.vue';
import GameSettings from '@/components/GameSettings.vue';
import ScoreBoard from '@/components/ScoreBoard.vue';
import Btn from '@/components/Btn.vue';
import NotesButtonGroup from '@/components/NotesButtonGroup.vue';

import SvgIcon from '@jamescoyle/vue-icon';
import { mdilPlay } from '@mdi/light-js';
import { useSequencyNotes } from '@/hooks/useSequencyNotes.js';
import { notas, ClaveLabel } from '@/common/AllPositionNotas.js';

// Tipo para uma nota musical
interface Note {
  name: string;
  cifra: string;
  position_sol?: number[];
  position_fa?: number[];
  position_do?: number[];
  position_do_3?: number[];
  sol_cifra?: string[];
}

const {
  toggleClave,
  typeClave,
  toggleCifra,
  isCifra,
  currentDifficulty,
  toggleDifficulty,
} = useSequencyNotes();

// Estado da validação
const validationResult = ref<{ isValid: boolean; error?: string } | undefined>(
  undefined,
);

// Acorde atual do jogo
const currentChord = ref<Note[]>([]);
const allChords = ref<
  { chord: Note[]; positions: number[]; tonicNote: Note }[]
>([]); // Array com todos os acordes possíveis
const currentGameIndex = ref(0); // Índice atual no array de acordes do jogo

// Posições do acorde atual na pauta
const currentChordPositions = computed(() => {
  if (
    allChords.value.length === 0 ||
    currentGameIndex.value >= allChords.value.length
  )
    return [];
  return allChords.value[currentGameIndex.value].positions;
});

// Classe para acordes fora da pauta (similar ao classOutPauta para notas individuais)
const classOutPautaChord = computed(() => {
  const positions = currentChordPositions.value;
  if (positions.length === 0) return '';

  let result = '';
  let hasTopOut = false;
  let hasBottomOut = false;
  let hasSecondLineTop = false;
  let hasSecondLineBottom = false;

  // Verificar cada posição do acorde
  positions.forEach(position => {
    // Posições muito altas (acima da pauta)
    if (position < -23) {
      hasTopOut = true;
      if (position < -47) {
        hasSecondLineTop = true;
      }
    }
    // Posições muito baixas (abaixo da pauta)
    else if (position > 108) {
      hasBottomOut = true;
      if (position > 122) {
        hasSecondLineBottom = true;
      }
    }
  });

  // Construir a classe baseada nas condições encontradas
  if (hasTopOut && hasBottomOut) {
    result = 'out both';
  } else if (hasTopOut) {
    result = 'out top';
  } else if (hasBottomOut) {
    result = 'out bottom';
  }

  // Adicionar linhas suplementares se necessário
  if (hasSecondLineTop || hasSecondLineBottom) {
    result += ' second_line';
  }

  return result;
});

// Função para gerar os 7 acordes básicos (nível fácil)
const generateBasicChords = () => {
  const basicChords: {
    chord: Note[];
    positions: number[];
    tonicNote: Note;
  }[] = [];
  const claveKey = ClaveLabel[
    typeClave.value.value as keyof typeof ClaveLabel
  ] as keyof Note;

  // Função auxiliar para encontrar a posição mais próxima menor
  const findClosestLowerPosition = (
    targetPositions: number[],
    referencePos: number,
  ): number | null => {
    const lowerPositions = targetPositions.filter(pos => pos < referencePos);
    if (lowerPositions.length === 0) return null;
    return Math.max(...lowerPositions);
  };

  // Os 7 acordes básicos: Dó, Ré, Mi, Fá, Sol, Lá, Si
  // Para cada acorde: tônica, terça (posição mais próxima menor da tônica), quinta (posição mais próxima menor da terça)
  const basicChordPatterns = [
    [0, 2, 4], // Dó-Mi-Sol
    [1, 3, 5], // Ré-Fá-Lá
    [2, 4, 6], // Mi-Sol-Si
    [3, 5, 0], // Fá-Lá-Dó
    [4, 6, 1], // Sol-Si-Ré
    [5, 0, 2], // Lá-Dó-Mi
    [6, 1, 3], // Si-Ré-Fá
  ];

  // Embaralhar os padrões de acordes para ordem aleatória
  const shuffledPatterns = [...basicChordPatterns].sort(
    () => Math.random() - 0.5,
  );

  shuffledPatterns.forEach(pattern => {
    const [tonicaIndex, tercaIndex, quintaIndex] = pattern;

    const chord = [
      notas[tonicaIndex], // tônica
      notas[tercaIndex], // terça
      notas[quintaIndex], // quinta
    ];

    const tonicaPositions = (notas[tonicaIndex][claveKey] as number[]) || [];
    const tercaPositions = (notas[tercaIndex][claveKey] as number[]) || [];
    const quintaPositions = (notas[quintaIndex][claveKey] as number[]) || [];

    if (
      tonicaPositions.length > 0 &&
      tercaPositions.length > 0 &&
      quintaPositions.length > 0
    ) {
      // Para cada posição da tônica, encontrar a terça e quinta mais próximas menores
      for (const tonicaPos of tonicaPositions) {
        // Encontrar a posição da terça mais próxima menor da tônica
        const tercaPos = findClosestLowerPosition(tercaPositions, tonicaPos);

        if (tercaPos !== null) {
          // Encontrar a posição da quinta mais próxima menor da terça
          const quintaPos = findClosestLowerPosition(quintaPositions, tercaPos);

          if (
            quintaPos !== null &&
            tonicaPos !== tercaPos &&
            tonicaPos !== quintaPos &&
            tercaPos !== quintaPos
          ) {
            basicChords.push({
              chord,
              positions: [tonicaPos, tercaPos, quintaPos],
              tonicNote: notas[tonicaIndex],
            });
            break; // Usar apenas a primeira combinação válida encontrada
          }
        }
      }
    }
  });

  return basicChords;
};

// Função para gerar nível médio - variações dos acordes básicos
const generateMediumChords = () => {
  const basicChords = generateBasicChords();
  const mediumChords: {
    chord: Note[];
    positions: number[];
    tonicNote: Note;
  }[] = [];
  const claveKey = ClaveLabel[
    typeClave.value.value as keyof typeof ClaveLabel
  ] as keyof Note;
  const usedTonicas = new Set<string>(); // Para controlar tônicas já usadas

  basicChords.forEach(basicChord => {
    const { chord, tonicNote } = basicChord;
    const [tonica, terca, quinta] = chord;

    // Pular se a tônica já foi usada
    if (usedTonicas.has(tonicNote.name)) {
      return;
    }

    // Obter todas as posições possíveis para cada nota do acorde
    const tonicaPositions = (tonica[claveKey] as number[]) || [];
    const tercaPositions = (terca[claveKey] as number[]) || [];
    const quintaPositions = (quinta[claveKey] as number[]) || [];

    // Função para encontrar a posição mais próxima
    const findClosestPosition = (
      positions: number[],
      reference: number,
      condition: (pos: number, ref: number) => boolean,
    ): number | null => {
      const validPositions = positions.filter(pos => condition(pos, reference));
      if (validPositions.length === 0) return null;

      // Retornar a posição mais próxima (menor diferença absoluta)
      return validPositions.reduce((closest, current) =>
        Math.abs(current - reference) < Math.abs(closest - reference)
          ? current
          : closest,
      );
    };

    // Caso 1: tônica > terça > quinta
    tonicaPositions.forEach(tonicaPos => {
      // Encontrar terça mais próxima menor que a tônica
      const tercaPos = findClosestPosition(
        tercaPositions,
        tonicaPos,
        (pos, ref) => pos < ref,
      );
      if (tercaPos !== null) {
        // Encontrar quinta mais próxima menor que a terça
        const quintaPos = findClosestPosition(
          quintaPositions,
          tercaPos,
          (pos, ref) => pos < ref,
        );
        if (
          quintaPos !== null &&
          quintaPos !== tercaPos &&
          quintaPos !== tonicaPos
        ) {
          mediumChords.push({
            chord: [tonica, terca, quinta],
            positions: [tonicaPos, tercaPos, quintaPos],
            tonicNote,
          });
        }
      }
    });

    // Caso 2: quinta > tônica > terça
    tonicaPositions.forEach(tonicaPos => {
      // Encontrar quinta mais próxima maior que a tônica
      const quintaPos = findClosestPosition(
        quintaPositions,
        tonicaPos,
        (pos, ref) => pos > ref,
      );
      if (quintaPos !== null) {
        // Encontrar terça mais próxima menor que a tônica
        const tercaPos = findClosestPosition(
          tercaPositions,
          tonicaPos,
          (pos, ref) => pos < ref,
        );
        if (
          tercaPos !== null &&
          tercaPos !== quintaPos &&
          tercaPos !== tonicaPos
        ) {
          mediumChords.push({
            chord: [quinta, tonica, terca],
            positions: [quintaPos, tonicaPos, tercaPos],
            tonicNote,
          });
        }
      }
    });

    // Caso 3: terça > quinta > tônica
    tonicaPositions.forEach(tonicaPos => {
      // Encontrar quinta mais próxima maior que a tônica
      const quintaPos = findClosestPosition(
        quintaPositions,
        tonicaPos,
        (pos, ref) => pos > ref,
      );
      if (quintaPos !== null) {
        // Encontrar terça mais próxima maior que a quinta
        const tercaPos = findClosestPosition(
          tercaPositions,
          quintaPos,
          (pos, ref) => pos > ref,
        );
        if (
          tercaPos !== null &&
          tercaPos !== quintaPos &&
          tercaPos !== tonicaPos
        ) {
          mediumChords.push({
            chord: [terca, quinta, tonica],
            positions: [tercaPos, quintaPos, tonicaPos],
            tonicNote,
          });
        }
      }
    });

    // Marcar esta tônica como usada
    usedTonicas.add(tonicNote.name);
  });

  // Embaralhar o array de acordes
  for (let i = mediumChords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mediumChords[i], mediumChords[j]] = [mediumChords[j], mediumChords[i]];
  }

  return mediumChords;
};

// Função para gerar todos os acordes possíveis sem repetir posições (nível difícil)
const generateAllChords = () => {
  if (currentDifficulty.value.value === 'easy') {
    return generateBasicChords();
  }

  if (currentDifficulty.value.value === 'medium') {
    return generateMediumChords();
  }

  const usedPositions = new Set<string>(); // Para controlar combinações já usadas
  const generatedChords: {
    chord: Note[];
    positions: number[];
    tonicNote: Note;
  }[] = [];
  const claveKey = ClaveLabel[
    typeClave.value.value as keyof typeof ClaveLabel
  ] as keyof Note;

  // Para cada nota como tônica
  notas.forEach((tonica, tonicaIndex) => {
    // Acorde maior: tônica, terça maior (2 semitons), quinta justa (4 semitons)
    const tercaIndex = (tonicaIndex + 2) % notas.length;
    const quintaIndex = (tonicaIndex + 4) % notas.length;

    const chord = [
      notas[tonicaIndex], // tônica
      notas[tercaIndex], // terça
      notas[quintaIndex], // quinta
    ];

    // Obter todas as posições possíveis para cada nota do acorde
    const tonicaPositions = (tonica[claveKey] as number[]) || [];
    const tercaPositions = (notas[tercaIndex][claveKey] as number[]) || [];
    const quintaPositions = (notas[quintaIndex][claveKey] as number[]) || [];

    // Gerar todas as combinações possíveis de posições
    tonicaPositions.forEach(tonicaPos => {
      tercaPositions.forEach(tercaPos => {
        quintaPositions.forEach(quintaPos => {
          // Verificar se as posições são todas diferentes (aceita estado fundamental, 1ª e 2ª inversão)
          if (
            tonicaPos !== tercaPos &&
            tonicaPos !== quintaPos &&
            tercaPos !== quintaPos
          ) {
            const positions = [tonicaPos, tercaPos, quintaPos];
            const positionsKey = positions.sort((a, b) => a - b).join(',');

            // Verificar se esta combinação de posições já foi usada
            if (!usedPositions.has(positionsKey)) {
              usedPositions.add(positionsKey);
              generatedChords.push({
                chord,
                positions: [tonicaPos, tercaPos, quintaPos],
                tonicNote: tonica,
              });
            }
          }
        });
      });
    });
  });

  // Embaralhar o array de acordes
  for (let i = generatedChords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [generatedChords[i], generatedChords[j]] = [
      generatedChords[j],
      generatedChords[i],
    ];
  }
  return generatedChords;
};

// const levelTwo = (basicChords: {
//   chord: Note[];
//   positions: number[];
//   tonicNote: Note;
// }) => {

//   return basicChords;
// };

// Inicializar o jogo com todos os acordes
const initializeGame = () => {
  allChords.value = generateAllChords();
  currentGameIndex.value = 0;

  if (allChords.value.length > 0) {
    currentChord.value = allChords.value[0].chord;
    console.log('Jogo inicializado com', allChords.value.length, 'acordes');
    console.log(
      'Primeiro acorde:',
      currentChord.value.map(n => n.name).join(' - '),
    );
  }
};

// Avançar para o próximo acorde
const nextChord = () => {
  currentGameIndex.value++;
  if (currentGameIndex.value < allChords.value.length) {
    currentChord.value = allChords.value[currentGameIndex.value].chord;
    console.log(
      `Acorde ${currentGameIndex.value + 1}/${allChords.value.length}:`,
      currentChord.value.map(n => n.name).join(' - '),
    );
  } else {
    console.log('Fim do jogo!');
    currentChord.value = [];
  }
};

// Nome do acorde atual (nome da tônica)
const getCurrentChordName = (): string => {
  if (
    allChords.value.length === 0 ||
    currentGameIndex.value >= allChords.value.length
  )
    return '';

  // Sempre pegar a tônica do acorde atual usando tonicNote
  const currentGameChord = allChords.value[currentGameIndex.value];
  return currentGameChord.tonicNote.name;
};

// Função chamada quando uma nota é selecionada
const onSequenceNoteSelected = (noteIndex: number) => {
  // Validar imediatamente se a nota selecionada é a tônica
  handleValidateNote(noteIndex);
};

// Função wrapper para lidar com a emissão do GameContainer
const handleValidateNoteFromContainer = (noteIndex: number) => {
  handleValidateNote(noteIndex);
};

// Validar se a nota selecionada é a tônica do acorde
const handleValidateNote = (noteIndex: number): void => {
  if (
    allChords.value.length === 0 ||
    currentGameIndex.value >= allChords.value.length
  ) {
    console.warn('Nenhum acorde atual definido ou jogo finalizado');
    return;
  }

  const currentGameChord = allChords.value[currentGameIndex.value];
  const selectedNote = notas[noteIndex];
  const tonicNote = currentGameChord.tonicNote;

  // Verificar se a nota selecionada é a tônica
  const isValid = selectedNote.name === tonicNote.name;

  validationResult.value = { isValid };

  console.log(
    `Nota selecionada: ${selectedNote.name}, Tônica esperada: ${tonicNote.name}, Válida: ${isValid}`,
  );

  // Avançar para o próximo acorde após um delay
  nextChord();

  // Limpar resultado da validação
  setTimeout(() => {
    validationResult.value = undefined;
  }, 500);
};

// Função para gerenciar toggle personalizado
const handleToggleStart = (
  originalToggleStart: () => void,
  gameState: { isStart: { value: boolean } },
) => {
  // Se o jogo não está iniciado, vamos iniciar e inicializar o jogo
  if (!gameState.isStart.value) {
    initializeGame(); // Inicializar jogo com acordes baseado na dificuldade
  }

  // Chamar função original
  originalToggleStart();
};

// Inicializar quando componente for montado
onMounted(() => {
  initializeGame();
});
</script>

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
              :is-start="gameState.isStart.value"
              :current-difficulty="currentDifficulty"
              :current-chord-state="currentChordState"
              @toggle-clave="toggleClave"
              @toggle-cifra="toggleCifra"
              @toggle-answer="gameSettings.toggleAnswer"
              @toggle-difficulty="toggleDifficulty"
              @toggle-chord-state="toggleChordState"
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
  currentChordState,
  toggleChordState,
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
      if (position >= 122) {
        hasSecondLineBottom = true;
      }
    }
  });

  // Construir a classe baseada nas condições encontradas
  if (hasTopOut && hasBottomOut) {
    result = 'out top bottom';
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

// Função para determinar o estado de um acorde
// Sistema: valor maior = nota mais grave (nota no baixo)
// Fundamental: tônicaPos é o maior valor
// Inversão: tercaPos ou quintaPos é o maior valor (combina 1ª e 2ª inversão)
const getChordState = (
  tonicaPos: number,
  tercaPos: number,
  quintaPos: number,
): 'fundamental' | 'inversion' => {
  if (tonicaPos > tercaPos && tonicaPos > quintaPos) return 'fundamental';
  return 'inversion';
};

// Função para gerar os 7 acordes básicos (nível fácil)
// - Estado 'fundamental': 1 posição por acorde em estado fundamental = 7 exercícios
// - Estado 'inversion': 2 posições por acorde (1ª + 2ª inversão) = 14 exercícios
// - Estado 'all': 3 posições por acorde (fundamental + 1ª inversão + 2ª inversão) = 21 exercícios
const generateBasicChords = () => {
  const basicChords: {
    chord: Note[];
    positions: number[];
    tonicNote: Note;
  }[] = [];
  const claveKey = ClaveLabel[
    typeClave.value.value as keyof typeof ClaveLabel
  ] as keyof Note;

  // Os 7 acordes básicos (grãos da escala maior): tônica, terça, quinta
  const basicChordPatterns = [
    [0, 2, 4], // Dó-Mi-Sol
    [1, 3, 5], // Ré-Fá-Lá
    [2, 4, 6], // Mi-Sol-Si
    [3, 5, 0], // Fá-Lá-Dó
    [4, 6, 1], // Sol-Si-Ré
    [5, 0, 2], // Lá-Dó-Mi
    [6, 1, 3], // Si-Ré-Fá
  ];

  const shuffledPatterns = [...basicChordPatterns].sort(
    () => Math.random() - 0.5,
  );

  const mode = currentChordState.value.value;

  shuffledPatterns.forEach(pattern => {
    const [tonicaIndex, tercaIndex, quintaIndex] = pattern;
    const chord = [notas[tonicaIndex], notas[tercaIndex], notas[quintaIndex]];

    const tonicaPositions = (notas[tonicaIndex][claveKey] as number[]) || [];
    const tercaPositions = (notas[tercaIndex][claveKey] as number[]) || [];
    const quintaPositions = (notas[quintaIndex][claveKey] as number[]) || [];

    if (
      !tonicaPositions.length ||
      !tercaPositions.length ||
      !quintaPositions.length
    )
      return;

    // Encontrar posições por estado
    const fundamentalCombos: number[][] = [];
    const inversionCombos: number[][] = [];

    for (const tonicaPos of tonicaPositions) {
      for (const tercaPos of tercaPositions) {
        for (const quintaPos of quintaPositions) {
          if (
            tonicaPos !== tercaPos &&
            tonicaPos !== quintaPos &&
            tercaPos !== quintaPos
          ) {
            const state = getChordState(tonicaPos, tercaPos, quintaPos);
            if (state === 'fundamental') {
              fundamentalCombos.push([tonicaPos, tercaPos, quintaPos]);
            } else {
              inversionCombos.push([tonicaPos, tercaPos, quintaPos]);
            }
          }
        }
      }
    }

    // Ordenar por compactação (menor spread)
    const sortBySpread = (combos: number[][]) =>
      combos.sort(
        (a, b) =>
          Math.max(...a) - Math.min(...a) - (Math.max(...b) - Math.min(...b)),
      );

    sortBySpread(fundamentalCombos);
    sortBySpread(inversionCombos);

    // Adicionar posições conforme o modo
    if (mode === 'fundamental') {
      if (fundamentalCombos.length > 0) {
        basicChords.push({
          chord,
          positions: fundamentalCombos[0],
          tonicNote: notas[tonicaIndex],
        });
      }
    } else if (mode === 'inversion') {
      // Adicionar até 2 inversões (1ª e 2ª)
      for (let i = 0; i < Math.min(2, inversionCombos.length); i++) {
        basicChords.push({
          chord,
          positions: inversionCombos[i],
          tonicNote: notas[tonicaIndex],
        });
      }
    } else if (mode === 'all') {
      // Adicionar 1 fundamental + 2 inversões (ou menos se não houver)
      if (fundamentalCombos.length > 0) {
        basicChords.push({
          chord,
          positions: fundamentalCombos[0],
          tonicNote: notas[tonicaIndex],
        });
      }
      for (let i = 0; i < Math.min(2, inversionCombos.length); i++) {
        basicChords.push({
          chord,
          positions: inversionCombos[i],
          tonicNote: notas[tonicaIndex],
        });
      }
    }
  });

  // Embaralhar o array de acordes para aleatoriedade
  for (let i = basicChords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [basicChords[i], basicChords[j]] = [basicChords[j], basicChords[i]];
  }

  return basicChords;
};

// Função para gerar exercícios adicionais do nível médio (complementam os básicos)
// Mesmos 7 acordes básicos, mas em segunda oitava/posição
const generateMediumOnlyChords = () => {
  const mediumOnlyChords: {
    chord: Note[];
    positions: number[];
    tonicNote: Note;
  }[] = [];
  const claveKey = ClaveLabel[
    typeClave.value.value as keyof typeof ClaveLabel
  ] as keyof Note;

  const mode = currentChordState.value.value;

  // Os mesmos 7 acordes básicos
  const basicChordPatterns = [
    [0, 2, 4], // Dó-Mi-Sol
    [1, 3, 5], // Ré-Fá-Lá
    [2, 4, 6], // Mi-Sol-Si
    [3, 5, 0], // Fá-Lá-Dó
    [4, 6, 1], // Sol-Si-Ré
    [5, 0, 2], // Lá-Dó-Mi
    [6, 1, 3], // Si-Ré-Fá
  ];

  basicChordPatterns.forEach(pattern => {
    const [tonicaIndex, tercaIndex, quintaIndex] = pattern;
    const chord = [notas[tonicaIndex], notas[tercaIndex], notas[quintaIndex]];

    const tonicaPositions = (notas[tonicaIndex][claveKey] as number[]) || [];
    const tercaPositions = (notas[tercaIndex][claveKey] as number[]) || [];
    const quintaPositions = (notas[quintaIndex][claveKey] as number[]) || [];

    // Pegar a segunda posição (índice 1) de cada nota
    const tonicaPos = tonicaPositions[1];
    const tercaPos = tercaPositions[1];
    const quintaPos = quintaPositions[1];

    if (
      tonicaPos !== undefined &&
      tercaPos !== undefined &&
      quintaPos !== undefined
    ) {
      if (
        tonicaPos !== tercaPos &&
        tonicaPos !== quintaPos &&
        tercaPos !== quintaPos
      ) {
        const state = getChordState(tonicaPos, tercaPos, quintaPos);

        // Filtrar por estado
        if (mode === 'fundamental' && state === 'fundamental') {
          mediumOnlyChords.push({
            chord,
            positions: [tonicaPos, tercaPos, quintaPos],
            tonicNote: notas[tonicaIndex],
          });
        } else if (mode === 'inversion' && state === 'inversion') {
          mediumOnlyChords.push({
            chord,
            positions: [tonicaPos, tercaPos, quintaPos],
            tonicNote: notas[tonicaIndex],
          });
        } else if (mode === 'all') {
          mediumOnlyChords.push({
            chord,
            positions: [tonicaPos, tercaPos, quintaPos],
            tonicNote: notas[tonicaIndex],
          });
        }
      }
    }
  });

  // Embaralhar
  for (let i = mediumOnlyChords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mediumOnlyChords[i], mediumOnlyChords[j]] = [
      mediumOnlyChords[j],
      mediumOnlyChords[i],
    ];
  }

  return mediumOnlyChords;
};

// Função para gerar exercícios adicionais do nível difícil (complementam básicos + médios)
// Mesmos 7 acordes básicos, mas em terceira oitava/posição
const generateHardOnlyChords = () => {
  const hardOnlyChords: {
    chord: Note[];
    positions: number[];
    tonicNote: Note;
  }[] = [];
  const claveKey = ClaveLabel[
    typeClave.value.value as keyof typeof ClaveLabel
  ] as keyof Note;

  const mode = currentChordState.value.value;

  // Os mesmos 7 acordes básicos
  const basicChordPatterns = [
    [0, 2, 4], // Dó-Mi-Sol
    [1, 3, 5], // Ré-Fá-Lá
    [2, 4, 6], // Mi-Sol-Si
    [3, 5, 0], // Fá-Lá-Dó
    [4, 6, 1], // Sol-Si-Ré
    [5, 0, 2], // Lá-Dó-Mi
    [6, 1, 3], // Si-Ré-Fá
  ];

  basicChordPatterns.forEach(pattern => {
    const [tonicaIndex, tercaIndex, quintaIndex] = pattern;
    const chord = [notas[tonicaIndex], notas[tercaIndex], notas[quintaIndex]];

    const tonicaPositions = (notas[tonicaIndex][claveKey] as number[]) || [];
    const tercaPositions = (notas[tercaIndex][claveKey] as number[]) || [];
    const quintaPositions = (notas[quintaIndex][claveKey] as number[]) || [];

    // Pegar a terceira posição (índice 2) de cada nota
    const tonicaPos = tonicaPositions[2];
    const tercaPos = tercaPositions[2];
    const quintaPos = quintaPositions[2];

    if (
      tonicaPos !== undefined &&
      tercaPos !== undefined &&
      quintaPos !== undefined
    ) {
      if (
        tonicaPos !== tercaPos &&
        tonicaPos !== quintaPos &&
        tercaPos !== quintaPos
      ) {
        const state = getChordState(tonicaPos, tercaPos, quintaPos);

        // Filtrar por estado
        if (mode === 'fundamental' && state === 'fundamental') {
          hardOnlyChords.push({
            chord,
            positions: [tonicaPos, tercaPos, quintaPos],
            tonicNote: notas[tonicaIndex],
          });
        } else if (mode === 'inversion' && state === 'inversion') {
          hardOnlyChords.push({
            chord,
            positions: [tonicaPos, tercaPos, quintaPos],
            tonicNote: notas[tonicaIndex],
          });
        } else if (mode === 'all') {
          hardOnlyChords.push({
            chord,
            positions: [tonicaPos, tercaPos, quintaPos],
            tonicNote: notas[tonicaIndex],
          });
        }
      }
    }
  });

  // Embaralhar
  for (let i = hardOnlyChords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [hardOnlyChords[i], hardOnlyChords[j]] = [
      hardOnlyChords[j],
      hardOnlyChords[i],
    ];
  }

  return hardOnlyChords;
};

// Função para gerar nível médio - variações dos acordes básicos
const generateMediumChords = () => {
  const basicChords = generateBasicChords();
  const mediumOnlyChords = generateMediumOnlyChords();

  // Combinar: básicos + médios (acumulativo)
  const allMediumChords = [...basicChords, ...mediumOnlyChords];

  // Embaralhar o array final
  for (let i = allMediumChords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allMediumChords[i], allMediumChords[j]] = [
      allMediumChords[j],
      allMediumChords[i],
    ];
  }

  return allMediumChords;
};

// Função para gerar todos os acordes possíveis sem repetir posições (nível difícil)
const generateAllChords = () => {
  if (currentDifficulty.value.value === 'easy') {
    return generateBasicChords();
  }

  if (currentDifficulty.value.value === 'medium') {
    return generateMediumChords();
  }

  const basicChords = generateBasicChords();
  const mediumOnlyChords = generateMediumOnlyChords();
  const hardOnlyChords = generateHardOnlyChords();

  // Combinar: básicos + médios + difíceis (acumulativo)
  const allChords = [...basicChords, ...mediumOnlyChords, ...hardOnlyChords];

  // Embaralhar o array final
  for (let i = allChords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allChords[i], allChords[j]] = [allChords[j], allChords[i]];
  }

  return allChords;
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

  // if (!isValid) {
  //   const chordNotes = currentGameChord.chord.map(n => n.name).join('-');
  //   const positions = currentGameChord.positions.join(', ');
  //   console.error(
  //     `Errou! Acorde na pauta: "${chordNotes}" (pos: [${positions}]px) | T\u00f4nica: "${tonicNote.name}" | Selecionado: "${selectedNote.name}"`,
  //   );
  // }

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

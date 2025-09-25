import { ref } from 'vue';
import { ClaveLabel, notas } from '@/common/AllPositionNotas.js';

export const useSequencyNotes = () => {
  // CLAVE
  const optionsClave = [
    { value: 'sol', text: 'Sol', url: 'sol' },
    { value: 'fa', text: 'Fá', url: 'fa' },
    { value: 'do', text: 'Dó', url: 'do' },
    { value: 'do-line-3', text: 'Dó3', url: 'do' },
  ];
  const typeClave = ref(optionsClave[0]);
  const toggleClave = () => {
    switch (typeClave.value.value) {
      case 'sol':
        typeClave.value = optionsClave[1];
        break;
      case 'do-line-3':
        typeClave.value = optionsClave[0];
        break;
      case 'fa':
        typeClave.value = optionsClave[2];
        break;
      case 'do':
        typeClave.value = optionsClave[3];
        break;
    }
  };

  // CIFRA
  const isCifra = ref(true);
  const toggleCifra = () => {
    isCifra.value = !isCifra.value;
  };

  // NÍVEIS DE DIFICULDADE
  const difficultyLevels = [
    { value: 'easy', text: 'Fácil', description: '7 acordes principais' },
    { value: 'medium', text: 'Médio', description: 'Acordes com inversões' },
    { value: 'hard', text: 'Difícil', description: 'Todos os acordes' },
  ];
  const currentDifficulty = ref(difficultyLevels[0]);
  const toggleDifficulty = () => {
    const currentIndex = difficultyLevels.findIndex(
      level => level.value === currentDifficulty.value.value,
    );
    const nextIndex = (currentIndex + 1) % difficultyLevels.length;
    currentDifficulty.value = difficultyLevels[nextIndex];
  };

  // Acordes comuns de 3 notas (tríades)
  const chordTypes = [
    {
      name: 'Maior',
      intervals: [0, 2, 4], // Tônica, terça maior, quinta justa
    },
    {
      name: 'Menor',
      intervals: [0, 2, 4], // Tônica, terça menor, quinta justa (será ajustado)
    },
    {
      name: 'Diminuto',
      intervals: [0, 2, 4], // Tônica, terça menor, quinta diminuta
    },
    {
      name: 'Aumentado',
      intervals: [0, 2, 4], // Tônica, terça maior, quinta aumentada
    },
  ];

  // Verificar se a nota selecionada é a primeira nota do acorde (posição mais alta)
  const validateTonicNote = (
    selectedNoteIndex: number,
    currentChord: number[],
  ): boolean => {
    console.log('selectedNoteIndex:', selectedNoteIndex);
    console.log('currentChord:', currentChord);

    // Verificar se há acorde atual
    if (currentChord.length === 0) return false;

    // A primeira posição no currentChord corresponde à nota tônica (mais alta)
    // selectedNoteIndex é o índice da nota selecionada no array 'notas' (0-6)
    // Precisamos encontrar qual nota corresponde à primeira posição do acorde

    // Obter a primeira posição (tônica) do acorde
    const tonicPosition = currentChord[0];

    // Verificar qual nota do array 'notas' tem essa posição
    const selectedNote = notas[selectedNoteIndex];
    if (!selectedNote) return false;

    // Verificar se alguma das posições da nota selecionada corresponde à posição tônica
    return selectedNote[ClaveLabel[typeClave.value.value]].includes(
      tonicPosition,
    );
  };

  return {
    toggleClave,
    typeClave,
    toggleCifra,
    isCifra,
    validateTonicNote,
    chordTypes,
    currentDifficulty,
    toggleDifficulty,
    difficultyLevels,
  };
};

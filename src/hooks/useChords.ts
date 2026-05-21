import { ref, computed } from 'vue';

const INTERVALS = [
  { steps: 1, name: '2ª' },
  { steps: 2, name: '3ª' },
  { steps: 3, name: '4ª' },
  { steps: 4, name: '5ª' },
];

export const useChords = () => {
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

  // INTERVAL
  const intervalFilter = ref<number | null>(null); // null = aleatório
  const intervalFilterLabel = computed(() =>
    intervalFilter.value === null
      ? 'Aleatório'
      : INTERVALS[intervalFilter.value].name,
  );
  const toggleIntervalFilter = () => {
    intervalFilter.value =
      intervalFilter.value === null
        ? 0
        : intervalFilter.value < INTERVALS.length - 1
          ? intervalFilter.value + 1
          : null;
    // Aplica imediatamente o filtro
    regenerateInterval();
  };
  const currentInterval = ref({
    ...INTERVALS[Math.floor(Math.random() * INTERVALS.length)],
  });
  const regenerateInterval = () => {
    const idx =
      intervalFilter.value !== null
        ? intervalFilter.value
        : Math.floor(Math.random() * INTERVALS.length);
    currentInterval.value = { ...INTERVALS[idx] };
  };

  return {
    toggleClave,
    typeClave,
    toggleCifra,
    isCifra,
    currentInterval,
    regenerateInterval,
    intervalFilterLabel,
    toggleIntervalFilter,
  };
};

import { ref } from 'vue';

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

  return {
    toggleClave,
    typeClave,
    toggleCifra,
    isCifra,
  };
};

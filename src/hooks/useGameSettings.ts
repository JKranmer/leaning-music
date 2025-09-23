import { ref } from 'vue';

export const useGameSettings = () => {
  const hasAnswer = ref(false);

  const toggleAnswer = (): void => {
    hasAnswer.value = !hasAnswer.value;
  };

  return {
    hasAnswer,
    toggleAnswer,
  };
};

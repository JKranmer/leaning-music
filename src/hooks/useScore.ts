import { ref } from 'vue';

interface Score {
  success: number;
  error: number;
}

export const useScore = () => {
  const score = ref<Score>({ success: 0, error: 0 });

  const updateScore = (isCorrect: boolean): void => {
    if (isCorrect) {
      score.value.success++;
    } else {
      score.value.error++;
    }
  };

  const resetScore = (): void => {
    score.value.success = 0;
    score.value.error = 0;
  };

  return {
    score,
    updateScore,
    resetScore,
  };
};

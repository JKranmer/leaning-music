import { Ref } from 'vue';

interface Score {
  success: number;
  error: number;
}

export declare const useScore: () => {
  score: Ref<Score>;
  updateScore: (isCorrect: boolean) => void;
  resetScore: () => void;
};

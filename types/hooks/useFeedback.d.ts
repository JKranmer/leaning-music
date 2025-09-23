import { Ref } from 'vue';

export declare const useFeedback: () => {
  classFeedback: Ref<string>;
  processFeedback: (isCorrect: boolean) => void;
};

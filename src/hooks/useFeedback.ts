import { ref } from 'vue';

export const useFeedback = () => {
  const classFeedback = ref('');

  const processFeedback = (isCorrect: boolean): void => {
    classFeedback.value = isCorrect ? 'bg-teal-950' : 'bg-rose-950';
    setTimeout(() => {
      classFeedback.value = '';
    }, 200);
  };

  return {
    classFeedback,
    processFeedback,
  };
};

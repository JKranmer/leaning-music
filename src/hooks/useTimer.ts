import { ref, computed } from 'vue';

const TIMER_INTERVAL = 10; // ms
const TIMER_INCREMENT = 0.01; // segundos

export const useTimer = () => {
  const time = ref(0.0);
  const myInterval = ref<NodeJS.Timeout | null>(null);

  const timeProcessed = (timeValue: number): string =>
    timeValue < 10 ? `0${timeValue}` : timeValue.toString();

  const timeFormatted = computed((): string => {
    const minutes = Math.floor((time.value % 3600) / 60);
    const seconds = Math.floor(time.value % 60);
    const milliseconds = Math.floor((time.value % 1) * 100);

    return `${timeProcessed(minutes)}:${timeProcessed(seconds)}:${timeProcessed(milliseconds)}`;
  });

  const startTimer = (): void => {
    time.value += TIMER_INCREMENT;
  };

  const stopTimer = (): void => {
    if (myInterval.value) {
      clearInterval(myInterval.value);
      myInterval.value = null;
    }
  };

  const resetTimer = (): void => {
    time.value = 0.0;
  };

  const initTimer = (): void => {
    myInterval.value = setInterval(startTimer, TIMER_INTERVAL);
  };

  return {
    time,
    timeFormatted,
    startTimer,
    stopTimer,
    resetTimer,
    initTimer,
  };
};

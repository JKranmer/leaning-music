import { Ref, ComputedRef } from 'vue';

export declare const useTimer: () => {
  time: Ref<number>;
  timeFormatted: ComputedRef<string>;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  initTimer: () => void;
};

import { Ref } from 'vue';

export declare const useAudio: () => {
  hasVolume: Ref<boolean>;
  toggleVolume: () => void;
  playNote: (noteName: string) => void;
};

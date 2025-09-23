import { ref } from 'vue';
import * as Tone from 'tone';

export const useAudio = () => {
  const hasVolume = ref(false);
  const synth = new Tone.Synth().toDestination();

  const toggleVolume = (): void => {
    hasVolume.value = !hasVolume.value;
  };

  const playNote = (noteName: string): void => {
    if (hasVolume.value && noteName) {
      synth.triggerAttackRelease(noteName, '4n');
    }
  };

  return {
    hasVolume,
    toggleVolume,
    playNote,
  };
};

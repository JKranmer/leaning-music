<template>
  <div
    class="flex justify-center items-center gap-4 flex-wrap"
    :class="{ 'pointer-events-none opacity-40': isStart }"
  >
    <p class="cursor-pointer m-0" @click="handleToggleClave">
      Clave de <badge>{{ typeClave.text }}</badge>
    </p>
    <p @click="handleToggleCifra" class="cursor-pointer m-0">
      Cifra:
      <badge>{{ isCifra ? 'sim' : 'não' }}</badge>
    </p>
    <p
      v-if="currentDifficulty"
      class="cursor-pointer m-0"
      @click="handleToggleDifficulty"
    >
      Dificuldade:
      <badge>{{ currentDifficulty.text }}</badge>
    </p>
    <p
      v-if="currentChordState"
      class="cursor-pointer m-0"
      @click="handleToggleChordState"
    >
      Estado:
      <badge>{{ currentChordState.text }}</badge>
    </p>
    <div
      v-if="!currentChordState"
      @click="handleToggleVolume"
      class="cursor-pointer p-4"
    >
      <svg-icon
        type="mdi"
        :path="hasVolume ? mdilVolumeHigh : mdilVolumeOff"
      ></svg-icon>
    </div>
    <p
      v-if="!currentChordState"
      class="cursor-pointer m-0"
      @click="handleToggleIntervalMode"
    >
      Modo: <badge>{{ isIntervalMode ? 'Intervalo' : 'Leitura' }}</badge>
    </p>
    <p
      v-if="isIntervalMode && intervalFilter !== undefined"
      class="cursor-pointer m-0"
      @click="handleToggleIntervalFilter"
    >
      Intervalo: <badge>{{ intervalFilter }}</badge>
    </p>
    <div @click="handleToggleAnswer" class="cursor-pointer p-4">
      <svg-icon type="mdi" :path="hasAnswer ? mdilEye : mdilEyeOff"></svg-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import Badge from '@/components/Badge.vue';
import SvgIcon from '@jamescoyle/vue-icon';
import {
  mdilVolumeHigh,
  mdilVolumeOff,
  mdilEye,
  mdilEyeOff,
} from '@mdi/light-js';

interface Props {
  typeClave: { text: string; value: string; url: string };
  isCifra: boolean;
  hasVolume: boolean;
  hasAnswer: boolean;
  isStart?: boolean;
  currentDifficulty?: { value: string; text: string; description: string };
  currentChordState?: { value: string; text: string; description: string };
  isIntervalMode?: boolean;
  intervalFilter?: string;
}

interface Emits {
  (e: 'toggle-clave'): void;
  (e: 'toggle-cifra'): void;
  (e: 'toggle-volume'): void;
  (e: 'toggle-answer'): void;
  (e: 'toggle-difficulty'): void;
  (e: 'toggle-chord-state'): void;
  (e: 'toggle-interval-mode'): void;
  (e: 'toggle-interval-filter'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleToggleClave = () => emit('toggle-clave');
const handleToggleCifra = () => emit('toggle-cifra');
const handleToggleVolume = () => emit('toggle-volume');
const handleToggleAnswer = () => emit('toggle-answer');
const handleToggleDifficulty = () => emit('toggle-difficulty');
const handleToggleChordState = () => emit('toggle-chord-state');
const handleToggleIntervalMode = () => emit('toggle-interval-mode');
const handleToggleIntervalFilter = () => emit('toggle-interval-filter');
</script>

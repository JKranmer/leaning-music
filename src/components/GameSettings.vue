<template>
  <div class="flex justify-center items-center gap-4 flex-wrap">
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
    <div @click="handleToggleVolume" class="cursor-pointer p-4">
      <svg-icon
        type="mdi"
        :path="hasVolume ? mdilVolumeHigh : mdilVolumeOff"
      ></svg-icon>
    </div>
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
  currentDifficulty?: { value: string; text: string; description: string };
}

interface Emits {
  (e: 'toggle-clave'): void;
  (e: 'toggle-cifra'): void;
  (e: 'toggle-volume'): void;
  (e: 'toggle-answer'): void;
  (e: 'toggle-difficulty'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleToggleClave = () => emit('toggle-clave');
const handleToggleCifra = () => emit('toggle-cifra');
const handleToggleVolume = () => emit('toggle-volume');
const handleToggleAnswer = () => emit('toggle-answer');
const handleToggleDifficulty = () => emit('toggle-difficulty');
</script>

<template>
  <div class="absolute left-2/4 top-0 -translate-x-2/4">
    <MusicalNote
      v-for="(position, index) in notePositions"
      :key="index"
      :position="position"
      :class="['chord-note', `note-${index}`, { active: isActive }]"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MusicalNote from './MusicalNote.vue';

interface Props {
  positions: number[];
  isActive?: boolean;
}

const props = defineProps<Props>();

// Converter as posições numéricas para objetos de estilo CSS
const notePositions = computed(() => {
  return props.positions.map(position => ({
    top: `${position}px`,
  }));
});
</script>

<style scoped>
.chord-note {
  position: absolute;
  transition: opacity 0.3s ease;
}

.note-0 {
  z-index: 3;
}

.note-1 {
  z-index: 2;
}

.note-2 {
  z-index: 1;
}

.active .chord-note {
  opacity: 1;
}

.chord-note:not(.active) {
  opacity: 0.8;
}
</style>

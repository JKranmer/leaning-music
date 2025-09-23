<template>
  <div
    class="flex justify-center flex-wrap items-center mt-5 gap-2 md:max-w-60"
  >
    <btn
      v-for="(nota, index) in notas"
      :key="index"
      :disabled="!isStart"
      @click="handleNoteClick(index)"
      class="w-auto"
    >
      {{ isCifra ? nota.cifra : nota.name }}
    </btn>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import Btn from '@/components/Btn.vue';
import { notas } from '@/common/AllPositionNotas';

interface Props {
  isStart: boolean;
  isCifra: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  noteSelected: [index: number];
}>();

const handleNoteClick = (index: number) => {
  emit('noteSelected', index);
};
</script>

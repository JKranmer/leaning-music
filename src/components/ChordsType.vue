<template>
  <div v-if="src === 'fa'" class="absolute bottom-[30px] w-[74px]">
    <img :src="claveFa" class="w-full" :alt="`Calve de ${src}`" />
  </div>
  <div
    v-if="src === 'do'"
    class="absolute left-[5px] w-[55px]"
    :class="classDo"
  >
    <img :src="claveDo" alt="1" />
  </div>
  <div v-if="src === 'sol'" class="absolute left-[-40px] top-[-24px] w-[142px]">
    <img :src="claveSol" alt="2" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { defineProps } from 'vue';
import claveFa from '@/assets/icons/clave-de-fa.svg';
import claveDo from '@/assets/icons/clave-de-do.svg';
import claveSol from '@/assets/icons/clave-de-sol.svg';

const props = defineProps({
  src: String,
  type: String,
});

const classDo = computed(() => {
  return props.type === 'do' ? 'top-[-25px]' : 'top-[1px]';
});
</script>

<style lang="scss" scoped>
img {
  filter: invert(100%);
}
</style>

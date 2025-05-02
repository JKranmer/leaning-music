<template>
  <button
    class="pt-2 pb-1 px-5 border-none rounded-md font-bold uppercase letter-spacing-[1px] cursor-pointer transition-opacity hover:bg-opacity-80 active:opacity-50 disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto inline-block align-middle"
    :class="
      props.background
        ? `${props.background} text-stone-200`
        : 'bg-stone-300 text-stone-900'
    "
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
const props = defineProps<{
  background?: string;
}>();
</script>

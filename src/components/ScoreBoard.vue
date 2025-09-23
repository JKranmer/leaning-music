<template>
  <div class="font-bold text-center">
    <h1 class="text-5xl my-8">{{ timeFormatted }}</h1>
    <ul
      class="sm:text-2xl sm:gap-12 list-none m-0 p-0 flex flex-wrap justify-center gap-4"
    >
      <li
        class="border-b-2 divide-solid border-stone-500 flex-grow w-full md:w-auto"
      >
        {{ score.success + score.error }} /
        {{ totalNotes }}
      </li>
      <li class="border-b-2 divide-solid border-green-800 flex-grow">
        Acertos: {{ score.success }}
      </li>
      <li class="border-b-2 divide-solid border-red-800 flex-grow">
        Erros: {{ score.error }}
        <span v-if="hasAnswer && isStart">- {{ currentNoteName }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Score {
  success: number;
  error: number;
}

interface Props {
  timeFormatted: string;
  score: Score;
  totalNotes: number;
  hasAnswer: boolean;
  isStart: boolean;
  currentNoteName?: string;
}

defineProps<Props>();
</script>

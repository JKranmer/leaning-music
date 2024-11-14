<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav
    class="absolute flex gap-2 left-0 right-0 text-center m-auto w-fit top-2"
  >
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/chords">Cifra</RouterLink>
  </nav>
  <main class="m-0 p-0">
    <RouterView />
  </main>
</template>

<style scoped></style>

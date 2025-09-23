<template>
  <div
    class="transition sm:flex sm:justify-center sm:items-center bg-primary-950 h-full min-h-screen"
  >
    <slot>
      <router-view />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

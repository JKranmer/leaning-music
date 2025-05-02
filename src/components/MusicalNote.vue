<template>
  <div
    class="absolute w-[30px] h-[25px] rounded-full bg-slate-50 left-2/4"
    :style="position"
  ></div>
</template>

<script lang="ts">
export default {
  props: {
    position: {
      type: Object,
      required: true,
    },
  },
  name: 'MusicalNote',
}

</script>

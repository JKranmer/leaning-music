<template>
  <div class="h-[100px] w-[250px] flex justify-between flex-col relative my-4">
    <div v-for="n in 5" :key="n" class="h-[2px] w-full bg-slate-50"></div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.out::after {
  content: '';
  position: absolute;
  height: 2px;
  width: 3rem;
  background: #fff;
  left: 46%;
}
.top::after {
  top: -24px;
}
.bottom::after {
  bottom: -24px;
}
.second_line::before {
  content: '';
  position: absolute;
  height: 2px;
  width: 3rem;
  background: #fff;
  left: 46%;
}
.top::before {
  top: -48px;
}
.bottom::before {
  bottom: -48px;
}
</style>

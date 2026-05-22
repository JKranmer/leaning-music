<template>
  <div class="h-[100px] w-[250px] flex justify-between flex-col relative my-4">
    <div v-for="n in 5" :key="n" class="h-[2px] w-full bg-slate-50"></div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
/* === Primeira linha suplementar via ::after === */
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

/* Quando ambos: ::after fica no topo, reseta o bottom */
.top.bottom::after {
  top: -24px;
  bottom: auto;
}

/* === Segunda linha / linha inferior (quando ambos) via ::before === */
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

/* Quando ambos: ::before vira a linha suplementar inferior
   Especificidade maior (.top.bottom = 2 classes) sobrescreve .top e .bottom */
.top.bottom::before {
  content: '';
  position: absolute;
  height: 2px;
  width: 3rem;
  background: #fff;
  left: 46%;
  top: auto;
  bottom: -24px;
}
</style>

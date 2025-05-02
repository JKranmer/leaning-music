<template>
  <div
    class="transition sm:flex sm:justify-center sm:items-center bg-primary-950 h-full"
    :class="classFeedback"
  >
    <div class="box-border my-0 mx-auto max-w-[40.625rem] p-8 w-full">
      <div>
        <div class="flex justify-center items-center gap-4">
          <p class="cursor-pointer m-0" @click="toggleClave">
            Clave de <badge>{{ type_clave.text }}</badge>
          </p>
          <p @click="toggleCifra" class="cursor-pointer m-0">
            Cifra:
            <badge>{{ isCifra ? 'sim' : 'não' }}</badge>
          </p>
          <p @click="toggleInterval" class="cursor-pointer m-0">
            myInterval: <badge>{{ type_interval }}</badge>
          </p>
        </div>
        <div class="font-bold text-center">
          <h1 class="text-5xl my-8">{{ timeFormated }}</h1>
          <ul
            class="sm:text-2xl sm:gap-12 list-none m-0 p-0 flex flex-wrap justify-center gap-4"
          >
            <li
              class="border-b-2 divide-solid border-stone-500 flex-grow w-full md:w-auto"
            >
              {{ score.success + score.error }} /
              {{ allPositionNotas.length }}
            </li>
            <li class="border-b-2 divide-solid border-green-800 flex-grow">
              Acertos: {{ score.success }}
            </li>
            <li class="border-b-2 divide-solid border-red-800 flex-grow">
              Erros: {{ score.error }} - {{ name }} - {{ typeof position_nota }}
            </li>
          </ul>
        </div>
      </div>
      <div
        class="flex flex-wrap w-full box-border justify-center gap-8 border-2 border-primary-900 rounded-lg pt-12 pb-4 pl-4 pr-4 sm:px-12 sm:py-8 bg-primary-900 my-12"
      >
        <div class="flex justify-center flex-col h-[9.375rem]">
          <Staff :class="classOutPauta">
            <MusicalNote v-show="isStart" :position="positionNota" />
            <ChordsType
              class="absolute"
              :class="type_clave.value"
              :src="type_clave.url"
              :type="type_clave.value"
            />
          </Staff>
        </div>
        <!-- btn group -->
        <div
          class="flex justify-center flex-wrap items-center mt-5 sm:max-w-[15.625rem] gap-2"
        >
          <btn
            v-for="(nota, index) in notas"
            :key="index"
            :disabled="!isStart"
            @click="choseNota(index)"
            class="w-auto"
          >
            {{ isCifra ? nota.cifra : nota.name }}
          </btn>
        </div>
      </div>
      <div class="flex">
        <btn
          @click="toggleStart"
          :babkground="isStart ? 'bg-rose-900' : 'bg-primary-500'"
        >
          {{ isStart ? 'Cancelar' : 'Iniciar' }}
        </btn>
      </div>
      <div v-show="mensage_end">
        <h1>Fim do jogo</h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MusicalNote from '@/components/MusicalNote.vue';
import ChordsType from '@/components/ChordsType.vue';
import Staff from '@/components/Staff.vue';
import Badge from '@/components/Badge.vue';
import Btn from '@/components/Btn.vue';
import {
  allPositionNotas,
  AllLabelPositionNotas,
  ClaveLabel,
} from '@/common/AllPositionNotas';

const isStart = ref(false);
const position_nota = ref(0);
const mensage_end = ref(false);
const position_notas = ref([] as [] | number[]);
const classFeedback = ref('');
const options_clave = [
  { value: 'sol', text: 'Sol', url: 'sol' },
  { value: 'fa', text: 'Fá', url: 'fa' },
  { value: 'do', text: 'Dó', url: 'do' },
  { value: 'do-line-3', text: 'Dó3', url: 'do' },
];
const type_clave = ref(options_clave[0]);
const isCifra = ref(true);
const score = ref({ success: 0, error: 0 });

const time = ref(0.0);

const startTimer = () => {
  time.value += 0.01;
};

const timeProcessed = (time: number) => (time < 10 ? `0${time}` : time);

const timeFormated = computed(() => {
  const minutes = Math.floor((time.value % 3600) / 60);
  const seconds = Math.floor(time.value % 60);
  const miliseconds = Math.floor((time.value % 1) * 100);
  return `${timeProcessed(minutes)}:${timeProcessed(seconds)}:${timeProcessed(miliseconds)}`;
});

const myInterval = ref(null as any);
const stopTimer = () => clearInterval(myInterval.value as any);

const toggleStart = () => {
  isStart.value = !isStart.value;
  position_notas.value = [...allPositionNotas];
  mensage_end.value = false;
  position_nota.value = randomPosition();
  if (isStart.value) {
    time.value = 0.0;
    myInterval.value = setInterval(startTimer, 10);
  } else {
    stopTimer();
    score.value.success = 0;
    score.value.error = 0;
  }
};

const toggleCifra = () => {
  isCifra.value = !isCifra.value;
};

const toggleClave = () => {
  switch (type_clave.value.value) {
    case 'sol':
      type_clave.value = options_clave[1];
      break;
    case 'do-line-3':
      type_clave.value = options_clave[0];
      break;
    case 'fa':
      type_clave.value = options_clave[2];
      break;
    case 'do':
      type_clave.value = options_clave[3];
      break;
  }
};

const classOutPauta = computed(() => {
  let res = '';
  if (position_notas.value[position_nota.value] < -23) {
    res = 'out top';
    if (position_notas.value[position_nota.value] < -47)
      res = res + ' second_line';
  } else if (position_notas.value[position_nota.value] > 108)
    res = 'out bottom';
  if (position_notas.value[position_nota.value] > 122)
    res = res + ' second_line';
  return res;
});

const choseNota = (i: number) => {
  if (mensage_end.value) return;
  const response = typeValidation(i);
  console.log('response', response);
  feedBack(response);
  if (response) {
    setScore(response);
    next();
  }
};

const setScore = (status: boolean) => {
  if (status) score.value.success++;
  else score.value.error++;
};

const next = () => {
  if (position_notas.value.length === 1) {
    stopTimer();
    return (mensage_end.value = true);
  }
  position_notas.value.splice(position_nota.value, 1);
  position_nota.value = randomPosition();
};

const type_interval = ref(0);
const options_interval = [
  { value: 0, text: '0' },
  { value: 1, text: '1' },
];

const toggleInterval = () => {
  type_interval.value++;
  if (type_interval.value === options_interval.length) type_interval.value = 0;
};

const typeValidation = (i: number) => {
  if (type_interval.value === 0) return validateClave(i);
  return validateInterval(i);
};

const validateInterval = (i: number) => {
  console.log(position_notas.value[position_nota.value]);
  const index = Object.values(allPositionNotas).indexOf(
    position_notas.value[position_nota.value],
  );
  console.log(allPositionNotas[index - 1]);
  // Obtém a nota anterior usando position_nota como referência
  const proximaNota =
    allPositionNotas[index - 1] === undefined
      ? allPositionNotas[allPositionNotas.length - 1]
      : allPositionNotas[index - 1];

  const possivelNota = notas[i][ClaveLabel[type_clave.value.value]];
  if (!possivelNota) {
    console.error('Nota inválida:', notas[i]);
    return false;
  }

  const res = possivelNota.includes(proximaNota);

  console.log('proximaNota:', proximaNota);
  console.log('possivelNota:', possivelNota);
  console.log('position atual:', index);
  console.log(allPositionNotas);

  return res;
};

const validateClave = (i: number) => {
  if (
    type_clave.value.value === 'sol' &&
    notas[i].position_sol.includes(position_notas.value[position_nota.value])
  )
    return true;
  else if (
    type_clave.value.value === 'fa' &&
    notas[i].position_fa.includes(position_notas.value[position_nota.value])
  )
    return true;
  else if (
    type_clave.value.value === 'do' &&
    notas[i].position_do.includes(position_notas.value[position_nota.value])
  )
    return true;
  else if (
    type_clave.value.value === 'do-line-3' &&
    notas[i].position_do_3.includes(position_notas.value[position_nota.value])
  )
    return true;
  return false;
};

const feedBack = (status: boolean) => {
  classFeedback.value = status ? 'bg-teal-950' : 'bg-rose-950';
  setTimeout(() => {
    classFeedback.value = '';
  }, 200);
};

const randomPosition = () => {
  return Math.floor(Math.random() * position_notas.value.length);
};

const notas = [
  {
    name: 'Do',
    cifra: 'C',
    position_sol: [25, 109, -60],
    position_fa: [-35, 49, 134],
    position_do: [98, 12, -72],
    position_do_3: [-47, 37, 122],
  },
  {
    name: 'Re',
    cifra: 'D',
    position_sol: [98, 12, -72],
    position_fa: [-47, 37, 122],
    position_do: [0, 86],
    position_do_3: [25, 109, -60],
  },
  {
    name: 'Mi',
    cifra: 'E',
    position_sol: [0, 86],
    position_fa: [25, 109, -60],
    position_do: [74, -12],
    position_do_3: [98, 12, -72],
  },
  {
    name: 'Fa',
    cifra: 'F',
    position_sol: [74, -12],
    position_fa: [98, 12, -72],
    position_do: [61, -23, 146],
    position_do_3: [0, 86],
  },
  {
    name: 'Sol',
    cifra: 'G',
    position_sol: [61, -23, 146],
    position_fa: [0, 86],
    position_do: [-35, 49, 134],
    position_do_3: [74, -12],
  },
  {
    name: 'La',
    cifra: 'A',
    position_sol: [-35, 49, 134],
    position_fa: [74, -12],
    position_do: [-47, 37, 122],
    position_do_3: [61, -23, 146],
  },
  {
    name: 'Si',
    cifra: 'B',
    position_sol: [-47, 37, 122],
    position_fa: [61, -23, 146],
    position_do: [25, 109, -60],
    position_do_3: [-35, 49, 134],
  },
];

const body = document.querySelector('body') as any;
body.addEventListener('keyup', (e: any) => {
  notas.forEach((nota, index) => {
    if (nota.cifra === e.key.toUpperCase()) {
      choseNota(index);
    }
  });
});

const positionNota = computed(() => {
  return { top: position_notas.value[position_nota.value] + 'px' };
});

const name = computed(() => {
  return AllLabelPositionNotas[position_notas.value[position_nota.value]];
});
</script>

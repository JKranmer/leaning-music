<template>
  <div
    class="transition sm:flex sm:justify-center sm:items-center bg-primary-950 h-full min-h-screen"
    :class="classFeedback"
  >
    <div class="box-border my-0 mx-auto max-w-[40.625rem] p-8 w-full">
      <div>
        <div class="flex justify-center items-center gap-4 flex-wrap">
          <p class="cursor-pointer m-0" @click="toggleClave">
            Clave de <badge>{{ type_clave.text }}</badge>
          </p>
          <p @click="toggleCifra" class="cursor-pointer m-0">
            Cifra:
            <badge>{{ isCifra ? 'sim' : 'não' }}</badge>
          </p>
          <div @click="toggleVolume" class="cursor-pointer p-4">
            <svg-icon
              type="mdi"
              :path="hasVolume ? mdilVolumeHigh : mdilVolumeOff"
            ></svg-icon>
          </div>
          <div @click="toggleAnswer" class="cursor-pointer p-4">
            <svg-icon
              type="mdi"
              :path="hasAnswer ? mdilEye : mdilEyeOff"
            ></svg-icon>
          </div>

          <!-- <p @click="toggleInterval" class="cursor-pointer m-0">
            myInterval: <badge>{{ type_interval }}</badge>
          </p> -->
        </div>
        <div class="font-bold text-center">
          <h1 class="text-5xl my-8">{{ timeFormatted }}</h1>
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
              Erros: {{ score.error }}
              <span v-if="hasAnswer && isStart">- {{ name }}</span>
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
          class="flex justify-center flex-wrap items-center mt-5 gap-2 md:max-w-60"
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
      <div class="flex gap-4">
        <btn
          @click="toggleStart"
          class="w-full sm:w-auto"
          :background="isStart ? 'bg-rose-900' : 'bg-primary-500'"
        >
          {{ isStart ? 'Cancelar' : 'Iniciar' }}
        </btn>
        <btn
          @click="repeatSynth"
          v-if="hasVolume && name && isStart"
          class="pt-0 pb-0"
        >
          <svg-icon type="mdi" :path="mdilPlay"></svg-icon>
        </btn>
      </div>
      <div v-show="message_end">
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
  AllLabelPositionNotasFa,
  AllLabelPositionNotasDo,
  AllLabelPositionNotasDo3,
} from '@/common/AllPositionNotas';
import * as Tone from 'tone';
import SvgIcon from '@jamescoyle/vue-icon';
import {
  mdilVolumeHigh,
  mdilVolumeOff,
  mdilPlay,
  mdilEye,
  mdilEyeOff,
} from '@mdi/light-js';

const synth = new Tone.Synth().toDestination();
const isStart = ref(false);
const position_nota = ref(0);
const message_end = ref(false);
const position_notas = ref([] as [] | number[]);
const classFeedback = ref('');
const hasVolume = ref(false);
const hasAnswer = ref(false);
const toggleAnswer = () => (hasAnswer.value = !hasAnswer.value);
const toggleVolume = () => (hasVolume.value = !hasVolume.value);
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

const timeFormatted = computed(() => {
  const minutes = Math.floor((time.value % 3600) / 60);
  const seconds = Math.floor(time.value % 60);
  const miliSeconds = Math.floor((time.value % 1) * 100);
  return `${timeProcessed(minutes)}:${timeProcessed(seconds)}:${timeProcessed(miliSeconds)}`;
});

const myInterval = ref(null as NodeJS.Timeout);
const stopTimer = () => clearInterval(myInterval.value as NodeJS.Timeout);

const toggleStart = () => {
  isStart.value = !isStart.value;
  position_notas.value = [...allPositionNotas];
  message_end.value = false;
  position_nota.value = randomPosition();
  if (hasVolume.value) synth.triggerAttackRelease(name.value, '4n');

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

const repeatSynth = () => {
  if (hasVolume.value) synth.triggerAttackRelease(name.value, '4n');
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
  if (message_end.value) return;
  const response = typeValidation(i);
  feedBack(response);
  setScore(response);
  next();
};

const setScore = (status: boolean) => {
  if (status) score.value.success++;
  else score.value.error++;
};

const next = () => {
  if (position_notas.value.length === 1) {
    stopTimer();
    return (message_end.value = true);
  }
  position_notas.value.splice(position_nota.value, 1);
  position_nota.value = randomPosition();
  if (hasVolume.value) synth.triggerAttackRelease(name.value, '4n');
};

const type_interval = ref(0);

// const options_interval = [
//   { value: 0, text: '0' },
//   { value: 1, text: '1' },
// ];

// const toggleInterval = () => {
//   type_interval.value++;
//   if (type_interval.value === options_interval.length) type_interval.value = 0;
// };

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

  const possibleNote = notas[i][ClaveLabel[type_clave.value.value]];
  if (!possibleNote) {
    console.error('Nota inválida:', notas[i]);
    return false;
  }

  const res = possibleNote.includes(proximaNota);

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
    sol_cifra: ['C4', 'C3', 'C5'],
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

const body = document.querySelector('body') as HTMLBodyElement;
body.addEventListener('keyup', (e: { key: string }) => {
  console.log(e);
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
  const position = position_notas.value[position_nota.value];
  switch (type_clave.value.value) {
    case 'sol':
      return AllLabelPositionNotas[position];
    case 'fa':
      return AllLabelPositionNotasFa[position];
    case 'do':
      return AllLabelPositionNotasDo[position];
    case 'do-line-3':
      return AllLabelPositionNotasDo3[position];
  }
  return 'Erro';
});
</script>

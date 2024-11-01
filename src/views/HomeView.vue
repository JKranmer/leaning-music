<template>
  <main class="m-0 p-0">
    <div
      class="transition sm:flex sm:justify-center sm:items-center"
      :class="classFeedback"
    >
      <div class="box-border my-0 mx-auto max-w-[650px] p-8 w-full">
        <div>
          <div class="flex justify-center items-center gap-4">
            <p class="pointer m-0" @click="toggleClave">
              Clave de <span class="badge--success">{{ type_clave.text }}</span>
            </p>
            <p @click="toggleCifra" class="pointer m-0">
              Cifra:
              <span class="badge--success">{{ isCifra ? 'sim' : 'não' }}</span>
            </p>
          </div>
          <div class="font-bold text-center">
            <h1 class="text-5xl">{{ timeFormated }}</h1>
            <ul
              class="sm:text-2xl sm:gap-12 list-none m-0 p-0 flex flex-wrap justify-center gap-x-4"
            >
              <li class="border-b-2 divide-solid border-stone-500">
                {{ score.success + score.error }} /
                {{ all_position_notas.length }}
              </li>
              <li class="score__points--success">
                Acertos: {{ score.success }}
              </li>
              <li class="score__points--error">Erros: {{ score.error }}</li>
            </ul>
          </div>
        </div>
        <div
          class="flex flex-wrap w-full box-border justify-center gap-8 border-2 border-stone-700 rounded-lg pt-12 pb-4 pl-4 pr-4 sm:px-12 sm:py-8 bg-stone-700"
        >
          <div class="flex justify-center flex-col h-[150px]">
            <!-- pentagrama -->
            <div
              class="h-[100px] w-[250px] flex justify-between flex-col relative mx-4"
              :class="classOutPauta"
            >
              <div v-for="n in 5" class="h-[2px] w-full bg-slate-50"></div>
              <!-- nota -->
              <div
                v-show="isStart"
                class="absolute w-[30px] h-[25px] rounded-full bg-slate-50 left-2/4"
                :style="{ top: position_notas[position_nota] + 'px' }"
              ></div>
              <!-- clave -->
              <div class="absolute" :class="type_clave.value">
                <img
                  :src="`./img/clave-de-${type_clave.url}.svg`"
                  :alt="`Clave de ${type_clave}`"
                />
              </div>
            </div>
          </div>
          <!-- btn group -->
          <div
            class="flex justify-center flex-wrap items-center mt-5 sm:max-w-[250px] gap-2"
          >
            <button
              v-for="(nota, index) in notas"
              :key="index"
              :disabled="!isStart"
              @click="choseNota(index)"
              class="py-2 px-5 bg-stone-400 text-slate-950 border-none rounded-md font-bold uppercase letter-spacing-[1px] cursor-pointer transition-opacity hover:bg-opacity-80 active:opacity-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {{ isCifra ? nota.cifra : nota.name }}
            </button>
          </div>
        </div>
        <div class="flex">
          <button
            @click="toggleStart"
            class="py-2 px-5 bg-stone-400 border-none rounded-md font-bold uppercase letter-spacing-[1px] cursor-pointer transition-opacity hover:bg-opacity-80 active:opacity-50 disabled:opacity-40 disabled:cursor-not-allowed w-full text-slate-50 sm:w-auto"
            :class="isStart ? 'bg-red-500' : 'bg-green-700'"
          >
            {{ isStart ? 'Cancelar' : 'Iniciar' }}
          </button>
        </div>
        <div v-show="mensage_end">
          <h1>Fim do jogo</h1>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const isStart = ref(false)
const position_nota = ref(0)
const mensage_end = ref(false)
const position_notas = ref([] as [] | number[])
const classFeedback = ref('')
const options = [
  { value: 'sol', text: 'Sol', url: 'sol' },
  { value: 'fa', text: 'Fá', url: 'fa' },
  { value: 'do', text: 'Dó', url: 'do' },
  { value: 'do-line-3', text: 'Dó3', url: 'do' },
]
const type_clave = ref(options[0])
const isCifra = ref(true)
const score = ref({ success: 0, error: 0 })

const time = ref(0.0)

const startTimer = () => {
  time.value += 0.01
}

const timeProcessed = (time: number) => (time < 10 ? `0${time}` : time)

const timeFormated = computed(() => {
  const minutes = Math.floor((time.value % 3600) / 60)
  const seconds = Math.floor(time.value % 60)
  const miliseconds = Math.floor((time.value % 1) * 100)
  return `${timeProcessed(minutes)}:${timeProcessed(seconds)}:${timeProcessed(miliseconds)}`
})

const myInterval = ref(null as any)
const stopTimer = () => clearInterval(myInterval.value as any)

const all_position_notas = [
  -72, -60, -47, -35, -23, -12, 0, 12, 25, 37, 49, 61, 74, 86, 98, 109, 122,
  134, 146,
]

const toggleStart = () => {
  isStart.value = !isStart.value
  position_notas.value = [...all_position_notas]
  mensage_end.value = false
  position_nota.value = randomPosition()
  if (isStart.value) {
    time.value = 0.0
    myInterval.value = setInterval(startTimer, 10)
  } else {
    stopTimer()
    score.value.success = 0
    score.value.error = 0
  }
}

const toggleCifra = () => {
  isCifra.value = !isCifra.value
}

const toggleClave = () => {
  switch (type_clave.value.value) {
    case 'sol':
      type_clave.value = options[1]
      break
    case 'do-line-3':
      type_clave.value = options[0]
      break
    case 'fa':
      type_clave.value = options[2]
      break
    case 'do':
      type_clave.value = options[3]
      break
  }
}

const classOutPauta = computed(() => {
  let res = ''
  if (position_notas.value[position_nota.value] < -23) {
    res = 'out top'
    if (position_notas.value[position_nota.value] < -47)
      res = res + ' second_line'
  } else if (position_notas.value[position_nota.value] > 108) res = 'out bottom'
  if (position_notas.value[position_nota.value] > 122)
    res = res + ' second_line'
  return res
})

const choseNota = (i: number) => {
  if (mensage_end.value) return
  const response = validate(i)
  feedBack(response)
  setScore(response)
  next()
}

const setScore = (status: boolean) => {
  if (status) score.value.success++
  else score.value.error++
}

const next = () => {
  if (position_notas.value.length === 1) {
    stopTimer()
    return (mensage_end.value = true)
  }
  position_notas.value.splice(position_nota.value, 1)
  position_nota.value = randomPosition()
}

const validate = (i: number) => {
  if (
    type_clave.value.value === 'sol' &&
    notas[i].position_sol.includes(position_notas.value[position_nota.value])
  )
    return true
  else if (
    type_clave.value.value === 'fa' &&
    notas[i].position_fa.includes(position_notas.value[position_nota.value])
  )
    return true
  else if (
    type_clave.value.value === 'do' &&
    notas[i].position_do.includes(position_notas.value[position_nota.value])
  )
    return true
  else if (
    type_clave.value.value === 'do-line-3' &&
    notas[i].position_do_3.includes(position_notas.value[position_nota.value])
  )
    return true
  return false
}

const feedBack = (status: boolean) => {
  classFeedback.value = status ? 'bg-green-50' : 'bg-red-50'
  setTimeout(() => {
    classFeedback.value = ''
  }, 200)
}

const randomPosition = () => {
  return Math.floor(Math.random() * position_notas.value.length)
}

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
]

const body = document.querySelector('body') as any
body.addEventListener('keyup', (e: any) => {
  notas.forEach((nota, index) => {
    if (nota.cifra === e.key.toUpperCase()) {
      choseNota(index)
    }
  })
})
</script>

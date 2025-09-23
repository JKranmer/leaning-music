# Componente GameSettings

O componente `GameSettings` foi criado para centralizar as configurações do jogo musical, tornando-o reutilizável em diferentes telas.

## Props

- `typeClave`: Objeto contendo informações sobre o tipo de clave (text, value, url)
- `isCifra`: Boolean que indica se a cifra está ativa
- `hasVolume`: Boolean que indica se o volume está ativo
- `hasAnswer`: Boolean que indica se as respostas estão sendo mostradas

## Eventos

- `@toggle-clave`: Emitido quando o usuário clica para alterar a clave
- `@toggle-cifra`: Emitido quando o usuário clica para alternar a cifra
- `@toggle-volume`: Emitido quando o usuário clica para alternar o volume
- `@toggle-answer`: Emitido quando o usuário clica para alternar a visualização das respostas

## Exemplo de uso

```vue
<template>
  <div>
    <GameSettings
      :type-clave="typeClave"
      :is-cifra="isCifra"
      :has-volume="hasVolume"
      :has-answer="hasAnswer"
      @toggle-clave="handleToggleClave"
      @toggle-cifra="handleToggleCifra"
      @toggle-volume="handleToggleVolume"
      @toggle-answer="handleToggleAnswer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GameSettings from '@/components/GameSettings.vue';

// Estados das configurações
const typeClave = ref({ text: 'Sol', value: 'sol', url: '/path/to/icon' });
const isCifra = ref(false);
const hasVolume = ref(false);
const hasAnswer = ref(false);

// Handlers dos eventos
const handleToggleClave = () => {
  // Lógica para alternar clave
};

const handleToggleCifra = () => {
  isCifra.value = !isCifra.value;
};

const handleToggleVolume = () => {
  hasVolume.value = !hasVolume.value;
};

const handleToggleAnswer = () => {
  hasAnswer.value = !hasAnswer.value;
};
</script>
```

## Benefícios da componentização

1. **Reutilização**: Pode ser usado em múltiplas telas
2. **Manutenibilidade**: Mudanças nas configurações ficam centralizadas
3. **Consistência**: Interface uniforme em toda a aplicação
4. **Testabilidade**: Componente isolado e mais fácil de testar

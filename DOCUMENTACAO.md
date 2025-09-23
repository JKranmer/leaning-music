# Harmony - Aplicação de Aprendizado Musical

## 📋 Visão Geral

**Harmony** é uma aplicação web interativa desenvolvida em Vue 3 para o aprendizado de teoria musical. O projeto foca no reconhecimento de notas musicais em diferentes claves e oferece exercícios práticos para desenvolvimento da leitura musical.

### 🎯 Funcionalidades Principais

- **Reconhecimento de Notas**: Exercícios para identificar notas musicais em pauta
- **Múltiplas Claves**: Suporte às claves de Sol, Fá, Dó e Dó na 3ª linha
- **Sistema de Pontuação**: Controle de acertos e erros em tempo real
- **Áudio Interativo**: Reprodução das notas usando Tone.js
- **Interface Responsiva**: Design adaptável para desktop e mobile
- **Controles Personalizáveis**: Opções de volume, visualização e tipo de notação

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Vue 3** - Framework JavaScript reativo
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e servidor de desenvolvimento
- **Vue Router** - Roteamento para Single Page Application
- **Pinia** - Gerenciamento de estado

### Estilização
- **Tailwind CSS** - Framework CSS utilitário
- **Sass** - Pré-processador CSS
- **PostCSS** - Transformações CSS

### Áudio
- **Tone.js** - Biblioteca para síntese e reprodução de áudio

### Ícones e UI
- **@jamescoyle/vue-icon** - Componente de ícones para Vue
- **@mdi/light-js** - Ícones Material Design Light

### Desenvolvimento
- **ESLint** - Linting de código JavaScript/TypeScript
- **Prettier** - Formatação automática de código
- **Vitest** - Framework de testes unitários

### PWA e Deploy
- **vite-plugin-pwa** - Plugin para Progressive Web App
- **gh-pages** - Deploy automatizado no GitHub Pages

## 📁 Estrutura do Projeto

```
src/
├── assets/           # Recursos estáticos (CSS, imagens, ícones)
│   ├── icons/        # Ícones SVG das claves musicais
│   └── *.css         # Arquivos de estilo
├── common/           # Lógica compartilhada e constantes
│   └── AllPositionNotas.ts  # Definições de posições das notas
├── components/       # Componentes Vue reutilizáveis
│   ├── Badge.vue     # Componente de badge
│   ├── Btn.vue       # Componente de botão
│   ├── Card.vue      # Componente de card
│   ├── ChordsType.vue # Exibição de claves musicais
│   ├── MusicalNote.vue # Representação visual da nota
│   ├── Staff.vue     # Pauta musical (5 linhas)
│   └── __tests__/    # Testes dos componentes
├── hooks/            # Composables Vue
│   └── useChords.ts  # Lógica para manipulação de claves
├── router/           # Configuração de rotas
│   └── index.ts      # Definição das rotas da aplicação
├── stores/           # Stores do Pinia
│   └── counter.ts    # Store de exemplo
├── views/            # Páginas/Views da aplicação
│   ├── AboutView.vue      # Página sobre
│   ├── ChordsView.vue     # Exercício de reconhecimento de notas
│   ├── HomeView.vue       # Página inicial
│   ├── SequencyNotesView.vue # Exercício de sequência de notas
│   └── base/              # Layout base
│       └── basePage.vue   # Template base das páginas
└── App.vue          # Componente raiz
```

## 🎵 Funcionalidades Detalhadas

### 1. Sistema de Claves Musicais

O projeto suporta quatro tipos de claves:

- **Clave de Sol**: Posicionamento padrão para instrumentos agudos
- **Clave de Fá**: Posicionamento para instrumentos graves
- **Clave de Dó**: Posicionamento na 4ª linha
- **Clave de Dó na 3ª linha**: Variação da clave de Dó

### 2. Mapeamento de Posições

Cada nota possui posições específicas em pixels para cada clave, definidas em `AllPositionNotas.ts`:

```typescript
export enum AllLabelPositionNotas {
  G3 = 146,  // Sol 3
  A3 = 134,  // Lá 3
  B3 = 122,  // Si 3
  // ... outras notas
}
```

### 3. Sistema de Exercícios

#### Exercício "Encontre a Nota" (`ChordsView.vue`)
- Exibe uma nota aleatória na pauta
- O usuário deve identificar a nota correta
- Sistema de pontuação com acertos e erros
- Timer para medir performance
- Suporte a teclado (teclas C, D, E, F, G, A, B)

### 4. Controles Interativos

- **Volume**: Liga/desliga reprodução de áudio
- **Resposta**: Mostra/esconde o nome da nota
- **Cifra**: Alterna entre notação tradicional (Dó, Ré, Mi...) e cifras (C, D, E...)
- **Clave**: Alterna entre os diferentes tipos de clave

### 5. Feedback Visual

- **Cores de Feedback**: Verde para acertos, vermelho para erros
- **Animações**: Transições suaves entre estados
- **Responsividade**: Interface adaptável a diferentes tamanhos de tela

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento
pnpm build           # Build para produção
pnpm preview         # Preview do build de produção

# Qualidade de Código
pnpm lint            # Executa ESLint com correção automática
pnpm format          # Formata código com Prettier
pnpm type-check      # Verificação de tipos TypeScript

# Testes
pnpm test:unit       # Executa testes unitários

# Deploy
pnpm deploy          # Deploy para GitHub Pages
```

## ⚙️ Configuração do Projeto

### Dependências Principais

```json
{
  "vue": "^3.5.12",           # Framework principal
  "vue-router": "^4.4.5",     # Roteamento
  "pinia": "^2.2.4",          # Gerenciamento de estado
  "tone": "^15.1.22",         # Síntese de áudio
  "tailwindcss": "^3.4.14"    # Framework CSS
}
```

### Configurações

- **Vite**: Configurado em `vite.config.ts`
- **TypeScript**: Configurado em `tsconfig.json`
- **Tailwind**: Configurado em `tailwind.config.js`
- **ESLint**: Configurado em `eslint.config.js`

## 📱 Progressive Web App (PWA)

O projeto está configurado como PWA com:

- **Manifest**: Configurado em `manifest.json`
- **Ícones**: Disponíveis em `public/`
- **Service Worker**: Gerado automaticamente pelo Vite PWA Plugin
- **Instalação**: Pode ser instalado como app nativo

### Características PWA

- **Nome**: Harmony
- **Idioma**: Português (pt-BR)
- **Tema**: Verde (#d0ab85)
- **Orientação**: Qualquer
- **Display**: Standalone

## 🎨 Design e Estilização

### Paleta de Cores (Tailwind)

- **Primary**: Tons de verde/azul escuro (primary-500, primary-900, primary-950)
- **Feedback**: Verde (teal-950) para acertos, vermelho (rose-950) para erros
- **Texto**: Branco (slate-50) para contraste

### Componentes de UI

1. **Badge**: Exibição de informações em destaque
2. **Btn**: Botões personalizáveis com diferentes backgrounds
3. **Card**: Container para conteúdo
4. **Staff**: Pauta musical com 5 linhas
5. **MusicalNote**: Representação visual de notas musicais

## 🔧 Arquitetura e Padrões

### Composables (hooks/)

- **useChords**: Gerencia estado e lógica das claves musicais
- Implementa padrão de composição do Vue 3
- Reutilizável entre componentes

### Estrutura de Dados

```typescript
// Estrutura de uma nota
{
  name: 'Do',           // Nome em português
  cifra: 'C',          // Cifra americana
  position_sol: [...], // Posições na clave de Sol
  position_fa: [...],  // Posições na clave de Fá
  position_do: [...],  // Posições na clave de Dó
  position_do_3: [...] // Posições na clave de Dó 3ª linha
}
```

## 🎯 Funcionalidades Futuras

Com base na análise do código, algumas funcionalidades estão em desenvolvimento:

1. **Exercício de Acordes** (`SequencyNotesView.vue`)
2. **Sistema de Intervalos** (código comentado em `ChordsView.vue`)
3. **Múltiplas notas simultâneas**
4. **Progressões harmônicas**

## 📊 Métricas e Analytics

O projeto inclui:

- **Timer**: Medição de tempo de exercício
- **Pontuação**: Contagem de acertos e erros
- **Progresso**: Visualização do progresso através das notas

## 🚀 Deploy e Produção

### GitHub Pages

O projeto está configurado para deploy automático no GitHub Pages:

- **Repositório**: `leaning-music`
- **Branch**: `develop`
- **URL Base**: `/leaning-music/`
- **Comando**: `pnpm deploy`

### Build

O processo de build:

1. Verificação de tipos TypeScript
2. Build do Vite
3. Cópia do `index.html` como `404.html` (para SPAs)
4. Deploy no GitHub Pages

## 🤝 Desenvolvimento

### Padrões de Código

- **TypeScript**: Tipagem estrita habilitada
- **Vue 3 Composition API**: Padrão principal para componentes
- **ESLint + Prettier**: Formatação e linting automáticos
- **Conventional Commits**: Recomendado para commits

### Estrutura de Testes

- **Framework**: Vitest
- **Ambiente**: jsdom
- **Cobertura**: Componentes em `__tests__/`

---

## 📝 Licença

Este projeto é privado e destinado ao aprendizado musical interativo.

---

**Developed with ❤️ for music education**

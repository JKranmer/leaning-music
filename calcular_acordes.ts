const notas = [
  {
    name: 'Do',
    position_sol: [25, 109, -60],
    position_fa: [-35, 49, 134],
    position_do: [98, 12, -72],
    position_do_3: [-47, 37, 122],
  },
  {
    name: 'Re',
    position_sol: [98, 12, -72],
    position_fa: [-47, 37, 122],
    position_do: [0, 86],
    position_do_3: [25, 109, -60],
  },
  {
    name: 'Mi',
    position_sol: [0, 86],
    position_fa: [25, 109, -60],
    position_do: [74, -12],
    position_do_3: [98, 12, -72],
  },
  {
    name: 'Fa',
    position_sol: [74, -12],
    position_fa: [98, 12, -72],
    position_do: [61, -23, 146],
    position_do_3: [0, 86],
  },
  {
    name: 'Sol',
    position_sol: [61, -23, 146],
    position_fa: [0, 86],
    position_do: [-35, 49, 134],
    position_do_3: [74, -12],
  },
  {
    name: 'La',
    position_sol: [-35, 49, 134],
    position_fa: [74, -12],
    position_do: [-47, 37, 122],
    position_do_3: [61, -23, 146],
  },
  {
    name: 'Si',
    position_sol: [-47, 37, 122],
    position_fa: [61, -23, 146],
    position_do: [25, 109, -60],
    position_do_3: [-35, 49, 134],
  },
];

// 7 acordes básicos: I - III - V
const basicChordPatterns = [
  [0, 2, 4], // Do-Mi-Sol
  [1, 3, 5], // Re-Fá-Lá
  [2, 4, 6], // Mi-Sol-Si
  [3, 5, 0], // Fá-Lá-Do
  [4, 6, 1], // Sol-Si-Ré
  [5, 0, 2], // Lá-Dó-Mi
  [6, 1, 3], // Si-Ré-Fá
];

const claves = [
  'position_sol',
  'position_fa',
  'position_do',
  'position_do_3',
] as const;

// Contar acordes por clave
console.log('╔════════════════════════════════════════════════════════╗');
console.log('║         ANÁLISE DE ACORDES MAPEADOS                    ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

const acordesPorClave: Record<string, number> = {};
let totalAcordes = 0;

for (const clave of claves) {
  let contagem = 0;

  console.log(`📍 Clave: ${clave}`);
  console.log('   ─────────────────────────────────────────');

  for (const pattern of basicChordPatterns) {
    const [tonicaIdx, tercaIdx, quintaIdx] = pattern;
    const tonica = notas[tonicaIdx];
    const terca = notas[tercaIdx];
    const quinta = notas[quintaIdx];

    const tonicaPos =
      (tonica[clave as keyof typeof tonica] as number[])?.length || 0;
    const tercaPos =
      (terca[clave as keyof typeof terca] as number[])?.length || 0;
    const quintaPos =
      (quinta[clave as keyof typeof quinta] as number[])?.length || 0;

    if (tonicaPos > 0 && tercaPos > 0 && quintaPos > 0) {
      const combinacoes = tonicaPos * tercaPos * quintaPos;
      console.log(
        `   ${tonica.name}-${terca.name}-${quinta.name}: ${tonicaPos} × ${tercaPos} × ${quintaPos} = ${combinacoes}`,
      );
      contagem += combinacoes;
    } else {
      console.log(
        `   ${tonica.name}-${terca.name}-${quinta.name}: ❌ Não mapeado`,
      );
    }
  }

  acordesPorClave[clave] = contagem;
  totalAcordes += contagem;
  console.log(`   Subtotal: ${contagem} acordes\n`);
}

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║                    RESUMO FINAL                        ║');
console.log('╠════════════════════════════════════════════════════════╣');
for (const [clave, count] of Object.entries(acordesPorClave)) {
  console.log(
    `║ ${clave.padEnd(35)} │ ${String(count).padStart(10)} acordes ║`,
  );
}
console.log('╠════════════════════════════════════════════════════════╣');
console.log(
  `║ TOTAL DE ACORDES MAPEADOS${' '.repeat(29)}│ ${String(totalAcordes).padStart(10)} acordes ║`,
);
console.log('╚════════════════════════════════════════════════════════╝');

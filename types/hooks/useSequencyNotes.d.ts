export interface Note {
  name: string;
  cifra: string;
  position_sol?: number[];
  position_fa?: number[];
  position_do?: number[];
  position_do_3?: number[];
  sol_cifra?: string[];
}

export interface ChordType {
  name: string;
  intervals: number[];
}

export interface ClaveOption {
  value: string;
  text: string;
  url: string;
}

export interface UseSequencyNotesReturn {
  toggleClave: () => void;
  typeClave: import('vue').Ref<ClaveOption>;
  toggleCifra: () => void;
  isCifra: import('vue').Ref<boolean>;
  generateChord: (rootNoteIndex: number) => Note[];
  getChordPositions: (chord: Note[], claveType: string) => number[];
  validateTonicNote: (
    selectedNoteIndex: number,
    currentChord: Note[],
  ) => boolean;
  chordTypes: ChordType[];
}

export {};

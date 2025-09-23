export interface GameSettingsProps {
  typeClave: { text: string; value: string; url: string };
  isCifra: boolean;
  hasVolume: boolean;
  hasAnswer: boolean;
}

export interface GameSettingsEmits {
  (e: 'toggle-clave'): void;
  (e: 'toggle-cifra'): void;
  (e: 'toggle-volume'): void;
  (e: 'toggle-answer'): void;
}

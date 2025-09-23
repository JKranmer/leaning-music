import {
  AllLabelPositionNotas,
  AllLabelPositionNotasFa,
  AllLabelPositionNotasDo,
  AllLabelPositionNotasDo3,
} from '../common/AllPositionNotas.js';

export const useNoteName = () => {
  const getNoteName = (
    currentPosition: number | undefined,
    claveType: string,
  ): string => {
    if (!currentPosition && currentPosition !== 0) {
      return '';
    }

    try {
      switch (claveType) {
        case 'sol':
          return AllLabelPositionNotas[currentPosition] || '';
        case 'fa':
          return AllLabelPositionNotasFa[currentPosition] || '';
        case 'do':
          return AllLabelPositionNotasDo[currentPosition] || '';
        case 'do-line-3':
          return AllLabelPositionNotasDo3[currentPosition] || '';
        default:
          console.warn(`Tipo de clave desconhecido: ${claveType}`);
          return '';
      }
    } catch (error) {
      console.error('Erro ao obter nome da nota:', error);
      return '';
    }
  };

  return {
    getNoteName,
  };
};

import { DefineComponent } from 'vue';

declare const NotesButtonGroup: DefineComponent<
  {
    isStart: boolean;
    isCifra: boolean;
  },
  {
    noteSelected: (index: number) => void;
  }
>;

export default NotesButtonGroup;

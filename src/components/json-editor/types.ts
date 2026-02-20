import { Slide } from '../historical-dates/types';

export type JsonEditorType = {
  slides: Slide[];
  onSave: (value: Slide[]) => void;
};

import { SliderEvents } from '../events-slider/types';

export type Dates = {
  start: number;
  end: number;
};

export type Slide = {
  dates: Dates;
  title?: string;
  content: SliderEvents[];
};

export type HistoricalDatesType = {
  slides: Slide[];
};

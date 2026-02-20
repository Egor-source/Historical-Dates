export type HistoricalDatesNavigationType = {
  selectedIndex: number;
  slidesCount: number;
  goPrev: () => void;
  goNext: () => void;
  goTo: (index: number) => void;
};

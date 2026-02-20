export type HistoricalDatesPaginationType = {
  title?: string;
  slidesCount: number;
  activeItemIndex: number;
  paginate: (index: number) => void;
};

export type HistoricalDatesPaginationItemType = {
  title?: string;
  index: number;
  activeItemIndex: number;
  step: number;
  paginate: (index: number) => void;
};

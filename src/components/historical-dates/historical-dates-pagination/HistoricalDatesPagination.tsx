import React, { FC, useRef } from 'react';
import HistoricalDatesPaginationItem from '../historical-dates-pagination-item/HistoricalDatesPaginationItem';
import { useAnimatedRotation } from '../../../hooks/useAnimatedRotation';
import * as styles from './styles.module.scss';
import { HistoricalDatesPaginationType } from './types';
import { useWindowSize } from '../../../hooks/useWindowSize';

const HistoricalDatesPagination: FC<HistoricalDatesPaginationType> = ({
  title,
  slidesCount,
  activeItemIndex,
  paginate,
}) => {
  const step = 360 / slidesCount;
  const containerRef = useRef<any>(null);
  const { width } = useWindowSize();
  useAnimatedRotation(
    {
      target: containerRef,
      rotationDeg: () => -activeItemIndex * step,
      getGSAPVars: () => {
        return {
          transform: 'translate(-50%, -50%)',
        };
      },
    },
    [activeItemIndex, step, width],
  );

  return (
    <div ref={containerRef} className={styles.customPagination}>
      {Array.from({ length: slidesCount }).map((_, i) => (
        <HistoricalDatesPaginationItem
          title={title}
          step={step}
          activeItemIndex={activeItemIndex}
          index={i}
          paginate={paginate}
          key={i}
        />
      ))}
    </div>
  );
};

export default HistoricalDatesPagination;

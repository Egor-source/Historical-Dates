import React, { FC } from 'react';
import * as styles from './styles.module.scss';
import { HistoricalDatesNavigationType } from './types';

const HistoricalDatesNavigation: FC<HistoricalDatesNavigationType> = ({
  selectedIndex,
  slidesCount,
  goPrev,
  goNext,
  goTo,
}) => {
  return (
    <div className={styles.navigationWrapper}>
      <div>
        <div className={styles.pagination}>
          {(selectedIndex + 1).toString().padStart(2, '0')}/
          {slidesCount.toString().padStart(2, '0')}
        </div>
        <div className={styles.sliderNavigation}>
          <div
            onClick={goPrev}
            className={selectedIndex === 0 ? `${styles.prev} ${styles.disabled}` : styles.prev}
          >
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
              <path
                d="M7.66418 0.707108L1.41419 6.95711L7.66418 13.2071"
                stroke="#42567A"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div
            onClick={goNext}
            className={
              selectedIndex === slidesCount - 1 ? `${styles.next} ${styles.disabled}` : styles.next
            }
          >
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
              <g transform="rotate(180 4.5 7)">
                <path
                  d="M7.66418 0.707108L1.41419 6.95711L7.66418 13.2071"
                  stroke="#42567A"
                  strokeWidth="2"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className={styles.dotPagination}>
        {Array.from({ length: slidesCount }).map((_, index) => (
          <div
            onClick={() => goTo(index)}
            key={index}
            className={
              index === selectedIndex
                ? `${styles.dotPaginationItem} ${styles.dotPaginationItemActive}`
                : styles.dotPaginationItem
            }
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HistoricalDatesNavigation;

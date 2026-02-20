import React, { FC, useEffect, useRef, useState } from 'react';
import { useAnimatedRotation } from '../../../hooks/useAnimatedRotation';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import {
  CIRCLE_DIAMETER,
  CIRCLE_DIAMETER_SMALL,
  CIRCLE_SLIDER_START_ANGLE,
  SLIDER_ITEM_ACTIVE_BG,
  SLIDER_ITEM_ACTIVE_SIZE,
  SLIDER_ITEM_INACTIVE_BG,
  SLIDER_ITEM_INACTIVE_SIZE,
} from './constants';

import * as styles from './styles.module.scss';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { HistoricalDatesPaginationItemType } from './types';

const HistoricalDatesPaginationItem: FC<HistoricalDatesPaginationItemType> = ({
  title,
  index,
  activeItemIndex,
  step,
  paginate,
}) => {
  const itemRef = useRef<any>(null);
  const titleRef = useRef<any>(null);
  const isSelected = activeItemIndex === index;
  const [isActive, setIsActive] = useState(isSelected);
  const { width } = useWindowSize();

  useEffect(() => {
    setIsActive(isSelected);
  }, [activeItemIndex]);

  useGSAP(() => {
    gsap.set(itemRef.current, {
      transform: 'translate(-50%,-50%)',
    });
  });

  useGSAP(() => {
    gsap.to(itemRef.current, {
      width: isActive ? SLIDER_ITEM_ACTIVE_SIZE : SLIDER_ITEM_INACTIVE_SIZE,
      height: isActive ? SLIDER_ITEM_ACTIVE_SIZE : SLIDER_ITEM_INACTIVE_SIZE,
      backgroundColor: isActive ? SLIDER_ITEM_ACTIVE_BG : SLIDER_ITEM_INACTIVE_BG,
      duration: 0.3,
    });
  }, [isActive]);

  useAnimatedRotation(
    {
      target: itemRef,
      rotationDeg: () => activeItemIndex * step,
      getGSAPVars: () => {
        const diameter = width > 1024 ? CIRCLE_DIAMETER : CIRCLE_DIAMETER_SMALL;
        const radius = diameter / 2;
        const angle = CIRCLE_SLIDER_START_ANGLE + step * index;
        const rad = (angle * Math.PI) / 180;
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);
        return {
          x,
          y,
          onStart() {
            gsap.set(itemRef.current, {
              transform: 'translate(-50%,-50%)',
            });
            if (!titleRef.current) return;
            gsap.set(titleRef.current, {
              opacity: 0,
            });
          },
          onComplete() {
            if (!titleRef.current) return;
            gsap.to(titleRef.current, {
              opacity: 1,
              duration: 0.3,
            });
          },
        };
      },
    },
    [activeItemIndex, step, width],
  );

  const onMouseEnter = () => {
    if (isSelected) return;
    setIsActive(true);
  };

  const onMouseLeve = () => {
    if (isSelected) return;
    setIsActive(false);
  };

  return (
    <span
      ref={itemRef}
      className={styles.circleItem}
      onClick={() => paginate(index)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeve}
    >
      {isActive && index + 1}
      {title && isSelected && (
        <span ref={titleRef} className={styles.title} title={title}>
          {title}
        </span>
      )}
    </span>
  );
};

export default HistoricalDatesPaginationItem;

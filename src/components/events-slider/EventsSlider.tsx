import React, { FC, useId, useRef, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import * as styles from './styles.module.scss';
import { NavigationOptions } from 'swiper/types';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { EventsSliderType } from './types';

const EventsSlider: FC<EventsSliderType> = ({ events }) => {
  const id = useId();
  const swiperRef = useRef<any>(null);
  const wrapperRef = useRef<any>(null);
  const [currentEvents, setCurrentEvents] = useState(events);

  useGSAP(() => {
    if (!swiperRef?.current) return;

    gsap.to(wrapperRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.8,
      onComplete: () => {
        setCurrentEvents(events);
        swiperRef.current.update();
        swiperRef.current.slideTo(0, 0);
        gsap.to(wrapperRef.current, { opacity: 1, y: 0, duration: 0.2 });
      },
    });
  }, [events]);

  return (
    <div ref={wrapperRef} className={styles.sliderWrapper}>
      <div id={id} className={`events-prev ${styles.prev}`}>
        <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
          <path
            d="M7.66418 0.707108L1.41419 6.95711L7.66418 13.2071"
            stroke="#42567A"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div id={id} className={`events-next ${styles.next}`}>
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
      <Swiper
        modules={[Navigation]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView="auto"
        spaceBetween={25}
        nested={true}
        resizeObserver={true}
        breakpoints={{
          768: {
            spaceBetween: 40,
          },
          1024: {
            spaceBetween: 80,
          },
        }}
        grabCursor={true}
        navigation={
          {
            prevEl: `.${styles.prev}#${id}`,
            nextEl: `.${styles.next}#${id}`,
          } as NavigationOptions
        }
      >
        {currentEvents.map(({ title, text }) => (
          <SwiperSlide className={styles.sliderItem}>
            <div className={styles.title}>{title}</div>
            <div className={styles.text}>{text}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default EventsSlider;

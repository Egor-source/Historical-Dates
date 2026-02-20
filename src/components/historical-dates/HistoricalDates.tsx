import React, { FC, useRef, useState } from 'react';
import HistoricalDatesPagination from './historical-dates-pagination/HistoricalDatesPagination';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import * as styles from './styles.module.scss';
import 'swiper/css/effect-fade';
import EventsSlider from '../events-slider/EventsSlider';
import HistoricalDatesNavigation from './historical-dates-navigation/HistoricalDatesNavigation';
import { HistoricalDatesType } from './types';

const HistoricalDates: FC<HistoricalDatesType> = ({ slides }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const startDateRef = useRef<any>(null);
  const endDateRef = useRef<any>(null);
  const periodTitleRef = useRef<any>(null);
  const [start, setStart] = useState(slides[selectedIndex].dates.start);
  const [end, setEnd] = useState(slides[selectedIndex].dates.end);

  useGSAP(() => {
    const newStart = slides[selectedIndex].dates.start;
    const newEnd = slides[selectedIndex].dates.end;

    gsap.fromTo(
      startDateRef.current,
      { innerText: start },
      {
        innerText: newStart,
        duration: 1,
        snap: { innerText: 1 },
      },
    );

    gsap.fromTo(
      endDateRef.current,
      { innerText: end },
      {
        innerText: newEnd,
        duration: 1,
        snap: { innerText: 1 },
      },
    );
    if (!periodTitleRef) return;
    const tl = gsap.timeline();

    tl.fromTo(
      periodTitleRef.current,
      { opacity: 1 },
      {
        y: 10,
        opacity: 0,
        duration: 0.8,
      },
    )
      .set(periodTitleRef.current, { innerText: slides[selectedIndex].title || '' })
      .to(periodTitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.2,
      });

    setStart(newStart);
    setEnd(newEnd);
  }, [selectedIndex, slides]);

  const goNext = () => {
    if (selectedIndex + 1 >= slides.length) return;
    setSelectedIndex(selectedIndex + 1);
  };

  const goPrev = () => {
    if (selectedIndex - 1 < 0) return;
    setSelectedIndex(selectedIndex - 1);
  };

  const goTo = (index: number) => {
    if (index < 0 || index >= slides.length) return;
    setSelectedIndex(index);
  };

  return (
    <div className={styles.historicalDates}>
      <div className={styles.title}>
        <div>Исторические</div>
        <div>даты</div>
      </div>
      <div className={styles.wrapper}>
        <HistoricalDatesPagination
          title={slides[selectedIndex].title}
          slidesCount={slides.length}
          activeItemIndex={selectedIndex}
          paginate={(index) => setSelectedIndex(index)}
        />
        <div className={styles.dates}>
          <div ref={startDateRef} className={styles.start} />
          <div ref={endDateRef} className={styles.end} />
        </div>
        <div ref={periodTitleRef} className={styles.periodTitle} />
      </div>

      <div className={styles.sliderWrapper}>
        <HistoricalDatesNavigation
          selectedIndex={selectedIndex}
          slidesCount={slides.length}
          goPrev={goPrev}
          goNext={goNext}
          goTo={goTo}
        />
        <EventsSlider events={slides[selectedIndex].content} />
      </div>
    </div>
  );
};

export default HistoricalDates;

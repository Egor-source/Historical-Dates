import TweenVars = gsap.TweenVars;
import { RefObject, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

type RotationConfig = {
  target: RefObject<any>;
  rotationDeg: () => number;
  getGSAPVars?: () => TweenVars;
};
const getShortestRotation = (currentRotation: number, targetRotation: number) => {
  let delta = (targetRotation - currentRotation) % 360;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return currentRotation + delta;
};

export const useAnimatedRotation = (
  { target, rotationDeg, getGSAPVars }: RotationConfig,
  deps: unknown[],
) => {
  const [prevDeg, setPrevDeg] = useState<number>(0);
  useGSAP(() => {
    const rotation = rotationDeg();
    const config = getGSAPVars ? getGSAPVars() : {};

    gsap.set(target.current, {
      rotation,
      ...config,
    });

    setPrevDeg(rotation);
  });

  useGSAP(() => {
    const rotation = rotationDeg();
    const config = getGSAPVars ? getGSAPVars() : {};
    const shortest = getShortestRotation(prevDeg, rotation);

    gsap.to(target.current, {
      rotation: shortest,
      duration: 1,
      ...config,
    });
    setPrevDeg(shortest);
  }, deps);
};

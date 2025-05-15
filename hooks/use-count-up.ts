import { useEffect, useState } from 'react';

interface UseCountUpProps {
  end: number;
  start?: number;
  duration?: number;
}

const easeOutQuad = (t: number): number => t * (2 - t);

export const useCountUp = ({ end, start = 0, duration = 1000 }: UseCountUpProps) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const updateCount = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentCount = Math.floor(start + (end - start) * easeOutQuad(progress));
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, start, duration]);

  return count;
};

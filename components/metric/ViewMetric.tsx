'use client';

import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

import Metric from '@/components/Metric';
import { useCountUp } from '@/hooks/use-count-up';
import { incrementViewCount } from '@/lib/actions/question.action';
import { getCookie, setCookie } from '@/lib/cookie';
import { durationOfMonitoring } from '@/lib/utils';
interface IView {
  id: string;
  userId: string | undefined;
  views: number;
}

const ViewMetric = ({ id, userId, views }: IView) => {
  const [viewCount, setViewCount] = useState(views);
  const duration = durationOfMonitoring(viewCount);
  const count = useCountUp({ end: viewCount, duration });

  useEffect(() => {
    const timeout = setTimeout(() => {
      incrementView();
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  const incrementView = async () => {
    const cookie = (await getCookie('views')) || {};
    if ((!userId && Cookies.get('cookie-consent') === 'declined') || cookie?.[id] === true) return;
    await incrementViewCount(id);
    setViewCount((prev) => prev + 1);
    cookie[id] = true;
    setCookie('views', cookie);
  };

  return (
    <Metric
      imgUrl="/icons/eye.svg"
      alt="Views"
      value={
        <motion.span
          className="flex items-center font-semibold"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            type: 'spring',
            stiffness: 100,
            damping: 10,
          }}
        >
          {count}
        </motion.span>
      }
      title="Views"
      textStyles="body-medium text-dark400_light800"
    />
  );
};

export default ViewMetric;

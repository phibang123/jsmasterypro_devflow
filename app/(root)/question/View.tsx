'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

import Metric from '@/components/Metric';
import { incrementViewCount } from '@/lib/actions/question.action';
import { getCookie, setCookie } from '@/lib/cookie';

interface IView {
  id: string;
  userId: string | undefined;
  views: number;
}

const View = ({ id, userId, views }: IView) => {
  const [viewCount, setViewCount] = useState(views);

  const spring = useSpring(views, {
    damping: 30,
    stiffness: 100,
    mass: 0.8,
  });

  const displayNumber = useTransform(spring, (latest) => Math.floor(latest).toString());

  useEffect(() => {
    spring.set(viewCount);
  }, [viewCount, spring]);

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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {displayNumber}
        </motion.span>
      }
      title="Views"
      textStyles="body-medium text-dark400_light800"
    />
  );
};

export default View;

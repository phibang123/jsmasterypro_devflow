'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { useCountUp } from '@/hooks/use-count-up';
import { durationOfMonitoring, getTimeStampObject } from '@/lib/utils';

import Metric from '../Metric';

interface DateTimeMetricProps {
  dateTime: Date;
  title: string;
  iconUrl?: string;
}

const DateTimeMetric = ({ dateTime, title, iconUrl = '/icons/clock.svg' }: DateTimeMetricProps) => {
  const { value, unit } = getTimeStampObject(dateTime);
  const duration = durationOfMonitoring(value);
  const count = useCountUp({ end: value, duration });

  return (
    <Metric
      imgUrl={iconUrl}
      alt={title}
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
          {count} {unit}
        </motion.span>
      }
      title="Views"
      textStyles="body-medium text-dark400_light800"
    />
  );
};

export default DateTimeMetric;

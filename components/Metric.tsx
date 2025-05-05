import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { MetricIF } from '@/types/global';

const Metric = ({
  alt,
  href,
  imgUrl,
  isAuthor,
  textStyles,
  title,
  value,
  imgStyles = '',
}: MetricIF) => {
  const sizeWidthAndHeight = isAuthor ? 28 : 18;
  const classNameAuthor = isAuthor
    ? 'size-[28px] rounded-full bg-light-400 dark:bg-dark-500'
    : 'rounded-md';
  const metricContent = (
    <div className="flex items-center gap-1.5">
      <Image
        src={imgUrl}
        alt={alt}
        width={sizeWidthAndHeight}
        height={sizeWidthAndHeight}
        className={` ${classNameAuthor} object-contain ${imgStyles}`}
        quality={100}
      />
      <div className={`flex items-center gap-1 ${textStyles}`}>
        <span className="font-semibold">{value}</span>
        {title && <span className="text-light400_light500">{title}</span>}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="hover:text-blue-600"
      >
        {metricContent}
      </Link>
    );
  }

  return metricContent;
};

export default Metric;

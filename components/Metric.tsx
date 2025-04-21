import Image from "next/image";
import Link from "next/link";
import React from "react";

import { MetricIF } from "@/types/global";

const Metric = ({
  alt,
  href,
  imgUrl,
  isAuthor,
  textStyles,
  title,
  value,
  imgStyles,
}: MetricIF) => {
  const sizeWidthAndHeight = isAuthor ? 28 : 18;
  const metricContent = (
    <div className="flex items-center gap-1.5">
      <Image
        src={imgUrl}
        alt={alt}
        width={sizeWidthAndHeight}
        height={sizeWidthAndHeight}
        className={`object-contain rounded-md ${imgStyles}`}
        quality={100}
      />
      <div className={`flex items-center gap-1 ${textStyles}`}>
        <span className="font-semibold">{value}</span>
        {title && <span className="text-gray-500">{title}</span>}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:text-blue-600">
        {metricContent}
      </Link>
    );
  }

  return metricContent;
};

export default Metric;

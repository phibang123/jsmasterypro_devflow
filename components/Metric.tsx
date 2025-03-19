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
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={16}
        height={16}
        className={`rounded-full object-contain ${imgStyles}`}
      />
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""}`}
        >
          {title}
        </span>
      </p>
    </>
  );

  return href ? (
    <Link className="flex-center gap-1" href={href}>
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;

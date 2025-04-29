import React from 'react';

import SkeletonEmptyData from '@/components/emptyData';
import SkeletonError from '@/components/error';

interface DataRendererProps<T> {
  success: boolean;
  className?: string;
  data?: T;
  render: (data: T) => React.ReactNode;
}

const DataRendererLayer = <T,>({ render, data, success, className }: DataRendererProps<T>) => {
  if (!success) return <SkeletonError />;
  if (!data || (Array.isArray(data) && data.length === 0)) return <SkeletonEmptyData />;
  return <div className={className}>{render(data)}</div>;
};

export default DataRendererLayer;

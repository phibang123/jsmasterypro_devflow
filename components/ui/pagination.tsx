// import React và các hook cần thiết
'use client';
import React, { useState } from 'react';

import clsx from 'clsx';

interface PaginationProps {
  page: number;
  totalPages: number;
  //   onPageChange: (page: number) => void;
  variant?: 'default' | 'rounded' | 'minimal';
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  //   onPageChange,
  variant = 'default',
  className = '',
}) => {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (totalPages <= 1) return null;

  // Mobile: Toggle dạng Prev/Next
  if (isMobile) {
    return (
      <div className={clsx('flex items-center justify-center gap-2', className)}>
        <button
          className="px-3 py-1 rounded bg-neutral-800 text-white disabled:opacity-50"
          //   onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="px-3 py-1 rounded bg-orange-500 text-white">{page}</span>
        <button
          className="px-3 py-1 rounded bg-neutral-800 text-white disabled:opacity-50"
          //   onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    );
  }

  // Desktop: Hiển thị nhiều dạng
  const getButtonClass = (p: number) =>
    clsx(
      'px-3 py-1',
      variant === 'rounded' && 'rounded-full',
      variant === 'minimal' && 'bg-transparent',
      p === page ? 'bg-orange-500 text-white' : 'bg-neutral-800 text-white hover:bg-orange-400',
    );

  return (
    <div className={clsx('flex items-center justify-center gap-2', className)}>
      <button
        className={getButtonClass(page - 1)}
        //   onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={getButtonClass(i + 1)}
          //   onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className={getButtonClass(page + 1)}
        //   onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

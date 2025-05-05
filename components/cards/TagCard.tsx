import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import ROUTES from '@/constants/routes';
import { getCount, getDeviconClassName, getDeviconDescription } from '@/lib/utils';
import { TagIF } from '@/types/global';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const TagCard = ({
  id,
  name,
  questions,
  showCount = false,
  compact = false,
  handleRemove,
  isButton,
  remove,
}: TagIF) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const renderingCount = () => {
    if (!showCount) return;
    const count = getCount(questions);
    if (!compact) {
      return (
        <div className="flex flex-row gap-2 text-sm">
          <p className="primary-text-gradient">{count}</p>
          <p className="text-light400_light500">Questions</p>
        </div>
      );
    }
    return <p className="small-medium primary-text-gradient">{count}</p>;
  };

  const renderingRemoveButton = () => {
    if (!remove) return;
    return (
      <Image
        src="/icons/close.svg"
        width={12}
        height={12}
        alt="close icon"
        className="cursor-pointer object-contain invert-0 dark:invert"
        onClick={handleRemove}
      />
    );
  };

  const iconClass = getDeviconClassName(name);

  const Content = (
    <>
      <Badge className="subtle-medium background-light800_dark400 text-light400_light500 flex flex-row gap-2 rounded-md border-none px-2 py-1 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`}></i>
          <span>{name}</span>
        </div>
        {renderingRemoveButton()}
      </Badge>
      {compact && renderingCount()}
    </>
  );

  if (!compact) {
    const deviconDescription = getDeviconDescription(name);
    return (
      <Link
        href={ROUTES.TAG(id)}
        className="items-center justify-between gap-2"
      >
        <article className="card-wrapper flex w-full flex-col rounded-2xl p-4">
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between gap-3">{Content}</div>
            <div className="line-clamp-4 text-sm">
              <p className="text-dark300_light700 tracking-wide">{deviconDescription}</p>
            </div>
            {renderingCount()}
          </div>
        </article>
      </Link>
    );
  }

  return isButton ? (
    <Button
      onClick={handleClick}
      className="flex justify-between gap-2"
    >
      {Content}
    </Button>
  ) : (
    <Link
      href={ROUTES.TAG(id)}
      className="flex items-center justify-between gap-2"
    >
      {Content}
    </Link>
  );
};

export default TagCard;

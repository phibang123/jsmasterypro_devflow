import Image from "next/image";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getDeviconClassName } from "@/lib/utils";
import { TagIF } from "@/types/global";

import { Badge } from "../ui/badge";

const TagCard = ({
  _id,
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

  const renderingQuestions = () => {
    if (!showCount) return;
    return <p className="small-medium text-dark500_light700">{questions}</p>;
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
      {renderingQuestions()}
    </>
  );

  return compact && isButton ? (
    <button onClick={handleClick} className="flex justify-between gap-2">
      {Content}
    </button>
  ) : (
    <Link
      href={ROUTES.TAGS(_id)}
      className="flex items-center justify-between gap-2"
    >
      {Content}
    </Link>
  );
};

export default TagCard;

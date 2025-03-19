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
  // compact = false,
}: TagIF) => {
  const renderingQuestions = () => {
    if (!showCount) return "";
    return <p className="small-medium text-dark500_light700">{questions}</p>;
  };

  const iconClass = getDeviconClassName(name);

  return (
    <Link href={ROUTES.TAGS(_id)} className="flex justify-between gap-2">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`}></i>
          <span>{name}</span>
        </div>
      </Badge>

      {renderingQuestions()}
    </Link>
  );
};

export default TagCard;

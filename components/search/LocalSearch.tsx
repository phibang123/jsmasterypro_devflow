"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { fromUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";

import { Input } from "../ui/input";

interface Props {
  route: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

function LocalSearch({ route, imgSrc, placeholder, otherClasses }: Props) {
  const pathname = usePathname();
  const searchParam = useSearchParams();
  const query = searchParam.get("query") || "";
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(query);

  const handleNewUrl = () => {
    if ((searchQuery || pathname === route) && query !== searchQuery) {
      const params = searchParam.toString();
      let newUrl;
      const queryString = "query";
      if (searchQuery) {
        newUrl = fromUrlQuery({
          key: queryString,
          params,
          value: searchQuery,
        });
      } else {
        newUrl = removeKeysFromUrlQuery({
          params,
          keysToRemove: [queryString],
        });
      }
      router.push(newUrl, { scroll: false });
    }
  };

  useEffect(() => {
    const delayDebugFn = setTimeout(() => {
      handleNewUrl();
    }, 300);
    return () => clearTimeout(delayDebugFn);
  }, [searchQuery, router, searchParam, pathname]);

  return (
    <div
      className={`background-light800_dark_gradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      <Image
        src={imgSrc}
        width={32}
        height={32}
        alt="Search"
        className={placeholder}
      />
      <Input
        type="text"
        placeholder="Search questions..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
      />
    </div>
  );
}

export default LocalSearch;

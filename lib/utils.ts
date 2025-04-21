import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { deviconClasses } from "@/constants/techMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDeviconClassName = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();

  return deviconClasses[normalizedTechName]
    ? `${deviconClasses[normalizedTechName]} colored`
    : "devicon-devicon-plain";
};

export const getTimeStamp = (date: Date) => {
  const now = new Date();
  const convertDate = new Date(date);
  const secondsAgo = Math.floor((now.getTime() - convertDate.getTime()) / 1000);

  const units = [
    { label: "yr", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "wk", seconds: 604800 },
    { label: "d", seconds: 86400 },
    { label: "hr", seconds: 3600 },
    { label: "min", seconds: 60 },
    { label: "sec", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

export const toUpperCaseTitle = (title = "") => {
  return title.charAt(0).toLocaleUpperCase() + title.slice(1);
};

export const getAuthorName = (name = "") => {
  const firstName = name.split(" ")[0];
  return firstName.length > 8 ? `${firstName}...` : firstName;
};

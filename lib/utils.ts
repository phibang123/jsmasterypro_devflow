import { clsx, type ClassValue } from "clsx";
import { ObjectId } from "mongoose";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  DEFAULT_QUERY,
  DEFAULT_SORT,
  DEFAULT_FILTER,
} from "@/configs/constance";
import { deviconClasses } from "@/constants/techMap";

import { UnauthorizedError, ValidationError } from "./http.errors";
import logger from "./logger";

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

export const getPaginationParams = (searchParams: URLSearchParams) => ({
  page: parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10),
  limit: parseInt(searchParams.get("pageSize") || String(DEFAULT_LIMIT), 10),
  skip:
    (parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10) - 1) *
    parseInt(searchParams.get("pageSize") || String(DEFAULT_LIMIT), 10),
  query: searchParams.get("query") || DEFAULT_QUERY,
  sort: searchParams.get("sort") || DEFAULT_SORT,
  filter: searchParams.get("filter") || DEFAULT_FILTER,
});

export const validateRequest = <
  T extends z.ZodObject<Record<string, z.ZodType>>,
>(
  dataRequest: z.infer<T>,
  schema: T,
  options: {
    requiredAuth?: boolean;
    partial?: boolean;
  } = {
    requiredAuth: false,
  },
): z.infer<T> => {
  logger.info("Validating request");
  if (options.requiredAuth && !dataRequest?.userId)
    throw new UnauthorizedError("Unauthorized");

  const validatedData = options.partial
    ? schema.partial().safeParse(dataRequest)
    : schema.safeParse(dataRequest);

  if (!validatedData.success) {
    const fieldErrors = validatedData.error.flatten().fieldErrors;
    throw new ValidationError(fieldErrors as Record<string, string[]>);
  }
  logger.info("Request validated successfully");
  return validatedData.data;
};

export const validateDuplicateTags = (tags: string[] | undefined) => {
  if (!tags || !tags?.length || tags.length > 2) return;
  const duplicateTags = tags.filter(
    (tag, index, self) => self.indexOf(tag) !== index,
  );
  if (duplicateTags.length > 0) {
    throw new Error(
      `Duplicate tags are not allowed: ${duplicateTags.join(", ")}`,
    );
  }
};
export const transformLeanDocument = <
  T extends { _id: ObjectId | string; __v?: number },
>(
  doc: T,
): Omit<T, "_id"> & { id: string } => {
  const { _id, ...rest } = doc;
  return {
    ...(_id && { id: _id.toString() }),
    __v: doc.__v,
    ...rest,
  } as Omit<T, "_id"> & { id: string };
};

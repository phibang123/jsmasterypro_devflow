import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { deviconClasses } from "@/constants/techMap";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "@/configs/constance";
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
  limit: parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10),
  skip:
    (parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10) - 1) *
    parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10),
});

export const validateRequest = async <T>(
  request: Request,
  schema: z.ZodSchema<T>,
  requiredAuth = false,
) => {
  try {
    const dataRequest = await request.json();
    if (requiredAuth && !dataRequest.userId)
      throw new UnauthorizedError("Unauthorized");
    const validatedData = schema.safeParse(dataRequest);

    if (!validatedData.success) {
      const fieldErrors = Object.fromEntries(
        Object.entries(validatedData.error.flatten().fieldErrors).map(
          ([key, value]) => [key, value || []],
        ),
      ) as Record<string, string[]>;
      throw new ValidationError(fieldErrors);
    }

    return validatedData.data;
  } catch (error) {
    logger.error("Validation error:", error);
    throw error;
  }
};

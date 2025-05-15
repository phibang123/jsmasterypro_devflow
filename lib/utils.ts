import { clsx, type ClassValue } from 'clsx';
import { ObjectId } from 'mongoose';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  DEFAULT_QUERY,
  DEFAULT_SORT,
  DEFAULT_FILTER,
  UNITS_TIME,
  allDeviconClasses,
  allDeviconDescriptions,
} from '@/constants';

import { UnauthorizedError, ValidationError } from './http.errors';
import logger from './logger';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDeviconClassName = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, '').toLowerCase();

  return allDeviconClasses[normalizedTechName]
    ? `${allDeviconClasses[normalizedTechName]} colored`
    : 'devicon-devicon-plain';
};

export const getDeviconDescription = (techName: string) => {
  const description =
    allDeviconDescriptions[techName] ||
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged";
  return description;
};

const getTimeStamp = (date: Date) => {
  const now = new Date();
  const convertDate = new Date(date);
  const secondsAgo = Math.floor((now.getTime() - convertDate.getTime()) / 1000);
  return secondsAgo;
};

export const getTimeStampObject = (date: Date) => {
  const secondsAgo = getTimeStamp(date);

  for (const unit of UNITS_TIME) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return { value: interval, unit: `${unit.label}${interval > 1 ? 's' : ''} ago` };
    }
  }
  return { value: 0, unit: null };
};

export const durationOfMonitoring = (value: number) => {
  let duration = 500;
  if (value >= 500) duration = 2000;
  if (value >= 100) duration = 1000;
  return duration;
};

export const getTimeStampString = (date: Date) => {
  const secondsAgo = getTimeStamp(date);

  for (const unit of UNITS_TIME) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

const COUNT_THRESHOLDS = [
  { threshold: 1e18, suffix: 'E' },
  { threshold: 1e15, suffix: 'P' },
  { threshold: 1e12, suffix: 'T' },
  { threshold: 1e9, suffix: 'B' },
  { threshold: 1e6, suffix: 'M' },
  { threshold: 1e3, suffix: 'k' },
] as const;

export const getCount = (count: number | string | undefined): string => {
  if (count === 0 || count === undefined) return 'No questions';

  const numericCount = typeof count === 'string' ? parseInt(count, 10) : count;

  const threshold = COUNT_THRESHOLDS.find(({ threshold }) => numericCount >= threshold);

  if (threshold) {
    const formattedCount = (numericCount / threshold.threshold).toFixed(1);
    return `${formattedCount}${threshold.suffix}+`;
  }

  return `${numericCount}+`;
};

export const toUpperCaseTitle = (title = '') => {
  return title.charAt(0).toLocaleUpperCase() + title.slice(1);
};

export const getAuthorName = (name = '') => {
  const firstName = name.split(' ')[0];
  return firstName.length > 8 ? `${firstName}...` : firstName;
};

export const getPaginationParams = (searchParams: URLSearchParams) => ({
  page: parseInt(searchParams.get('page') || String(DEFAULT_PAGE), 10),
  limit: parseInt(searchParams.get('pageSize') || String(DEFAULT_LIMIT), 10),
  skip:
    (parseInt(searchParams.get('page') || String(DEFAULT_PAGE), 10) - 1) *
    parseInt(searchParams.get('pageSize') || String(DEFAULT_LIMIT), 10),
  query: searchParams.get('query') || DEFAULT_QUERY,
  sort: searchParams.get('sort') || DEFAULT_SORT,
  filter: searchParams.get('filter') || DEFAULT_FILTER,
});

export const validateRequest = <T extends z.ZodObject<Record<string, z.ZodType>>>(
  dataRequest: z.infer<T>,
  schema: T,
  options: {
    requiredAuth?: boolean;
    partial?: boolean;
  } = {
    requiredAuth: false,
  },
): z.infer<T> => {
  logger.info('Validating request');
  if (options.requiredAuth && !dataRequest?.userId) throw new UnauthorizedError('Unauthorized');

  const validatedData = options.partial
    ? schema.partial().safeParse(dataRequest)
    : schema.safeParse(dataRequest);

  if (!validatedData.success) {
    const fieldErrors = validatedData.error.flatten().fieldErrors;
    throw new ValidationError(fieldErrors as Record<string, string[]>);
  }
  logger.info('Request validated successfully');
  return validatedData.data;
};

export const validateDuplicateTags = (tags: string[] | undefined) => {
  if (!tags || !tags?.length || tags.length > 2) return;
  const duplicateTags = tags.filter((tag, index, self) => self.indexOf(tag) !== index);
  if (duplicateTags.length > 0) {
    throw new Error(`Duplicate tags are not allowed: ${duplicateTags.join(', ')}`);
  }
};
export const transformLeanDocument = <T extends { _id: ObjectId | string; __v?: number }>(
  doc: T,
): Omit<T, '_id'> & { id: string } => {
  const { _id, ...rest } = doc;
  return {
    ...(_id && { id: _id.toString() }),
    __v: doc.__v,
    ...rest,
  } as Omit<T, '_id'> & { id: string };
};

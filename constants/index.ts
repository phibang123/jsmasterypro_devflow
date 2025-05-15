import { ROUTES } from './routes';

export const sidebarLinks = [
  {
    imgURL: '/icons/home.svg',
    label: 'Home',
    route: '/',
  },
  {
    imgURL: '/icons/users.svg',
    label: 'Community',
    route: '/community',
  },
  {
    imgURL: '/icons/star.svg',
    label: 'Collections',
    route: '/collections',
  },
  {
    imgURL: '/icons/suitcase.svg',
    label: 'Find Jobs',
    route: '/jobs',
  },
  {
    imgURL: '/icons/tag.svg',
    label: 'Tags',
    route: '/tags',
  },
  {
    imgURL: '/icons/user.svg',
    label: 'Profile',
    route: '/profile',
  },
  {
    imgURL: '/icons/question.svg',
    label: 'Ask a question',
    route: ROUTES.ASK_QUESTION,
  },
];

export const UNITS_TIME = [
  { label: 'yr', seconds: 31536000 },
  { label: 'mo', seconds: 2592000 },
  { label: 'wk', seconds: 604800 },
  { label: 'd', seconds: 86400 },
  { label: 'hr', seconds: 3600 },
  { label: 'min', seconds: 60 },
  { label: 'sec', seconds: 1 },
];

export const SIGN_IN = 'SIGN_IN';
export const SIGN_UP = 'SIGN_UP';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const DEFAULT_QUERY = '';
export const DEFAULT_FILTER = '';
export const DEFAULT_SORT = 'createdAt';

export * from './states';
export * from './routes';
export * from './devicon/allDeviconClasses';
export * from './devicon/allDeviconDescriptions';

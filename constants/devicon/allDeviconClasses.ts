import { additionalDeviconClasses } from './additionalDeviconClasses';
import { deviconClasses } from './deviconClasses';
import { moreDeviconClasses } from './moreDeviconClasses';
import { techDeviconClasses } from './techMap';

interface objDefine {
  [key: string]: string;
}

export const allDeviconClasses: objDefine = {
  ...techDeviconClasses,
  ...deviconClasses,
  ...additionalDeviconClasses,
  ...moreDeviconClasses,
};

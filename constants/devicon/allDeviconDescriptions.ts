import { additionalDeviconDescriptions } from './additionalDeviconDescriptions';
import { deviconDescriptions } from './deviconDescriptions';
import { moreDeviconDescriptions } from './moreDeviconDescriptions';
import { techDeviconDescriptions } from './techMap';

interface objDefine {
  [key: string]: string;
}

export const allDeviconDescriptions: objDefine = {
  ...techDeviconDescriptions,
  ...deviconDescriptions,
  ...additionalDeviconDescriptions,
  ...moreDeviconDescriptions,
};

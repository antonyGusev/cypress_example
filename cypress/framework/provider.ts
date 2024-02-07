import { browser } from '../../lib';
import { utils } from '../../lib/utils';
import { Actor } from './actor';

const provider = {
  get packages() {
    return { browser };
  },
  get actor() {
    return { Actor };
  },
  get utils() {
    return utils;
  }
};

export { provider };

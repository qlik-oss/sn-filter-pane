import properties from './object-properties';
import getData from './data';

import useRender from './hooks/use-render';
import ext from './ext';
import { IEnv } from './types/types';

export default function supernova(env: IEnv) {
  return {
    ext: ext(env),
    qae: {
      properties,
      data: getData(env),
    },
    component() {
      useRender({ ...env });
    },
  };
}

import properties from './object-properties';
import getData from './data';

import useRender from './hooks/use-render';
import ext from './ext';

interface IEnv {
  flags: {
    isEnabled: (flag?: string) => boolean;
  },
}

export default function supernova(env: IEnv) {
  return {
    ext: ext(env),
    qae: {
      properties,
      data: getData(),
    },
    component() {
      useRender({ ...env });
    },
  };
}

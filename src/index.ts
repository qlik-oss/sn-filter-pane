import properties from './object-properties';
import getData from './data';

import useRender from './hooks/use-render';

interface IEnv {
  flags: {
    isEnabled: (flag?: string) => boolean;
  },
}

export default function supernova(env: IEnv) {
  return {
    ext: {
      definition: {},
      support: {},
      importProperties: () => {},
    },
    qae: {
      properties,
      data: getData(),
    },
    component() {
      useRender({ ...env });
    },
  };
}

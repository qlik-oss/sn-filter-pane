import { useElement } from '@nebula.js/stardust';
import properties from './object-properties';
import data from './data';

import useRender from './hooks/use-render';

export default function supernova() {
  return {
    qae: {
      properties,
      data,
    },
    component() {
      useRender();
    },
  };
}

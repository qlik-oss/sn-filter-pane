import { useEffect, useElement, useState } from '@nebula.js/stardust';
import { store } from '../store';
import getListBoxResources from './listbox/get-listbox-resources';
import {
  IContainerElement, IListboxResource, ListboxResourcesArr,
} from './types';
import { render, teardown } from '../components/root';
import './style.scss';
import { IEnv } from '../types/types';

export default function useRender({ sense }: IEnv) {
  const [resourcesArr, setResourcesArr] = useState<IListboxResource[] | undefined>(undefined);

  const {
    app, fpLayout, options, constraints, translator,
  } = store.getState();

  const containerElement = <IContainerElement>useElement();

  useEffect(() => {
    if (!app || !fpLayout) {
      return;
    }
    getListBoxResources(app, fpLayout).then((resArr: ListboxResourcesArr) => {
      setResourcesArr(resArr || []);
    });
  }, [app, fpLayout]);

  useEffect(() => {
    if (!resourcesArr?.length || !app) {
      return undefined;
    }
    const root = render(
      containerElement,
      {
        app,
        listboxOptions: options.listboxOptions ?? {},
        resources: resourcesArr,
        onFullscreen: options.zoomSelf,
        isZoomed: options.isZoomed,
        constraints,
        t: translator,
      },
    );
    return (() => {
      teardown(root);
    });
  }, [resourcesArr, constraints, options.isZoomed]);
}

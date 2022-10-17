import {
  useApp, useEffect, useElement, useLayout, useModel, useOptions, useState, useConstraints, useTranslator,
} from '@nebula.js/stardust';
import { store } from '../store';
import getListBoxResources from './listbox/get-listbox-resources';
import {
  IContainerElement, IListBoxOptions, IFilterPaneLayout, IListboxResource, ListboxResourcesArr,
} from './types';
import { render, teardown } from '../components/root';
import './style.scss';
import { IEnv } from '../types/types';

interface IUseOptions {
  listboxOptions?: IListBoxOptions;
  zoomSelf?: () => void;
  isZoomed?: boolean;
}

export default function useRender({ sense }: IEnv) {
  const options = useOptions() as IUseOptions;
  const constraints = useConstraints();
  const translator = useTranslator();

  const [resourcesArr, setResourcesArr] = useState<IListboxResource[] | undefined>(undefined);
  const app = useApp() as EngineAPI.IApp;

  const model = useModel();
  const layout = useLayout() as IFilterPaneLayout;

  store.setState({
    app,
    model,
    isSmallDevice: sense?.isSmallDevice,
  });

  const containerElement = <IContainerElement>useElement();

  useEffect(() => {
    if (!app || !layout) {
      return;
    }
    getListBoxResources(app, layout).then((resArr: ListboxResourcesArr) => {
      setResourcesArr(resArr || []);
    });
  }, [app, layout]);

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

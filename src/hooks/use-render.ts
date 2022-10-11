import { embed, stardust, useApp, useEffect, useElement, useLayout, useModel, useOptions, usePromise, useState, useConstraints } from "@nebula.js/stardust";
import { store, IStore } from '../store';
import getListBoxResources from "./listbox/get-listbox-resources";
import { IContainerElement, IListLayout, IListBoxOptions, IFilterPaneLayout, IListboxResource, ListboxResourcesArr } from './types';
import { render, teardown } from "../components/root";
import './style.scss';
import { IEnv } from '../types/types';

interface IUseOptions {
  listboxOptions?: IListBoxOptions;
  zoomSelf?: () => void;
}

export default function useRender({ flags, sense }: IEnv) {
  const options = useOptions() as IUseOptions;
  const constraints = useConstraints();
  const { isEnabled } = flags;

  const [resourcesArr, setResourcesArr] = useState<IListboxResource[] | undefined>(undefined);
  const app = useApp() as EngineAPI.IApp;

  const model = useModel();
  const layout = useLayout() as IFilterPaneLayout;

  store.setState({ app, model, layout });

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
        constraints,
      },
    );
    return (() => {
      teardown(root);
    });
  }, [resourcesArr, constraints, sense]);
}

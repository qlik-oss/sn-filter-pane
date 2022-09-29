import { embed, stardust, useApp, useEffect, useElement, useLayout, useModel, useOptions, usePromise, useState } from "@nebula.js/stardust";
import { store, IStore } from '../store';
import getListBoxResources from "./listbox/get-listbox-resources";
import { IContainerElement, IListLayout, IListBoxOptions, IFilterPaneLayout, IListboxResource, ListboxResourcesArr } from './types';
import { render, teardown } from "../components/root";
import './style.scss';

interface IRenderArgs {
  flags: {
    isEnabled: (flag?: string) => boolean;
  };
}

interface IUseOptions {
  onFullscreen?: (modelId: string) => void;
  listboxOptions?: IListBoxOptions;
}

export default function useRender({ flags }: IRenderArgs) {
  const options = useOptions() as IUseOptions;
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
      return;
    }
    const root = render(containerElement, resourcesArr, app, options.listboxOptions ?? {}, options.onFullscreen);
    return (() => {
      teardown(root);
    })
  }, [resourcesArr]);
}

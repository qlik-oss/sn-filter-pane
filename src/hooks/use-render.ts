import { embed, stardust, useApp, useEffect, useElement, useLayout, useModel, useOptions, usePromise, useState } from "@nebula.js/stardust";
import { store, IStore } from '../store';
import getListBoxResources from "./listbox/get-listbox-resources";
import renderListBox from "./listbox/render-listbox";
import { IContainerElement, IListLayout, IListBoxOptions, IFilterPaneLayout, IListboxResources, ListboxResourcesArr } from './types';
import './style.scss';

interface IRenderArgs {
  flags: {
    isEnabled: (flag?: string) => boolean;
  };
}

interface IUseOptions {
  toggleExpand?: () => void;
}

export default function useRender({ flags }: IRenderArgs ) {
  const options = useOptions() as IUseOptions;
  const { isEnabled } = flags;

  const [resourcesArr, setResourcesArr] = useState(undefined);
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
    if (!resourcesArr?.length) {
      return;
    }
    const lbInstances = resourcesArr.map((resources: IListboxResources, index: number) => {
      const element = document.createElement('div');
      element.id = `filterpane-container-${index}`;
      element.className = 'filterpane-container';
      element.style.height = '45%';
      containerElement.appendChild(element);

      // Assign an element container for each ListBox and render it within it.
      return renderListBox({
        resources: {
          ...resources,
          app,
          isEnabled,
        },
        element,
        options: {},
      });
    });

    if (options.toggleExpand) { // TODO: Should only be visible when listboxes does not fit.
      const button = document.createElement('button'); // TODO: Use lui-icon--more
      button.innerHTML = 'expand...';
      button.onclick = options.toggleExpand;
      containerElement.appendChild(button);
    }

    return () => {
      lbInstances.forEach(((destroy) => destroy()));
      containerElement.replaceChildren();
    }
  }, [resourcesArr]);

  // [
  //   // This dependency array should have props that must trigger a re-render
  //   element,
  //   fieldInstance,
  //   selectionsApi,
  //   search,
  //   // Editing Data > Dimensions - Pane > Re-ordering panes
  //   layout?.qInfo?.qId,
  //   // Editing Data > Dimensions - Pane > Field
  //   getFieldName(layout),
  // ]);

}
import { embed, stardust, useApp, useEffect, useElement, useLayout, useModel, usePromise, useState } from "@nebula.js/stardust";
import { store, IStore } from '../store';
import getListBoxResources from "./listbox/get-listbox-resources";
import renderListBox from "./listbox/render-listbox";
import { IContainerElement, IListLayout, IListBoxOptions, IFilterPaneLayout, IListboxResources, ListboxResourcesArr } from './types';

interface IRenderArgs {
  flags: {
    isEnabled: (flag?: string) => boolean;
  };
}


export default function useRender({ flags }: IRenderArgs ) {
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
      element.id = `listbox-container-${index}`;
      element.className = 'listbox-container';
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
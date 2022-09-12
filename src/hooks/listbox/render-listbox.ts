
import { embed, stardust, useApp, useEffect, useElement, useLayout, useModel, useState } from "@nebula.js/stardust";
import { IContainerElement, IListLayout, IListBoxOptions, IFilterPaneLayout, IListboxResources } from '../types';

import { getFieldName, postProcessPages } from './funcs';

interface IRenderListBoxOptions {
  resources: IListboxResources & {
    isEnabled: (flag?: string) => boolean;
    app: EngineAPI.IApp
  };
  options: IListBoxOptions;
  element: HTMLDivElement;
}

export default function renderListBox({ element, resources, options }: IRenderListBoxOptions) {
  const { isEnabled, app, layout, properties, model, id } = resources;

  const listBoxOptionsDefaults: IListBoxOptions = {
    dqEnabled: false,
    sessionModel: model,
    update: () => {},
  };

  const opts = {
    ...listBoxOptionsDefaults,
    ...options || {},
  };

  const { dqEnabled, selectionsApi, search, checkboxes } = opts;
  const fieldName = getFieldName(layout);

  const checkboxesEnabled = dqEnabled && checkboxes !== false;

  // selectionsApi.isModal = () => backendApi.model === app?.modalSelectionObject;

  // const fetchStart = (req) => {
  //   // Track request for showing and hiding the loading ui.
  //   scope.object.throbberApi.trackRequest(req);
  // };

  const n = embed(app);
  const instPromise = n.field(fieldName);
  instPromise.then((fieldInstance) => {
    fieldInstance.mount(element, {
      title: getFieldName(layout),
      search: search && (!dqEnabled || (dqEnabled && isEnabled('DIRECT_QUERY_SEARCH'))),
      toolbar: false,
      checkboxes: checkboxesEnabled,
      stateName: layout.qStateName,
      // @ts-ignore
      __DO_NOT_USE__: {
        focusSearch: true,
        // @ts-ignore
        // sessionModel,
        selectionsApi,
        // @ts-ignore
        // update,
        // @ts-ignore
        // fetchStart,
        // selectDisabled: () => !selectionsApi.allowedToSelect(),
        showGray: !dqEnabled,
        postProcessPages: dqEnabled ? postProcessPages : undefined,
        calculatePagesHeight: dqEnabled,
      },
    });
  });


  return () => {
    // destroy
    instPromise?.then((fieldInstance) => fieldInstance.unmount());
    selectionsApi?.destroy();
  };
}
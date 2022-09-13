import { IListBoxOptions, IListLayout } from "../types";
import { postProcessPages } from "./funcs";

export default function mergeListboxOptions(listboxOptions: IListBoxOptions, fieldName: string, layout: IListLayout) {
  const listBoxOptionsDefaults: IListBoxOptions = {
    dqEnabled: false,
    update: () => { },
  };

  const o = {
    ...listBoxOptionsDefaults,
    ...listboxOptions || {},
  };

  return {
    title: fieldName,
    search: o.search, // && (!dqEnabled || (dqEnabled && isEnabled('DIRECT_QUERY_SEARCH'))),
    toolbar: false,
    checkboxes: o.dqEnabled && o.checkboxes !== false,
    stateName: layout.qStateName,
    __DO_NOT_USE__: {
      focusSearch: true,
      // sessionModel,
      selectionsApi: o.selectionsApi,
      // update,
      // fetchStart,
      // selectDisabled: () => !selectionsApi.allowedToSelect(),
      showGray: !o.dqEnabled,
      postProcessPages: o.dqEnabled ? postProcessPages : undefined,
      calculatePagesHeight: o.dqEnabled,
    },
  };
}

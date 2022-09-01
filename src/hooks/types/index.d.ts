export interface IContainerElement extends HTMLDivElement {
  current: HTMLElement
};

export interface IListLayout extends EngineAPI.IGenericListLayout {
  title: string;
  qStateName: string;
};


interface ISessionModel {
  [key]: any;
}

interface ISelectionsApi {
  isModal: () => boolean;
  destroy: () => void;
  allowedToSelect: () => boolean;
}

export interface IListBoxOptions {
  title?: string;
  direction?: stardust.Direction;
  listLayout?: stardust.ListLayout;
  frequencyMode?: stardust.FrequencyMode;
  histogram?: boolean;
  search?: stardust.SearchMode;
  toolbar?: boolean;
  checkboxes?: boolean;
  dense?: boolean;
  dqEnabled?: boolean;
  selectionsApi?: ISelectionsApi
  sessionModel?: ISessionModel;
  stateName?: string;
  properties?: object;
  update?: () => void;
}

export interface IFilterPaneLayout {
  qChildList?: {
    qItems: { qInfo: { qId: string } }[];
  };
}

export interface IListboxResources {
  id: string;
  model: GenericObjectModel;
  layout: IListLayout;
  properties: EngineAPI.IGenericObjectProperties;
}

export type ListboxResourcesArr = array & IListboxResources[];
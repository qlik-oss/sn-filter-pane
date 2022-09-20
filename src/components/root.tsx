import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { IContainerElement, IListBoxOptions, IListboxResource } from '../hooks/types';
import ListboxGrid from './ListboxGrid/ListboxGrid';

export function render(element: IContainerElement, resources: IListboxResource[], app: EngineAPI.IApp, listboxOptions: IListBoxOptions) {
  const root = createRoot(element);
  root.render(<ListboxGrid resources={resources} app={app} listboxOptions={listboxOptions}/>);

  return root;
}

export function teardown(root: Root) {
  root.unmount();
}

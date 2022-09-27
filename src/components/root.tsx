import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { IContainerElement, IListBoxOptions, IListboxResource } from '../hooks/types';
import ListboxGrid from './ListboxGrid/ListboxGrid';
import theme from '../theme/theme';

export function render(element: IContainerElement, resources: IListboxResource[], app: EngineAPI.IApp, listboxOptions: IListBoxOptions) {
  const root = createRoot(element);
  root.render(
    <ThemeProvider theme={theme}>
      <ListboxGrid resources={resources} app={app} listboxOptions={listboxOptions} />
    </ThemeProvider>,
  );

  return root;
}

export function teardown(root: Root) {
  root.unmount();
}

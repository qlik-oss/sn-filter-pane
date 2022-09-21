import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import Grid from '@mui/material/Grid';
// @ts-ignore
import { ResizableBox } from 'react-resizable';
import debounce from 'lodash/debounce';
import { getColumnCount, getColumnWidthPercent, getWidth, getWidthForRestOfColumns } from './get-size';
import { IListBoxOptions, IListboxResource } from '../../hooks/types';
import ListboxContainer from '../ListboxContainer';
import 'react-resizable/css/styles.css';
import ElementResizeListener from '../ElementResizeListener';
import distributeResources from './distribute-resources';

interface ListboxGridProps {
  app: EngineAPI.IApp;
  listboxOptions: IListBoxOptions;
  resources: IListboxResource[];
}

export default function ListboxGrid(props: ListboxGridProps) {
  const { resources, app, listboxOptions } = props;
  const [width, setWidth] = useState(0);
  const gridRef = useRef<HTMLDivElement>();
  const [resourcesFirst, setResourcesFirst] = useState<IListboxResource[]>([]);
  const [resourcesRest, setResourcesRest] = useState<IListboxResource[] | undefined>([]);
  const maxColumns = resources.length;

  const handleResize = useCallback(() => {
    const { newWidth } = getWidth(gridRef.current?.offsetWidth ?? 0);
    setWidth(newWidth);
    const { firstColumn, restOfColumns } = distributeResources(resources, getColumnCount(newWidth, maxColumns));
    if (firstColumn.length !== resourcesFirst.length) {
      setResourcesFirst(firstColumn);
      setResourcesRest(restOfColumns);
    }
  }, []);

  useEffect(() => {
    if (gridRef.current) {
      handleResize();
    }
  }, []);

  const dHandleResize = debounce(handleResize, 50); // TODO: Remove debounce when used in a snap grid (like sense-client).

  // TODO: Remove ResizableBox, only for developing purposes
  return (
    <>
      <ResizableBox width={1100} height={1100} minConstraints={[100, 100]} maxConstraints={[1220, 1220]}>
        <ElementResizeListener onResize={dHandleResize} />
        <Grid container columns={1 + +!!resourcesRest?.length} ref={gridRef as any} spacing={1} height='100%'>

          {/* First column */}
          <Grid item width={`${getColumnWidthPercent(width, maxColumns)}%`}>
            <Grid container columns={1} height='100%' spacing={1}>
              {resourcesFirst.map((resource: IListboxResource) => (
                <Grid item key={resource.id} width='100%' xs={1}>
                  <ListboxContainer layout={resource.layout} app={app} listboxOptions={listboxOptions} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Rest of columns */}
          {!!resourcesRest?.length
            && <Grid item width={`${getWidthForRestOfColumns(width, maxColumns)}%`}>
              <Grid container height='100%' spacing={1} columns={getColumnCount(width, maxColumns) - 1}>
                {resourcesRest?.map((resource: IListboxResource) => (
                  <Grid item key={resource.id} height='100%' width='100%' xs={1}>
                    <ListboxContainer layout={resource.layout} app={app} listboxOptions={listboxOptions} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          }
        </Grid>
      </ResizableBox>
    </>
  );
}

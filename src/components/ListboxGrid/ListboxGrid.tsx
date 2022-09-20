import React, { useEffect, useRef, useState } from 'react';
import Grid, { GridTypeMap } from '@mui/material/Grid';
// @ts-ignore
import { ResizableBox } from 'react-resizable';
import debounce from 'lodash/debounce';
import { getColumnCount, getColumnWidth, getHeight } from './get-size';
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
  const gridRef = useRef<any>();
  const [resourcesFirst, setResourcesFirst] = useState<IListboxResource[]>([]);
  const [resourcesRest, setResourcesRest] = useState<IListboxResource[] | undefined>([]);

  const handleResize = () => {
    const { newWidth } = getHeight(gridRef.current?.offsetWidth ?? 0, resources.length);
    setWidth(newWidth);
    const { firstColumn, restOfColumns } = distributeResources(resources, getColumnCount(newWidth));
    if (firstColumn.length !== resourcesFirst.length) {
      setResourcesFirst(firstColumn);
      setResourcesRest(restOfColumns);
    }
  };

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
        <Grid container columns={1 + +!!resourcesRest?.length} ref={gridRef} spacing={1} height={'100%'}>

          {/* First column */}
          <Grid item width={`${getColumnWidth(width)}%`}>
            <Grid container columns={1} height={'100%'} spacing={1}>
              {resourcesFirst.map((resource: IListboxResource, index: number) => (
                <Grid item key={index} width={'100%'} xs={1}>
                  <ListboxContainer layout={resource.layout} app={app} listboxOptions={listboxOptions} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Rest of columns */}
          {!!resourcesRest?.length
            && <Grid item width={`${getColumnWidth(width) * (getColumnCount(width) - 1)}%`}>
              <Grid container height={'100%'} spacing={1} columns={getColumnCount(width) - 1}>
                {resourcesRest?.map((resource: IListboxResource, index: number) => (
                  <Grid item key={index} height={'100%'} width={'100%'} xs={1}>
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

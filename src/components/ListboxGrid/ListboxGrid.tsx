import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import Grid from '@mui/material/Grid';
// @ts-ignore
import { ResizableBox } from 'react-resizable';
import debounce from 'lodash/debounce';
import { getColumnCount, getColumnWidthPercent, getWidthHeight, getWidthForRestOfColumns } from './get-size';
import { IListBoxOptions, IListboxResource } from '../../hooks/types';
import ListboxContainer from '../ListboxContainer';
import 'react-resizable/css/styles.css';
import ElementResizeListener from '../ElementResizeListener';
import { distributeResources, distributeResourcesInFirstCoulumn } from './distribute-resources';
import { FoldedListbox } from '../FoldedListbox';
import { ExpandButton } from '../ExpandButton';

interface ListboxGridProps {
  app: EngineAPI.IApp;
  listboxOptions: IListBoxOptions;
  resources: IListboxResource[];
}

export default function ListboxGrid(props: ListboxGridProps) {
  const { resources, app, listboxOptions } = props;
  const [wh, setWidthHeight] = useState({ width: 0, height: 0 });
  const gridRef = useRef<HTMLDivElement>();
  const [resourcesFirstFolded, setResourcesFirstFolded] = useState<IListboxResource[]>([]);
  const [resourcesFirstExpanded, setResourcesFirstExpanded] = useState<IListboxResource[]>([]);
  const [resourcesRest, setResourcesRest] = useState<IListboxResource[] | undefined>([]);
  const [showExpandButton, setshowExpandButton] = useState<boolean>(false);
  const maxColumns = resources.length;

  const handleResize = useCallback(() => {
    const { newWidth, newHeight } = getWidthHeight(gridRef);
    setWidthHeight({ width: newWidth, height: newHeight });
    const { firstColumn, restOfColumns } = distributeResources(resources, getColumnCount(newWidth, maxColumns));
    const { expanded, folded, expandButton } = distributeResourcesInFirstCoulumn(firstColumn, newHeight, resourcesFirstFolded.length + +showExpandButton, resourcesFirstExpanded, resourcesFirstFolded);
    if (folded.length !== resourcesFirstFolded.length || restOfColumns?.length !== resourcesRest?.length) {
      setResourcesFirstExpanded(expanded);
      setResourcesFirstFolded(folded);
      setResourcesRest(restOfColumns);
      setshowExpandButton(expandButton);
    }
  }, [maxColumns, resources, resourcesRest?.length, resourcesFirstFolded, resourcesFirstExpanded, showExpandButton]);

  useEffect(() => {
    if (gridRef.current) {
      handleResize();
    }
  }, []);

  const showFoldedInRestColumns = () => wh.height < 170;
  const foldedHeight = () => resourcesFirstFolded.length * 58;
  const dHandleResize = debounce(handleResize, 50); // TODO: Remove debounce when used in a snap grid (like sense-client).

  // TODO: Remove ResizableBox, only for developing purposes
  return (
    <>
      <ResizableBox width={1100} height={1100} minConstraints={[100, 100]} maxConstraints={[1220, 1820]}>
        <ElementResizeListener onResize={dHandleResize} />
        <Grid container columns={1 + +!!resourcesRest?.length} ref={gridRef as any} spacing={1} height='100%'>

          {/* First column */}
          <Grid item width={`${getColumnWidthPercent(wh.width, maxColumns)}%`}>

            {/* Folded */}
            <Grid container columns={1} spacing={1}>
              {showExpandButton && <Grid item width='100%' xs={1}>
                <ExpandButton s={'Expand...'} />
              </Grid>}
              {resourcesFirstFolded.map((resource: IListboxResource) => (
                <Grid item key={resource.id} width='100%' xs={1}>
                  <FoldedListbox layout={resource.layout} />
                </Grid>
              ))}
            </Grid>

            {/* Expanded */}
            <Grid container columns={1} height={`calc(100% - ${foldedHeight()}px)`}>
              {resourcesFirstExpanded.map((resource: IListboxResource) => (
                <Grid item key={resource.id} width='100%' xs={1} paddingTop='8px'>
                  <ListboxContainer layout={resource.layout} app={app} listboxOptions={listboxOptions} />
                </Grid>
              ))}
            </Grid>

          </Grid>

          {/* Rest of columns */}
          {!!resourcesRest?.length
            && <Grid item width={`${getWidthForRestOfColumns(wh.width, maxColumns)}%`}>
              <Grid container height='100%' spacing={1} columns={getColumnCount(wh.width, maxColumns) - 1}>
                {resourcesRest?.map((resource: IListboxResource) => (
                  <Grid item key={resource.id} height='100%' width='100%' xs={1}>
                    {showFoldedInRestColumns()
                      ? <FoldedListbox layout={resource.layout} />
                      : <ListboxContainer layout={resource.layout} app={app} listboxOptions={listboxOptions} />
                    }
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

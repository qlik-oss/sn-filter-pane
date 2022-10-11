import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
// @ts-ignore
import { ResizableBox } from 'react-resizable';
import debounce from 'lodash/debounce';
import getWidthHeight from './get-size';
import { IListBoxOptions, IListboxResource } from '../../hooks/types';
import ListboxContainer from '../ListboxContainer';
import 'react-resizable/css/styles.css';
import ElementResizeListener from '../ElementResizeListener';
import {
  setDefaultValues, balanceColumns, calculateColumns, calculateExpandPriority, COLLAPSED_HEIGHT, mergeColumnsAndResources,
} from './distribute-resources';
import { FoldedListbox } from '../FoldedListbox';
import { ExpandButton } from '../ExpandButton';
import { IColumn, ISize } from './interfaces';
import { ColumnGrid } from './grid-components/ColumnGrid';
import { Column } from './grid-components/Column';
import { ColumnItem } from './grid-components/ColumnItem';
import ConditionalWrapper from './ConditionalWrapper';

export interface ListboxGridProps {
  app: EngineAPI.IApp;
  listboxOptions: IListBoxOptions;
  resources: IListboxResource[];
  onFullscreen?: () => void;
  constraints?: { active?: boolean, passive?: boolean };
}

// TODO: Remove
const Resizable = styled(ResizableBox)(() => ({
  position: 'absolute',
}));

export default function ListboxGrid(props: ListboxGridProps) {
  const {
    resources,
    app,
    listboxOptions,
    onFullscreen,
    constraints,
  } = props;
  const gridRef = useRef<HTMLDivElement>();
  const zoomEnabled = true; // TODO: Get from sense-client
  const [columns, setColumns] = useState<IColumn[]>([]);
  const [disableExpandButton, setDisableExpandButton] = useState(false);

  const handleResize = useCallback(() => {
    const { width, height } = getWidthHeight(gridRef);
    const size: ISize = { width, height, dimensionCount: resources.length };
    const calculatedColumns = calculateColumns(size, [], zoomEnabled);
    const balancedColumns = balanceColumns(size, calculatedColumns);
    const resourcesWithDefaultValues = setDefaultValues(resources);
    const mergedColumnsAndResources = mergeColumnsAndResources(balancedColumns, resourcesWithDefaultValues);
    const expandedAndCollapsedColumns = calculateExpandPriority(mergedColumnsAndResources, size);
    setColumns(expandedAndCollapsedColumns);
  }, [resources, zoomEnabled]);

  useEffect(() => {
    if (gridRef.current) {
      handleResize();
    }
  }, []);

  useEffect(() => {
    setDisableExpandButton(!!constraints?.active);
  }, [constraints?.active]);

  const dHandleResize = debounce(handleResize, 50); // TODO: Remove debounce when used in a snap grid (like sense-client).

  // TODO: Remove Resizable, only for developing purposes
  return (
    <>
      <ConditionalWrapper condition={typeof (onFullscreen) !== 'function'}
        wrapper={(children: JSX.Element[]) => <Resizable width={1080} height={1000} minConstraints={[10, 10]} maxConstraints={[1220, 1820]}>{children}</Resizable>}
      >
        <ElementResizeListener onResize={dHandleResize} />
        <Grid container columns={columns?.length} ref={gridRef as any} spacing={1} height='100%'>

          {!!columns?.length && columns?.map((column: IColumn, i: number) => (
            <ColumnGrid key={i} widthPercent={100 / columns.length}>
              <Column>

                {!!column?.items?.length && column.items.map((item: IListboxResource) => (
                  <ColumnItem key={item.id} height={item.expand ? item.height : COLLAPSED_HEIGHT}>
                    {item.expand
                      ? <ListboxContainer layout={item.layout} app={app} listboxOptions={listboxOptions}></ListboxContainer>
                      : <FoldedListbox layout={item.layout}></FoldedListbox>
                    }
                  </ColumnItem>
                ))}

                {column.showAll
                  && <ColumnItem height='100%'>
                    <ExpandButton onClick={onFullscreen} disabled={disableExpandButton}></ExpandButton>
                  </ColumnItem>}
                {/* TODO: When {column.showAll && object.expanded} inform user that not all items are shown. (Get object.expanded from sense-client) */}
              </Column>

            </ColumnGrid>
          ))}

        </Grid>
      </ConditionalWrapper>
    </>
  );
}

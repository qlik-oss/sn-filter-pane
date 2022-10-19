import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Grid, Typography } from '@mui/material';
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
import { store } from '../../store';

export interface ListboxGridProps {
  listboxOptions: IListBoxOptions;
  resources: IListboxResource[];
  onFullscreen?: () => void;
  isZoomed?: boolean;
}

// TODO: Remove
const Resizable = styled(ResizableBox)(() => ({
  position: 'absolute',
}));

export default function ListboxGrid(props: ListboxGridProps) {
  const {
    resources,
    listboxOptions,
    onFullscreen,
    isZoomed,
  } = props;

  const { app, constraints, translator: t } = store.getState();

  const gridRef = useRef<HTMLDivElement>();
  const [columns, setColumns] = useState<IColumn[]>([]);
  const isInSense = typeof (onFullscreen) === 'function';

  const handleResize = useCallback(() => {
    const { width, height } = getWidthHeight(gridRef);
    const size: ISize = { width, height, dimensionCount: resources.length };
    const calculatedColumns = calculateColumns(size, []);
    const balancedColumns = balanceColumns(size, calculatedColumns);
    const resourcesWithDefaultValues = setDefaultValues(resources);
    const mergedColumnsAndResources = mergeColumnsAndResources(balancedColumns, resourcesWithDefaultValues);
    const expandedAndCollapsedColumns = calculateExpandPriority(mergedColumnsAndResources, size);
    setColumns(expandedAndCollapsedColumns);
  }, [resources]);

  useEffect(() => {
    if (gridRef.current) {
      handleResize();
    }
  }, []);

  const dHandleResize = debounce(handleResize, isInSense ? 0 : 50);

  // TODO: Remove Resizable, only for developing purposes
  return (
    <>
      <ConditionalWrapper condition={!isInSense}
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
                      ? <ListboxContainer layout={item.layout} app={app} listboxOptions={listboxOptions} constraints={constraints}></ListboxContainer>
                      : <FoldedListbox layout={item.layout}></FoldedListbox>
                    }
                  </ColumnItem>
                ))}

                {column.showAll && !isZoomed
                  && <ColumnItem height='100%'>
                    <ExpandButton onClick={onFullscreen} disabled={constraints?.active}></ExpandButton>
                  </ColumnItem>}
                {column.showAll && isZoomed
                  && <ColumnItem height='100%'>
                    <Typography>{t?.get('Tooltip.Filterpane.NotAllItemsShow')}</Typography>
                  </ColumnItem>}
              </Column>

            </ColumnGrid>
          ))}
        </Grid>
      </ConditionalWrapper>
    </>
  );
}

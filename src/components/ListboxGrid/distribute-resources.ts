import { IListboxResource } from '../../hooks/types';
import { IColumn, ISize } from './interfaces';

export const COLLAPSED_HEIGHT = 58;
export const BUTTON_HEIGHT = 50;
const BUTTON_SPACING = 8;
const ITEM_SPACING = 0;
const EXPANDED_HEIGHT = 140;
const COLUMN_MIN_WIDTH = 160;
const COLUMN_SPACING = 16;
const EXPANDED_HEADER_HEIGHT = 64;
const EXPANDED_ROW_HEIGHT = 32;
const SEARCH_BAR = 40;
/* eslint-disable no-param-reassign */

// TODO: ResponsiveState.isSmallDevice return 1
export const getMaxColumns = (size: ISize) => Math.floor((size.width + COLUMN_SPACING) / (COLUMN_MIN_WIDTH + COLUMN_SPACING)) || 1;

export const getMaxItemsPerColumn = (size: ISize) => Math.max(1, Math.floor((size.height + ITEM_SPACING) / (COLLAPSED_HEIGHT + ITEM_SPACING)));

export const getColumnItemsCount = (columns: IColumn[]) => {
  let count = 0;

  columns.forEach((column) => {
    count += (column.itemCount ?? 0);
  });

  return count;
};

export const getHeightOf = (collapsedItemCount: number) => {
  // Subtract one ITEM_SPACING since the first item wont have a margin-top of ITEM_SPACING
  const height = (COLLAPSED_HEIGHT + ITEM_SPACING) * collapsedItemCount - ITEM_SPACING;
  return Math.max(height, 0);
};

export const getDimensionCardinal = (item: IListboxResource) => item.layout.qListObject.qDimensionInfo.qCardinal;

export const getHeightOfExpanded = (dimensionCardinal: number) => {
  const height = dimensionCardinal * EXPANDED_ROW_HEIGHT + EXPANDED_HEADER_HEIGHT + SEARCH_BAR + 3;
  return height;
};

export const doesAllFit = (itemsPerColumn: number, columnCount: number, itemCount: number) => itemCount <= itemsPerColumn * columnCount;

// TODO: Responive.isSmallDevice return false;
export const haveRoomToExpandOne = (size: ISize, column: IColumn) => {
  const spacing = (column.itemCount ?? 0) > 1 ? ITEM_SPACING : 0;
  return size.height > getHeightOf((column.itemCount ?? 0) - 1) + EXPANDED_HEIGHT + spacing;
};

export const calculateColumns = (size: ISize, columns: IColumn[], zoomEnabled: boolean) => {
  // const canExpand = !ResponsiveState.isSmallDevice && size.height > EXPANDED_HEIGHT; // TODO:
  const canExpand = size.height > EXPANDED_HEIGHT;
  const maxColumns = getMaxColumns(size);
  const maxPerColumn = getMaxItemsPerColumn(size);
  const usedCount = getColumnItemsCount(columns);

  if (canExpand && doesAllFit(maxPerColumn, maxColumns - columns.length - 1, size.dimensionCount - usedCount - 1)) {
    columns.push({
      expand: true,
      itemCount: 1,
    });
    if (usedCount + 1 < size.dimensionCount) {
      columns = calculateColumns(size, columns, zoomEnabled);
    }
  } else {
    let itemCount;

    // Default case with zoom enabled, now overflow and (...) to zoom object
    itemCount = Math.min(size.dimensionCount - usedCount, maxPerColumn);

    // TODO:
    // if (ResponsiveState.isSmallDevice) {
    // On small device all items is in a single column and overflow scrolled
    // itemCount = size.dimensionCount - usedCount;
    // } else if (!zoomEnabled) {
    if (!zoomEnabled) {
      // Don't show the fullscreen "..."-button, listboexes are collapsed and overflow is scrollable instead
      const initialItemCount = Math.ceil((size.dimensionCount - usedCount) / (maxColumns - columns.length));
      const maxItemCount = Math.max(maxPerColumn, initialItemCount);
      itemCount = Math.min(size.dimensionCount - usedCount, maxItemCount);
    }

    columns.push({
      expand: false,
      itemCount,
    });

    // Last columns and all items wont fit, show the fullscreen "..."-button to view the items that doesn't fit
    const columnsItemsCount = getColumnItemsCount(columns);
    if (columns.length >= maxColumns && maxPerColumn > 0 && columnsItemsCount < size.dimensionCount) {
      columns[columns.length - 1].showAll = true;
      if (BUTTON_HEIGHT + BUTTON_SPACING + ITEM_SPACING > size.height - getHeightOf(maxPerColumn)) {
        const lastItem = columns[columns.length - 1];
        columns[columns.length - 1].itemCount = Math.max((lastItem?.itemCount ?? 0) - 1, 0);
      }
    }

    if (getColumnItemsCount(columns) < size.dimensionCount && columns.length < maxColumns) {
      columns = calculateColumns(size, columns, zoomEnabled);
    }
  }
  return columns;
};

export const balanceColumns = (size: ISize, columns: IColumn[]) => {
  let collapsedItems = 0;
  const expanded = columns.filter((column) => column.expand);
  const collapsed = columns.filter((column) => column.expand === false);

  const canExpand = collapsed.length > 0 && !collapsed[collapsed.length - 1].showAll && haveRoomToExpandOne(size, collapsed[collapsed.length - 1]);
  if (canExpand) {
    collapsed[collapsed.length - 1].expand = true;
  } else {
    collapsedItems = getColumnItemsCount(collapsed);
    collapsed.forEach((column, index) => {
      // If the dimensions can't be evenly distributed among the
      // columns the extra dimensions should be given to the first columns
      const extraItems = index < collapsedItems % collapsed.length ? 1 : 0;
      const itemCount = Math.floor(collapsedItems / collapsed.length) + extraItems;

      column.itemCount = itemCount;
    });
  }

  return collapsed.concat(expanded);
};

export const mergeColumnsAndResources = (columns: IColumn[], resources: IListboxResource[]) => {
  columns.forEach((column: IColumn) => {
    column.items = resources.slice(0, column.itemCount);
    resources = resources.slice(column.itemCount);
  });

  return columns;
};

export const expandOne = (sortedItems: IListboxResource[] | undefined, h: number) => {
  if (!sortedItems) return false;
  let i;
  let item;
  let expandedHeight;

  for (i = 0; i < sortedItems.length; i++) {
    item = sortedItems[i];
    if (item.cardinal && !item.expand) {
      expandedHeight = getHeightOfExpanded(item.cardinal);
      if (expandedHeight < h) {
        item.expand = true;
        item.height = `${expandedHeight}px`;
        return expandedHeight + ITEM_SPACING;
      }
    }
  }

  return false;
};

export const calculateExpandPriority = (columns: IColumn[], size: ISize) => {
  columns.forEach((column: IColumn) => {
    if (column.expand) {
      let expandedCount = 0;
      let leftOverHeight = size.height - getHeightOf((column.itemCount ?? 0) - 1) - ITEM_SPACING;
      let totalExpandedHeight = 0;

      // Make sure we have the cardinal so that they can be expanded in the best order
      column?.items?.forEach((item) => {
        item.cardinal = getDimensionCardinal(item);
      });

      const sortedItems = column?.items?.concat().sort((a, b) => a.cardinal - b.cardinal);

      if ((sortedItems?.length ?? 0) > 1) {
        while (leftOverHeight > EXPANDED_HEIGHT) {
          const expHeight = expandOne(sortedItems, leftOverHeight);
          if (expHeight) {
            expandedCount++;
            totalExpandedHeight += expHeight;
            leftOverHeight = size.height - getHeightOf((column?.itemCount ?? 0) - expandedCount) - totalExpandedHeight;
          } else {
            break;
          }
        }
        const expandedItems = sortedItems?.filter((item) => item.expand);
        // Calculate total expanded height again as items might have been expanded before calculateExpandPriority
        totalExpandedHeight = 0;
        expandedItems?.forEach((item) => {
          totalExpandedHeight += getHeightOfExpanded(item.cardinal) + ITEM_SPACING;
        });
        leftOverHeight = size.height - getHeightOf((column?.itemCount ?? 0) - (expandedItems?.length ?? 0)) - totalExpandedHeight;
      }

      const collapsedItems = sortedItems?.filter((item) => !item.expand);

      if (leftOverHeight > EXPANDED_HEIGHT && collapsedItems?.length) {
        const item = collapsedItems[0]; // Only add spacing if there are more items after this.
        const spacing = collapsedItems.length > 1 ? ITEM_SPACING : 0;

        if (!item.expand) {
          if ((sortedItems?.length ?? 0) > 1) {
            // Should only set specific height when multiple items in columns, otherwise 100% height from default value
            item.height = `${size.height - getHeightOf(collapsedItems.length - 1) - totalExpandedHeight - spacing}px`;
          }
          item.expand = true;
        }
      }
    }

    // Set the render mode for collapsed LBs
    if (column?.items?.length === 1 && size.height < COLLAPSED_HEIGHT - 4) {
      // TODO: This hides the title in the old collapsed listbox, when does this occur?
      column.items[0].responsiveMode = size.height < COLLAPSED_HEIGHT * 0.5 ? 'spark' : 'small';
      column.items[0].height = `${size.height}px`;
    }
  });
  return columns;
};

export const setDefaultValues = (resources: IListboxResource[]) => resources.map((resource: IListboxResource) => {
  resource.expand = false;
  resource.height = '100%';
  return resource;
});

import { IListboxResource } from '../../hooks/types';

export const distributeResources = (resources: IListboxResource[], columnCount: number) => {
  let firstColumn;
  let restOfColumns;
  if (columnCount === 1) {
    firstColumn = resources;
  } else {
    const sliceIndex = 1 - columnCount;
    firstColumn = resources.slice(0, sliceIndex);
    restOfColumns = resources.slice(sliceIndex);
  }
  return { firstColumn, restOfColumns };
};

const removeOverflowingItems = (height: number, foldedItemHeight: number, count: number, rescources: IListboxResource[]) => {
  const sliceIndex = (height / foldedItemHeight) - count - 2;
  return rescources.slice(0, sliceIndex);
};

const foldOverflowingItems = (count: number, i: number, rescources: IListboxResource[]) => {
  const sliceIndex = Math.min(count, i);
  const foldedItems = rescources.slice(0, sliceIndex);
  const expandedItems = rescources.slice(sliceIndex);
  return { folded: foldedItems, expanded: expandedItems };
}

export const distributeResourcesInFirstCoulumn = (rescources: IListboxResource[], height: number) => {
  let expanded: IListboxResource[] = [];
  let folded: IListboxResource[] = [];
  let expandButton = false;
  const count = rescources.length;
  const foldHeight = count === 1 ? 200 : 100;
  const foldHeightStep = 50;
  const heightLimit = (i: number, high = false) => (((count - i - +high) * foldHeightStep) + foldHeight) * count;
  const foldedItemHeight = 60; // TODO: Get from FoldedListbox component

  for (let i = 0; i < count; i++) {
    if (height < heightLimit(i) && height > heightLimit(i, true)) {
      ({ folded, expanded } = foldOverflowingItems(count, i, rescources));
      break;
    } else if (height < heightLimit(i)) {
      if (height < foldedItemHeight * count) {
        folded = removeOverflowingItems(height, foldedItemHeight, count, rescources);
        expandButton = true;
      } else {
        folded = rescources;
      }
    } else {
      expanded = rescources;
    }
  }
  return { expanded, folded, expandButton };
};

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

export const distributeResourcesInFirstCoulumn = (rescources: IListboxResource[], height: number, foldedCount: number, cExpanded: IListboxResource[], cFolded: IListboxResource[]) => {
  let expanded: IListboxResource[] = [...cExpanded];
  let folded: IListboxResource[] = [...cFolded];
  let expandButton = false;
  const count = rescources.length;
  const foldedItemHeight = 60; // TODO: Get from FoldedListbox component
  const foldedItemsHeight = () => (foldedCount ? (foldedItemHeight * foldedCount) + foldedItemHeight : 0);
  const expandedCount = count - foldedCount;
  const hysteresis = () => (count === 1 ? 30 : 110);
  const expandedFactor = () => expandedCount * 30;
  const padOneFolded = () => (foldedCount === 1 ? 20 : 0);
  const foldLimit = foldedItemsHeight() + (expandedCount * 140) + expandedFactor();
  const expandLimit = foldedItemsHeight() + (expandedCount * 140) + expandedFactor() + hysteresis() + padOneFolded();

  if (height < foldLimit) {
    if (height < foldedItemHeight * count) {
      folded = removeOverflowingItems(height, foldedItemHeight, count, rescources);
      expandButton = true;
    } else {
      folded = rescources.slice(0, foldedCount + 1);
      expanded = rescources.slice(foldedCount + 1, rescources.length);
    }
  } else if (height >= expandLimit) {
    if (foldedCount > 0) {
      folded = rescources.slice(0, foldedCount - 1);
      expanded = rescources.slice(foldedCount - 1, rescources.length);
    } else {
      expanded = [...rescources];
      folded = [];
    }
  }
  // When moving a resource from rest of columns to this (firstColumn) and height is between fold- and expand-limit, we need to add the missing.
  if (folded.length + expanded.length !== rescources.length && !expandButton) {
    const foldedAndExpanded = [...folded, ...expanded];
    const missingResource = rescources.filter((res) => foldedAndExpanded.every((fe) => fe.id !== res.id));
    expanded = [...expanded, ...missingResource];
  }

  return { expanded, folded, expandButton };
};

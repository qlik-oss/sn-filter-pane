import { IListboxResource } from '../../hooks/types';

const distributeResources = (resources: IListboxResource[], columnCount: number) => {
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

export default distributeResources;

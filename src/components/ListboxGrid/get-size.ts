export const getWidth = (refWidth: number) => {
  const width = refWidth - 4;
  return { newWidth: width };
};

export const getColumnCount = (width: number, maxColumns: number) => {
  const maxColumnWidth = 170;
  let count = Math.floor(width / maxColumnWidth);
  count = Math.min(count, maxColumns);
  count = Math.max(count, 1);
  return count;
};

export const getColumnWidthPercent = (width: number, maxColumns: number) => 100 / getColumnCount(width, maxColumns);

export const getWidthForRestOfColumns = (width: number, maxColumns: number) => getColumnWidthPercent(width, maxColumns) * (getColumnCount(width, maxColumns) - 1);

export const getWidthHeight = (ref: React.MutableRefObject<HTMLDivElement | undefined>) => {
  const width = ref?.current?.offsetWidth ?? 0;
  const height = ref?.current?.offsetHeight ?? 0;
  return { newWidth: width, newHeight: height };
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

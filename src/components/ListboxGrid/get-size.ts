export const getHeight = (refWidth: number, resourceCount: number) => {
  const width = refWidth / resourceCount - 4;
  return { newWidth: width };
};

export const getColumnCount = (width: number) => {
  const maxColumnWidth = 50;
  return Math.ceil(width / maxColumnWidth);
};

export const getColumnWidth = (width: number) => 100 / getColumnCount(width);

export const getWidthForRestOfColumns = (width: number) => getColumnWidth(width) * (getColumnCount(width) - 1);

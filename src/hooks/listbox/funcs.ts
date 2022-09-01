import { IListLayout } from "../types";

export const getFieldName = (layout: IListLayout | undefined): string => {
  return layout && (layout.title || layout.qListObject?.qDimensionInfo.qFallbackTitle) || '';
}


/**
 * Set qHeight of each page corresponding to the number of items of that page,
 * since this is not done correctly in the backend in DQ mode (to be fixed in Engine).
 *
 * @param {object[]} pages
 * @returns {object[]} The same pages array but with overridden qHeight.
 */
export function postProcessPages(pages: any[]) {
  const newPages = pages.map((page) => {
    const qArea = {
      ...page.qArea,
      qHeight: page.qMatrix.length,
    };
    return {
      ...page,
      qArea,
    };
  });
  return newPages;
}


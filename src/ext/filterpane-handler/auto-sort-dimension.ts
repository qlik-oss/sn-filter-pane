export default function autoSortDimension(dimension, fields) {
  dimension.qDef.qSortCriterias = [];
  dimension.qDef.autoSort = true;

  if (fields) {
    fields.forEach((field, index) => {
      dimension.qDef.qSortCriterias[index] = {
        qSortByState: 1,
        qSortByLoadOrder: 1,
        qSortByNumeric: 1,
        qSortByAscii: 1,
      };
    });
  } else {
    // Special case for global selector
    dimension.qDef.qSortCriterias[0] = {
      qSortByState: 1,
      qSortByLoadOrder: 1,
      qSortByNumeric: 1,
      qSortByAscii: 1,
    };
  }
}
// import uid from './uid';

const nxDimension = (f) => ({
  qDef: {
    qFieldDefs: [f],
  },
});


export default function filterPaneHandler({ dc, def, properties }) {
  dc.qInitialDataFetch = dc.qInitialDataFetch || [];

  const objectProperties = properties;

  const handler = {
    dimensions() {
      if (!dc.qLibraryId && (!dc.qDef || !dc.qDef.qFieldDefs || dc.qDef.qFieldDefs.length === 0)) return [];
      return [dc];
    },
    measures() {
      return [];
    },
    addDimension(d) {
      const dimension =
        typeof d === 'string'
          ? nxDimension(d)
          : {
              ...d,
              qDef: d.qDef || {},
            };
      dimension.qDef.cId = dimension.qDef.cId || uid();

      dimension.qDef.qSortCriterias = dc.qDef.qSortCriterias || [
        {
          qSortByState: 1,
          qSortByLoadOrder: 1,
          qSortByNumeric: 1,
          qSortByAscii: 1,
        },
      ];
      Object.keys(dimension).forEach((k) => {
        dc[k] = dimension[k];
      });

      // hc.qDimensions.push(dimension);

      def.dimensions.added(dimension, objectProperties);
    },
    removeDimension(idx) {
      const dimension = dc;
      delete dc.qDef;
      delete dc.qLibraryId;
      def.dimensions.removed(dimension, objectProperties, idx);
    },
    addMeasure() {},
    removeMeasure() {},

    maxDimensions() {
      const { max } = def.dimensions || {};
      const maxDims = typeof max === 'function' ? max() : max;
      return maxDims || 0;
    },
    maxMeasures() {
      return 0;
    },
    canAddDimension() {
      return handler.dimensions().length < handler.maxDimensions();
    },
    canAddMeasure() {
      return false;
    },
  };

  return handler;
}

// import create from 'zustand/vanilla';
import extend from 'extend';
import { store, IStore } from './store';

const defaultListboxProps = {
  qListObjectDef: {
    qDef: {
      qSortCriterias: [
        {
          qSortByState: 1,
          qSortByAscii: 1,
          qSortByNumeric: 1,
          qSortByLoadOrder: 1,
        },
      ],
    },
    qShowAlternatives: true,
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qWidth: 0,
        qHeight: 0,
      },
    ],
  },
  showTitles: true,
  // title: "Dim1",
  subtitle: "",
  footnote: "",
  disableNavMenu: false,
  showDetails: false,
  showDetailsExpression: false,
  qStateName: "",
  qInfo: {
    qType: "listbox"
  },
  visualization: "listbox",
  targets: [],
};

export default function getData() {
  // const app = useStore((state) => state.app);

  return {
    dimensions: {
      min: 1,
      max: 1000,
    },
    qListObjectDef: {
      qShowAlternatives: true,
      qInitialDataFetch: [
        {
          qLeft: 0,
          qWidth: 1,
          qTop: 0,
          qHeight: 100,
        },
      ],
    },
    targets: [
      {
        path: '/qListObjectDef',
        dimensions: {
          min: 0,
          max: 10,
          add(dimension: EngineAPI.INxDimension, data, handler) {
            const { model: filterPaneModel } = store.getState();

            const listboxProps = extend(true, {}, defaultListboxProps, {
              title: dimension.qDef?.title || dimension.qDef?.qFieldLabels?.[0] || dimension.qDef?.qFieldDefs?.[0],
              qListObjectDef: {
                qDef: dimension.qDef,
                // cId: `listbox-${uid()}`, // <-- This will be generated automatically in lo-handler in Nebula.js
              }
            });

            // Create child must run after the calling function (i.e. the func calling add) has finished its setProperties call.
            filterPaneModel?.createChild(listboxProps, data);
            // filterPaneModel?.getProperties().then((filterPaneProps) => {
            // });
          },
          move(dimension, data) {
            // setMoveSort(data);
            // setColorVars(data);
            // customTooltipUtils.moveCallbackCustomTooltip(data, dimension);
          },
          remove(dimension, data, index) {
            const { layout, model: filterPaneModel } = store.getState();
            const layoutDim = layout.qChildList.qItems[index];
            if (layoutDim) {
              const qId = layout.qChildList.qItems[index].qInfo.qId;
              filterPaneModel.destroyChild(qId, data);
            }
          },
          replace(dimension, oldDimension, index, data) {
            console.log('replace dimension');
          },
        },
        // measures: {
        //   min: 0,
        //   max: 0,
        // },
      },
    ],
  };
}

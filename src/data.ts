// import create from 'zustand/vanilla';
import extend from 'extend';
import { store, IStore } from './store';
import uid from './utils/uid';

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
  visualization: "listbox"
};

export default function getData() {
  // const app = useStore((state) => state.app);

  return {
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

            console.log('add dimension', dimension);

            const listboxProps = extend(true, {}, defaultListboxProps, {
              title: dimension.qDef?.title || dimension.qDef?.qFieldLabels?.[0] || dimension.qDef?.qFieldDefs?.[0],
              qListObjectDef: {
                ...dimension.qDef,
                // cId: `listbox-${uid()}`, <-- This will be generated automatically in lo-handler in Nebula.js
              }
            });

            // Create child must run after the calling function (i.e. the func calling add) has finished its setProperties call.
            filterPaneModel?.createChild(listboxProps, data);
            // filterPaneModel?.getProperties().then((filterPaneProps) => {
            // });
          },
          move(dimension, data) {
            console.log('move dimension', dimension);
            // setMoveSort(data);
            // setColorVars(data);
            // customTooltipUtils.moveCallbackCustomTooltip(data, dimension);
          },
          remove(dimension, data) {
            const state = store.getState();

            // Why is dimension empty here? We need to be able to get the removed dimension's qId and 
            // remove it from the filterpane object by calling model.destroyChild(qId).

            state.model?.getChildInfos();
            // console.log('children', children);

            // const qId = dimension.qInfo.qId;
            // const dimToRemove = state.app?.getDimension(qId);

            // const dimensions = data.qListObjectDef.qDimensions;
            console.log('replace dimension', dimension);

            // const qId = app.getDimension()
            // filterPaneModel.destroyChild(qId);
            
            // setColorVars(data);
    
            // if (dimensions.length === 1) {
            //   data.qListObjectDef.qMode = 'S';
            // }
          },
          replace(dimension, oldDimension, index, data) {
            console.log('replace dimension');
          },
        },
        // measures: {
        //   min: 1,
        //   max: 1,
        // },
      },
    ],
  };
}

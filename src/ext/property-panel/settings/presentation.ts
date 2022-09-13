const presentation = {
  type: 'items',
  translation: 'properties.presentation',
  grouped: true,
  items: {
    showNavigation: {
      ref: 'navigation',
      type: 'boolean',
      translation: 'Common.Navigation',
      component: 'switch',
      defaultValue: false,
      options: [
        {
          value: true,
          translation: 'Common.Auto',
        },
        {
          value: false,
          translation: 'properties.off',
        },
      ],
    },
    bubbleSizeItems: {
      type: 'items',
      items: {
        bubbleSizes: {
          type: 'integer',
          component: 'slider',
          ref: 'dataPoint.bubbleSizes',
          translation: 'properties.dataPoints.bubbleSizes',
          min: 1,
          max: 20,
          step: 1,
          defaultValue: 5,
          show(data) {
            return data.qHyperCubeDef.qMeasures.length < 3;
          },
        },
        rangeBubbleSizes: {
          type: 'array',
          component: 'slider',
          ref: 'dataPoint.rangeBubbleSizes',
          translation: 'properties.dataPoints.bubbleSizes',
          min: 1,
          max: 20,
          step: 1,
          defaultValue: [2, 8],
          show(data) {
            return data.qHyperCubeDef.qMeasures.length >= 3;
          },
        },
      },
    },
    label: {
      type: 'items',
      items: {
        labelMode: {
          ref: 'labels.mode',
          translation: 'properties.labels',
          type: 'string',
          component: 'dropdown',
          defaultValue: 1,
          options: [
            {
              value: 1,
              translation: 'Common.Auto',
            },
            {
              value: 2,
              translation: 'Common.All',
            },
            {
              value: 0,
              translation: 'Common.None',
            },
          ],
          snapshot: {
            tid: 'property-labels',
          },
        },
        // labelModeCompressionNote: nonCompProp,
      },
    },
    gridLines: {
      type: 'items',
      snapshot: {
        tid: 'property-gridLines',
      },
      items: {
        showGridLines: {
          ref: 'gridLine.auto',
          type: 'boolean',
          translation: 'properties.gridLine.spacing',
          component: 'switch',
          defaultValue: true,
          options: [
            {
              value: true,
              translation: 'Common.Auto',
            },
            {
              value: false,
              translation: 'Common.Custom',
            },
          ],
        },
        gridSpacing: {
          ref: 'gridLine.spacing',
          type: 'number',
          component: 'dropdown',
          defaultValue: 2,
          options: [
            {
              value: 0,
              translation: 'properties.gridLine.noLines',
            },
            {
              value: 1,
              translation: 'properties.gridLine.wide',
            },
            {
              value: 2,
              translation: 'properties.gridLine.medium',
            },
            {
              value: 3,
              translation: 'properties.gridLine.narrow',
            },
          ],
          show(data) {
            return !data.gridLine.auto;
          },
        },
      },
    },
  },
};

export default presentation;

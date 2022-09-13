
// TODO: Hook in these functions.
const useDimValColShowFunc = () => false;
const persistentColorsShowFunc = () => false;


const colorsAndLegend = {
  uses: 'colorsAndLegend',
  items: {
    colors: {
      items: {
        persistentColors: {
          show(data) {
            if (useDimValColShowFunc(data)) {
              // If we allow dim value colors, then only show persistence settings if it is off
              return persistentColorsShowFunc(data) && !data?.color?.useDimColVal;
            }
            return persistentColorsShowFunc(data);
          },
        },
        colorMode: {
          options(data) {
            const colorOptions = [
              {
                value: 'primary',
                translation: 'properties.colorMode.primary',
              },
              {
                value: 'byDimension',
                translation: 'properties.colorMode.byDimension',
              },
              {
                value: 'byMeasure',
                translation: 'properties.colorMode.byMeasure',
              },
            ];
            if (data?.qHyperCubeDef?.qMeasures?.length > 0) {
              colorOptions.push({
                value: 'byExpression',
                translation: 'properties.colorMode.byExpression',
              });
            }
            return colorOptions;
          },
        },
      },
    },
    legend: {
      show(data) {
        const { auto, mode, expressionIsColor } = data.color;
        return !auto && mode !== 'primary' && (mode !== 'byExpression' || !expressionIsColor);
      },
    },
  },
};

export default colorsAndLegend;

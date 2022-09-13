export default function xAxis(env) {
  const xAxis = {
    type: 'items',
    uses: 'axis.measureAxis',
    label(properties, handler) {
      let label;
      const measure = handler.getMeasureLayouts()[0];
  
      if (measure && !measure.qError) {
        label = env.translator.get('properties.xAxisWithInfo', [measure.qFallbackTitle]);
      } else {
        label = env.translator.get('properties.xAxis');
      }
  
      return label;
    },
    items: {
      axis: {
        items: {
          show: {
            ref: 'xAxis.show',
            snapshot: {
              title: 'properties.xAxis',
              tid: 'property-xAxis',
            },
          },
          dock: {
            ref: 'xAxis.dock',
            show(data) {
              return data.xAxis.show !== 'none';
            },
            options: [
              {
                value: 'near',
                translation: 'Common.Bottom',
              },
              {
                value: 'far',
                translation: 'Common.Top',
              },
            ],
          },
          spacing: {
            ref: 'xAxis.spacing',
            show(data) {
              return data.xAxis.show !== 'none';
            },
          },
        },
      },
      minMax: {
        type: 'items',
        items: {
          autoMinMax: {
            ref: 'xAxis.autoMinMax',
          },
          minMax: {
            ref: 'xAxis.minMax',
            show(data) {
              return !data.xAxis.autoMinMax;
            },
          },
          min: {
            ref: 'xAxis.min',
            show(data) {
              return ['min', 'minMax'].includes(data.xAxis.minMax) && !data.xAxis.autoMinMax;
            },
            invalid(data) {
              if (data.xAxis.minMax === 'minMax') {
                return data.xAxis.min >= data.xAxis.max;
              }
              return false;
            },
          },
          max: {
            ref: 'xAxis.max',
            show(data) {
              return ['max', 'minMax'].includes(data.xAxis.minMax) && !data.xAxis.autoMinMax;
            },
            invalid(data) {
              if (data.xAxis.minMax === 'minMax') {
                return data.xAxis.min >= data.xAxis.max;
              }
              return false;
            },
          },
        },
      },
    },
  };

  return xAxis;
}


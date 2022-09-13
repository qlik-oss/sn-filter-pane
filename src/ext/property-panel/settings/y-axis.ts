export default function yAxis(env) {
  const yAxis = {
    type: 'items',
    uses: 'axis.measureAxis',
    label(properties, handler) {
      let label;
      const measure = handler.getMeasureLayouts()[1];
  
      if (measure && !measure.qError) {
        label = env.translator.get('properties.yAxisWithInfo', [measure.qFallbackTitle]);
      } else {
        label = env.translator.get('properties.yAxis');
      }
  
      return label;
    },
    items: {
      axis: {
        items: {
          show: {
            ref: 'yAxis.show',
            snapshot: {
              title: 'properties.yAxis',
              tid: 'property-yAxis',
            },
          },
          dock: {
            ref: 'yAxis.dock',
            show(data) {
              return data.yAxis.show !== 'none';
            },
            options(data, handler, args) {
              const nearStr = args.yMirrorMode ? 'properties.dock.right' : 'properties.dock.left';
              const farStr = args.yMirrorMode ? 'properties.dock.left' : 'properties.dock.right';
              return [
                { value: 'near', translation: nearStr },
                { value: 'far', translation: farStr },
              ];
            },
          },
          spacing: {
            ref: 'yAxis.spacing',
            show(data) {
              return data.yAxis.show !== 'none';
            },
          },
        },
      },
      minMax: {
        type: 'items',
        items: {
          autoMinMax: {
            ref: 'yAxis.autoMinMax',
          },
          minMax: {
            ref: 'yAxis.minMax',
            show(data) {
              return !data.yAxis.autoMinMax;
            },
          },
          min: {
            ref: 'yAxis.min',
            show(data) {
              return ['min', 'minMax'].includes(data.yAxis.minMax) && !data.yAxis.autoMinMax;
            },
            invalid(data) {
              if (data.yAxis.minMax === 'minMax') {
                return data.yAxis.min >= data.yAxis.max;
              }
              return false;
            },
          },
          max: {
            ref: 'yAxis.max',
            show(data) {
              return ['max', 'minMax'].includes(data.yAxis.minMax) && !data.yAxis.autoMinMax;
            },
            invalid(data) {
              if (data.yAxis.minMax === 'minMax') {
                return data.yAxis.min >= data.yAxis.max;
              }
              return false;
            },
          },
        },
      },
    },
  };

  return yAxis;
}

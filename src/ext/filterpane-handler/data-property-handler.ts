import extend from 'extend';
// import translator from '@qlik-trial/translator';
// import NumberFormatUtil from '../../../client/utils/property-logic/number-format-util';
// import { isEnabled } from '../../../../services/feature-flags';

const notSupportedError = 'Not supported in this object, need to implement in subclass.';

class DataPropertyHandler {
  constructor(opts) {
    opts = opts || {};

    this.dimensionDefinition = opts.dimensionDefinition || { max: 0 };
    this.measureDefinition = opts.measureDefinition || { max: 0 };

    if (opts.dimensionDefinition) {
      this.dimensionProperties = opts.dimensionProperties || {};
    }
    if (opts.measureDefinition) {
      this.measureProperties = opts.measureProperties || {};
    }
    if (opts.globalChangeListeners) {
      this.globalChangeListeners = opts.globalChangeListeners;
    }
    if (opts.addDimensionLabel) {
      this.addDimensionLabel = opts.addDimensionLabel;
    }

    this.app = opts.app;
  }

  setProperties(properties) {
    this.properties = properties;
  }

  setGlobalChangeListeners(arr) {
    this.globalChangeListeners = arr;
  }

  setLayout(layout) {
    this.layout = layout;
  }

  type() {
    throw new Error('Must override this method');
  }

  getDimensions() {
    return [];
  }

  getDimension(id) {
    const dimensions = this.getDimensions();
    const alternativeDimensions = this.getAlternativeDimensions();
    let i = 0;
    for (i; i < dimensions.length; ++i) {
      if (dimensions[i].qDef.cId === id) {
        return dimensions[i];
      }
    }
    for (i = 0; i < alternativeDimensions.length; ++i) {
      if (alternativeDimensions[i].qDef.cId === id) {
        return alternativeDimensions[i];
      }
    }
    return null;
  }

  minDimensions() {
    if (typeof this.dimensionDefinition.min === 'function') {
      return this.dimensionDefinition.min.call(null, this.properties, this);
    }
    return this.dimensionDefinition.min || 0;
  }

  maxDimensions(decrement) {
    decrement = decrement || 0;
    if (typeof this.dimensionDefinition.max === 'function') {
      return this.dimensionDefinition.max.call(null, this.getMeasures().length - decrement);
    }
    return Number.isNaN(+this.dimensionDefinition.max) ? 10000 : this.dimensionDefinition.max;
  }

  canAddDimension() {
    return this.getDimensions().length < this.maxDimensions();
  }

  minMeasures() {
    if (typeof this.measureDefinition.min === 'function') {
      return this.measureDefinition.min.call(null, this.properties, this);
    }
    return this.measureDefinition.min || 0;
  }

  maxMeasures(decrement) {
    decrement = decrement || 0;
    if (typeof this.measureDefinition.max === 'function') {
      return this.measureDefinition.max.call(null, this.getDimensions().length - decrement);
    }
    return Number.isNaN(+this.measureDefinition.max) ? 10000 : this.measureDefinition.max;
  }

  canAddMeasure() {
    return this.getMeasures().length < this.maxMeasures();
    //			return this.getMeasures().length < 10000;
  }

  getMeasures() {
    return [];
  }

  getLabels() {
    return [];
  }

  getMeasure(id) {
    const measures = this.getMeasures();
    const alternativeMeasures = this.getAlternativeMeasures();
    let i = 0;
    for (i; i < measures.length; ++i) {
      if (measures[i].qDef.cId === id) {
        return measures[i];
      }
    }
    for (i = 0; i < alternativeMeasures.length; ++i) {
      if (alternativeMeasures[i].qDef.cId === id) {
        return alternativeMeasures[i];
      }
    }
    return null;
  }

  addDimension() {
    throw notSupportedError;
  }

  getSorting() {
    throw notSupportedError;
  }

  addFieldDimension(field, label, defaults) {
    const dimension = this.createFieldDimension(field, label, defaults);
    return this.addDimension(dimension);
  }

  addLibraryDimension(id, defaults) {
    const dimension = this.createLibraryDimension(id, defaults);
    return this.addDimension(dimension);
  }

  addMeasure() {
    throw notSupportedError;
  }

  addExpressionMeasure(expression, label, defaults) {
    const measure = this.createExpressionMeasure(expression, label, defaults);
    return this.addMeasure(measure);
  }

  addLibraryMeasure(id, defaults) {
    const measure = this.createLibraryMeasure(id, defaults);
    return this.addMeasure(measure);
  }

  addAlternativeFieldDimension(field, label, defaults) {
    const dimension = this.createFieldDimension(field, label, defaults);
    return this.addDimension(dimension, true);
  }

  addAlternativeLibraryDimension(id, defaults) {
    const dimension = this.createLibraryDimension(id, defaults);
    return this.addDimension(dimension, true);
  }

  addAlternativeExpressionMeasure(expression, label, defaults) {
    const measure = this.createExpressionMeasure(expression, label, defaults);
    return this.addMeasure(measure, true);
  }

  addAlternativeLibraryMeasure(id, defaults) {
    const measure = this.createLibraryMeasure(id, defaults);
    return this.addMeasure(measure, true);
  }

  replaceDimension() {
    throw notSupportedError;
  }

  replaceMeasure() {
    throw notSupportedError;
  }

  autoSortDimension() {
    throw notSupportedError;
  }

  autoSortMeasure() {
    throw notSupportedError;
  }

  createFieldDimension(field, label, defaults) {
    const dimension = extend(true, {}, this.dimensionProperties || {}, defaults || {});

    if (!dimension.qDef) {
      dimension.qDef = {};
    }
    if (!dimension.qOtherTotalSpec) {
      dimension.qOtherTotalSpec = {};
    }

    if (field) {
      dimension.qDef.qFieldDefs = [field];
      if (label) {
        dimension.qDef.qFieldLabels = [label];
      } else {
        dimension.qDef.qFieldLabels = [''];
      }
      dimension.qDef.qSortCriterias = [
        {
          qSortByLoadOrder: 1,
        },
      ];
    } else {
      dimension.qDef.qFieldDefs = [];
      dimension.qDef.qFieldLabels = [];
      dimension.qDef.qSortCriterias = [];
    }

    dimension.qDef.autoSort = true;

    return dimension;
  }

  createLibraryDimension(id, defaults) {
    const dimension = extend(true, {}, this.dimensionProperties || {}, defaults || {});

    if (!dimension.qDef) {
      dimension.qDef = {};
    }
    if (!dimension.qOtherTotalSpec) {
      dimension.qOtherTotalSpec = {};
    }

    dimension.qLibraryId = id;
    dimension.qDef.qSortCriterias = [
      {
        qSortByLoadOrder: 1,
      },
    ];
    dimension.qDef.autoSort = true;

    delete dimension.qDef.qFieldDefs;
    delete dimension.qDef.qFieldLabels;

    return dimension;
  }

  createExpressionMeasure(expression, label, defaults) {
    const measure = extend(true, {}, this.measureProperties || {}, defaults || {});

    if (!measure.qDef) {
      measure.qDef = {};
    }
    if (!measure.qDef.qNumFormat) {
      measure.qDef.qNumFormat = {};
    }

    measure.qDef.qDef = expression;
    measure.qDef.qLabel = label;
    measure.qDef.autoSort = true;

    // TODO move defaults here

    return measure;
  }

  createLibraryMeasure(id, defaults) {
    const measure = extend(true, {}, this.measureProperties || {}, defaults || {});

    if (!measure.qDef) {
      measure.qDef = {};
    }
    if (!measure.qDef.qNumFormat) {
      measure.qDef.qNumFormat = {};
    }
    // if (isEnabled('MASTER_MEASURE_FORMAT')) {
    //   NumberFormatUtil.useMasterNumberFormat(measure.qDef);
    // }

    measure.qLibraryId = id;
    measure.qDef.autoSort = true;

    delete measure.qDef.qDef;
    delete measure.qDef.qLabel;

    return measure;
  }

  updateGlobalChangeListeners(layout) {
    if (this.globalChangeListeners) {
      (this.globalChangeListeners || []).forEach((func) => {
        if (func && typeof func === 'function') {
          func(this.properties, this, { layout });
        }
      });
    }
  }

  removeDimension() {
    throw notSupportedError;
  }

  removeMeasure() {
    throw notSupportedError;
  }

  moveDimension() {
    throw notSupportedError;
  }

  moveMeasure() {
    throw notSupportedError;
  }

  changeSorting() {
    throw notSupportedError;
  }

  getAddDimensionLabel() {
    return 'hey hey'; // this.addDimensionLabel; // || translator.get('Visualization.Requirements.AddDimension');
  }
}

export default DataPropertyHandler;

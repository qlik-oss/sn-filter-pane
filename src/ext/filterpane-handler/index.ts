import DataPropertyHandler from './data-property-handler';
import autoSortDimension from './auto-sort-dimension';
import libraryUtils from './library-utils';
import { defaultListboxProps } from '../../data/listbox-properties';
import { v4 as createId } from 'uuid';


const TOTAL_MAX_DIMENSIONS = 1000;

class FilterpaneHandler extends DataPropertyHandler {
  constructor(opts) {
    super(opts);
    this.dimensionLayout = []; // Layouts for children
    this.dimensions = []; // Properties for children
  }

  autoSortDimension(dimension) {
    if (dimension.qLibraryId) {
      return this.app.getDimensionList().then((dimensionList) => {
        const libDim = libraryUtils.findLibraryDimension(dimension.qLibraryId, dimensionList);
        const libDimInfo = libDim ? libDim.qData.info : undefined;
        autoSortDimension(dimension, libDimInfo);
        return dimension;
      });
    }
    return this.app.getFieldList().then((fieldList) => {
      const field = libraryUtils.findField(dimension.qDef.qFieldDefs[0], fieldList);
      const fields = field ? [field] : undefined;
      autoSortDimension(dimension, fields);
      return dimension;
    });
  }

  // This function relies on that dimensions have been fetched and set externally before calling it.
  getDimensions() {
    return this.dimensions || [];
  }

  minDimensions() {
    return 1;
  }

  maxDimensions() {
    return 1000;
  }

  setModel(model) {
    this.model = model;
  }

  addDimension(dimension) {
    let listbox;

    dimension.qDef.cId = createId();
    dimension.qShowAlternatives = true;
    dimension.qDirectQuerySimplifiedView = false; // TODO: directQueryAdaptService.adaptationsEnabled();

    if (this.getDimensions().length < TOTAL_MAX_DIMENSIONS) {

      const listboxProps = { ...defaultListboxProps };
      this.autoSortDimension(dimension).then(() => {
        listboxProps.qListObjectDef = dimension;

        if (dimension.qLibraryId) {
          return this.app.getDimension(dimension.qLibraryId).then((model) =>
            model.getProperties().then((dimProps) => {
              if (dimProps.qDim.qLabelExpression) {
                listboxProps.title = {
                  qStringExpression: {
                    qExpr: dimProps.qDim.qLabelExpression,
                  },
                };
              } else {
                listboxProps.title = dimProps.qDim.title;
              }

              return this.model
                .createChild(listboxProps, this.properties)
                .then((/* child */) => listboxProps.qListObjectDef);
            })
          );
        }
        listboxProps.title = dimension.qDef.title || dimension.qDef.qFieldLabels[0] || dimension.qDef.qFieldDefs[0];

        return this.model
          .createChild(listboxProps, this.properties)
          .then((/* child */) => listboxProps.qListObjectDef);
      });
    }
    return undefined;
  }

  removeDimension(index) {
    // TODO fetch layout
    const dimension = this.layout.qChildList.qItems[index];

    return this.model.destroyChild(dimension.qInfo.qId, this.properties).then((/* child */) => dimension);
  }

  getDimensionLayouts() {
    return this.dimensionLayout || [];
  }

  getDimensionLayout(index) {
    const dimensionLayouts = this.getDimensionLayouts();
    if (dimensionLayouts[index]) {
      return dimensionLayouts[index].qListObject.qDimensionInfo;
    }
    return '';
  }
}

export default FilterpaneHandler;

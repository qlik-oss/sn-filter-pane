import pp from './property-panel';
import FilterpaneHandler from './filterpane-handler';

export default function ext(env: object) {
  return {
    getCreatePropertyHandler(app) {
      return new FilterpaneHandler({
        app,
        dimensionDefinition: this.dimensionDefinition,
      });
    },
    definition: <object>pp(env),
    support: {
      snapshot: true,
      export: true,
      exportData: true,
      sharing: false,
      viewData: true,
    },
  };
}

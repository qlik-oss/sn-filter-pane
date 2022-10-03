import pp from './property-panel';
import FilterpaneHandler from './filterpane-handler';

interface Config {
  type: 'rows'|'columns'
}

export default function ext(env: object) {
  const { translator } = env;

  return {
    getCreatePropertyHandler(app) {
      return new FilterpaneHandler({
        app,
        dimensionDefinition: {
          min: 1,
          max: 1000,
          description(_: unknown, __: unknown, config: Config): string {
            const translationProperty = config && config.type === 'rows' ? 'Visualizations.Descriptions.Row' : 'Visualizations.Descriptions.Column';
            return translator.get(translationProperty);
          },
        },
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

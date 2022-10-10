import pp from './property-panel';

export default function ext(env: object) {
  return {
    usePropertyHandler: 'filterpane-data',
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

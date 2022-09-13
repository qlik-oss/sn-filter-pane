import sorting from "./sorting";
import simpleSorting from "./simple-sorting";
import getSettings from "./settings";
import getData from "./data";


export default function pp(env) {
  return {
    type: 'items',
    component: 'accordion',
    items: {
      data: getData(env),
      sorting,
      simpleSorting,
      settings: getSettings(env),
    }
  };
}
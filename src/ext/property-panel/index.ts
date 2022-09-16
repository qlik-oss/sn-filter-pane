import sorting from "./sorting";
// import simpleSorting from "./simple-sorting";
import settings from "./settings";
import getData from "./data";


export default function pp(env) {
  const out = {
    type: 'items',
    component: 'accordion',
    items: {
      data: getData(env),
      sorting,
      // simpleSorting,
      settings,
    }
  };
  return out;
}
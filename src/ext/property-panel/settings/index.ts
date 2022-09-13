import general from "./general";
import presentation from "./presentation";
import colorsAndLegend from "./colors-and-legend";
import getXAxis from "./x-axis";
import getYAxis from "./y-axis";

export default function settings(env) {
  return {
    uses: 'settings',
    items: {
      general,
      presentation,
      colorsAndLegend,
      xAxis: getXAxis(env),
      yAxis: getYAxis(env),
      tooltips: {
        uses: 'tooltip',
      },
    }
  }
}

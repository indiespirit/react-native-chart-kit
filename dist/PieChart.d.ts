import { ViewStyle } from "react-native";
import AbstractChart, { AbstractChartProps } from "./AbstractChart";
export interface PieChartProps extends AbstractChartProps {
  data: Array<any>;
  width: number;
  height: number;
  accessor: string;
  backgroundColor: string;
  paddingLeft: string;
  center?: Array<number>;
  absolute?: boolean;
  hasLegend?: boolean;
  style?: Partial<ViewStyle>;
  avoidFalseZero?: boolean;
}
declare type PieChartState = {};
declare class PieChart extends AbstractChart<PieChartProps, PieChartState> {
  render(): JSX.Element;
}
export default PieChart;
//# sourceMappingURL=PieChart.d.ts.map

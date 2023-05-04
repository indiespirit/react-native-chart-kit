import { ViewStyle } from "react-native";

import { AbstractChartProps } from "../AbstractChart";
import ContributionGraph, {
  ContributionChartValue,
  TooltipDataAttrs
} from "./ContributionGraph";

export interface ContributionGraphProps extends AbstractChartProps {
  values: Array<any>;
  endDate: Date;
  numDays: number;
  width: number;
  height: number;
  gutterSize?: number;
  squareSize?: number;
  horizontal?: boolean;
  showMonthLabels?: boolean;
  showOutOfRangeDays?: boolean;
  showWeekdayLabels?: boolean;
  accessor?: string;
  accessorDual?: string; // for dual
  colorLegend?: CGColorLegend;
  colorLegendDual?: CGColorLegend; // for dual
  showLegend?: boolean;
  getMonthLabel?: (monthIndex: number) => string;
  onDayPress?: ({ count: number, date: Date } ) => void;
  classForValue?: (value: string) => string;
  style?: Partial<ViewStyle>;
  titleForValue?: (value: ContributionChartValue) => string;
  tooltipDataAttrs: TooltipDataAttrs;
}

export type ContributionGraphState = {
  maxValue: number;
  minValue: number;
  valueCache: object;
};

export type ContributionGraphDualState = ContributionGraphState & { maxValueDual: number; minValueDual: number; }; // for dual


export type CGColorLegend = {
  formatCLabel: (value: number) => string;
  maxValue: number;
  minValue: number;
  title: string;
  descending: boolean;
};


export default ContributionGraph;

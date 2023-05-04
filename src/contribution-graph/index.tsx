import { ViewStyle } from "react-native";

import { AbstractChartProps } from "../AbstractChart";
import ContributionGraph, {
  ContributionChartValue,
  TooltipDataAttrs
} from "./ContributionGraph";


import ContributionGraphDual, {
  ContributionChartValueDual,
} from "./ContributionGraphDual";

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
  colorLegend?: CGColorLegend;
  showLegend?: boolean;
  getMonthLabel?: (monthIndex: number) => string;
  onDayPress?: ({ count: number, date: Date } ) => void;
  classForValue?: (value: string) => string;
  style?: Partial<ViewStyle>;
  titleForValue?: (value: ContributionChartValue) => string;
  tooltipDataAttrs: TooltipDataAttrs;
}

export interface ContributionGraphDualProps extends AbstractChartProps {
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
  colorLegend1?: CGColorLegend;
  colorLegend2?: CGColorLegend;
  showLegend?: boolean;
  getMonthLabel?: (monthIndex: number) => string;
  classForValue?: (value: string) => string;
  style?: Partial<ViewStyle>;
}

export type ContributionGraphState = {
  maxValue: number;
  minValue: number;
  valueCache: object;
};

export type ContributionGraphDualState = {
  maxValue1: number;
  minValue1: number;
  maxValue2: number;
  minValue2: number;
  valueCache: object;
};

export type CGColorLegend = {
  formatCLabel: (value: number) => string;
  maxValue: number;
  minValue: number;
  title: string;
};

export default ContributionGraph;

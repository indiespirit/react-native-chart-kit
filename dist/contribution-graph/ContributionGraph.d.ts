/// <reference types="react" />
import { RectProps } from "react-native-svg";
import AbstractChart from "../AbstractChart";
import { ContributionGraphProps, ContributionGraphState } from ".";
export declare type ContributionChartValue = {
  value: number;
  title: string;
  tooltipDataAttrs: TooltipDataAttrs;
  date: Date;
};
export declare type TooltipDataAttrs = (
  value: ContributionChartValue
) => Partial<RectProps> | Partial<RectProps>;
declare class ContributionGraph extends AbstractChart<
  ContributionGraphProps,
  ContributionGraphState
> {
  constructor(props: ContributionGraphProps);
  UNSAFE_componentWillReceiveProps(nextProps: ContributionGraphProps): void;
  getSquareSizeWithGutter(): number;
  getMonthLabelSize(): number;
  getStartDate(): Date;
  getEndDate(): Date;
  getStartDateWithEmptyDays(): Date;
  getNumEmptyDaysAtStart(): number;
  getNumEmptyDaysAtEnd(): number;
  getWeekCount(): number;
  getWeekWidth(): number;
  getWidth(): number;
  getHeight(): number;
  getValueCache(
    values: ContributionChartValue[]
  ): {
    valueCache: {};
    minValue: number;
    maxValue: number;
  };
  getValueForIndex(index: number): any;
  getClassNameForIndex(index: number): string;
  getTitleForIndex(index: number): any;
  getTooltipDataAttrsForIndex(index: number): any;
  getTooltipDataAttrsForValue(
    value: ContributionChartValue
  ): Partial<RectProps>;
  getTransformForWeek(weekIndex: number): number[];
  getTransformForMonthLabels(): string;
  getTransformForAllWeeks(): string;
  getViewBox(): string;
  getSquareCoordinates(dayIndex: number): number[];
  getMonthLabelCoordinates(weekIndex: number): number[];
  renderSquare(dayIndex: number, index: number): JSX.Element;
  handleDayPress(index: number): void;
  renderWeek(weekIndex: number): JSX.Element;
  renderAllWeeks(): JSX.Element[];
  renderMonthLabels(): JSX.Element[];
  static defaultProps: {
    numDays: number;
    endDate: Date;
    gutterSize: number;
    squareSize: number;
    horizontal: boolean;
    showMonthLabels: boolean;
    showOutOfRangeDays: boolean;
    accessor: string;
    classForValue: (value: any) => "black" | "#8cc665";
    style: {};
  };
  render(): JSX.Element;
}
export default ContributionGraph;
//# sourceMappingURL=ContributionGraph.d.ts.map

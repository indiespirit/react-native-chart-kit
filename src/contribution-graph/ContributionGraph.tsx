import _ from "lodash";
import React from "react";
import { View } from "react-native";
import { G, Rect, RectProps, Svg, Text } from "react-native-svg";

import AbstractChart from "../AbstractChart";
import { mapValue } from "../Utils";
import {
  convertToDate,
  getBeginningTimeForDate,
  shiftDate
} from "./DateHelpers";
import {
  DAYS_IN_WEEK,
  MILLISECONDS_IN_ONE_DAY,
  MONTH_LABELS
} from "./constants";
import { ContributionGraphProps, ContributionGraphState } from ".";

const SQUARE_SIZE = 20;
const MONTH_LABEL_GUTTER_SIZE = 8;
const paddingLeft = 40;

export type ContributionChartValue = {
  value: number;
  title: string;
  tooltipDataAttrs: TooltipDataAttrs;
  date: Date;
};

export type TooltipDataAttrs = (
  value: ContributionChartValue
) => Partial<RectProps> | Partial<RectProps>;

class ContributionGraph extends AbstractChart<
  ContributionGraphProps,
  ContributionGraphState
> {
  constructor(props: ContributionGraphProps) {
    super(props);

    let { maxValue, minValue, valueCache } = this.getValueCache(props.values);

    this.state = {
      maxValue,
      minValue,
      valueCache
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: ContributionGraphProps) {
    let { maxValue, minValue, valueCache } = this.getValueCache(
      nextProps.values
    );

    this.setState({
      maxValue,
      minValue,
      valueCache
    });
  }

  getSquareSizeWithGutter() {
    return (this.props.squareSize || SQUARE_SIZE) + this.props.gutterSize;
  }

  getMonthLabelSize() {
    let { squareSize = SQUARE_SIZE } = this.props;
    if (!this.props.showMonthLabels) {
      return 0;
    }
    if (this.props.horizontal) {
      return squareSize + MONTH_LABEL_GUTTER_SIZE;
    }
    return 2 * (squareSize + MONTH_LABEL_GUTTER_SIZE);
  }

  getStartDate() {
    return shiftDate(this.getEndDate(), -this.props.numDays + 1); // +1 because endDate is inclusive
  }

  getEndDate() {
    return getBeginningTimeForDate(convertToDate(this.props.endDate));
  }

  getStartDateWithEmptyDays() {
    return shiftDate(this.getStartDate(), -this.getNumEmptyDaysAtStart());
  }

  getNumEmptyDaysAtStart() {
    const dow = this.getDow(this.getStartDate());
    return dow < 0 ? 6 : dow;
  }

  getDow(date: Date) {
    const dow = date.getDay()-1;
    return dow < 0 ? 6 : dow;
  }

  getNumEmptyDaysAtEnd() {
    let dow = this.getDow(this.getEndDate());
    dow = dow < 0 ? 6 : dow;
    return DAYS_IN_WEEK - 1 - dow;
  }

  getWeekCount() {
    const numDaysRoundedToWeek =
      this.props.numDays +
      this.getNumEmptyDaysAtStart() +
      this.getNumEmptyDaysAtEnd();
    return Math.ceil(numDaysRoundedToWeek / DAYS_IN_WEEK);
  }

  getWeekWidth() {
    return DAYS_IN_WEEK * this.getSquareSizeWithGutter();
  }

  getWidth() {
    return (
      this.getWeekCount() * this.getSquareSizeWithGutter() -
      this.props.gutterSize
    );
  }

  getHeight() {
    return (
      this.getWeekWidth() + (this.getMonthLabelSize() - this.props.gutterSize)
    );
  }

  getValueCache(values: ContributionChartValue[]) {
    let minValue = Infinity,
      maxValue = -Infinity;

    return {
      valueCache: values.reduce((memo, value) => {
        const date = convertToDate(value.date);

        let index = Math.floor(
          (date.valueOf() - this.getStartDateWithEmptyDays().valueOf()) /
            MILLISECONDS_IN_ONE_DAY
        );

        index = index;

        minValue = Math.min(value[this.props.accessor], minValue);
        maxValue = Math.max(value[this.props.accessor], maxValue);

        memo[index] = {
          value,
          title: this.props.titleForValue
            ? this.props.titleForValue(value)
            : null,
          tooltipDataAttrs: this.getTooltipDataAttrsForValue(value)
        };

        return memo;
      }, {}),
      minValue,
      maxValue
    };
  }

  getValueForIndex(index: number) {
    if (this.state.valueCache[index]) {
      return this.state.valueCache[index].value;
    }
    return null;
  }

  getColorForIndex(index: number) {
    if (this.state.valueCache[index]) {
      if (this.state.valueCache[index].value) {
        const count = this.state.valueCache[index].value[this.props.accessor];

        if (count) {
          const opacity = mapValue(
            count,
            this.state.maxValue === this.state.minValue ? 0: this.state.minValue,
            isNaN(this.state.maxValue) ? 1 : this.state.maxValue,
            0.15 + 0.05, // + 0.05 to make smaller values a bit more visible
            1
          );

          return this.props.chartConfig.color(opacity, count);
        }
      }
    }

    return this.props.chartConfig.color(0.15);
  }

  getColorForValue(value: number) {
      if (value) {
        const opacity = mapValue(
          value,
          this.state.maxValue === this.state.minValue ? 0: this.state.minValue,
          isNaN(this.state.maxValue) ? 1 : this.state.maxValue,
          0.15 + 0.05, // + 0.05 to make smaller values a bit more visible
          1
        );

        return this.props.chartConfig.color(opacity, value);
      }
    return this.props.chartConfig.color(0.15);
  }

  getTitleForIndex(index: number) {
    if (this.state.valueCache[index]) {
      return this.state.valueCache[index].title;
    }

    return this.props.titleForValue ? this.props.titleForValue(null) : null;
  }

  getTooltipDataAttrsForIndex(index: number) {
    if (this.state.valueCache[index]) {
      return this.state.valueCache[index].tooltipDataAttrs;
    }

    return this.getTooltipDataAttrsForValue({
      date: null,
      [this.props.accessor]: null
    } as ContributionChartValue);
  }

  getTooltipDataAttrsForValue(value: ContributionChartValue) {
    const { tooltipDataAttrs } = this.props;

    if (typeof tooltipDataAttrs === "function") {
      return tooltipDataAttrs(value);
    }

    return tooltipDataAttrs;
  }

  getTransformForWeek(weekIndex: number) {
    if (this.props.horizontal) {
      return [weekIndex * this.getSquareSizeWithGutter(), 50];
    }
    return [10, weekIndex * this.getSquareSizeWithGutter()];
  }

  getTransformForMonthLabels() {
    if (this.props.horizontal) {
      return null;
    }
    return `${this.getWeekWidth() + MONTH_LABEL_GUTTER_SIZE}, 0`;
  }

  getTransformForAllWeeks() {
    if (this.props.horizontal) {
      return `0, ${this.getMonthLabelSize() - 100}`;
    }
    return null;
  }

  getViewBox() {
    if (this.props.horizontal) {
      return `${this.getWidth()} ${this.getHeight()}`;
    }
    return `${this.getHeight()} ${this.getWidth()}`;
  }

  getSquareCoordinates(dayIndex: number) {
    if (this.props.horizontal) {
      return [0, dayIndex * this.getSquareSizeWithGutter()];
    }
    return [dayIndex * this.getSquareSizeWithGutter(), 0];
  }

  getMonthLabelCoordinates(weekIndex: number) {
    if (this.props.horizontal) {
      return [
        (weekIndex+1) * this.getSquareSizeWithGutter(),
        this.getMonthLabelSize() - MONTH_LABEL_GUTTER_SIZE
      ];
    }
    const verticalOffset = -2;
    return [
      0,
      (weekIndex+1) * this.getSquareSizeWithGutter() + verticalOffset
    ];
  }

  getDayLabelCoordinates(dayIndex: number) {
    const hOffset = -3;
    return [
      +hOffset,
      dayIndex * this.getSquareSizeWithGutter()
    ];
  }

  renderSquare(dayIndex: number, index: number) {
    const indexOutOfRange =
      index < this.getNumEmptyDaysAtStart() ||
      index >= this.getNumEmptyDaysAtStart() + this.props.numDays;

    if (indexOutOfRange && !this.props.showOutOfRangeDays) {
      return null;
    }

    const [x, y] = this.getSquareCoordinates(dayIndex);

    const { squareSize = SQUARE_SIZE } = this.props;

    return (
      <Rect
        key={index}
        width={squareSize}
        height={squareSize}
        x={x + paddingLeft}
        y={y}
        title={this.getTitleForIndex(index)}
        fill={this.getColorForIndex(index)}
        onPress={() => {
          this.handleDayPress(index);
        }}
        {...this.getTooltipDataAttrsForIndex(index)}
      />
    );
  }

  handleDayPress(index: number) {
    if (!this.props.onDayPress) {
      return;
    }

    this.props.onDayPress(
      this.state.valueCache[index] && this.state.valueCache[index].value
        ? this.state.valueCache[index].value
        : {
            [this.props.accessor]: 0,
            date: new Date(
              this.getStartDate().valueOf() + index * MILLISECONDS_IN_ONE_DAY
            )
          }
    );
  }

  renderWeek(weekIndex: number) {
    const [x, y] = this.getTransformForWeek(weekIndex);
    return (
      <G key={weekIndex} x={x} y={y}>
        {_.range(DAYS_IN_WEEK).map(dayIndex =>
          this.renderSquare(dayIndex, weekIndex * DAYS_IN_WEEK + dayIndex)
        )}
      </G>
    );
  }

  renderAllWeeks() {
    return _.range(this.getWeekCount()).map(weekIndex =>
      this.renderWeek(weekIndex)
    );
  }

  renderScale() {
    if (this.props.colorLegend) {
      const cl = this.props.colorLegend;
      var tempvalues = this.props.values.map((item) => {
        return item.value;
      });

      const upperBound = Math.max(Math.max(...tempvalues), cl.maxValue);
      const lowerBound = Math.min(Math.min(...tempvalues), cl.minValue);

      const createDescRange = (start, end) =>  
        Array.from({length: (end - start+1)}, (v, k) => -k + end);

      const range = createDescRange(lowerBound, upperBound);

      const { squareSize = SQUARE_SIZE } = this.props;

      const charWidth = 6;

      let scaleStepsWidth = Math.max(...range.map((value) => {
        return cl.formatCLabel(value).toString().length;
      }))*charWidth;

      scaleStepsWidth = Math.max(scaleStepsWidth,squareSize/2);
      const titleWidth = cl.title.length*charWidth;

      const legendWidth = (range.length)*scaleStepsWidth + titleWidth + squareSize/2;

      var squares =  range.map((value, index) => {
        return (
          <Rect
            key={index}
            width={squareSize/2}
            height={squareSize/2}
            x={paddingLeft + titleWidth + squareSize/2 + (range.length - index-1) * (scaleStepsWidth)}
            y={this.props.height-squareSize}
            fill={this.getColorForValue(value)}
          />
        )});

      var texts =  range.map((value, index) => {
        return (
          <Text
            key={index}
            x={paddingLeft + titleWidth + squareSize/2 + (range.length - index-1) * (scaleStepsWidth)}
            y={this.props.height+charWidth}
            {...this.getPropsForLabels()}
          >{cl.formatCLabel(value)}</Text>
        )});

      return (
        <G>
           <Text
            x={paddingLeft}
            y={this.props.height}
            {...this.getPropsForLabels()}
          >{cl.title}</Text>
          {squares}
          {texts}
        </G>
      )
    }
  }

  renderWeekDayLabels() {
    if (!this.props.showWeekdayLabels) {
      return null;
    }

    const dowRange = _.range(DAYS_IN_WEEK);

    const [x0, y0] = this.getTransformForWeek(-1);

    return(
      <G x={x0} y={y0}>{dowRange.map(dow => {

      const [x, y] = this.getDayLabelCoordinates(dow);
      return (
        <Text
          key={dow}
          x={x + paddingLeft-this.props.squareSize/4}
          y={y + this.props.squareSize*0.75}
          {...this.getPropsForLabels()}
        >
          {this.props.weekdayLabel(dow)}
        </Text>
      );
    })}
    </G>);

  }

  renderMonthLabels() {
    if (!this.props.showMonthLabels) {
      return null;
    }

    const weekRange = _.range(this.getWeekCount() - 1); // don't render for last week, because label will be cut off

    return weekRange.map(weekIndex => {
      const endOfWeek = shiftDate(
        this.getStartDateWithEmptyDays(),
        (weekIndex + 1) * DAYS_IN_WEEK
      );

      const [x, y] = this.getMonthLabelCoordinates(weekIndex);

      return endOfWeek.getDate() >= 1 && endOfWeek.getDate() <= DAYS_IN_WEEK ? (
        <Text
          key={weekIndex}
          x={x + paddingLeft}
          y={y + 8}
          {...this.getPropsForLabels()}
        >
          {this.props.getMonthLabel
            ? this.props.getMonthLabel(endOfWeek.getMonth())
            : MONTH_LABELS[endOfWeek.getMonth()]}
        </Text>
      ) : null;
    });
  }

  public static defaultProps = {
    numDays: 200,
    endDate: new Date(),
    gutterSize: 1,
    squareSize: SQUARE_SIZE,
    horizontal: true,
    showMonthLabels: true,
    showOutOfRangeDays: false,
    accessor: "value",
    classForValue: value => (value ? "black" : "#8cc665"),
    style: {}
  };

  render() {
    const { style } = this.props;

    let { borderRadius = 0 } = style;

    if (!borderRadius && this.props.chartConfig.style) {
      const stupidXo = this.props.chartConfig.style.borderRadius;
      borderRadius = stupidXo;
    }

    // make room for scale if enabled
    const canvasHeight = this.props.showLegend ? this.props.height + 10 : this.props.height;

    return (
      <View style={style}>
        <Svg height={canvasHeight} width={this.props.width}>
          {this.renderDefs({
            width: this.props.width,
            height: this.props.height,
            ...this.props.chartConfig
          })}
          <Rect
            width="100%"
            height={this.props.height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>{this.renderWeekDayLabels()}</G>
          <G>{this.renderMonthLabels()}</G>
          <G>{this.renderAllWeeks()}</G>
          <G justifyContent= 'center' alignItems = 'center'>{this.renderScale()}</G>
        </Svg>
      </View>
    );
  }
}

export default ContributionGraph;

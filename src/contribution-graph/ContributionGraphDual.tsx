import _ from "lodash";
import React from "react";
import { View } from "react-native";
import { G, Rect,  Svg, Text, Polygon} from "react-native-svg";

import AbstractChart from "../AbstractChart";
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
import { ContributionGraphProps, ContributionGraphDualState } from ".";

const SQUARE_SIZE = 20;
const MONTH_LABEL_GUTTER_SIZE = 8;
const charWidth = 7;
const charHeight = charWidth*1.2;
const distTop = 40;

export type ContributionChartValueDual = {
  value: number;
  valueDual: number;
  date: Date;
};

class ContributionGraphDual extends AbstractChart<
ContributionGraphProps,
  ContributionGraphDualState
> {
  constructor(props: ContributionGraphProps) {
    props.endDate = new Date(props.endDate.setUTCHours(0,0,0,0));

    super(props);

    let { minValue, maxValue, minValueDual, maxValueDual, valueCache } = this.getValueCache(props.values);

    this.state = {
      minValue,
      maxValue,
      minValueDual,
      maxValueDual,
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
    return squareSize + MONTH_LABEL_GUTTER_SIZE;
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
    const dow = date.getUTCDay()-1;
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

    const weekdayWidth = this.props.showWeekdayLabels ? charWidth*5 : 0;

    return (
      this.getWeekCount() * this.getSquareSizeWithGutter() -
      this.props.gutterSize +
      weekdayWidth
    );
  }

  getHeight() {
    return (
      this.getWeekWidth() + (this.getMonthLabelSize() - this.props.gutterSize)
    );
  }

  getValueCache(values: ContributionChartValueDual[]) {
    let minValue = Infinity, maxValue = -Infinity;
    let minValueDual = Infinity, maxValueDual = -Infinity;

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

        minValueDual = Math.min(value[this.props.accessorDual], minValueDual);
        maxValueDual = Math.max(value[this.props.accessorDual], maxValueDual);

        memo[index] = {
          value // of type ContributionChartValueDual
        };

        return memo;
      }, {}),
      minValue,
      maxValue,
      minValueDual,
      maxValueDual
    };
  }

  getValueForIndex(index: number) {
    if (this.state.valueCache[index]) {
      return this.state.valueCache[index].value;
    }
    return null;
  }

  getColorsForIndex(index: number) {
    if (this.state.valueCache[index]) {
      if (this.state.valueCache[index].value) {
        const count = this.state.valueCache[index].value[this.props.accessor];
        const countDual = this.state.valueCache[index].value[this.props.accessorDual];
        return [this.props.chartConfig.color(count), this.props.chartConfig.colorDual(countDual)];
      }
    } else {
      return [this.props.chartConfig.color(undefined), this.props.chartConfig.colorDual(undefined)];
    }
  }

  getColorForValue(value: number) {
    return this.props.chartConfig.color(value);
  }

  getPaddingLeft(){
    return (this.props.width - this.getWidth())/2;
  }

  getTransformForWeek(weekIndex: number) {
    const xOffset = this.props.showWeekdayLabels ? charWidth*5 : 0;

    return [weekIndex * this.getSquareSizeWithGutter() + this.getPaddingLeft() + xOffset, distTop];
  }

  getTransformForMonthLabels() {
    const xOffset = this.props.showWeekdayLabels ? charWidth*5 : 0;
    return [xOffset+ this.getPaddingLeft(), 0]
  }

  getSquareCoordinates(dayIndex: number) {
    return [0, dayIndex * this.getSquareSizeWithGutter()];
  }

  getMonthLabelCoordinates(weekIndex: number) {
    return [
      (weekIndex+1) * this.getSquareSizeWithGutter(),
      this.getMonthLabelSize() - MONTH_LABEL_GUTTER_SIZE
    ];
  }

  getTransformForcolorLegend1() {
    // align to left of weekday labels if they exist
    return [this.getPaddingLeft(), this.props.height];
  }

  getTransformForDayLabels() {
    return [this.getPaddingLeft(), distTop];
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

    const colorList = this.getColorsForIndex(index);

    const ul_points = `${x},${y} ${x+squareSize},${y} ${x},${y+squareSize}`
    const ll_points = `${x+squareSize},${y} ${x+squareSize},${y+squareSize} ${x},${y+squareSize}`


    return (
      <G key={index}>
      <Polygon
        key={1000+index}
        points={ll_points}
        fill={colorList[1]}
      />
            <Polygon
        key={index}
        points={ul_points}
        fill={colorList[0]}
      />
      </G>
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

  renderScale(cl, dual=false) {

      let upperBound = cl.maxValue;
      let lowerBound = cl.minValue;

      const yOffset = dual ? 45 : -5;
      const cMap = dual ? this.props.chartConfig.colorDual : this.props.chartConfig.color;

      const createDescRange = (start, end) =>  
        Array.from({length: (end - start+1)}, (v, k) => -k + end);

      const createAscRange = (start, end) =>  
        Array.from({length: (end - start+1)}, (v, k) => start + k);


      const range = cl.descending? createDescRange(lowerBound, upperBound): createAscRange(lowerBound, upperBound);

      const { squareSize = SQUARE_SIZE } = this.props;

      let scaleStepsWidth = Math.max(...range.map((value) => {
        return cl.formatCLabel(value).toString().length;
      }))*charWidth;

      scaleStepsWidth = Math.max(scaleStepsWidth, squareSize);
      const titleWidth = cl.titleWidth ? cl.titleWidth: (cl.title.length+1)*charWidth;

      const [x0, y0] = this.getTransformForcolorLegend1();

      
      var squares =  range.map((value, index) => {
        const x = titleWidth + (index) * (scaleStepsWidth);
        const y = -charHeight*3 + yOffset;
        const triangle_points = dual ? `${x+squareSize},${y} ${x+squareSize},${y+squareSize} ${x},${y+squareSize}` : `${x},${y} ${x+squareSize},${y} ${x},${y+squareSize}`
        return (
          <Polygon
            key={index + 1000*Number(dual)}
            points={triangle_points}
            fill={cMap(value)}
          />
        )});

      var texts =  range.map((value, index) => {
        return (
          <Text
            key={index+ 1000*Number(dual)}
            x={titleWidth + (index) * (scaleStepsWidth)}
            y={charHeight +yOffset}
            fill={"black"}
            {...this.getPropsForLabels()}
          >{cl.formatCLabel(value)}</Text>
        )});

      return (
        <G x={x0} y={y0}>
           <Text
            x={0}
            y={-charHeight +yOffset}
            {...this.getPropsForLabels()}
          >{cl.title}</Text>
          {texts}
          {squares}
        </G>
      )
  }

  renderWeekDayLabels() {
    if (!this.props.showWeekdayLabels) {
      return null;
    }

    const dowRange = _.range(DAYS_IN_WEEK);

    const [x0, y0] = this.getTransformForDayLabels();

    return(
      <G x={x0} y={y0}>{dowRange.map(dow => {
      return (
        <Text
          key={dow}
          x={0}
          y={dow*this.getSquareSizeWithGutter() + this.props.squareSize*0.75}
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

    const [x0, y0] = this.getTransformForMonthLabels();

    const labels = weekRange.map(weekIndex => {
      const endOfWeek = shiftDate(
        this.getStartDateWithEmptyDays(),
        (weekIndex + 1) * DAYS_IN_WEEK
      );

      const [x, y] = this.getMonthLabelCoordinates(weekIndex);

      return endOfWeek.getUTCDate() >= 1 && endOfWeek.getUTCDate() <= DAYS_IN_WEEK ? (
        <Text
          key={weekIndex}
          x={x}
          y={y}
          {...this.getPropsForLabels()}
        >
          {this.props.getMonthLabel
            ? this.props.getMonthLabel(endOfWeek.getMonth())
            : MONTH_LABELS[endOfWeek.getUTCMonth()]}
        </Text>
      ) : null;
    });

    return(<G x={x0} y={y0}>{labels}</G>);
  }

  public static defaultProps = {
    numDays: 200,
    endDate: (new Date()).setUTCHours(0,0,0,0),
    gutterSize: 1,
    squareSize: SQUARE_SIZE,
    horizontal: true,
    showMonthLabels: true,
    showOutOfRangeDays: false,
    accessor1: "value1",
    accessor2: "value2",
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

    // // make room for scales
    const canvasHeight = this.props.height + 60;

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
          <G>{this.renderScale(this.props.colorLegend, false)}</G>
          <G>{this.renderScale(this.props.colorLegendDual, true)}</G>
        </Svg>
      </View>
    );
  }
}

export default ContributionGraphDual;

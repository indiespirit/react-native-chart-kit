import React from "react";
import { View } from "react-native";
import { Svg, G, Text, Rect } from "react-native-svg";
import _ from "lodash";
import AbstractChart from "../abstract-chart";
import {
  DAYS_IN_WEEK,
  MILLISECONDS_IN_ONE_DAY,
  MONTH_LABELS
} from "./constants";
import {
  shiftDate,
  getBeginningTimeForDate,
  convertToDate
} from "./dateHelpers";

function mapValue(x, in_min, in_max, out_min, out_max) {
  const diff = (in_max - in_min) || 1; //prevent divided by 0 if in_max == in_min
  return ((x - in_min) * (out_max - out_min)) / diff + out_min;
}

class ContributionGraph extends AbstractChart {
  constructor(props) {
    super(props);

    this.state = {
      maxValue: +Infinity,
      minValue: -Infinity,
      valueCache: {},
    };
  }

  setupValueCacheFromProps() {
    let { maxValue, minValue, valueCache } = this.getValueCache(
      this.props.values
    );
    this.setState({
      maxValue,
      minValue,
      valueCache
    });
  }

  componentDidMount() {
    this.setupValueCacheFromProps();
  }

  componentDidUpdate(prevProps, prevState) {
    const large = (prevProps.values.length < this.props.values.length) ? this.props.values : prevProps.values;
    const small = (prevProps.values.length < this.props.values.length) ? prevProps.values : this.props.values;
    var res = large.filter(item1 =>
    !small.some(item2 => (item2['date'] === item1['date'] && item2['value'] === item2['value'])));
    if(res.length > 0) {
      this.setupValueCacheFromProps();
    }
  }

  setContentLayout(contentWidth, contentHeight) {
    const { width, height } = this.props;
    const { paddingTop, paddingLeft, paddingRight, paddingBottom, justifyContent, alignItems } = this.props.chartConfig.chartStyle;
    var justifyOffset, alignOffset;

    // vertical
    switch(justifyContent) {
      case "start": justifyOffset = 0 + paddingTop; break;
      case "center": justifyOffset = (height - contentHeight) / 2; break;
      case "end": justifyOffset = height - contentHeight - paddingBottom; break;
      default: justifyOffset = 0;
    }
    // horizontal
    switch(alignItems) {
      case "start": alignOffset = 0 + paddingLeft; break;
      case "center": alignOffset = (width - contentWidth) / 2; break;
      case "end": alignOffset = width - contentWidth - paddingRight; break;
      default: alignOffset = 0;
    }

    return [justifyOffset, alignOffset];
  }

  mainLayoutSetup() {
    const { paddingTop, paddingLeft, paddingRight, paddingBottom } = this.props.chartConfig.chartStyle;
    const [x,y] = this.getViewBox();
    this.props.width = this.props.width > paddingLeft + paddingRight + x ? this.props.width : paddingLeft + paddingRight + x;
    this.props.height = this.props.height > paddingTop + paddingBottom + y ? this.props.height : paddingTop + paddingBottom + y;
  }

  setDynamicSquareSize() {
    const { paddingTop, paddingLeft, paddingRight, paddingBottom } = this.props.chartConfig.chartStyle;
    const innerHeight = this.props.height - paddingTop - paddingBottom;
    const innerWidth = this.props.width - paddingLeft - paddingRight;
    const labelOrientedSize = (DAYS_IN_WEEK - 1) * this.props.gutterSize + this.props.month_label_gutter_size;
    const WeekOrientedSize = (this.getWeekCount() - 1) * this.props.gutterSize;

    if(this.props.horizontal) {
      // + 1 becuase label itself is
      const height = (innerHeight - labelOrientedSize) / (DAYS_IN_WEEK + 1);
      const width = (innerWidth - WeekOrientedSize) / this.getWeekCount();
      return height < width ? height : width;
    }else {
      const height = (innerHeight - WeekOrientedSize) / this.getWeekCount();
      // minus extra gutter size and divided by extra 1 respected to getMonthLabelSize() for vertical layout
      const width = (innerWidth - labelOrientedSize - this.props.month_label_gutter_size) / (DAYS_IN_WEEK + 2);
      return height < width ? height : width;
    }
    return 0;
  }

  getSquareSizeWithGutter() {
    return this.props.squareSize + this.props.gutterSize;
  }

  getMonthLabelSize() {
    let { squareSize } = this.props;
    if (!this.props.showMonthLabels) {
      return 0;
    }
    if (this.props.horizontal) {
      return squareSize + this.props.month_label_gutter_size;
    }
    return 2 * (squareSize + this.props.month_label_gutter_size);
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
    return this.getStartDate().getDay();
  }

  getNumEmptyDaysAtEnd() {
    return DAYS_IN_WEEK - 1 - this.getEndDate().getDay();
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

  getValueCache(values) {
    let minValue = Infinity,
      maxValue = -Infinity;

    return {
      valueCache: values.reduce((memo, value) => {
        const date = convertToDate(value.date);
        const index = Math.ceil(
          (date - this.getStartDateWithEmptyDays()) / MILLISECONDS_IN_ONE_DAY
        );
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

  getValueForIndex(index) {
    if (this.state.valueCache[index]) {
      return this.state.valueCache[index].value;
    }
    return null;
  }

  getClassNameForIndex(index) {
    if (this.state.valueCache[index]) {
      if (this.state.valueCache[index].value) {
        const count = this.state.valueCache[index].value[this.props.accessor];

        if (count) {
          const opacity = mapValue(
            count,
            this.state.minValue,
            this.state.maxValue,
            0.15 + 0.05, // + 0.05 to make smaller values a bit more visible
            1
          );

          return this.props.chartConfig.color(opacity);
        }
      }
    }

    return this.props.chartConfig.color(0.15);
  }

  getTitleForIndex(index) {
    if (this.state.valueCache[index]) {
      return this.state.valueCache[index].title;
    }
    return this.props.titleForValue ? this.props.titleForValue(null) : null;
  }

  getTooltipDataAttrsForIndex(index) {
    if (this.state.valueCache[index]) {
      return this.state.valueCache[index].tooltipDataAttrs;
    }
    return this.getTooltipDataAttrsForValue({ date: null, [this.props.accessor]: null });
  }

  getTooltipDataAttrsForValue(value) {
    const { tooltipDataAttrs } = this.props;

    if (typeof tooltipDataAttrs === "function") {
      return tooltipDataAttrs(value);
    }
    return tooltipDataAttrs;
  }

  getTransformForWeek(weekIndex) {
    if (this.props.horizontal) {
      const [justifyOffset, alignOffset] = this.setContentLayout(this.getWidth(), this.getHeight());
      return [weekIndex * this.getSquareSizeWithGutter() + alignOffset,
        this.getMonthLabelSize() + justifyOffset];
    }
      const [justifyOffset, alignOffset] = this.setContentLayout(this.getHeight(), this.getWidth());
    return [this.getMonthLabelSize() + alignOffset,
      weekIndex * this.getSquareSizeWithGutter() + justifyOffset];
  }

  getTransformForMonthLabels() {
    if (this.props.horizontal) {
      return null;
    }
    return `${this.getWeekWidth() + this.props.month_label_gutter_size}, 0`;
  }

  getTransformForAllWeeks() {
    if (this.props.horizontal) {
      return `0, ${this.getMonthLabelSize() - 100}`;
    }
    return null;
  }

  getViewBox() {
    if (this.props.horizontal) {
      return [this.getWidth(), this.getHeight()];
    }
    return [this.getHeight(), this.getWidth()];
  }

  getSquareCoordinates(dayIndex) {
    if (this.props.horizontal) {
      return [0, dayIndex * this.getSquareSizeWithGutter()];
    }
    return [dayIndex * this.getSquareSizeWithGutter(), 0];
  }

  getMonthLabelCoordinates(weekIndex) {
    const { paddingTop, paddingLeft, paddingRight, paddingBottom, justifyContent, alignItems } = this.props.chartConfig.chartStyle;
    if (this.props.horizontal) {
      const [justifyOffset, alignOffset] = this.setContentLayout(this.getWidth(), this.getHeight());
      return [
        weekIndex * this.getSquareSizeWithGutter() + alignOffset,
        this.getMonthLabelSize() - this.props.month_label_gutter_size + justifyOffset
      ];
    }
    const verticalOffset = -2;
    const [justifyOffset, alignOffset] = this.setContentLayout(this.getHeight(), this.getWidth());
    return [
      0 + alignOffset,
      (weekIndex + 1) * this.getSquareSizeWithGutter() + verticalOffset + justifyOffset
    ];
  }

  renderSquare(dayIndex, index) {
    const indexOutOfRange =
      index < this.getNumEmptyDaysAtStart() ||
      index >= this.getNumEmptyDaysAtStart() + this.props.numDays;

    if (indexOutOfRange && !this.props.showOutOfRangeDays) {
      return null;
    }

    const [x, y] = this.getSquareCoordinates(dayIndex);
    const { squareSize } = this.props;

    return (
      <Tooltip
        key={index}
        toggleColor={this.props.chartConfig.toggleColor}
        from={ (toggleVisible, fill=this.getClassNameForIndex(index)) =>
          <Rect
            width={squareSize}
            height={squareSize}
            x={x}
            y={y}
            onPress={() => {this.handleDayPress(index);}}
            onPressIn={toggleVisible}
            onPressOut={toggleVisible}
            title={this.getTitleForIndex(index)}
            fill={fill}
          />
        }
        toggleTooltip={this.props.toggleTooltip}
        >
        {
          this.squareTooltip({index, x, y})
        }
      </Tooltip>
    );
  }

  squareTooltip(args) {
    const { index, x, y } = args;
    if(!this.props.toggleTooltip && this.props.tooltipContent){
      return;
    }

    const dateInfo = this.state.valueCache[index] && this.state.valueCache[index].value
      ? this.state.valueCache[index].value
      : {
          [this.props.accessor]: 0,
          date: new Date(this.getStartDate().valueOf()
           + index * MILLISECONDS_IN_ONE_DAY).toISOString().split('T')[0]
        }
    return this.props.tooltipContent(dateInfo, args);
  }

  handleDayPress(index) {
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
            ).toISOString().split('T')[0]
          }
    );
  }

  renderWeek(weekIndex) {
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

  renderMonthLabels() {
    const { paddingTop, paddingBottom, paddingLeft, paddingRight } = this.props.chartConfig.chartStyle;
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
          x={x}
          y={y}
          {...this.getPropsForLabels()}
        >
          {this.props.getMonthLabel
            ? this.props.getMonthLabel(endOfWeek.getMonth())
            : MONTH_LABELS[endOfWeek.getMonth()]}
        </Text>
      ) : null;
    });
  }

  render() {
    const { style = {} } = this.props;
    const defaultChartStyle = {
        borderRadius: 0,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 0,
        paddingLeft: 0,
        justifyContent: 'start',
        justifyOffset: 0,
        alignItems: 'start',
        alignOffset: 0,
    }

    this.props.chartConfig = {
      ...this.props.chartConfig,
      chartStyle: {
        ...defaultChartStyle,
        ...this.props.chartConfig.chartStyle,
      },
    }

    // setup dynamic size if user does not provide their own squareSize
    this.props.squareSize = this.props.squareSize || this.setDynamicSquareSize() || 20;
    this.mainLayoutSetup();

    // reserved code for future if want to handle special gesture events
    // this._panResponder = PanResponder.create({
    //   onStartShouldSetPanResponder: (evt, gestureState) => true,
    //   onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    //   onMoveShouldSetPanResponder: (evt, gestureState) => true,
    //   onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    //   onPanResponderGrant: (evt, gestureState) => {
    //     console.log(evt.nativeEvent.locationX,evt.nativeEvent.locationY);
    //   },
    //   onPanResponderMove: (evt, gestureState) => {
    //     // X position relative to the page
    //     console.log(evt.nativeEvent.locationX,evt.nativeEvent.locationY);
    //   }
    // });

    return (
      <View style={style}>
        <Svg height={this.props.height} width={this.props.width}>
          {this.renderDefs({
            width: this.props.width,
            height: this.props.height,
            ...this.props.chartConfig
          })}
          <Rect
            width="100%"
            height={this.props.height}
            rx={this.props.chartConfig.chartStyle.borderRadius}
            ry={this.props.chartConfig.chartStyle.borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>{this.renderMonthLabels()}</G>
          <G>{this.renderAllWeeks()}</G>
        </Svg>
      </View>
    );
  }
}

class Tooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
  }

  toggleVisible = () => {
    this.setState(prevState => ({isVisible: !prevState.isVisible}));
  }
  render() {
    const fill = this.props.toggleTooltip && this.state.isVisible ? this.props.toggleColor : undefined;

    return (
      <>
        { this.props.from(this.toggleVisible, fill) }
        { this.props.toggleTooltip && this.state.isVisible ? this.props.children : null }
      </>
    )
  }
}

ContributionGraph.defaultProps = {
  numDays: 200,
  endDate: new Date(),
  gutterSize: 1,
  month_label_gutter_size: 8,
  squareSize: 0,
  horizontal: true,
  showMonthLabels: true,
  showOutOfRangeDays: false,
  accessor: "count",
  toggleTooltip: false,
  classForValue: value => (value ? "black" : "#8cc665"),
};

export default ContributionGraph;

import React, { Component } from "react";

import { LinearGradient, Line, Text, Defs, Stop } from "react-native-svg";

class AbstractChart extends Component {

  calcScaler = data => {
    const defMin = this.props.defMin ?? Math.min(...data);
    const defMax = this.props.defMax ?? Math.max(...data);
    return Math.max(...data, defMin, defMax) - Math.min(...data, defMin, defMax) || 1;
  };

  calcBaseHeight = (data, height) => {
    const defMin = this.props.defMin ?? Math.min(...data);
    const defMax = this.props.defMax ?? Math.max(...data);
    const min = Math.min(...data, defMin, defMax);
    const max = Math.max(...data, defMin, defMax);
    if (min >= 0 && max >= 0) {
      return height;
    } else if (min < 0 && max <= 0) {
      return 0;
    } else if (min < 0 && max > 0) {
      return (height * max) / this.calcScaler(data);
    }
  };

  calcHeight = (val, data, height) => {
    const defMin = this.props.defMin ?? Math.min(...data);
    const defMax = this.props.defMax ?? Math.max(...data);
    const max = Math.max(...data, defMin, defMax);
    const min = Math.min(...data, defMin, defMax);
    if (min < 0 && max > 0) {
      return height * (val / this.calcScaler(data));
    } else if (min >= 0 && max >= 0) {
      return height * ((val - min) / this.calcScaler(data));
    } else if (min < 0 && max <= 0) {
      return height * ((val - max) / this.calcScaler(data));
    }
  };

  getPropsForBackgroundLines() {
    const { propsForBackgroundLines = {} } = this.props.chartConfig;
    return {
      stroke: this.props.chartConfig.color(0.2),
      strokeDasharray: "5, 10",
      strokeWidth: 1,
      ...propsForBackgroundLines
    };
  }

  getPropsForLabels() {
    const {
      propsForLabels = {},
      color,
      labelColor = color
    } = this.props.chartConfig;
    return {
      fontSize: 12,
      fill: labelColor(0.8),
      ...propsForLabels,
    };
  }

  renderHorizontalLines = config => {
    const { count, width, height, gutterTop, horizontalLabelWidth, verticalLabelHeight,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
     } = config;
    const basePosition = height - verticalLabelHeight - paddingBottom;
    const totalLineHeight = basePosition - paddingTop - gutterTop;
    const x1 = horizontalLabelWidth + paddingLeft;
    const x2 = width - paddingRight;
    const lineGap = (count - 1) || 1; //handle divided by zero
    return [...new Array(count)].map((_, i) => {
      const y = basePosition - totalLineHeight / lineGap * i
      return (
        <Line
          key={Math.random()}
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          {...this.getPropsForBackgroundLines()}
        />
      );
    });
  };

  renderHorizontalLabels = config => {
    const {
      count,
      data,
      height,
      gutterTop,
      horizontalLabelWidth,
      horizontalLabelRotation = 0,
      verticalLabelHeight,
      decimalPlaces = 2,
      formatYLabel = yLabel => yLabel,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
    } = config;

    const {
      yAxisLabel = "",
      yAxisSuffix = "",
      yLabelsOffset = 12,
      defMin = Math.min(...data),
      defMax = Math.max(...data),
    } = this.props;

    const basePosition = height - verticalLabelHeight - paddingBottom;
    const totalLineHeight = basePosition - paddingTop - gutterTop;
    const lineGap = (count - 1) || 1;

    return [...Array(count === 1 ? 1 : count).keys()].map((i, _) => {
      let yLabel = i * count;

      const label = this.calcScaler(data) / lineGap * i + Math.min(...data, defMin, defMax);
      yLabel = `${yAxisLabel}${formatYLabel(
        label.toFixed(decimalPlaces)
      )}${yAxisSuffix}`;

      const x = horizontalLabelWidth - yLabelsOffset;
      const y = basePosition - totalLineHeight / lineGap * i;

      return (
        <Text
          rotation={horizontalLabelRotation}
          origin={`${x}, ${y}`}
          key={Math.random()}
          x={x + paddingLeft}
          textAnchor="end"
          y={y}
          {...this.getPropsForLabels()}
        >
          {yLabel}
        </Text>
      );
    });
  };

  renderVerticalLabels = config => {
    const {
      labels = [],
      width,
      height,
      horizontalLabelWidth,
      verticalLabelHeight,
      gutterTop,
      horizontalOffset = 0,
      stackedBar = false,
      verticalLabelRotation = 0,
      formatXLabel = xLabel => xLabel,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
      midPoint = 0,
    } = config;

    const {
      xAxisLabel = "",
      xLabelsOffset = 0,
      hideLabelsAtIndex = []
    } = this.props;
    const fontSize = 12;
    let fac = 1;
    if (stackedBar) {
      fac = 0.71;
    }

    const labelWidth = (width - horizontalLabelWidth - paddingRight - paddingLeft) / labels.length;

    const y = height - paddingBottom - verticalLabelHeight + xLabelsOffset + fontSize*1.5;

    return labels.map((label, i) => {
      if (hideLabelsAtIndex.includes(i)) {
        return null;
      }

      const x = (paddingLeft + horizontalLabelWidth + labelWidth * i + midPoint + horizontalOffset) * fac;

      return (
        <Text
          origin={`${x}, ${y}`}
          rotation={verticalLabelRotation}
          key={Math.random()}
          x={x}
          y={y}
          textAnchor={verticalLabelRotation === 0 ? "middle" : "start"}
          {...this.getPropsForLabels()}
        >
          {`${formatXLabel(label)}${xAxisLabel}`}
        </Text>
      );
    });
  };

  renderVerticalLines = config => {
    const { data, width, height, gutterTop, horizontalLabelWidth, verticalLabelHeight,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
    } = config;
    const {
      yAxisInterval = 1,
      adjustment = 1,
      innerLines,
    } = this.props;
    const innerWidth = width - horizontalLabelWidth - paddingLeft - paddingRight;

    const lineNum = innerLines || data.length;

    const gap = innerWidth / (lineNum / yAxisInterval);

    return [...new Array(Math.ceil(lineNum / yAxisInterval))].map(
      (_, i) => {
        return (
          <Line
            key={Math.random()}
            x1={Math.floor(
              gap * i * adjustment + horizontalLabelWidth + paddingLeft
            )}
            y1={paddingTop+gutterTop}
            x2={Math.floor(
              gap * i * adjustment + horizontalLabelWidth + paddingLeft
            )}
            y2={height - verticalLabelHeight - paddingBottom }
            {...this.getPropsForBackgroundLines()}
          />
        );
      }
    );
  };

  renderDefs = config => {
    const {
      width,
      height,
      backgroundGradientFrom,
      backgroundGradientTo,
      useShadowColorFromDataset,
      data
    } = config;

    const fromOpacity = config.hasOwnProperty("backgroundGradientFromOpacity")
      ? config.backgroundGradientFromOpacity
      : 1.0;

    const toOpacity = config.hasOwnProperty("backgroundGradientToOpacity")
      ? config.backgroundGradientToOpacity
      : 1.0;

    const fillShadowGradient = config.hasOwnProperty("fillShadowGradient")
      ? config.fillShadowGradient
      : this.props.chartConfig.color();

    const fillShadowGradientOpacity = config.hasOwnProperty(
      "fillShadowGradientOpacity"
    )
      ? config.fillShadowGradientOpacity
      : 0.1;

    return (
      <Defs>
        <LinearGradient
          id="backgroundGradient"
          x1={0}
          y1={height}
          x2={width}
          y2={0}
          gradientUnits="userSpaceOnUse"
        >
          <Stop
            offset="0"
            stopColor={backgroundGradientFrom}
            stopOpacity={fromOpacity}
          />
          <Stop
            offset="1"
            stopColor={backgroundGradientTo}
            stopOpacity={toOpacity}
          />
        </LinearGradient>
        {
          useShadowColorFromDataset ? (
            data.map((dataset, index) => (
              <LinearGradient
                id={`fillShadowGradient_${index}`}
                key={`${index}`}
                x1={0}
                y1={0}
                x2={0}
                y2={height}
                gradientUnits="userSpaceOnUse"
              >
                <Stop
                  offset="0"
                  stopColor={dataset.color ? dataset.color() : fillShadowGradient}
                  stopOpacity={fillShadowGradientOpacity}
                />
                <Stop offset="1" stopColor={dataset.color ? dataset.color(fillShadowGradientOpacity) : fillShadowGradient} stopOpacity="0" />
              </LinearGradient>
            ))
          ) : (
            <LinearGradient
              id="fillShadowGradient"
              x1={0}
              y1={0}
              x2={0}
              y2={height}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor={fillShadowGradient}
                stopOpacity={fillShadowGradientOpacity}
              />
              <Stop offset="1" stopColor={fillShadowGradient} stopOpacity="0" />
            </LinearGradient>
          )
        }
      </Defs>
    );
  };
}

export default AbstractChart;

import React from "react";
import { View } from "react-native";
import { Svg, Rect, G, Text } from "react-native-svg";
import AbstractChart from "./abstract-chart";

const BAR_RATIO = {
  gutterTop: 0.1 ,
  horizontalLabelWidth: 0.2,
  verticalLabelHeight: 0.15,
}

class BarChart extends AbstractChart {
  getBarPercentage = () => {
    const { barPercentage = 1 } = this.props.chartConfig;
    return barPercentage;
  };

  barPosSetup = (config) => {
    const { data, width, height, gutterTop, horizontalLabelWidth, verticalLabelHeight,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
    } = config;
    const innerHeight = (height - paddingTop - paddingBottom - verticalLabelHeight - gutterTop);
    const baseHeight = this.calcBaseHeight(data, innerHeight);
    const labelWidth = (width - horizontalLabelWidth - paddingRight - paddingLeft) / data.length;
    const midPoint = labelWidth / 2;
    const barWidth = this.props.barWidth * this.getBarPercentage();
    return { innerHeight, baseHeight, labelWidth, midPoint, barWidth };
  }

  renderBars = config => {
    const { data, width, height, gutterTop, horizontalLabelWidth, verticalLabelHeight, barRadius,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
    } = config;

    const { innerHeight, baseHeight, labelWidth, midPoint, barWidth } = this.barPosSetup(config);

    return data.map((value, i) => {
      const barHeight = this.calcHeight(value, data, innerHeight);
      const x = horizontalLabelWidth + paddingLeft + labelWidth * i + midPoint - barWidth/2;
      const y = (barHeight > 0 ? baseHeight - barHeight : baseHeight) + gutterTop + paddingTop;
      return (
        <Rect
          key={Math.random()}
          x={x}
          y={y}
          rx={barRadius}
          width={barWidth}
          height={Math.abs(barHeight)}
          fill="url(#fillShadowGradient)"
        />
      );
    });
  };

  renderBarTops = config => {
    const { data, width, height, gutterTop, horizontalLabelWidth, verticalLabelHeight,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
    } = config;

    const { innerHeight, baseHeight, labelWidth, midPoint, barWidth } = this.barPosSetup(config);

    return data.map((value, i) => {
      const barHeight = this.calcHeight(value, data, innerHeight);
      const x = horizontalLabelWidth + paddingLeft + labelWidth * i + midPoint - barWidth/2;
      const y = baseHeight - barHeight + gutterTop + paddingTop;
      return (
        <Rect
          key={Math.random()}
          x={x}
          y={y}
          width={barWidth}
          height={2}
          fill={this.props.chartConfig.color(0.6)}
        />
      );
    });
  };

  renderValuesOnTopOfBars = config => {
    const { data, width, height, gutterTop, horizontalLabelWidth, verticalLabelHeight,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
    } = config;

    const { innerHeight, baseHeight, labelWidth, midPoint, barWidth } = this.barPosSetup(config);

    return data.map((value, i) => {
      const barHeight = this.calcHeight(value, data, innerHeight);
      const x = horizontalLabelWidth + paddingLeft + labelWidth * i + midPoint;
      const y = baseHeight - barHeight + gutterTop + paddingTop - 2;
      return (
        <Text
          key={Math.random()}
          x={x}
          y={y}
          fill={this.props.chartConfig.color(0.6)}
          fontSize="12"
          textAnchor="middle"
        >
          {data[i]}
        </Text>
      );
    });
  };

  render() {
    const {
      width,
      height,
      data,
      style = {},
      withHorizontalLabels = true,
      withVerticalLabels = true,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      withInnerLines = true,
      showBarTops = true,
      showValuesOnTopOfBars = false,
      segments = 5
    } = this.props;

    const defaultChartStyle = {
      borderRadius: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 0,
      paddingLeft: 0,
    }

    const config = {
      width,
      height,
      chartStyle: {
        ...defaultChartStyle,
        ...this.props.chartConfig.chartStyle,
      },
      verticalLabelRotation,
      horizontalLabelRotation,
      horizontalOffset: this.props.horizontalOffset || 0,
      barRadius:
        (this.props.chartConfig && this.props.chartConfig.barRadius) || 0,
      decimalPlaces:
        (this.props.chartConfig && this.props.chartConfig.decimalPlaces) ?? 2,
      formatYLabel:
        (this.props.chartConfig && this.props.chartConfig.formatYLabel) ||
        function(label) {
          return label;
        },
      formatXLabel:
        (this.props.chartConfig && this.props.chartConfig.formatXLabel) ||
        function(label) {
          return label;
        }
    };

    //auto dynamic size if user dont set the following props
    config.gutterTop = this.props.chartConfig.gutterTop ??
      (height - config.chartStyle.paddingTop - config.chartStyle.paddingBottom) * BAR_RATIO.gutterTop;

    config.horizontalLabelWidth = this.props.chartConfig.horizontalLabelWidth ??
      (width - config.chartStyle.paddingRight - config.chartStyle.paddingLeft) * BAR_RATIO.horizontalLabelWidth;

    config.verticalLabelHeight = this.props.chartConfig.verticalLabelHeight ??
      (height - config.chartStyle.paddingTop - config.chartStyle.paddingBottom) * BAR_RATIO.verticalLabelHeight;

    const labelWidth = (config.width - config.horizontalLabelWidth -
      config.chartStyle.paddingRight - config.chartStyle.paddingLeft) / data.labels.length;

    return (
      <View style={style} >
        <Svg height={height} width={width}>
          {this.renderDefs({
            ...config,
            ...this.props.chartConfig,
          })}
          <Rect
            width="100%"
            height={height}
            rx={config.chartStyle.borderRadius}
            ry={config.chartStyle.borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {withInnerLines
              ? this.renderHorizontalLines({
                  ...config,
                  count: segments,
                })
              : null}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                  ...config,
                  count: segments,
                  data: data.datasets[0].data,
                })
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels({
                  ...config,
                  labels: data.labels,
                  midPoint: labelWidth / 2,
                })
              : null}
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.datasets[0].data,
            })}
          </G>
          <G>
            {showValuesOnTopOfBars &&
              this.renderValuesOnTopOfBars({
                ...config,
                data: data.datasets[0].data,
              })}
          </G>
          <G>
            {showBarTops &&
              this.renderBarTops({
                ...config,
                data: data.datasets[0].data,
              })}
          </G>
        </Svg>
      </View>
    );
  }
}

BarChart.defaultProps = {
  barWidth: 32,
}

export default BarChart;

import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  TextInput
} from "react-native";
import {
  Svg,
  Circle,
  Polygon,
  Polyline,
  Path,
  Rect,
  G
} from "react-native-svg";
import AbstractChart, { GRAPH_RATIO } from "../abstract-chart";
import { LegendItem } from "./legend-item";

let AnimatedCircle = Animated.createAnimatedComponent(Circle);

class LineChart extends AbstractChart {
  label = React.createRef();

  state = {
    scrollableDotHorizontalOffset: new Animated.Value(0)
  };

  getColor = (dataset={}, opacity) => {
    return (dataset.color || this.props.chartConfig.color)(opacity);
  };

  getStrokeWidth = dataset => {
    return dataset.strokeWidth || this.props.chartConfig.strokeWidth || 3;
  };

  getDatas = data =>
    data.reduce((acc, item) => (item.data ? [...acc, ...item.data] : acc), []);

  linePositionHelper = config => {
    const {
      width,
      height,
      data,
      linejoinType,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
      verticalLabelHeight,
      horizontalLabelWidth,
      gutterTop,
    } = config;

    const datas = this.getDatas(data);
    const innerHeight = height - paddingTop - paddingBottom - verticalLabelHeight - gutterTop;
    const innerWidth = width - horizontalLabelWidth - paddingRight - paddingLeft;
    const baseHeight = this.calcBaseHeight(datas, innerHeight)

    return { datas, innerHeight, innerWidth, baseHeight };
  }

  getPropsForDots = (x, i) => {
    const { getDotProps, chartConfig = {} } = this.props;
    if (typeof getDotProps === "function") {
      return getDotProps(x, i);
    }
    const { propsForDots = {} } = chartConfig;
    return { r: "4", ...propsForDots };
  };

  renderDots = config => {
    const {
      data,
      width,
      height,
      onDataPointClick,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
      verticalLabelHeight,
      horizontalLabelWidth,
      gutterTop,
    } = config;
    const output = [];
    const { datas, innerHeight, innerWidth, baseHeight } = this.linePositionHelper(config);
    const {
      getDotColor,
      hidePointsAtIndex = [],
      renderDotContent = () => {
        return null;
      }
    } = this.props;

    data.forEach(dataset => {
      if (dataset.withDots == false) return;

      dataset.data.forEach((x, i) => {
        if (hidePointsAtIndex.includes(i)) {
          return;
        }
        const lineHeight = this.calcHeight(x, datas, innerHeight);
        const gapWidth = innerWidth / dataset.data.length;
        const cx = i * gapWidth + horizontalLabelWidth + paddingLeft;
        const cy = baseHeight - lineHeight + gutterTop + paddingTop;
        const onPress = () => {
          if (!onDataPointClick || hidePointsAtIndex.includes(i)) {
            return;
          }

          onDataPointClick({
            index: i,
            value: x,
            dataset,
            x: cx,
            y: cy,
            getColor: opacity => this.getColor(dataset, opacity)
          });
        };
        output.push(
          <Circle
            key={Math.random()}
            cx={cx}
            cy={cy}
            fill={
              typeof getDotColor === "function"
                ? getDotColor(x, i)
                : this.getColor(dataset, 0.9)
            }
            onPress={onPress}
            {...this.getPropsForDots(x, i)}
          />,
          <Circle
            key={Math.random()}
            cx={cx}
            cy={cy}
            r="14"
            fill="#fff"
            fillOpacity={0}
            onPress={onPress}
          />,
          renderDotContent({ x: cx, y: cy, index: i })
        );
      });
    });
    return output;
  };

  renderScrollableDot = config => {
    const {
      data,
      width,
      height,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
      scrollableDotHorizontalOffset,
      scrollableDotFill,
      scrollableDotStrokeColor,
      scrollableDotStrokeWidth,
      scrollableDotRadius,
      scrollableInfoViewStyle = {},
      scrollableInfoTextStyle = {},
      scrollableInfoSize = {height:20, width:20},
      scrollableInfoOffset = 10,
      verticalLabelHeight,
      horizontalLabelWidth,
      gutterTop,
    } = config;
    const output = [];
    const { datas, innerHeight, innerWidth, baseHeight } = this.linePositionHelper(config);
    let vl = [];

    const perData = width / data[0].data.length;
    for (let index = 0; index < data[0].data.length; index++) {
      vl.push(index * perData);
    }
    let lastIndex;

    scrollableDotHorizontalOffset.addListener(value => {
      const index = value.value / perData;
      if (!lastIndex) {
        lastIndex = index;
      }

      let abs = Math.floor(index);
      let percent = index - abs;
      abs = data[0].data.length - abs - 1;

      if (index >= data[0].data.length - 1) {
        this.label.current.setNativeProps({
          text: `${Math.floor(data[0].data[0])}`
        });
      } else {
        if (index > lastIndex) {
          // to right

          const base = data[0].data[abs];
          const prev = data[0].data[abs - 1];
          if (prev > base) {
            let rest = prev - base;
            this.label.current.setNativeProps({
              text: `${Math.floor(base + percent * rest)}`
            });
          } else {
            let rest = base - prev;
            this.label.current.setNativeProps({
              text: `${Math.floor(base - percent * rest)}`
            });
          }
        } else {
          // to left

          const base = data[0].data[abs - 1];
          const next = data[0].data[abs];
          percent = 1 - percent;
          if (next > base) {
            let rest = next - base;
            this.label.current.setNativeProps({
              text: `${Math.floor(base + percent * rest)}`
            });
          } else {
            let rest = base - next;
            this.label.current.setNativeProps({
              text: `${Math.floor(base - percent * rest)}`
            });
          }
        }
      }
      lastIndex = index;
    });

    data.forEach(dataset => {
      if (dataset.withScrollableDot == false) return;

      const perData = innerWidth / dataset.data.length;
      let values = [];
      let yValues = [];
      let xValues = [];

      let yValuesLabel = [];
      let xValuesLabel = [];

      for (let index = 0; index < dataset.data.length; index++) {
        values.push(index * perData);

        const lineHeight = this.calcHeight(dataset.data[dataset.data.length - index - 1], datas, innerHeight);
        const gapWidth = innerWidth / dataset.data.length;
        const yval = baseHeight - lineHeight + gutterTop + paddingTop;
        const xval = paddingLeft + horizontalLabelWidth + (dataset.data.length - index - 1) * gapWidth;

        yValues.push(yval);
        xValues.push(xval);
        yValuesLabel.push(yval + scrollableInfoOffset);
        xValuesLabel.push(xval - scrollableInfoSize.width / 2);
      }

      const translateX = scrollableDotHorizontalOffset.interpolate({
        inputRange: values,
        outputRange: xValues,
        extrapolate: "clamp"
      });

      const translateY = scrollableDotHorizontalOffset.interpolate({
        inputRange: values,
        outputRange: yValues,
        extrapolate: "clamp"
      });

      const labelTranslateX = scrollableDotHorizontalOffset.interpolate({
        inputRange: values,
        outputRange: xValuesLabel,
        extrapolate: "clamp"
      });

      const labelTranslateY = scrollableDotHorizontalOffset.interpolate({
        inputRange: values,
        outputRange: yValuesLabel,
        extrapolate: "clamp"
      });

      output.push([
        <Animated.View
          key={Math.random()}
          style={[
            scrollableInfoViewStyle,
            {
              transform: [
                { translateX: labelTranslateX },
                { translateY: labelTranslateY }
              ],
              width: scrollableInfoSize.width,
              height: scrollableInfoSize.height
            }
          ]}
        >
          <TextInput
            onLayout={() => {
              this.label.current.setNativeProps({
                text: `${Math.floor(data[0].data[data[0].data.length - 1])}`
              });
            }}
            style={scrollableInfoTextStyle}
            ref={this.label}
          />
        </Animated.View>,
        <AnimatedCircle
          key={Math.random()}
          cx={translateX}
          cy={translateY}
          r={scrollableDotRadius}
          stroke={scrollableDotStrokeColor}
          strokeWidth={scrollableDotStrokeWidth}
          fill={scrollableDotFill}
        />
      ]);
    });

    return output;
  };

  renderShadow = config => {
    if (this.props.bezier) {
      return this.renderBezierShadow(config);
    }

    const { data, width, height, useColorFromDataset,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
      verticalLabelHeight,
      horizontalLabelWidth,
      gutterTop,
    } = config;

    const { datas, innerHeight, innerWidth, baseHeight } = this.linePositionHelper(config);

    return config.data.map((dataset, index) => {
      return (
        <Polygon
          key={index}
          points={
            dataset.data
              .map((d, i) => {
                const lineHeight = this.calcHeight(d, datas, innerHeight);
                const gapWidth = innerWidth / dataset.data.length;
                const x = paddingLeft + horizontalLabelWidth + i * gapWidth;
                const y = baseHeight - lineHeight + gutterTop + paddingTop;
                return `${x},${y}`;
              })
              .join(" ") +
            ` ${paddingLeft + horizontalLabelWidth + (innerWidth / dataset.data.length) * (dataset.data.length - 1)},
              ${paddingTop + gutterTop + innerHeight} ${paddingLeft + horizontalLabelWidth},
              ${paddingTop + gutterTop + innerHeight}`
          }
          fill={`url(#fillShadowGradient${
            useColorFromDataset ? `_${index}` : ""
          })`}
          strokeWidth={0}
        />
      );
    });
  };

  renderLine = config => {
    if (this.props.bezier) {
      return this.renderBezierLine(config);
    }

    const {
      width,
      height,
      data,
      linejoinType,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
      verticalLabelHeight,
      horizontalLabelWidth,
      gutterTop,
    } = config;

    const output = [];

    const { datas, innerHeight, innerWidth, baseHeight } = this.linePositionHelper(config);
    let lastPoint;
    data.forEach((dataset, index) => {
      const points = dataset.data.map((d, i) => {
        const lineHeight = this.calcHeight(d, datas, innerHeight);
        const gapWidth = innerWidth / dataset.data.length;
        const x = i * gapWidth + horizontalLabelWidth + paddingLeft;
        const y = baseHeight - lineHeight + gutterTop + paddingTop;
        lastPoint = `${x},${y}`;
        return `${x},${y}`;
      });
      output.push(
        <Polyline
          key={index}
          strokeLinejoin={linejoinType}
          points={points.join(" ")}
          fill="none"
          stroke={this.getColor(dataset, 0.2)}
          strokeWidth={this.getStrokeWidth(dataset)}
        />
      );
    });

    return output;
  };

  getBezierLinePoints = (dataset, config) => {
    const { width, height, data,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
      verticalLabelHeight,
      horizontalLabelWidth,
      gutterTop,
    } = config;

    if (dataset.data.length === 0) {
      return "M0,0";
    }

    const { datas, innerHeight, innerWidth, baseHeight } = this.linePositionHelper(config);
    const gapWidth = innerWidth / dataset.data.length;

    const x = i =>
      Math.floor(paddingLeft + horizontalLabelWidth + i * gapWidth);
    const y = i => {
      const yHeight = this.calcHeight(dataset.data[i], datas, innerHeight);
      return Math.floor(baseHeight - yHeight + paddingTop + gutterTop);
    };

    return [`M${x(0)},${y(0)}`]
      .concat(
        dataset.data.slice(0, -1).map((_, i) => {
          const x_mid = (x(i) + x(i + 1)) / 2;
          const y_mid = (y(i) + y(i + 1)) / 2;
          const cp_x1 = (x_mid + x(i)) / 2;
          const cp_x2 = (x_mid + x(i + 1)) / 2;
          return (
            `Q ${cp_x1}, ${y(i)}, ${x_mid}, ${y_mid}` +
            ` Q ${cp_x2}, ${y(i + 1)}, ${x(i + 1)}, ${y(i + 1)}`
          );
        })
      )
      .join(" ");
  };

  renderBezierLine = config => {
    return config.data.map((dataset, index) => {
      const result = this.getBezierLinePoints(dataset, config);
      return (
        <Path
          key={index}
          d={result}
          fill="none"
          stroke={this.getColor(dataset, 0.2)}
          strokeWidth={this.getStrokeWidth(dataset)}
        />
      );
    });
  };

  renderBezierShadow = config => {
    const { width, height, data, useColorFromDataset,
      chartStyle: { paddingTop, paddingLeft, paddingRight, paddingBottom },
      verticalLabelHeight,
      horizontalLabelWidth,
      gutterTop,
    } = config;

    const { datas, innerHeight, innerWidth, baseHeight } = this.linePositionHelper(config);

    return data.map((dataset, index) => {
      const gapWidth = innerWidth / dataset.data.length;
      const d =
        this.getBezierLinePoints(dataset, config) +
        ` L${paddingLeft + horizontalLabelWidth +
          gapWidth * (dataset.data.length - 1)}
          ,${innerHeight + gutterTop + paddingTop} L${paddingLeft + horizontalLabelWidth},
          ${innerHeight + gutterTop + paddingTop} Z`;
      return (
        <Path
          key={index}
          d={d}
          fill={`url(#fillShadowGradient${
            useColorFromDataset ? `_${index}` : ""
          })`}
          strokeWidth={0}
        />
      );
    });
  };

  renderLegend = (width, legendOffset) => {
    const { legend, datasets } = this.props.data;
    const baseLegendItemX = width / (legend.length + 1);

    return legend.map((legendItem, i) => (
      <G key={Math.random()}>
        <LegendItem
          index={i}
          iconColor={this.getColor(datasets[i], 0.9)}
          baseLegendItemX={baseLegendItemX}
          legendText={legendItem}
          labelProps={{ ...this.getPropsForLabels() }}
          legendOffset={legendOffset}
        />
      </G>
    ));
  };

  render() {
    const {
      width,
      height,
      data,
      withScrollableDot = false,
      withShadow = true,
      withDots = true,
      withInnerLines = true,
      withOuterLines = true,
      withHorizontalLabels = true,
      withVerticalLabels = true,
      style = {},
      decorator,
      onDataPointClick,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      formatYLabel = yLabel => yLabel,
      formatXLabel = xLabel => xLabel,
      segments,
      transparent = false,
      chartConfig = {}
    } = this.props;

    const defaultChartStyle = {
      borderRadius: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 0,
      paddingLeft: 0,
    }

    const { scrollableDotHorizontalOffset } = this.state;
    const { labels = [] } = data;
    const {
      borderRadius = 0,
      paddingTop = 16,
      paddingRight = 64,
      margin = 0,
      marginRight = 0,
      paddingBottom = 0
    } = style;

    const config = {
      width,
      height,
      chartStyle: {
        ...defaultChartStyle,
        ...this.props.chartConfig.chartStyle,
      },
      verticalLabelRotation,
      horizontalLabelRotation
    };

    //auto dynamic size if user dont set the following props
    config.gutterTop = this.props.chartConfig.gutterTop ??
      (height - config.chartStyle.paddingTop - config.chartStyle.paddingBottom) * GRAPH_RATIO.gutterTop;

    config.horizontalLabelWidth = this.props.chartConfig.horizontalLabelWidth ??
      (width - config.chartStyle.paddingRight - config.chartStyle.paddingLeft) * GRAPH_RATIO.horizontalLabelWidth;

    config.verticalLabelHeight = this.props.chartConfig.verticalLabelHeight ??
      (height - config.chartStyle.paddingTop - config.chartStyle.paddingBottom) * GRAPH_RATIO.verticalLabelHeight;

    const datas = this.getDatas(data.datasets);

    let count = Math.min(...datas) === Math.max(...datas) ? 2 : 5;
    if (segments) {
      count = segments;
    }

    const legendOffset = this.props.data.legend ? height * 0.15 : 0;

    return (
      <View style={style}>
        <Svg
          height={height + legendOffset}
          width={width}
        >
          <Rect
            width="100%"
            height={height + legendOffset}
            rx={config.chartStyle.borderRadius}
            ry={config.chartStyle.borderRadius}
            fill="url(#backgroundGradient)"
            fillOpacity={transparent ? 0 : 1}
          />
          {
            this.props.data.legend &&
            this.renderLegend(config.width, legendOffset)
          }
            <G x="0" y={legendOffset}>
            {this.renderDefs({
              ...config,
              ...chartConfig,
              data: data.datasets
            })}
            <G>
              {withInnerLines
                ? this.renderHorizontalLines({
                    ...config,
                    count: count,
                  })
                : null}
            </G>
            <G>
              {withHorizontalLabels
                ? this.renderHorizontalLabels({
                    ...config,
                    count: count,
                    data: datas,
                    formatYLabel,
                    decimalPlaces: chartConfig.decimalPlaces
                  })
                : null}
            </G>
            <G>
              {withInnerLines
                ? this.renderVerticalLines({
                    ...config,
                    data: data.datasets[0].data,
                  })
                : null}
            </G>
            <G>
              {withVerticalLabels
                ? this.renderVerticalLabels({
                    ...config,
                    labels,
                    formatXLabel
                  })
                : null}
            </G>
            <G>
              {this.renderLine({
                ...chartConfig,
                ...config,
                data: data.datasets,
              })}
            </G>
            <G>
              {withShadow &&
                this.renderShadow({
                  ...config,
                  data: data.datasets,
                  useColorFromDataset: chartConfig.useShadowColorFromDataset,
                })}
            </G>
            <G>
              {withDots &&
                this.renderDots({
                  ...config,
                  data: data.datasets,
                  onDataPointClick
                })}
            </G>
            <G>
              {withScrollableDot &&
                this.renderScrollableDot({
                  ...chartConfig,
                  ...config,
                  data: data.datasets,
                  onDataPointClick,
                  scrollableDotHorizontalOffset
                })}
            </G>
            <G>
              {decorator &&
                decorator({
                  ...config,
                  data: data.datasets,
                })}
            </G>
          </G>
        </Svg>
        {
          withScrollableDot && (
          <ScrollView
            style={StyleSheet.absoluteFill}
            contentContainerStyle={{ width: width * 2 }}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: { x: scrollableDotHorizontalOffset }
                }
              }
            ],
            { useNativeDriver: false })}
            horizontal
            bounces={false}
          />
        )
        }
      </View>
    );
  }
}

export default LineChart;

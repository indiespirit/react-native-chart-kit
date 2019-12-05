import React from "react";
import { View } from "react-native";
import {
  Svg,
  Circle,
  Polygon,
  Polyline,
  Path,
  Rect,
  Text,
  G,
  Line
} from "react-native-svg";
import AbstractChart from "./abstract-chart";

class LineChart extends AbstractChart {
  getColor = (dataset, opacity) => {
    return (dataset.color || this.props.chartConfig.color)(opacity);
  };

  getStrokeWidth = dataset => {
    return dataset.strokeWidth || this.props.chartConfig.strokeWidth || 3;
  };

  getDatas = data =>
    data.reduce((acc, item) => (item.data ? [...acc, ...item.data] : acc), []);

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
      paddingTop,
      paddingRight,
      onDataPointClick
    } = config;
    const output = [];
    const datas = this.getDatas(data);
    const baseHeight = this.calcBaseHeight(datas, height);
    const { getDotColor, hidePointsAtIndex = [] } = this.props;
    data.forEach(dataset => {
      dataset.data.forEach((x, i) => {
        if (hidePointsAtIndex.includes(i)) {
          return;
        }
        const cx =
          paddingRight + (i * (width - paddingRight)) / dataset.data.length;
        const cy =
          ((baseHeight - this.calcHeight(x, datas, height)) / 4) * 3 +
          paddingTop;
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
            r="12"
            fill="#fff"
            fillOpacity={0}
            onPress={onPress}
          />
        );
      });
    });
    return output;
  };

  renderShadow = config => {
    if (this.props.bezier) {
      return this.renderBezierShadow(config);
    }

    const { data, width, height, paddingRight, paddingTop } = config;
    const datas = this.getDatas(data);
    const baseHeight = this.calcBaseHeight(datas, height);
    return config.data.map((dataset, index) => {
      return (
        <Polygon
          key={index}
          points={
            dataset.data
              .map((d, i) => {
                const x =
                  paddingRight +
                  (i * (width - paddingRight)) / dataset.data.length;
                const y =
                  ((baseHeight - this.calcHeight(d, datas, height)) / 4) * 3 +
                  paddingTop;
                return `${x},${y}`;
              })
              .join(" ") +
            ` ${paddingRight +
              ((width - paddingRight) / dataset.data.length) *
                (dataset.data.length - 1)},${(height / 4) * 3 +
              paddingTop} ${paddingRight},${(height / 4) * 3 + paddingTop}`
          }
          fill="url(#fillShadowGradient)"
          strokeWidth={0}
        />
      );
    });
  };

  renderLine = config => {
    if (this.props.bezier) {
      return this.renderBezierLine(config);
    }

    const { width, height, paddingRight, paddingTop, data } = config;
    const output = [];
    const datas = this.getDatas(data);
    const baseHeight = this.calcBaseHeight(datas, height);
    data.forEach((dataset, index) => {
      const points = dataset.data.map((d, i) => {
        const x =
          (i * (width - paddingRight)) / dataset.data.length + paddingRight;
        const y =
          ((baseHeight - this.calcHeight(d, datas, height)) / 4) * 3 +
          paddingTop;
        return `${x},${y}`;
      });

      output.push(
        <Polyline
          key={index}
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
    const { width, height, paddingRight, paddingTop, data } = config;
    if (dataset.data.length === 0) {
      return "M0,0";
    }

    const datas = this.getDatas(data);
    const x = i =>
      Math.floor(
        paddingRight + (i * (width - paddingRight)) / dataset.data.length
      );
    const baseHeight = this.calcBaseHeight(datas, height);
    const y = i => {
      const yHeight = this.calcHeight(dataset.data[i], datas, height);
      return Math.floor(((baseHeight - yHeight) / 4) * 3 + paddingTop);
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
    const { width, height, paddingRight, paddingTop, data } = config;
    return data.map((dataset, index) => {
      const d =
        this.getBezierLinePoints(dataset, config) +
        ` L${paddingRight +
          ((width - paddingRight) / dataset.data.length) *
            (dataset.data.length - 1)},${(height / 4) * 3 +
          paddingTop} L${paddingRight},${(height / 4) * 3 + paddingTop} Z`;
      return (
        <Path
          key={index}
          d={d}
          fill="url(#fillShadowGradient)"
          strokeWidth={0}
        />
      );
    });
  };

  renderLegendItems = config => {
    const { legend, data, width } = config;
    /* half the height of the legend Rect, minus half the height of the circle to align the
       circle from its center, rather than its top. */
    const CENTER_ALIGNED_CIRCLE = 30 / 2 - 8;
    // .65 accounts for the height of the text to center it in relation to the circles
    const CENTER_ALIGNED_TEXT = 30 * 0.65;

    // const legendItemSection = Math.round((width * .90) / legend.length);
    const interval = width / (legend.length + 1);
    // 0 is at width * .1
    // end of width is at width * .90
    // space evenly in between

    return (
      legend &&
      legend.map((x, i) => {
        return (
          <G key={Math.random()}>
            <Rect
              width="16px"
              height="16px"
              fill={this.getColor(data[i], 0.9)}
              rx={8}
              ry={8}
              x={interval * (i + 1) - 16} // he width of the circle so the circle and text straddle the interval
              y={CENTER_ALIGNED_CIRCLE}
            />
            <Text
              x={interval * (i + 1) + 4} // text padding away from circle
              y={CENTER_ALIGNED_TEXT}
              {...this.getPropsForLabels()}
            >
              {x}
            </Text>
          </G>
        );
      })
    );
  };

  renderLegend = (config, borderRadius, margin, marginRight) => {
    const { legend, datasets } = this.props.data;
    const legendItemsConfig = {
      ...config,
      legend,
      data: datasets
    };
    return (
      <>
        <Rect
          width="100%"
          height={30}
          x="0"
          y="0"
          rx={0}
          ry={0}
          fill="url(#backgroundGradient)"
        />
        {/* <Line x1="0" x2={config.width} y1="0" y2="0" stroke="red" strokeWidth="2"/> */}
        <G>{this.renderLegendItems(legendItemsConfig)}</G>
      </>
    );
  };

  render() {
    const {
      width,
      height,
      data,
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
      formatXLabel = xLabel => xLabel
    } = this.props;
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
      verticalLabelRotation,
      horizontalLabelRotation
    };

    const datas = this.getDatas(data.datasets);

    return (
      <View style={style}>
        <Svg
          height={height + paddingBottom + 30} // 30 is hardcoded width of the header
          width={width - margin * 2 - marginRight}
        >
          {this.renderLegend(config, borderRadius, margin, marginRight)}
          {/*this x/y will have to be dynamic depending on whether there is a header or not*/}
          <G x="0" y="30">
            {this.renderDefs({
              ...config,
              ...this.props.chartConfig
            })}
            <Rect
              width="100%"
              height={height}
              rx={borderRadius}
              ry={borderRadius}
              fill="url(#backgroundGradient)"
            />
            <G>
              {withInnerLines
                ? this.renderHorizontalLines({
                    ...config,
                    count: 4,
                    paddingTop,
                    paddingRight
                  })
                : withOuterLines
                ? this.renderHorizontalLine({
                    ...config,
                    paddingTop,
                    paddingRight
                  })
                : null}
            </G>
            <G>
              {withHorizontalLabels
                ? this.renderHorizontalLabels({
                    ...config,
                    count: Math.min(...datas) === Math.max(...datas) ? 1 : 4,
                    data: datas,
                    paddingTop,
                    paddingRight,
                    formatYLabel
                  })
                : null}
            </G>
            <G>
              {withInnerLines
                ? this.renderVerticalLines({
                    ...config,
                    data: data.datasets[0].data,
                    paddingTop,
                    paddingRight
                  })
                : withOuterLines
                ? this.renderVerticalLine({
                    ...config,
                    paddingTop,
                    paddingRight
                  })
                : null}
            </G>
            <G>
              {withVerticalLabels
                ? this.renderVerticalLabels({
                    ...config,
                    labels,
                    paddingRight,
                    paddingTop,
                    formatXLabel
                  })
                : null}
            </G>
            <G>
              {this.renderLine({
                ...config,
                paddingRight,
                paddingTop,
                data: data.datasets
              })}
            </G>
            <G>
              {withShadow &&
                this.renderShadow({
                  ...config,
                  data: data.datasets,
                  paddingRight,
                  paddingTop
                })}
            </G>
            <G>
              {withDots &&
                this.renderDots({
                  ...config,
                  data: data.datasets,
                  paddingTop,
                  paddingRight,
                  onDataPointClick
                })}
            </G>
            <G>
              {decorator &&
                decorator({
                  ...config,
                  data: data.datasets,
                  paddingTop,
                  paddingRight
                })}
            </G>
          </G>
        </Svg>
      </View>
    );
  }
}

export default LineChart;

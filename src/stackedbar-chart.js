import React from 'react'
import { View, Dimensions } from 'react-native'
import { Svg, Rect, G, Text } from 'react-native-svg'
import AbstractChart from './abstract-chart'

const screenWidth = Dimensions.get('window').width;

const isAllZero = (arr) => arr.filter(d => d !== 0).length === 0;

class StackedBarChart extends AbstractChart {
  renderBars = config => {
    const {
      data,
      width,
      height,
      paddingTop,
      paddingRight,
      border,
      colors,
      barWidth,
    } = config;
    return data.map((x, i) => {
      const ret = [];
      let h = 0;
      let st = paddingTop;
      for (let z = 0; z < x.length; z++) {
        h = isAllZero(x) ? 0 : (height - 55) * (x[z] / border)
        const y = (height / 4) * 3 - h + st
        const xC =
          (paddingRight +
            (i * (width - paddingRight)) / data.length +
            barWidth / 2) *
          0.7
        ret.push(
          <Rect
            key={Math.random()}
            x={xC}
            y={y}
            width={barWidth}
            height={h}
            fill={colors[z]}
          />
        )
        if (x[z] !== 0) {
          ret.push(
            <Text
              key={Math.random()}
              x={xC + 7 + barWidth / 2}
              textAnchor="end"
              y={h > 15 ? y + 15 : y + 7}
              fontSize={12}
              fill="#fff"
            >
              {x[z]}
            </Text>
          );
        }

        st -= h
      }

      return ret
    })
  }

  renderLegend = config => {
    const { legend, colors, width, height } = config
    return legend.map((x, i) => {
      return (
        <G key={Math.random()}>
          <Rect
            width="16px"
            height="16px"
            fill={colors[i]}
            rx={8}
            ry={8}
            x={width * 0.71}
            y={height * 0.7 - i * 50}
          />
          <Text
            fill={colors[i]}
            fontSize={16}
            x={width * 0.78}
            y={height * 0.76 - i * 50}
          >
            {x}
          </Text>
        </G>
      )
    })
  }

  hasLegend = () => this.props.data.legend && this.props.data.legend.length

  render() {
    const paddingTop = 15
    const paddingRight = 50
    const {
      width,
      height,
      style = {},
      data,
      withHorizontalLabels = true,
      withVerticalLabels = true,
    } = this.props;
    const { borderRadius = 0 } = style;
    const config = { width, height };
    let border = 0;
    for (let i = 0; i < data.data.length; i++) {
      const actual = data.data[i].reduce((pv, cv) => pv + cv, 0)
      if (actual > border) {
        border = actual;
      }
    }

    const barWidth = 32//(screenWidth - 50 - (this.hasLegend() ? 20 : 0)) / data.data.length;

    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs({ ...config, ...this.props.chartConfig })}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {this.renderHorizontalLines({ ...config, count: 4, paddingTop })}
          </G>
          <G>
            {withHorizontalLabels
              && this.renderHorizontalLabels({
                ...config,
                count: 4,
                data: [0, border],
                paddingTop,
                paddingRight
              })
            }
          </G>
          <G>
            {withVerticalLabels
              && this.renderVerticalLabels({
                ...config,
                labels: data.labels,
                paddingRight: paddingRight + 28,
                stackedBar: true,
                paddingTop,
                horizontalOffset: barWidth,
                rotation: "25"
              })
            }
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.data,
              border,
              colors: this.props.data.barColors,
              paddingTop,
              width: screenWidth - 50,
              barWidth,
              paddingRight: paddingRight + (this.hasLegend() ? 20 : 0)
            })}
          </G>
          {this.hasLegend() && this.renderLegend({
            ...config,
            legend: data.legend,
            colors: this.props.data.barColors
          })}
        </Svg>
      </View>
    )
  }
}
export default StackedBarChart

import React from 'react'
import { View, StyleSheet, Dimensions, PixelRatio, Platform } from 'react-native'
import {
  Svg,
  Rect,
  Text,
  G,
  Path
} from 'react-native-svg'
import AbstractChart from './abstract-chart'
const Pie = require('paths-js/pie')

const isTabletAndroid = () => {
  const pixelDensity = PixelRatio.get();
  dim = Dimensions.get('window');
  const adjustedHeight = dim.height * pixelDensity;
  const adjustedWidth = dim.width * pixelDensity;
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else if (pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)) {
    return true;
  } else {
    return false;
  }
}
function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 || dimen.width === 812)
  );
}
const textSize = isTabletAndroid() ? 20 : 10;
const colorSelector = (text) => {
  switch (text) {
    // biomass
    case "biomass":
      return "#753019";
    // coal
    case "coal":
      return "#454546";
    // imports
    case "imports":
      return "#F26522";
    // gas
    case "gas":
      return "#6A2C91";
    // nuclear
    case "nuclear":
      return "#0079C1";
    // other
    case "other":
      return "#C0C0C0";
    // hydro
    case "hydro":
      return "#5BCBF5";
    // solar
    case "solar":
      return "#FFBF22";
    // wind
    case "wind":
      return "#C2CD23";
  }
}
const changeToWater = (text) => {
  switch (text) {
    case "hydro":
      return "water";
    default:
      return text;
  }
}
const displayInnerText = (string, middleText) => {
  if (string === "true") {
    return (
      <G>
        <Text
          x={0}
          y={-10}
          textAnchor="middle"
          fill="purple"
          stroke="purple"
          fontSize="32"
          fontWeight="bold"
        >{middleText}</Text>
        <Text
          x={0}
          y={30}
          textAnchor="middle"
          fill="purple"
          stroke="purple"
          fontSize="16"
          fontWeight="bold"
        > % zero carbon</Text>
      </G>
    )
  }
}
// This is to bubbleSort the fuel Data from least percentage to most percentage. Also removes any feuls that have less than 1% 
const bubbleSortData = (data) => {
  let fuelData = data.filter((fuelObject, index) => {
    return fuelObject.percentage >= 1
  });
  for (let i = 0; i < fuelData.length; i++) {
    for (let j = 0; j < (fuelData.length - i - 1); j++) {
      if (fuelData[j].percentage > fuelData[j + 1].percentage) {
        let temp = fuelData[j];
        fuelData[j] = fuelData[j + 1];
        fuelData[j + 1] = temp;
      }
    }
  }
  return fuelData.reverse();
}
class PieChart extends AbstractChart {
  render() {
    const shouldWeDisplayInnerText = this.props.displayText
    let RSize = 0;
    let r = 0;
    if (shouldWeDisplayInnerText === "true") {
      RSize = isIphoneX() ? 4 : (isTabletAndroid() ? 2.5 : 3.1);
      r = 66;
    }
    else {
      RSize = isIphoneX() ? 4 : (isTabletAndroid() ? 2.5 : 4.5);
      r = 56;
    }
    //const { style = {} } = this.props
    const {style = {}, backgroundColor, absolute = false} = this.props
    const { borderRadius = 0 } = style
    const chart = Pie({
      center: this.props.center || [0, 0],
      r: r,
      //R: this.props.height / 2.5,
      R: this.props.height / RSize,
      data: bubbleSortData(this.props.data),
      accessor: x => {
        return x[this.props.accessor]
      }
    })
    const total = this.props.data.reduce((sum, item) => {
      return sum + item[this.props.accessor]
    }, 0)
    const slices = chart.curves.map((c, i) => {
      return (
        <G key={Math.random()}>
          <Path
            d={c.sector.path.print()}
            // fill={this.props.chartConfig.color(0.2 * (i + 1))}
            fill={colorSelector(c.item.name)}
          />
          {displayInnerText(shouldWeDisplayInnerText, this.props.middleText)}
          <Rect
            width="17px"
            height="17px"
            fill={colorSelector(c.item.name)}
            // rx={8}
            // ry={8}
            // x={(this.props.width / 2.5) - 24}
            // y={-(this.props.height / 2.5) + ((this.props.height * 0.8) / this.props.data.length * i) + 12}
            rx={8}
            ry={8}
            x={(this.props.width / 2.5) - 24}
            y={-(this.props.height / 2.5) + ((this.props.height * 0.8) / this.props.data.length * i) + 12}
          />
          <Text
            fill={colorSelector(c.item.name)}
            fontSize={textSize}
            x={this.props.width / 2.5}
            y={-(this.props.height / 2.5) + ((this.props.height * 0.8) / this.props.data.length * i) + 12 * 2}
          >{Math.round(100 / total * c.item[this.props.accessor])}% {changeToWater(c.item.name)}
          </Text>
        </G >
      )
    })
    return (
      <View
        style={{
          width: this.props.width,
          height: this.props.height,
          padding: 0,
          ...style
        }}
      >
        <Svg
          width={this.props.width}
          height={this.props.height}
        >
        <G>
          {this.renderDefs({
            width: this.props.height,
            height: this.props.height,
            ...this.props.chartConfig
          })}
          </G>
          <Rect width="100%" height={this.props.height} rx={borderRadius} ry={borderRadius} fill="url(#backgroundGradient)" />
          {/* <Rect width="100%" height={this.props.height} rx={borderRadius} ry={borderRadius} fill={backgroundColor} /> */}
          <G
          x={
              this.props.width / 2 / 2 +
              Number(this.props.paddingLeft ? this.props.paddingLeft : 0)
            }
            y={this.props.height / 2}
          >
            {slices}
          </G>
        </Svg>
      </View >
    )
  }
}

export default PieChart

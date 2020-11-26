import "babel-polyfill";

import React from "react";
import { Dimensions, ScrollView, StatusBar, Text } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import ScrollableTabView from "react-native-scrollable-tab-view";
import ProgressChart from "./src/ProgressChart";
import { LinearGradient, Stop } from "react-native-svg";
import {
  contributionData,
  data,
  pieChartData,
  progressChartData,
  stackedBarGraphData
} from "./data";
import {
  BarChart,
  ContributionGraph,
  LineChart,
  PieChart,
  // ProgressChart,
  StackedBarChart
} from "./dist/";

// in Expo - swipe left to see the following styling, or create your own
const chartConfigs = [
  {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
  }
];

export default class App extends React.Component {
  renderTabBar() {
    return <StatusBar hidden />;
  }

  render() {
    const { width } = Dimensions.get("window");
    const height = 256;
    const linear = (
      <LinearGradient
        id="customLinear"
        key={"customLinear"}
        x1={0}
        y1={0}
        x2={0}
        y2={1}
      >
        <Stop offset="0" stopColor={"#08D2B4"} />
        <Stop offset="1" stopColor={"#4F58DF"} />
      </LinearGradient>
    );
    const linear2 = (
      <LinearGradient
        id="customLinear2"
        key={"customLinear2"}
        x1={0}
        y1={0}
        x2={0}
        y2={1}
      >
        <Stop offset="0" stopColor={"#4F58DF"} />
        <Stop offset="1" stopColor={"#08D2B4"} />
      </LinearGradient>
    );
    const progressChartDataTmp = {
      data: [0.5, 0.3, 0.5],
      colors: ["url(#customLinear)", "blue", "url(#customLinear2)"],
      gradientColors: [linear, linear2]
    };
    return (
      <ScrollableTabView renderTabBar={this.renderTabBar}>
        {chartConfigs.map(chartConfig => {
          const labelStyle = {
            color: chartConfig.color(),
            marginVertical: 10,
            textAlign: "center",
            fontSize: 16
          };
          const graphStyle = {
            marginVertical: 8,
            ...chartConfig.style
          };
          return (
            <ScrollView
              key={Math.random()}
              style={{
                backgroundColor: chartConfig.backgroundColor
              }}
            >
              <Text style={labelStyle}>Bezier Line Chart</Text>
              <LineChart
                bezier
                data={data}
                width={width}
                height={height}
                yAxisLabel="$"
                yAxisSuffix="k"
                chartConfig={chartConfig}
                style={graphStyle}
                verticalLabelRotation={20}
                onDataPointClick={({ value, getColor }) =>
                  showMessage({
                    message: `${value}`,
                    description: "You selected this value",
                    backgroundColor: getColor(0.9)
                  })
                }
                formatXLabel={label => label.toUpperCase()}
              />
              <FlashMessage duration={1000} />
              <Text style={labelStyle}>Progress Chart</Text>
              <ProgressChart
                data={progressChartDataTmp}
                width={width}
                height={height}
                chartConfig={chartConfig}
                style={graphStyle}
                hideLegend={false}
                withCustomBarColorFromData={true}
              />
              <Text style={labelStyle}>Bar Graph</Text>
              {/* <BarChart
                width={width}
                height={height}
                data={data}
                yAxisLabel="$"
                chartConfig={chartConfig}
                style={graphStyle}
              /> */}
              <Text style={labelStyle}>Stacked Bar Graph</Text>
              <StackedBarChart
                style={graphStyle}
                data={stackedBarGraphData}
                width={width}
                height={220}
                chartConfig={chartConfig}
              />
              <Text style={labelStyle}>Stacked Bar Graph Percentile</Text>
              <StackedBarChart
                style={graphStyle}
                data={stackedBarGraphData}
                width={width}
                height={220}
                chartConfig={chartConfig}
                percentile
              />
              <Text style={labelStyle}>Pie Chart</Text>
              <PieChart
                data={pieChartData}
                height={height}
                width={width}
                chartConfig={chartConfig}
                accessor="population"
                style={graphStyle}
                backgroundColor="transparent"
                paddingLeft="15"
              />
              <Text style={labelStyle}>Line Chart</Text>
              <LineChart
                data={data}
                width={width}
                height={height}
                yAxisLabel="$"
                chartConfig={chartConfig}
                style={graphStyle}
              />
              <Text style={labelStyle}>Contribution Graph</Text>
              <ContributionGraph
                values={contributionData}
                width={width}
                height={height}
                endDate={new Date("2016-05-01")}
                numDays={105}
                chartConfig={chartConfig}
                style={graphStyle}
              />
              <Text style={labelStyle}>Line Chart</Text>
              <LineChart
                data={data}
                width={width}
                height={height}
                yAxisLabel="$"
                segments={5}
                chartConfig={chartConfig}
                style={graphStyle}
                hidePointsAtIndex={[0, data.datasets[0].data.length - 1]}
              />
              <Text style={labelStyle}>
                Line Chart with shadow background as line color
              </Text>
              <LineChart
                bezier
                data={data}
                width={width}
                height={height}
                yAxisLabel="$"
                segments={5}
                chartConfig={{
                  ...chartConfig,
                  useShadowColorFromDataset: true
                }}
                style={graphStyle}
                hidePointsAtIndex={[0, data.datasets[0].data.length - 1]}
              />

              <Text style={labelStyle}>Scrollable Line Chart</Text>
              <LineChart
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June"
                  ],
                  datasets: [
                    {
                      data: [
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100
                      ]
                    }
                  ]
                }}
                width={Dimensions.get("window").width} // from react-native
                height={220}
                withInnerLines={false}
                withDots={false}
                withShadow={false}
                withScrollableDot={true}
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundGradientFrom: "#1F1F1F",
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => "#FF5500",
                  labelColor: (opacity = 1) => "#A0A0A0",
                  linejoinType: "round",

                  scrollableDotFill: "#fff",
                  scrollableDotRadius: 6,
                  scrollableDotStrokeColor: "#FF5500",
                  scrollableDotStrokeWidth: 3,

                  scrollableInfoViewStyle: {
                    justifyContent: "center",
                    alignContent: "center",
                    backgroundColor: "#121212",
                    borderRadius: 2
                  },
                  scrollableInfoTextStyle: {
                    color: "#C4C4C4",
                    marginHorizontal: 4,
                    flex: 1,
                    textAlign: "center"
                  },
                  scrollableInfoSize: { width: 65, height: 30 },
                  scrollableInfoOffset: 15
                }}
                style={{
                  marginVertical: 8
                }}
              />
            </ScrollView>
          );
        })}
      </ScrollableTabView>
    );
  }
}

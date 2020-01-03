import "babel-polyfill";
import React from "react";
import { ScrollView, StatusBar, Dimensions, Text } from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import FlashMessage, { showMessage } from "react-native-flash-message";
import LineChart from "./src/line-chart";
import PieChart from "./src/pie-chart";
import ProgressChart from "./src/progress-chart";
import BarChart from "./src/bar-chart";
import StackedBarChart from "./src/stackedbar-chart";
import ContributionGraph from "./src/contribution-graph";
import {
  contributionData,
  pieChartData,
  progressChartData,
  stackedBarGraphData
} from "./data";

const data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [72, 66, 38, 12, 32, 89]
    }
  ]
};

const chartConfig = {
  count: "5",
  backgroundGradientFrom: "#FEF1E0",
  backgroundGradientTo: "#FEF1E0",
  color: (opacity = 1) => `#7e9cff`,
  propsForBackgroundLines: {
    strokeWidth: "0.5",
    stroke: "#1b4751"
  },
  propsForLabels: {
    stroke: "#1b4751",
    fontSize: "12"
  },
  style: {
    borderRadius: 16
  }
};
export default class App extends React.Component {
  renderTabBar() {
    return <StatusBar hidden />;
  }

  render() {
    const { width } = Dimensions.get("window");
    const height = 256;

    const graphStyle = {
      marginVertical: 8,
      ...chartConfig.style
    };

    return (
      <ScrollView>
        <LineChart
          data={data}
          width={width}
          height={height}
          chartConfig={chartConfig}
          style={graphStyle}
          fromZero={true}
          segments={6}
          yMaxValue={100}
          withInnerLines={true}
          withOuterLines={false}
          // formatYLabel={value => `£${value}`}
        />
      </ScrollView>
    );
  }
}

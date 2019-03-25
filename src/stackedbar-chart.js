 import React from 'react'
import { View } from 'react-native'
import {
  Svg,
  Rect,
  G,
  Text,
  Path
} from 'react-native-svg'
import AbstractChart from './abstract-chart'

const barWidth = 32

class StackedBarChart extends AbstractChart {

  renderBars = config => {
    const { data, width, height, paddingTop, paddingRight, border, colors } = config
    return data.map((x, i) => {
    	//for(g = 0; g<x.length; g++){ sum += x[g];}
      const barHeight = height / 4 * 3 * ((x[0] - Math.min(...x)) / this.calcScaler(x))
      const barWidth = 32
      var ret = [];
      //var col = ['rgba(255, 255, 255, 1)', 'green', 'yellow']
      var h = 0;
      var st = paddingTop;
     for(z = 0; z<x.length; z++){
     	
     	h = (height-55) * (x[z]/border);
     	y = (((height / 4 * 3) - h)) + st;
     	xC = (paddingRight + (i * (width - paddingRight) / data.length) + (barWidth / 2))*0.7
     	ret.push(
     		<Rect
     		          key={Math.random()}
          	x={xC}
          	y={y}
          	width={barWidth}
          	height={h}
          	fill={colors[z]}
        	/>
        );
        ret.push(
        	<Text
          key={Math.random()}
          x={xC+7+barWidth/2}
          textAnchor="end"
          y={y+18}
          fontSize={12}
          fill='#fff'
        >{x[z]}
        </Text>
        );

        st -= h;
     }
     return ret;


      })
  }

  renderLegend = config => {
  	const {legend, colors, width, height} = config;
  	return legend.map((x, i) =>{
  		return (
	        <G key={Math.random()}>
	          
	          <Rect
	            width="16px"
	            height="16px"
	            fill={colors[i]}
	            rx={8}
	            ry={8}
	            x={width*0.71}
	            y={height*0.25+(i)*50}
	          />
	          <Text
	            fill={'#fff'}
	            fontSize={16}
	            x={width*0.78}
	            y={height*0.31+(i)*50}>
	          {x}

	          </Text>
	        </G>
      	)
  	})
  	
  }

  render() {
    const paddingTop = 15
    const paddingRight = 50
    const { width, height, style = {}, borders, data } = this.props
    const { borderRadius = 0 } = style
    const config = {
      width,
      height
    }
    var border = 0;
    for(let i = 0; i<data.data.length; i++){
    	actual = data.data[i].reduce((pv, cv) => pv + cv, 0);
    	if(actual > border){
    		border = actual;
    	}
    }

    return (
      <View style={style}>
        <Svg
          height={height}
          width={width}
        >
          {this.renderDefs({
            ...config,
            ...this.props.chartConfig
          })}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"/>
            <G>
          {this.renderHorizontalLines({
            ...config,
            count: 4,
            paddingTop
          })}</G>
          <G>
          
          </G>
            <G>
          {this.renderHorizontalLabels({
            ...config,
            count: 4,
            data: [0, border],
            paddingTop,
            paddingRight
          })}
          </G>
          <G>
          {this.renderVerticalLabels({
            ...config,
            labels: data.labels,
            paddingRight: paddingRight+28,
            stackedBar: true,
            paddingTop,
            horizontalOffset: barWidth
          })}
          </G>
          <G>
          {this.renderBars({
            ...config,
            data: data.data,
            border: border,
            colors: this.props.chartConfig.barColors,
            paddingTop,
            paddingRight: (paddingRight+20)
          })}
          </G>
         {this.renderLegend({
         	...config,
          	legend: data.legend,
         	colors: this.props.chartConfig.barColors,
         })}
        </Svg>
      </View>
    )
  }
}
export default StackedBarChart

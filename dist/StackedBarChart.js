var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
import React from "react";
import { View } from "react-native";
import { G, Rect, Svg, Text } from "react-native-svg";
import AbstractChart, {
  DEFAULT_X_LABELS_HEIGHT_PERCENTAGE
} from "./AbstractChart";
var StackedBarChart = /** @class */ (function(_super) {
  __extends(StackedBarChart, _super);
  function StackedBarChart() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.getBarPercentage = function() {
      var _a = _this.props.chartConfig.barPercentage,
        barPercentage = _a === void 0 ? 1 : _a;
      return barPercentage;
    };
    _this.getBarRadius = function(ret, x) {
      return _this.props.chartConfig.barRadius && ret.length === x.length - 1
        ? _this.props.chartConfig.barRadius
        : 0;
    };
    _this.renderBars = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        border = _a.border,
        colors = _a.colors,
        _b = _a.stackedBar,
        stackedBar = _b === void 0 ? false : _b,
        verticalLabelsHeightPercentage = _a.verticalLabelsHeightPercentage;
      return data.map(function(x, i) {
        var barWidth = 32 * _this.getBarPercentage();
        var ret = [];
        var h = 0;
        var st = paddingTop;
        var fac = 1;
        if (stackedBar) {
          fac = 0.7;
        }
        var sum = _this.props.percentile
          ? x.reduce(function(a, b) {
              return a + b;
            }, 0)
          : border;
        var barsAreaHeight = height * verticalLabelsHeightPercentage;
        for (var z = 0; z < x.length; z++) {
          h = barsAreaHeight * (x[z] / sum);
          var y = barsAreaHeight - h + st;
          var xC =
            (paddingRight +
              (i * (width - paddingRight)) / data.length +
              barWidth / 2) *
            fac;
          ret.push(
            <Rect
              key={Math.random()}
              x={xC}
              y={y}
              rx={_this.getBarRadius(ret, x)}
              ry={_this.getBarRadius(ret, x)}
              width={barWidth}
              height={h}
              fill={colors[z]}
            />
          );
          if (!_this.props.hideLegend) {
            ret.push(
              <Text
                key={Math.random()}
                x={xC + 7 + barWidth / 2}
                textAnchor="end"
                y={h > 15 ? y + 15 : y + 7}
                {..._this.getPropsForLabels()}
              >
                {x[z]}
              </Text>
            );
          }
          st -= h;
        }
        return ret;
      });
    };
    _this.renderLegend = function(_a) {
      var legend = _a.legend,
        colors = _a.colors,
        width = _a.width,
        height = _a.height;
      return legend.map(function(x, i) {
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
              x={width * 0.78}
              y={height * 0.76 - i * 50}
              {..._this.getPropsForLabels()}
            >
              {x}
            </Text>
          </G>
        );
      });
    };
    return _this;
  }
  StackedBarChart.prototype.render = function() {
    var paddingTop = 15;
    var paddingRight = 50;
    var barWidth = 32 * this.getBarPercentage();
    var _a = this.props,
      width = _a.width,
      height = _a.height,
      _b = _a.style,
      style = _b === void 0 ? {} : _b,
      data = _a.data,
      _c = _a.withHorizontalLabels,
      withHorizontalLabels = _c === void 0 ? true : _c,
      _d = _a.withVerticalLabels,
      withVerticalLabels = _d === void 0 ? true : _d,
      _e = _a.segments,
      segments = _e === void 0 ? 4 : _e,
      decimalPlaces = _a.decimalPlaces,
      _f = _a.percentile,
      percentile = _f === void 0 ? false : _f,
      _g = _a.verticalLabelsHeightPercentage,
      verticalLabelsHeightPercentage =
        _g === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _g,
      _h = _a.formatYLabel,
      formatYLabel =
        _h === void 0
          ? function(yLabel) {
              return yLabel;
            }
          : _h,
      _j = _a.hideLegend,
      hideLegend = _j === void 0 ? false : _j;
    var _k = style.borderRadius,
      borderRadius = _k === void 0 ? 0 : _k;
    var config = {
      width: width,
      height: height
    };
    var border = 0;
    var max = 0;
    for (var i = 0; i < data.data.length; i++) {
      var actual = data.data[i].reduce(function(pv, cv) {
        return pv + cv;
      }, 0);
      if (actual > max) {
        max = actual;
      }
    }
    if (percentile) {
      border = 100;
    } else {
      border = max;
    }
    var showLegend = !hideLegend && data.legend && data.legend.length != 0;
    var stackedBar = showLegend;
    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs(
            __assign(__assign({}, config), this.props.chartConfig)
          )}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {this.renderHorizontalLines(
              __assign(__assign({}, config), {
                count: segments,
                paddingTop: paddingTop,
                verticalLabelsHeightPercentage: verticalLabelsHeightPercentage
              })
            )}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels(
                  __assign(__assign({}, config), {
                    count: segments,
                    data: [0, border],
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    decimalPlaces: decimalPlaces,
                    verticalLabelsHeightPercentage: verticalLabelsHeightPercentage,
                    formatYLabel: formatYLabel
                  })
                )
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels(
                  __assign(__assign({}, config), {
                    labels: data.labels,
                    paddingRight: paddingRight + 28,
                    stackedBar: stackedBar,
                    paddingTop: paddingTop,
                    horizontalOffset: barWidth,
                    verticalLabelsHeightPercentage: verticalLabelsHeightPercentage
                  })
                )
              : null}
          </G>
          <G>
            {this.renderBars(
              __assign(__assign({}, config), {
                data: data.data,
                border: border,
                colors: this.props.data.barColors,
                paddingTop: paddingTop,
                paddingRight: paddingRight + 20,
                stackedBar: stackedBar,
                verticalLabelsHeightPercentage: verticalLabelsHeightPercentage
              })
            )}
          </G>
          {showLegend &&
            this.renderLegend(
              __assign(__assign({}, config), {
                legend: data.legend,
                colors: this.props.data.barColors
              })
            )}
        </Svg>
      </View>
    );
  };
  return StackedBarChart;
})(AbstractChart);
export default StackedBarChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhY2tlZEJhckNoYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1N0YWNrZWRCYXJDaGFydC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBRSxJQUFJLEVBQWEsTUFBTSxjQUFjLENBQUM7QUFDL0MsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRXRELE9BQU8sYUFBYSxFQUFFLEVBR3BCLGtDQUFrQyxFQUNuQyxNQUFNLGlCQUFpQixDQUFDO0FBdUR6QjtJQUE4QixtQ0FHN0I7SUFIRDtRQUFBLHFFQWtQQztRQTlPQyxzQkFBZ0IsR0FBRztZQUNULElBQUEsS0FBc0IsS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLGNBQTNCLEVBQWpCLGFBQWEsbUJBQUcsQ0FBQyxLQUFBLENBQTRCO1lBQ3JELE9BQU8sYUFBYSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQztRQUVGLGtCQUFZLEdBQUcsVUFBQyxHQUFtQixFQUFFLENBQWlCO1lBQ3BELE9BQU8sS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUNwRSxDQUFDLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUztnQkFDbEMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNSLENBQUMsQ0FBQztRQUVGLGdCQUFVLEdBQUcsVUFBQyxFQXNCYjtnQkFyQkMsSUFBSSxVQUFBLEVBQ0osS0FBSyxXQUFBLEVBQ0wsTUFBTSxZQUFBLEVBQ04sVUFBVSxnQkFBQSxFQUNWLFlBQVksa0JBQUEsRUFDWixNQUFNLFlBQUEsRUFDTixNQUFNLFlBQUEsRUFDTixrQkFBa0IsRUFBbEIs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a1AxQztBQUVELGVBQWUsZUFBZSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgVmlldywgVmlld1N0eWxlIH0gZnJvbSBcInJlYWN0LW5hdGl2ZVwiO1xuaW1wb3J0IHsgRywgUmVjdCwgU3ZnLCBUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS1zdmdcIjtcblxuaW1wb3J0IEFic3RyYWN0Q2hhcnQsIHtcbiAgQWJzdHJhY3RDaGFydENvbmZpZyxcbiAgQWJzdHJhY3RDaGFydFByb3BzLFxuICBERUZBVUxUX1hfTEFCRUxTX0hFSUdIVF9QRVJDRU5UQUdFXG59IGZyb20gXCIuL0Fic3RyYWN0Q2hhcnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGFja2VkQmFyQ2hhcnREYXRhIHtcbiAgbGFiZWxzOiBzdHJpbmdbXTtcbiAgbGVnZW5kOiBzdHJpbmdbXTtcbiAgZGF0YTogbnVtYmVyW11bXTtcbiAgYmFyQ29sb3JzOiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdGFja2VkQmFyQ2hhcnRQcm9wcyBleHRlbmRzIEFic3RyYWN0Q2hhcnRQcm9wcyB7XG4gIC8qKlxuICAgKiBFLmcuXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogY29uc3QgZGF0YSA9IHtcbiAgICogICBsYWJlbHM6IFtcIlRlc3QxXCIsIFwiVGVzdDJcIl0sXG4gICAqICAgbGVnZW5kOiBbXCJMMVwiLCBcIkwyXCIsIFwiTDNcIl0sXG4gICAqICAgZGF0YTogW1s2MCwgNjAsIDYwXSwgWzMwLCAzMCwgNjBdXSxcbiAgICogICBiYXJDb2xvcnM6IFtcIiNkZmU0ZWFcIiwgXCIjY2VkNmUwXCIsIFwiI2E0YjBiZVwiXVxuICAgKiB9O1xuICAgKiBgYGBcbiAgICovXG4gIGRhdGE6IFN0YWNrZWRCYXJDaGFydERhdGE7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBjaGFydENvbmZpZzogQWJzdHJhY3RDaGFydENvbmZpZztcbiAgaGlkZUxlZ2VuZDogYm9vbGVhbjtcbiAgc3R5bGU/OiBQYXJ0aWFsPFZpZXdTdHlsZT47XG4gIGJhclBlcmNlbnRhZ2U/OiBudW1iZXI7XG4gIGRlY2ltYWxQbGFjZXM/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBTaG93IHZlcnRpY2FsIGxhYmVscyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoVmVydGljYWxMYWJlbHM/OiBib29sZWFuO1xuICAvKipcbiAgICogU2hvdyBob3Jpem9udGFsIGxhYmVscyAtIGRlZmF1bHQ6IFRydWUuXG4gICAqL1xuICB3aXRoSG9yaXpvbnRhbExhYmVscz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGhvcml6b250YWwgbGluZXNcbiAgICovXG4gIHNlZ21lbnRzPzogbnVtYmVyO1xuXG4gIHBlcmNlbnRpbGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBQZXJjZW50YWdlIG9mIHRoZSBjaGFydCBoZWlnaHQsIGRlZGljYXRlZCB0byB2ZXJ0aWNhbCBsYWJlbHNcbiAgICogKHNwYWNlIGJlbG93IGNoYXJ0KVxuICAgKi9cbiAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlPzogbnVtYmVyO1xuXG4gIGZvcm1hdFlMYWJlbD86ICh5TGFiZWw6IHN0cmluZykgPT4gc3RyaW5nO1xufVxuXG50eXBlIFN0YWNrZWRCYXJDaGFydFN0YXRlID0ge307XG5cbmNsYXNzIFN0YWNrZWRCYXJDaGFydCBleHRlbmRzIEFic3RyYWN0Q2hhcnQ8XG4gIFN0YWNrZWRCYXJDaGFydFByb3BzLFxuICBTdGFja2VkQmFyQ2hhcnRTdGF0ZVxuPiB7XG4gIGdldEJhclBlcmNlbnRhZ2UgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBiYXJQZXJjZW50YWdlID0gMSB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcbiAgICByZXR1cm4gYmFyUGVyY2VudGFnZTtcbiAgfTtcblxuICBnZXRCYXJSYWRpdXMgPSAocmV0OiBzdHJpbmcgfCBhbnlbXSwgeDogc3RyaW5nIHwgYW55W10pID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGFydENvbmZpZy5iYXJSYWRpdXMgJiYgcmV0Lmxlbmd0aCA9PT0geC5sZW5ndGggLSAxXG4gICAgICA/IHRoaXMucHJvcHMuY2hhcnRDb25maWcuYmFyUmFkaXVzXG4gICAgICA6IDA7XG4gIH07XG5cbiAgcmVuZGVyQmFycyA9ICh7XG4gICAgZGF0YSxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgcGFkZGluZ1RvcCxcbiAgICBwYWRkaW5nUmlnaHQsXG4gICAgYm9yZGVyLFxuICAgIGNvbG9ycyxcbiAgICBzdGFja2VkQmFyID0gZmFsc2UsXG4gICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlXG4gIH06IFBpY2s8XG4gICAgT21pdDxBYnN0cmFjdENoYXJ0Q29uZmlnLCBcImRhdGFcIj4sXG4gICAgfCBcIndpZHRoXCJcbiAgICB8IFwiaGVpZ2h0XCJcbiAgICB8IFwicGFkZGluZ1JpZ2h0XCJcbiAgICB8IFwicGFkZGluZ1RvcFwiXG4gICAgfCBcInN0YWNrZWRCYXJcIlxuICAgIHwgXCJ2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2VcIlxuICA+ICYge1xuICAgIGJvcmRlcjogbnVtYmVyO1xuICAgIGNvbG9yczogc3RyaW5nW107XG4gICAgZGF0YTogbnVtYmVyW11bXTtcbiAgfSkgPT5cbiAgICBkYXRhLm1hcCgoeCwgaSkgPT4ge1xuICAgICAgY29uc3QgYmFyV2lkdGggPSAzMiAqIHRoaXMuZ2V0QmFyUGVyY2VudGFnZSgpO1xuICAgICAgY29uc3QgcmV0ID0gW107XG4gICAgICBsZXQgaCA9IDA7XG4gICAgICBsZXQgc3QgPSBwYWRkaW5nVG9wO1xuXG4gICAgICBsZXQgZmFjID0gMTtcbiAgICAgIGlmIChzdGFja2VkQmFyKSB7XG4gICAgICAgIGZhYyA9IDAuNztcbiAgICAgIH1cbiAgICAgIGNvbnN0IHN1bSA9IHRoaXMucHJvcHMucGVyY2VudGlsZSA/IHgucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCkgOiBib3JkZXI7XG4gICAgICBjb25zdCBiYXJzQXJlYUhlaWdodCA9IGhlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZTtcbiAgICAgIGZvciAobGV0IHogPSAwOyB6IDwgeC5sZW5ndGg7IHorKykge1xuICAgICAgICBoID0gYmFyc0FyZWFIZWlnaHQgKiAoeFt6XSAvIHN1bSk7XG4gICAgICAgIGNvbnN0IHkgPSBiYXJzQXJlYUhlaWdodCAtIGggKyBzdDtcbiAgICAgICAgY29uc3QgeEMgPVxuICAgICAgICAgIChwYWRkaW5nUmlnaHQgK1xuICAgICAgICAgICAgKGkgKiAod2lkdGggLSBwYWRkaW5nUmlnaHQpKSAvIGRhdGEubGVuZ3RoICtcbiAgICAgICAgICAgIGJhcldpZHRoIC8gMikgKlxuICAgICAgICAgIGZhYztcblxuICAgICAgICByZXQucHVzaChcbiAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxuICAgICAgICAgICAgeD17eEN9XG4gICAgICAgICAgICB5PXt5fVxuICAgICAgICAgICAgcng9e3RoaXMuZ2V0QmFyUmFkaXVzKHJldCwgeCl9XG4gICAgICAgICAgICByeT17dGhpcy5nZXRCYXJSYWRpdXMocmV0LCB4KX1cbiAgICAgICAgICAgIHdpZHRoPXtiYXJXaWR0aH1cbiAgICAgICAgICAgIGhlaWdodD17aH1cbiAgICAgICAgICAgIGZpbGw9e2NvbG9yc1t6XX1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuXG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5oaWRlTGVnZW5kKSB7XG4gICAgICAgICAgcmV0LnB1c2goXG4gICAgICAgICAgICA8VGV4dFxuICAgICAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XG4gICAgICAgICAgICAgIHg9e3hDICsgNyArIGJhcldpZHRoIC8gMn1cbiAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cImVuZFwiXG4gICAgICAgICAgICAgIHk9e2ggPiAxNSA/IHkgKyAxNSA6IHkgKyA3fVxuICAgICAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvckxhYmVscygpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7eFt6XX1cbiAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgc3QgLT0gaDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9KTtcblxuICByZW5kZXJMZWdlbmQgPSAoe1xuICAgIGxlZ2VuZCxcbiAgICBjb2xvcnMsXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0XG4gIH06IFBpY2s8QWJzdHJhY3RDaGFydENvbmZpZywgXCJ3aWR0aFwiIHwgXCJoZWlnaHRcIj4gJiB7XG4gICAgbGVnZW5kOiBzdHJpbmdbXTtcbiAgICBjb2xvcnM6IHN0cmluZ1tdO1xuICB9KSA9PlxuICAgIGxlZ2VuZC5tYXAoKHgsIGkpID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxHIGtleT17TWF0aC5yYW5kb20oKX0+XG4gICAgICAgICAgPFJlY3RcbiAgICAgICAgICAgIHdpZHRoPVwiMTZweFwiXG4gICAgICAgICAgICBoZWlnaHQ9XCIxNnB4XCJcbiAgICAgICAgICAgIGZpbGw9e2NvbG9yc1tpXX1cbiAgICAgICAgICAgIHJ4PXs4fVxuICAgICAgICAgICAgcnk9ezh9XG4gICAgICAgICAgICB4PXt3aWR0aCAqIDAuNzF9XG4gICAgICAgICAgICB5PXtoZWlnaHQgKiAwLjcgLSBpICogNTB9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VGV4dFxuICAgICAgICAgICAgeD17d2lkdGggKiAwLjc4fVxuICAgICAgICAgICAgeT17aGVpZ2h0ICogMC43NiAtIGkgKiA1MH1cbiAgICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yTGFiZWxzKCl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3h9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICA8L0c+XG4gICAgICApO1xuICAgIH0pO1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBwYWRkaW5nVG9wID0gMTU7XG4gICAgY29uc3QgcGFkZGluZ1JpZ2h0ID0gNTA7XG4gICAgY29uc3QgYmFyV2lkdGggPSAzMiAqIHRoaXMuZ2V0QmFyUGVyY2VudGFnZSgpO1xuXG4gICAgY29uc3Qge1xuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgZGF0YSxcbiAgICAgIHdpdGhIb3Jpem9udGFsTGFiZWxzID0gdHJ1ZSxcbiAgICAgIHdpdGhWZXJ0aWNhbExhYmVscyA9IHRydWUsXG4gICAgICBzZWdtZW50cyA9IDQsXG4gICAgICBkZWNpbWFsUGxhY2VzLFxuICAgICAgcGVyY2VudGlsZSA9IGZhbHNlLFxuICAgICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlID0gREVGQVVMVF9YX0xBQkVMU19IRUlHSFRfUEVSQ0VOVEFHRSxcbiAgICAgIGZvcm1hdFlMYWJlbCA9ICh5TGFiZWw6IHN0cmluZykgPT4ge1xuICAgICAgICByZXR1cm4geUxhYmVsO1xuICAgICAgfSxcbiAgICAgIGhpZGVMZWdlbmQgPSBmYWxzZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgeyBib3JkZXJSYWRpdXMgPSAwIH0gPSBzdHlsZTtcbiAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodFxuICAgIH07XG5cbiAgICBsZXQgYm9yZGVyID0gMDtcblxuICAgIGxldCBtYXggPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBhY3R1YWwgPSBkYXRhLmRhdGFbaV0ucmVkdWNlKChwdiwgY3YpID0+IHB2ICsgY3YsIDApO1xuICAgICAgaWYgKGFjdHVhbCA+IG1heCkge1xuICAgICAgICBtYXggPSBhY3R1YWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBlcmNlbnRpbGUpIHtcbiAgICAgIGJvcmRlciA9IDEwMDtcbiAgICB9IGVsc2Uge1xuICAgICAgYm9yZGVyID0gbWF4O1xuICAgIH1cblxuICAgIGNvbnN0IHNob3dMZWdlbmQgPSAhaGlkZUxlZ2VuZCAmJiBkYXRhLmxlZ2VuZCAmJiBkYXRhLmxlZ2VuZC5sZW5ndGggIT0gMDtcbiAgICBjb25zdCBzdGFja2VkQmFyID0gc2hvd0xlZ2VuZDtcblxuICAgIHJldHVybiAoXG4gICAgICA8VmlldyBzdHlsZT17c3R5bGV9PlxuICAgICAgICA8U3ZnIGhlaWdodD17aGVpZ2h0fSB3aWR0aD17d2lkdGh9PlxuICAgICAgICAgIHt0aGlzLnJlbmRlckRlZnMoe1xuICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5jaGFydENvbmZpZ1xuICAgICAgICAgIH0pfVxuICAgICAgICAgIDxSZWN0XG4gICAgICAgICAgICB3aWR0aD1cIjEwMCVcIlxuICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgICByeD17Ym9yZGVyUmFkaXVzfVxuICAgICAgICAgICAgcnk9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIGZpbGw9XCJ1cmwoI2JhY2tncm91bmRHcmFkaWVudClcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEc+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJIb3Jpem9udGFsTGluZXMoe1xuICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgIGNvdW50OiBzZWdtZW50cyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcCxcbiAgICAgICAgICAgICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L0c+XG4gICAgICAgICAgPEc+XG4gICAgICAgICAgICB7d2l0aEhvcml6b250YWxMYWJlbHNcbiAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlckhvcml6b250YWxMYWJlbHMoe1xuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgY291bnQ6IHNlZ21lbnRzLFxuICAgICAgICAgICAgICAgICAgZGF0YTogWzAsIGJvcmRlcl0sXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgZGVjaW1hbFBsYWNlcyxcbiAgICAgICAgICAgICAgICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSxcbiAgICAgICAgICAgICAgICAgIGZvcm1hdFlMYWJlbFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIDogbnVsbH1cbiAgICAgICAgICA8L0c+XG4gICAgICAgICAgPEc+XG4gICAgICAgICAgICB7d2l0aFZlcnRpY2FsTGFiZWxzXG4gICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJWZXJ0aWNhbExhYmVscyh7XG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgICBsYWJlbHM6IGRhdGEubGFiZWxzLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgKyAyOCxcbiAgICAgICAgICAgICAgICAgIHN0YWNrZWRCYXIsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wLFxuICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbE9mZnNldDogYmFyV2lkdGgsXG4gICAgICAgICAgICAgICAgICB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2VcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICA6IG51bGx9XG4gICAgICAgICAgPC9HPlxuICAgICAgICAgIDxHPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyQmFycyh7XG4gICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhLFxuICAgICAgICAgICAgICBib3JkZXIsXG4gICAgICAgICAgICAgIGNvbG9yczogdGhpcy5wcm9wcy5kYXRhLmJhckNvbG9ycyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcCxcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgKyAyMCxcbiAgICAgICAgICAgICAgc3RhY2tlZEJhcixcbiAgICAgICAgICAgICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L0c+XG4gICAgICAgICAge3Nob3dMZWdlbmQgJiZcbiAgICAgICAgICAgIHRoaXMucmVuZGVyTGVnZW5kKHtcbiAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICBsZWdlbmQ6IGRhdGEubGVnZW5kLFxuICAgICAgICAgICAgICBjb2xvcnM6IHRoaXMucHJvcHMuZGF0YS5iYXJDb2xvcnNcbiAgICAgICAgICAgIH0pfVxuICAgICAgICA8L1N2Zz5cbiAgICAgIDwvVmlldz5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0YWNrZWRCYXJDaGFydDtcbiJdfQ==

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
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
import React, { Component } from "react";
import { Defs, Line, LinearGradient, Stop, Text } from "react-native-svg";
export var DEFAULT_X_LABELS_HEIGHT_PERCENTAGE = 0.75;
var AbstractChart = /** @class */ (function(_super) {
  __extends(AbstractChart, _super);
  function AbstractChart() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.calcScaler = function(data) {
      if (_this.props.fromZero && _this.props.fromNumber) {
        return (
          Math.max.apply(Math, __spreadArrays(data, [_this.props.fromNumber])) -
            Math.min.apply(Math, __spreadArrays(data, [0])) || 1
        );
      } else if (_this.props.fromZero) {
        return (
          Math.max.apply(Math, __spreadArrays(data, [0])) -
            Math.min.apply(Math, __spreadArrays(data, [0])) || 1
        );
      } else if (_this.props.fromNumber) {
        return (
          Math.max.apply(Math, __spreadArrays(data, [_this.props.fromNumber])) -
            Math.min.apply(
              Math,
              __spreadArrays(data, [_this.props.fromNumber])
            ) || 1
        );
      } else {
        return Math.max.apply(Math, data) - Math.min.apply(Math, data) || 1;
      }
    };
    _this.calcBaseHeight = function(data, height) {
      var min = Math.min.apply(Math, data);
      var max = Math.max.apply(Math, data);
      if (min >= 0 && max >= 0) {
        return height;
      } else if (min < 0 && max <= 0) {
        return 0;
      } else if (min < 0 && max > 0) {
        return (height * max) / _this.calcScaler(data);
      }
    };
    _this.calcHeight = function(val, data, height) {
      var max = Math.max.apply(Math, data);
      var min = Math.min.apply(Math, data);
      if (min < 0 && max > 0) {
        return height * (val / _this.calcScaler(data));
      } else if (min >= 0 && max >= 0) {
        return _this.props.fromZero
          ? height * (val / _this.calcScaler(data))
          : height * ((val - min) / _this.calcScaler(data));
      } else if (min < 0 && max <= 0) {
        return _this.props.fromZero
          ? height * (val / _this.calcScaler(data))
          : height * ((val - max) / _this.calcScaler(data));
      }
    };
    _this.renderHorizontalLines = function(config) {
      var count = config.count,
        width = config.width,
        height = config.height,
        paddingTop = config.paddingTop,
        paddingRight = config.paddingRight,
        _a = config.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _a === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _a;
      var basePosition = height * verticalLabelsHeightPercentage;
      return __spreadArrays(new Array(count + 1)).map(function(_, i) {
        var y = (basePosition / count) * i + paddingTop;
        return (
          <Line
            key={Math.random()}
            x1={paddingRight}
            y1={y}
            x2={width}
            y2={y}
            {..._this.getPropsForBackgroundLines()}
          />
        );
      });
    };
    _this.renderHorizontalLine = function(config) {
      var width = config.width,
        height = config.height,
        paddingTop = config.paddingTop,
        paddingRight = config.paddingRight,
        _a = config.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _a === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _a;
      return (
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={height * verticalLabelsHeightPercentage + paddingTop}
          x2={width}
          y2={height * verticalLabelsHeightPercentage + paddingTop}
          {..._this.getPropsForBackgroundLines()}
        />
      );
    };
    _this.renderCustomHorizontalLines = function(config) {
      var width = config.width,
        paddingRight = config.paddingRight,
        customXAxisData = config.customXAxisData;
      var datasets =
        customXAxisData && customXAxisData.datasets
          ? customXAxisData.datasets
          : [];
      return datasets.map(function(d) {
        var lineStyle =
          d.lineStyle || __assign({}, _this.getPropsForBackgroundLines());
        return (
          <Line
            key={Math.random()}
            x1={paddingRight}
            y1={d.calcPts}
            x2={width}
            y2={d.calcPts}
            {...lineStyle}
          />
        );
      });
    };
    _this.renderHorizontalLabels = function(config) {
      var count = config.count,
        data = config.data,
        height = config.height,
        paddingTop = config.paddingTop,
        paddingRight = config.paddingRight,
        _a = config.horizontalLabelRotation,
        horizontalLabelRotation = _a === void 0 ? 0 : _a,
        _b = config.decimalPlaces,
        decimalPlaces = _b === void 0 ? 2 : _b,
        _c = config.formatYLabel,
        formatYLabel =
          _c === void 0
            ? function(yLabel) {
                return yLabel;
              }
            : _c,
        _d = config.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _d === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _d;
      var _e = _this.props,
        _f = _e.yAxisLabel,
        yAxisLabel = _f === void 0 ? "" : _f,
        _g = _e.yAxisSuffix,
        yAxisSuffix = _g === void 0 ? "" : _g,
        _h = _e.yLabelsOffset,
        yLabelsOffset = _h === void 0 ? 12 : _h;
      return new Array(count === 1 ? 1 : count + 1).fill(1).map(function(_, i) {
        var yLabel = String(i * count);
        if (count === 1) {
          yLabel =
            "" +
            yAxisLabel +
            formatYLabel(data[0].toFixed(decimalPlaces)) +
            yAxisSuffix;
        } else {
          var label = _this.props.fromZero
            ? (_this.calcScaler(data) / count) * i +
              Math.min.apply(Math, __spreadArrays(data, [0]))
            : (_this.calcScaler(data) / count) * i + Math.min.apply(Math, data);
          yLabel =
            "" +
            yAxisLabel +
            formatYLabel(label.toFixed(decimalPlaces)) +
            yAxisSuffix;
        }
        var basePosition = height * verticalLabelsHeightPercentage;
        var x = paddingRight - yLabelsOffset;
        var y =
          count === 1 && _this.props.fromZero
            ? paddingTop + 4
            : height * verticalLabelsHeightPercentage -
              (basePosition / count) * i +
              paddingTop;
        return (
          <Text
            rotation={horizontalLabelRotation}
            origin={x + ", " + y}
            key={Math.random()}
            x={x}
            textAnchor="end"
            y={y}
            {..._this.getPropsForLabels()}
            {..._this.getPropsForHorizontalLabels()}
          >
            {yLabel}
          </Text>
        );
      });
    };
    _this.renderVerticalLabels = function(_a) {
      var _b = _a.labels,
        labels = _b === void 0 ? [] : _b,
        width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        _c = _a.horizontalOffset,
        horizontalOffset = _c === void 0 ? 0 : _c,
        _d = _a.stackedBar,
        stackedBar = _d === void 0 ? false : _d,
        _e = _a.verticalLabelRotation,
        verticalLabelRotation = _e === void 0 ? 0 : _e,
        _f = _a.formatXLabel,
        formatXLabel =
          _f === void 0
            ? function(xLabel) {
                return xLabel;
              }
            : _f,
        _g = _a.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _g === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _g;
      var _h = _this.props,
        _j = _h.xAxisLabel,
        xAxisLabel = _j === void 0 ? "" : _j,
        _k = _h.xLabelsOffset,
        xLabelsOffset = _k === void 0 ? 0 : _k,
        _l = _h.hidePointsAtIndex,
        hidePointsAtIndex = _l === void 0 ? [] : _l;
      var fontSize = 12;
      var fac = 1;
      if (stackedBar) {
        fac = 0.71;
      }
      return labels.map(function(label, i) {
        if (hidePointsAtIndex.includes(i)) {
          return null;
        }
        var x =
          (((width - paddingRight) / labels.length) * i +
            paddingRight +
            horizontalOffset) *
          fac;
        var y =
          height * verticalLabelsHeightPercentage +
          paddingTop +
          fontSize * 2 +
          xLabelsOffset;
        return (
          <Text
            origin={x + ", " + y}
            rotation={verticalLabelRotation}
            key={Math.random()}
            x={x}
            y={y}
            textAnchor={verticalLabelRotation === 0 ? "middle" : "start"}
            {..._this.getPropsForLabels()}
            {..._this.getPropsForVerticalLabels()}
          >
            {"" + formatXLabel(label) + xAxisLabel}
          </Text>
        );
      });
    };
    _this.renderVerticalLines = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        _b = _a.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _b === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _b;
      var _c = _this.props.yAxisInterval,
        yAxisInterval = _c === void 0 ? 1 : _c;
      return __spreadArrays(
        new Array(Math.ceil(data.length / yAxisInterval))
      ).map(function(_, i) {
        return (
          <Line
            key={Math.random()}
            x1={Math.floor(
              ((width - paddingRight) / (data.length / yAxisInterval)) * i +
                paddingRight
            )}
            y1={0}
            x2={Math.floor(
              ((width - paddingRight) / (data.length / yAxisInterval)) * i +
                paddingRight
            )}
            y2={height * verticalLabelsHeightPercentage + paddingTop}
            {..._this.getPropsForBackgroundLines()}
          />
        );
      });
    };
    _this.renderVerticalLine = function(_a) {
      var height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        _b = _a.verticalLabelsHeightPercentage,
        verticalLabelsHeightPercentage =
          _b === void 0 ? DEFAULT_X_LABELS_HEIGHT_PERCENTAGE : _b;
      return (
        <Line
          key={Math.random()}
          x1={Math.floor(paddingRight)}
          y1={0}
          x2={Math.floor(paddingRight)}
          y2={height * verticalLabelsHeightPercentage + paddingTop}
          {..._this.getPropsForBackgroundLines()}
        />
      );
    };
    _this.renderDefs = function(config) {
      var width = config.width,
        height = config.height,
        backgroundGradientFrom = config.backgroundGradientFrom,
        backgroundGradientTo = config.backgroundGradientTo,
        useShadowColorFromDataset = config.useShadowColorFromDataset,
        data = config.data;
      var fromOpacity = config.hasOwnProperty("backgroundGradientFromOpacity")
        ? config.backgroundGradientFromOpacity
        : 1.0;
      var toOpacity = config.hasOwnProperty("backgroundGradientToOpacity")
        ? config.backgroundGradientToOpacity
        : 1.0;
      var fillShadowGradient = config.hasOwnProperty("fillShadowGradient")
        ? config.fillShadowGradient
        : _this.props.chartConfig.color(1.0);
      var fillShadowGradientOpacity = config.hasOwnProperty(
        "fillShadowGradientOpacity"
      )
        ? config.fillShadowGradientOpacity
        : 0.1;
      var fillShadowGradientFrom = config.hasOwnProperty(
        "fillShadowGradientFrom"
      )
        ? config.fillShadowGradientFrom
        : fillShadowGradient;
      var fillShadowGradientFromOpacity = config.hasOwnProperty(
        "fillShadowGradientFromOpacity"
      )
        ? config.fillShadowGradientFromOpacity
        : fillShadowGradientOpacity;
      var fillShadowGradientFromOffset = config.hasOwnProperty(
        "fillShadowGradientFromOffset"
      )
        ? config.fillShadowGradientFromOffset
        : 0;
      var fillShadowGradientTo = config.hasOwnProperty("fillShadowGradientTo")
        ? config.fillShadowGradientTo
        : _this.props.chartConfig.color(1.0);
      var fillShadowGradientToOpacity = config.hasOwnProperty(
        "fillShadowGradientToOpacity"
      )
        ? config.fillShadowGradientToOpacity
        : 0.1;
      var fillShadowGradientToOffset = config.hasOwnProperty(
        "fillShadowGradientToOffset"
      )
        ? config.fillShadowGradientToOffset
        : 1;
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
          {useShadowColorFromDataset ? (
            data.map(function(dataset, index) {
              return (
                <LinearGradient
                  id={"fillShadowGradientFrom_" + index}
                  key={"" + index}
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={height}
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop
                    offset={fillShadowGradientFromOffset}
                    stopColor={
                      dataset.color
                        ? dataset.color(1.0)
                        : fillShadowGradientFrom
                    }
                    stopOpacity={fillShadowGradientFromOpacity}
                  />
                  <Stop
                    offset={fillShadowGradientToOffset}
                    stopColor={
                      dataset.color
                        ? dataset.color(fillShadowGradientFromOpacity)
                        : fillShadowGradientFrom
                    }
                    stopOpacity={fillShadowGradientToOpacity || 0}
                  />
                </LinearGradient>
              );
            })
          ) : (
            <LinearGradient
              id="fillShadowGradientFrom"
              x1={0}
              y1={0}
              x2={0}
              y2={height}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset={fillShadowGradientFromOffset}
                stopColor={fillShadowGradientFrom}
                stopOpacity={fillShadowGradientFromOpacity}
              />
              <Stop
                offset={fillShadowGradientToOffset}
                stopColor={fillShadowGradientTo || fillShadowGradientFrom}
                stopOpacity={fillShadowGradientToOpacity || 0}
              />
            </LinearGradient>
          )}
        </Defs>
      );
    };
    return _this;
  }
  AbstractChart.prototype.getPropsForBackgroundLines = function() {
    var _a = this.props.chartConfig.propsForBackgroundLines,
      propsForBackgroundLines = _a === void 0 ? {} : _a;
    return __assign(
      {
        stroke: this.props.chartConfig.color(0.2),
        strokeDasharray: "5, 10",
        strokeWidth: 1
      },
      propsForBackgroundLines
    );
  };
  AbstractChart.prototype.getPropsForLabels = function() {
    var _a = this.props.chartConfig,
      _b = _a.propsForLabels,
      propsForLabels = _b === void 0 ? {} : _b,
      color = _a.color,
      _c = _a.labelColor,
      labelColor = _c === void 0 ? color : _c;
    return __assign({ fontSize: 12, fill: labelColor(0.8) }, propsForLabels);
  };
  AbstractChart.prototype.getPropsForVerticalLabels = function() {
    var _a = this.props.chartConfig,
      _b = _a.propsForVerticalLabels,
      propsForVerticalLabels = _b === void 0 ? {} : _b,
      color = _a.color,
      _c = _a.labelColor,
      labelColor = _c === void 0 ? color : _c;
    return __assign({ fill: labelColor(0.8) }, propsForVerticalLabels);
  };
  AbstractChart.prototype.getPropsForHorizontalLabels = function() {
    var _a = this.props.chartConfig,
      _b = _a.propsForHorizontalLabels,
      propsForHorizontalLabels = _b === void 0 ? {} : _b,
      color = _a.color,
      _c = _a.labelColor,
      labelColor = _c === void 0 ? color : _c;
    return __assign({ fill: labelColor(0.8) }, propsForHorizontalLabels);
  };
  return AbstractChart;
})(Component);
export default AbstractChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWJzdHJhY3RDaGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BYnN0cmFjdENoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDekMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQXFDMUUsTUFBTSxDQUFDLElBQU0sa0NBQWtDLEdBQUcsSUFBSSxDQUFDO0FBRXZEO0lBR1UsaUNBQW1FO0lBSDdFO1FBQUEscUVBNmdCQztRQXpnQkMsZ0JBQVUsR0FBRyxVQUFDLElBQWM7WUFDMUIsSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRTtnQkFDaEQsT0FBTyxDQUNMLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxpQkFBUSxJQUFJLEdBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLE1BQUksSUFBSSxDQUFDLEdBQUcsT0FBUixJQUFJLGlCQUFRLElBQUksR0FBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQ3JFLENBQUM7YUFDSDtpQkFBTSxJQUFJLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUM5QixPQUFPLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxpQkFBUSxJQUFJLEdBQUUsQ0FBQyxNQUFJLElBQUksQ0FBQyxHQUFHLE9BQVIsSUFBSSxpQkFBUSxJQUFJLEdBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3pEO2lCQUFNLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUU7Z0JBQ2hDLE9BQU8sQ0FDTCxJQUFJLENBQUMsR0FBRyxPQUFSLElBQUksaUJBQVEsSUFBSSxHQUFF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LEdBQWpCO1FBQ1EsSUFBQSxLQUlGLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUh4QixzQkFBbUIsRUFBbkIsY0FBYyxtQkFBRyxFQUFFLEtBQUEsRUFDbkIsS0FBSyxXQUFBLEVBQ0wsa0JBQWtCLEVBQWxCLFVBQVUsbUJBQUcsS0FBSyxLQUNNLENBQUM7UUFDM0Isa0JBQ0UsUUFBUSxFQUFFLEVBQUUsRUFDWixJQUFJLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUNsQixjQUFjLEVBQ2pCO0lBQ0osQ0FBQztJQUVELGlEQUF5QixHQUF6QjtRQUNRLElBQUEsS0FJRixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFIeEIsOEJBQTJCLEVBQTNCLHNCQUFzQixtQkFBRyxFQUFFLEtBQUEsRUFDM0IsS0FBSyxXQUFBLEVBQ0wsa0JBQWtCLEVBQWxCLFVBQVUsbUJBQUcsS0FBSyxLQUNNLENBQUM7UUFDM0Isa0JBQ0UsSUFBSSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFDbEIsc0JBQXNCLEVBQ3pCO0lBQ0osQ0FBQztJQUVELG1EQUEyQixHQUEzQjtRQUNRLElBQUEsS0FJRixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFIeEIsZ0NBQTZCLEVBQTdCLHdCQUF3QixtQkFBRyxFQUFFLEtBQUEsRUFDN0IsS0FBSyxXQUFBLEVBQ0wsa0JBQWtCLEVBQWxCLFVBQVUsbUJBQUcsS0FBSyxLQUNNLENBQUM7UUFDM0Isa0JBQ0UsSUFBSSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFDbEIsd0JBQXdCLEVBQzNCO0lBQ0osQ0FBQztJQThhSCxvQkFBQztBQUFELENBQUMsQUE3Z0JELENBR1UsU0FBUyxHQTBnQmxCO0FBRUQsZUFBZSxhQUFhLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IERlZnMsIExpbmUsIExpbmVhckdyYWRpZW50LCBTdG9wLCBUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS1zdmdcIjtcclxuXHJcbmltcG9ydCB7IENoYXJ0Q29uZmlnLCBEYXRhc2V0LCBQYXJ0aWFsQnkgfSBmcm9tIFwiLi9IZWxwZXJUeXBlc1wiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBYnN0cmFjdENoYXJ0UHJvcHMge1xyXG4gIGZyb21aZXJvPzogYm9vbGVhbjtcclxuICBmcm9tTnVtYmVyPzogbnVtYmVyO1xyXG4gIGNoYXJ0Q29uZmlnPzogQWJzdHJhY3RDaGFydENvbmZpZztcclxuICB5QXhpc0xhYmVsPzogc3RyaW5nO1xyXG4gIHlBeGlzU3VmZml4Pzogc3RyaW5nO1xyXG4gIHlMYWJlbHNPZmZzZXQ/OiBudW1iZXI7XHJcbiAgeUF4aXNJbnRlcnZhbD86IG51bWJlcjtcclxuICB4QXhpc0xhYmVsPzogc3RyaW5nO1xyXG4gIHhMYWJlbHNPZmZzZXQ/OiBudW1iZXI7XHJcbiAgaGlkZVBvaW50c0F0SW5kZXg/OiBudW1iZXJbXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBYnN0cmFjdENoYXJ0Q29uZmlnIGV4dGVuZHMgQ2hhcnRDb25maWcge1xyXG4gIGNvdW50PzogbnVtYmVyO1xyXG4gIGRhdGE/OiBEYXRhc2V0W107XHJcbiAgd2lkdGg/OiBudW1iZXI7XHJcbiAgaGVpZ2h0PzogbnVtYmVyO1xyXG4gIHBhZGRpbmdUb3A/OiBudW1iZXI7XHJcbiAgcGFkZGluZ1JpZ2h0PzogbnVtYmVyO1xyXG4gIGhvcml6b250YWxMYWJlbFJvdGF0aW9uPzogbnVtYmVyO1xyXG4gIGZvcm1hdFlMYWJlbD86ICh5TGFiZWw6IHN0cmluZykgPT4gc3RyaW5nO1xyXG4gIGxhYmVscz86IHN0cmluZ1tdO1xyXG4gIGhvcml6b250YWxPZmZzZXQ/OiBudW1iZXI7XHJcbiAgc3RhY2tlZEJhcj86IGJvb2xlYW47XHJcbiAgdmVydGljYWxMYWJlbFJvdGF0aW9uPzogbnVtYmVyO1xyXG4gIGZvcm1hdFhMYWJlbD86ICh4TGFiZWw6IHN0cmluZykgPT4gc3RyaW5nO1xyXG4gIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZT86IG51bWJlcjtcclxuICBmb3JtYXRUb3BCYXJWYWx1ZT86ICh0b3BCYXJWYWx1ZTogbnVtYmVyKSA9PiBzdHJpbmcgfCBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEFic3RyYWN0Q2hhcnRTdGF0ZSA9IHt9O1xyXG5cclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0UgPSAwLjc1O1xyXG5cclxuY2xhc3MgQWJzdHJhY3RDaGFydDxcclxuICBJUHJvcHMgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0UHJvcHMsXHJcbiAgSVN0YXRlIGV4dGVuZHMgQWJzdHJhY3RDaGFydFN0YXRlXHJcbj4gZXh0ZW5kcyBDb21wb25lbnQ8QWJzdHJhY3RDaGFydFByb3BzICYgSVByb3BzLCBBYnN0cmFjdENoYXJ0U3RhdGUgJiBJU3RhdGU+IHtcclxuICBjYWxjU2NhbGVyID0gKGRhdGE6IG51bWJlcltdKSA9PiB7XHJcbiAgICBpZiAodGhpcy5wcm9wcy5mcm9tWmVybyAmJiB0aGlzLnByb3BzLmZyb21OdW1iZXIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICBNYXRoLm1heCguLi5kYXRhLCB0aGlzLnByb3BzLmZyb21OdW1iZXIpIC0gTWF0aC5taW4oLi4uZGF0YSwgMCkgfHwgMVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmZyb21aZXJvKSB7XHJcbiAgICAgIHJldHVybiBNYXRoLm1heCguLi5kYXRhLCAwKSAtIE1hdGgubWluKC4uLmRhdGEsIDApIHx8IDE7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuZnJvbU51bWJlcikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIE1hdGgubWF4KC4uLmRhdGEsIHRoaXMucHJvcHMuZnJvbU51bWJlcikgLVxyXG4gICAgICAgICAgTWF0aC5taW4oLi4uZGF0YSwgdGhpcy5wcm9wcy5mcm9tTnVtYmVyKSB8fCAxXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gTWF0aC5tYXgoLi4uZGF0YSkgLSBNYXRoLm1pbiguLi5kYXRhKSB8fCAxO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNhbGNCYXNlSGVpZ2h0ID0gKGRhdGE6IG51bWJlcltdLCBoZWlnaHQ6IG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgbWluID0gTWF0aC5taW4oLi4uZGF0YSk7XHJcbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5kYXRhKTtcclxuICAgIGlmIChtaW4gPj0gMCAmJiBtYXggPj0gMCkge1xyXG4gICAgICByZXR1cm4gaGVpZ2h0O1xyXG4gICAgfSBlbHNlIGlmIChtaW4gPCAwICYmIG1heCA8PSAwKSB7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfSBlbHNlIGlmIChtaW4gPCAwICYmIG1heCA+IDApIHtcclxuICAgICAgcmV0dXJuIChoZWlnaHQgKiBtYXgpIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNhbGNIZWlnaHQgPSAodmFsOiBudW1iZXIsIGRhdGE6IG51bWJlcltdLCBoZWlnaHQ6IG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGF0YSk7XHJcbiAgICBjb25zdCBtaW4gPSBNYXRoLm1pbiguLi5kYXRhKTtcclxuXHJcbiAgICBpZiAobWluIDwgMCAmJiBtYXggPiAwKSB7XHJcbiAgICAgIHJldHVybiBoZWlnaHQgKiAodmFsIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpKTtcclxuICAgIH0gZWxzZSBpZiAobWluID49IDAgJiYgbWF4ID49IDApIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZnJvbVplcm9cclxuICAgICAgICA/IGhlaWdodCAqICh2YWwgLyB0aGlzLmNhbGNTY2FsZXIoZGF0YSkpXHJcbiAgICAgICAgOiBoZWlnaHQgKiAoKHZhbCAtIG1pbikgLyB0aGlzLmNhbGNTY2FsZXIoZGF0YSkpO1xyXG4gICAgfSBlbHNlIGlmIChtaW4gPCAwICYmIG1heCA8PSAwKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmZyb21aZXJvXHJcbiAgICAgICAgPyBoZWlnaHQgKiAodmFsIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpKVxyXG4gICAgICAgIDogaGVpZ2h0ICogKCh2YWwgLSBtYXgpIC8gdGhpcy5jYWxjU2NhbGVyKGRhdGEpKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBnZXRQcm9wc0ZvckJhY2tncm91bmRMaW5lcygpIHtcclxuICAgIGNvbnN0IHsgcHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMgPSB7fSB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN0cm9rZTogdGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcigwLjIpLFxyXG4gICAgICBzdHJva2VEYXNoYXJyYXk6IFwiNSwgMTBcIixcclxuICAgICAgc3Ryb2tlV2lkdGg6IDEsXHJcbiAgICAgIC4uLnByb3BzRm9yQmFja2dyb3VuZExpbmVzXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvcHNGb3JMYWJlbHMoKSB7XHJcbiAgICBjb25zdCB7XHJcbiAgICAgIHByb3BzRm9yTGFiZWxzID0ge30sXHJcbiAgICAgIGNvbG9yLFxyXG4gICAgICBsYWJlbENvbG9yID0gY29sb3JcclxuICAgIH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZm9udFNpemU6IDEyLFxyXG4gICAgICBmaWxsOiBsYWJlbENvbG9yKDAuOCksXHJcbiAgICAgIC4uLnByb3BzRm9yTGFiZWxzXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvcHNGb3JWZXJ0aWNhbExhYmVscygpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgcHJvcHNGb3JWZXJ0aWNhbExhYmVscyA9IHt9LFxyXG4gICAgICBjb2xvcixcclxuICAgICAgbGFiZWxDb2xvciA9IGNvbG9yXHJcbiAgICB9ID0gdGhpcy5wcm9wcy5jaGFydENvbmZpZztcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZpbGw6IGxhYmVsQ29sb3IoMC44KSxcclxuICAgICAgLi4ucHJvcHNGb3JWZXJ0aWNhbExhYmVsc1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldFByb3BzRm9ySG9yaXpvbnRhbExhYmVscygpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgcHJvcHNGb3JIb3Jpem9udGFsTGFiZWxzID0ge30sXHJcbiAgICAgIGNvbG9yLFxyXG4gICAgICBsYWJlbENvbG9yID0gY29sb3JcclxuICAgIH0gPSB0aGlzLnByb3BzLmNoYXJ0Q29uZmlnO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZmlsbDogbGFiZWxDb2xvcigwLjgpLFxyXG4gICAgICAuLi5wcm9wc0Zvckhvcml6b250YWxMYWJlbHNcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICByZW5kZXJIb3Jpem9udGFsTGluZXMgPSBjb25maWcgPT4ge1xyXG4gICAgY29uc3Qge1xyXG4gICAgICBjb3VudCxcclxuICAgICAgd2lkdGgsXHJcbiAgICAgIGhlaWdodCxcclxuICAgICAgcGFkZGluZ1RvcCxcclxuICAgICAgcGFkZGluZ1JpZ2h0LFxyXG4gICAgICB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgPSBERUZBVUxUX1hfTEFCRUxTX0hFSUdIVF9QRVJDRU5UQUdFXHJcbiAgICB9ID0gY29uZmlnO1xyXG4gICAgY29uc3QgYmFzZVBvc2l0aW9uID0gaGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlO1xyXG5cclxuICAgIHJldHVybiBbLi4ubmV3IEFycmF5KGNvdW50ICsgMSldLm1hcCgoXywgaSkgPT4ge1xyXG4gICAgICBjb25zdCB5ID0gKGJhc2VQb3NpdGlvbiAvIGNvdW50KSAqIGkgKyBwYWRkaW5nVG9wO1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxMaW5lXHJcbiAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XHJcbiAgICAgICAgICB4MT17cGFkZGluZ1JpZ2h0fVxyXG4gICAgICAgICAgeTE9e3l9XHJcbiAgICAgICAgICB4Mj17d2lkdGh9XHJcbiAgICAgICAgICB5Mj17eX1cclxuICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yQmFja2dyb3VuZExpbmVzKCl9XHJcbiAgICAgICAgLz5cclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHJlbmRlckhvcml6b250YWxMaW5lID0gY29uZmlnID0+IHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgd2lkdGgsXHJcbiAgICAgIGhlaWdodCxcclxuICAgICAgcGFkZGluZ1RvcCxcclxuICAgICAgcGFkZGluZ1JpZ2h0LFxyXG4gICAgICB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgPSBERUZBVUxUX1hfTEFCRUxTX0hFSUdIVF9QRVJDRU5UQUdFXHJcbiAgICB9ID0gY29uZmlnO1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPExpbmVcclxuICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XHJcbiAgICAgICAgeDE9e3BhZGRpbmdSaWdodH1cclxuICAgICAgICB5MT17aGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlICsgcGFkZGluZ1RvcH1cclxuICAgICAgICB4Mj17d2lkdGh9XHJcbiAgICAgICAgeTI9e2hlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSArIHBhZGRpbmdUb3B9XHJcbiAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMoKX1cclxuICAgICAgLz5cclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgcmVuZGVyQ3VzdG9tSG9yaXpvbnRhbExpbmVzID0gY29uZmlnID0+IHtcclxuICAgIGNvbnN0IHsgd2lkdGgsIHBhZGRpbmdSaWdodCwgY3VzdG9tWEF4aXNEYXRhIH0gPSBjb25maWc7XHJcbiAgICBjb25zdCBkYXRhc2V0cyA9XHJcbiAgICAgIGN1c3RvbVhBeGlzRGF0YSAmJiBjdXN0b21YQXhpc0RhdGEuZGF0YXNldHNcclxuICAgICAgICA/IGN1c3RvbVhBeGlzRGF0YS5kYXRhc2V0c1xyXG4gICAgICAgIDogW107XHJcbiAgICByZXR1cm4gZGF0YXNldHMubWFwKGQgPT4ge1xyXG4gICAgICBjb25zdCBsaW5lU3R5bGUgPSBkLmxpbmVTdHlsZSB8fCB7IC4uLnRoaXMuZ2V0UHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMoKSB9O1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxMaW5lXHJcbiAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XHJcbiAgICAgICAgICB4MT17cGFkZGluZ1JpZ2h0fVxyXG4gICAgICAgICAgeTE9e2QuY2FsY1B0c31cclxuICAgICAgICAgIHgyPXt3aWR0aH1cclxuICAgICAgICAgIHkyPXtkLmNhbGNQdHN9XHJcbiAgICAgICAgICB7Li4ubGluZVN0eWxlfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICByZW5kZXJIb3Jpem9udGFsTGFiZWxzID0gKFxyXG4gICAgY29uZmlnOiBPbWl0PEFic3RyYWN0Q2hhcnRDb25maWcsIFwiZGF0YVwiPiAmIHsgZGF0YTogbnVtYmVyW10gfVxyXG4gICkgPT4ge1xyXG4gICAgY29uc3Qge1xyXG4gICAgICBjb3VudCxcclxuICAgICAgZGF0YSxcclxuICAgICAgaGVpZ2h0LFxyXG4gICAgICBwYWRkaW5nVG9wLFxyXG4gICAgICBwYWRkaW5nUmlnaHQsXHJcbiAgICAgIGhvcml6b250YWxMYWJlbFJvdGF0aW9uID0gMCxcclxuICAgICAgZGVjaW1hbFBsYWNlcyA9IDIsXHJcbiAgICAgIGZvcm1hdFlMYWJlbCA9ICh5TGFiZWw6IHN0cmluZykgPT4geUxhYmVsLFxyXG4gICAgICB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgPSBERUZBVUxUX1hfTEFCRUxTX0hFSUdIVF9QRVJDRU5UQUdFXHJcbiAgICB9ID0gY29uZmlnO1xyXG5cclxuICAgIGNvbnN0IHtcclxuICAgICAgeUF4aXNMYWJlbCA9IFwiXCIsXHJcbiAgICAgIHlBeGlzU3VmZml4ID0gXCJcIixcclxuICAgICAgeUxhYmVsc09mZnNldCA9IDEyXHJcbiAgICB9ID0gdGhpcy5wcm9wcztcclxuICAgIHJldHVybiBuZXcgQXJyYXkoY291bnQgPT09IDEgPyAxIDogY291bnQgKyAxKS5maWxsKDEpLm1hcCgoXywgaSkgPT4ge1xyXG4gICAgICBsZXQgeUxhYmVsID0gU3RyaW5nKGkgKiBjb3VudCk7XHJcblxyXG4gICAgICBpZiAoY291bnQgPT09IDEpIHtcclxuICAgICAgICB5TGFiZWwgPSBgJHt5QXhpc0xhYmVsfSR7Zm9ybWF0WUxhYmVsKFxyXG4gICAgICAgICAgZGF0YVswXS50b0ZpeGVkKGRlY2ltYWxQbGFjZXMpXHJcbiAgICAgICAgKX0ke3lBeGlzU3VmZml4fWA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbGFiZWwgPSB0aGlzLnByb3BzLmZyb21aZXJvXHJcbiAgICAgICAgICA/ICh0aGlzLmNhbGNTY2FsZXIoZGF0YSkgLyBjb3VudCkgKiBpICsgTWF0aC5taW4oLi4uZGF0YSwgMClcclxuICAgICAgICAgIDogKHRoaXMuY2FsY1NjYWxlcihkYXRhKSAvIGNvdW50KSAqIGkgKyBNYXRoLm1pbiguLi5kYXRhKTtcclxuICAgICAgICB5TGFiZWwgPSBgJHt5QXhpc0xhYmVsfSR7Zm9ybWF0WUxhYmVsKFxyXG4gICAgICAgICAgbGFiZWwudG9GaXhlZChkZWNpbWFsUGxhY2VzKVxyXG4gICAgICAgICl9JHt5QXhpc1N1ZmZpeH1gO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBiYXNlUG9zaXRpb24gPSBoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2U7XHJcbiAgICAgIGNvbnN0IHggPSBwYWRkaW5nUmlnaHQgLSB5TGFiZWxzT2Zmc2V0O1xyXG4gICAgICBjb25zdCB5ID1cclxuICAgICAgICBjb3VudCA9PT0gMSAmJiB0aGlzLnByb3BzLmZyb21aZXJvXHJcbiAgICAgICAgICA/IHBhZGRpbmdUb3AgKyA0XHJcbiAgICAgICAgICA6IGhlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSAtXHJcbiAgICAgICAgICAgIChiYXNlUG9zaXRpb24gLyBjb3VudCkgKiBpICtcclxuICAgICAgICAgICAgcGFkZGluZ1RvcDtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGV4dFxyXG4gICAgICAgICAgcm90YXRpb249e2hvcml6b250YWxMYWJlbFJvdGF0aW9ufVxyXG4gICAgICAgICAgb3JpZ2luPXtgJHt4fSwgJHt5fWB9XHJcbiAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XHJcbiAgICAgICAgICB4PXt4fVxyXG4gICAgICAgICAgdGV4dEFuY2hvcj1cImVuZFwiXHJcbiAgICAgICAgICB5PXt5fVxyXG4gICAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JMYWJlbHMoKX1cclxuICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9ySG9yaXpvbnRhbExhYmVscygpfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHt5TGFiZWx9XHJcbiAgICAgICAgPC9UZXh0PlxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmVuZGVyVmVydGljYWxMYWJlbHMgPSAoe1xyXG4gICAgbGFiZWxzID0gW10sXHJcbiAgICB3aWR0aCxcclxuICAgIGhlaWdodCxcclxuICAgIHBhZGRpbmdSaWdodCxcclxuICAgIHBhZGRpbmdUb3AsXHJcbiAgICBob3Jpem9udGFsT2Zmc2V0ID0gMCxcclxuICAgIHN0YWNrZWRCYXIgPSBmYWxzZSxcclxuICAgIHZlcnRpY2FsTGFiZWxSb3RhdGlvbiA9IDAsXHJcbiAgICBmb3JtYXRYTGFiZWwgPSB4TGFiZWwgPT4geExhYmVsLFxyXG4gICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlID0gREVGQVVMVF9YX0xBQkVMU19IRUlHSFRfUEVSQ0VOVEFHRVxyXG4gIH06IFBpY2s8XHJcbiAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxyXG4gICAgfCBcImxhYmVsc1wiXHJcbiAgICB8IFwid2lkdGhcIlxyXG4gICAgfCBcImhlaWdodFwiXHJcbiAgICB8IFwicGFkZGluZ1JpZ2h0XCJcclxuICAgIHwgXCJwYWRkaW5nVG9wXCJcclxuICAgIHwgXCJob3Jpem9udGFsT2Zmc2V0XCJcclxuICAgIHwgXCJzdGFja2VkQmFyXCJcclxuICAgIHwgXCJ2ZXJ0aWNhbExhYmVsUm90YXRpb25cIlxyXG4gICAgfCBcImZvcm1hdFhMYWJlbFwiXHJcbiAgICB8IFwidmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlXCJcclxuICA+KSA9PiB7XHJcbiAgICBjb25zdCB7XHJcbiAgICAgIHhBeGlzTGFiZWwgPSBcIlwiLFxyXG4gICAgICB4TGFiZWxzT2Zmc2V0ID0gMCxcclxuICAgICAgaGlkZVBvaW50c0F0SW5kZXggPSBbXVxyXG4gICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgY29uc3QgZm9udFNpemUgPSAxMjtcclxuXHJcbiAgICBsZXQgZmFjID0gMTtcclxuICAgIGlmIChzdGFja2VkQmFyKSB7XHJcbiAgICAgIGZhYyA9IDAuNzE7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxhYmVscy5tYXAoKGxhYmVsLCBpKSA9PiB7XHJcbiAgICAgIGlmIChoaWRlUG9pbnRzQXRJbmRleC5pbmNsdWRlcyhpKSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB4ID1cclxuICAgICAgICAoKCh3aWR0aCAtIHBhZGRpbmdSaWdodCkgLyBsYWJlbHMubGVuZ3RoKSAqIGkgK1xyXG4gICAgICAgICAgcGFkZGluZ1JpZ2h0ICtcclxuICAgICAgICAgIGhvcml6b250YWxPZmZzZXQpICpcclxuICAgICAgICBmYWM7XHJcblxyXG4gICAgICBjb25zdCB5ID1cclxuICAgICAgICBoZWlnaHQgKiB2ZXJ0aWNhbExhYmVsc0hlaWdodFBlcmNlbnRhZ2UgK1xyXG4gICAgICAgIHBhZGRpbmdUb3AgK1xyXG4gICAgICAgIGZvbnRTaXplICogMiArXHJcbiAgICAgICAgeExhYmVsc09mZnNldDtcclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRleHRcclxuICAgICAgICAgIG9yaWdpbj17YCR7eH0sICR7eX1gfVxyXG4gICAgICAgICAgcm90YXRpb249e3ZlcnRpY2FsTGFiZWxSb3RhdGlvbn1cclxuICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cclxuICAgICAgICAgIHg9e3h9XHJcbiAgICAgICAgICB5PXt5fVxyXG4gICAgICAgICAgdGV4dEFuY2hvcj17dmVydGljYWxMYWJlbFJvdGF0aW9uID09PSAwID8gXCJtaWRkbGVcIiA6IFwic3RhcnRcIn1cclxuICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yTGFiZWxzKCl9XHJcbiAgICAgICAgICB7Li4udGhpcy5nZXRQcm9wc0ZvclZlcnRpY2FsTGFiZWxzKCl9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge2Ake2Zvcm1hdFhMYWJlbChsYWJlbCl9JHt4QXhpc0xhYmVsfWB9XHJcbiAgICAgICAgPC9UZXh0PlxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmVuZGVyVmVydGljYWxMaW5lcyA9ICh7XHJcbiAgICBkYXRhLFxyXG4gICAgd2lkdGgsXHJcbiAgICBoZWlnaHQsXHJcbiAgICBwYWRkaW5nVG9wLFxyXG4gICAgcGFkZGluZ1JpZ2h0LFxyXG4gICAgdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlID0gREVGQVVMVF9YX0xBQkVMU19IRUlHSFRfUEVSQ0VOVEFHRVxyXG4gIH06IE9taXQ8XHJcbiAgICBQaWNrPFxyXG4gICAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxyXG4gICAgICB8IFwiZGF0YVwiXHJcbiAgICAgIHwgXCJ3aWR0aFwiXHJcbiAgICAgIHwgXCJoZWlnaHRcIlxyXG4gICAgICB8IFwicGFkZGluZ1JpZ2h0XCJcclxuICAgICAgfCBcInBhZGRpbmdUb3BcIlxyXG4gICAgICB8IFwidmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlXCJcclxuICAgID4sXHJcbiAgICBcImRhdGFcIlxyXG4gID4gJiB7IGRhdGE6IG51bWJlcltdIH0pID0+IHtcclxuICAgIGNvbnN0IHsgeUF4aXNJbnRlcnZhbCA9IDEgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgcmV0dXJuIFsuLi5uZXcgQXJyYXkoTWF0aC5jZWlsKGRhdGEubGVuZ3RoIC8geUF4aXNJbnRlcnZhbCkpXS5tYXAoXHJcbiAgICAgIChfLCBpKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgIDxMaW5lXHJcbiAgICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cclxuICAgICAgICAgICAgeDE9e01hdGguZmxvb3IoXHJcbiAgICAgICAgICAgICAgKCh3aWR0aCAtIHBhZGRpbmdSaWdodCkgLyAoZGF0YS5sZW5ndGggLyB5QXhpc0ludGVydmFsKSkgKiBpICtcclxuICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodFxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgICB5MT17MH1cclxuICAgICAgICAgICAgeDI9e01hdGguZmxvb3IoXHJcbiAgICAgICAgICAgICAgKCh3aWR0aCAtIHBhZGRpbmdSaWdodCkgLyAoZGF0YS5sZW5ndGggLyB5QXhpc0ludGVydmFsKSkgKiBpICtcclxuICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodFxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgICB5Mj17aGVpZ2h0ICogdmVydGljYWxMYWJlbHNIZWlnaHRQZXJjZW50YWdlICsgcGFkZGluZ1RvcH1cclxuICAgICAgICAgICAgey4uLnRoaXMuZ2V0UHJvcHNGb3JCYWNrZ3JvdW5kTGluZXMoKX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICByZW5kZXJWZXJ0aWNhbExpbmUgPSAoe1xyXG4gICAgaGVpZ2h0LFxyXG4gICAgcGFkZGluZ1RvcCxcclxuICAgIHBhZGRpbmdSaWdodCxcclxuICAgIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSA9IERFRkFVTFRfWF9MQUJFTFNfSEVJR0hUX1BFUkNFTlRBR0VcclxuICB9OiBQaWNrPFxyXG4gICAgQWJzdHJhY3RDaGFydENvbmZpZyxcclxuICAgIFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCIgfCBcInZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZVwiXHJcbiAgPikgPT4gKFxyXG4gICAgPExpbmVcclxuICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxyXG4gICAgICB4MT17TWF0aC5mbG9vcihwYWRkaW5nUmlnaHQpfVxyXG4gICAgICB5MT17MH1cclxuICAgICAgeDI9e01hdGguZmxvb3IocGFkZGluZ1JpZ2h0KX1cclxuICAgICAgeTI9e2hlaWdodCAqIHZlcnRpY2FsTGFiZWxzSGVpZ2h0UGVyY2VudGFnZSArIHBhZGRpbmdUb3B9XHJcbiAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yQmFja2dyb3VuZExpbmVzKCl9XHJcbiAgICAvPlxyXG4gICk7XHJcblxyXG4gIHJlbmRlckRlZnMgPSAoXHJcbiAgICBjb25maWc6IFBpY2s8XHJcbiAgICAgIFBhcnRpYWxCeTxcclxuICAgICAgICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxyXG4gICAgICAgIHwgXCJiYWNrZ3JvdW5kR3JhZGllbnRGcm9tT3BhY2l0eVwiXHJcbiAgICAgICAgfCBcImJhY2tncm91bmRHcmFkaWVudFRvT3BhY2l0eVwiXHJcbiAgICAgICAgfCBcImZpbGxTaGFkb3dHcmFkaWVudFwiXHJcbiAgICAgICAgfCBcImZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHlcIlxyXG4gICAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRGcm9tXCJcclxuICAgICAgICB8IFwiZmlsbFNoYWRvd0dyYWRpZW50RnJvbU9wYWNpdHlcIlxyXG4gICAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRGcm9tT2Zmc2V0XCJcclxuICAgICAgICB8IFwiZmlsbFNoYWRvd0dyYWRpZW50VG9cIlxyXG4gICAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRUb09wYWNpdHlcIlxyXG4gICAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRUb09mZnNldFwiXHJcbiAgICAgID4sXHJcbiAgICAgIHwgXCJ3aWR0aFwiXHJcbiAgICAgIHwgXCJoZWlnaHRcIlxyXG4gICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50RnJvbVwiXHJcbiAgICAgIHwgXCJiYWNrZ3JvdW5kR3JhZGllbnRUb1wiXHJcbiAgICAgIHwgXCJ1c2VTaGFkb3dDb2xvckZyb21EYXRhc2V0XCJcclxuICAgICAgfCBcImRhdGFcIlxyXG4gICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50RnJvbU9wYWNpdHlcIlxyXG4gICAgICB8IFwiYmFja2dyb3VuZEdyYWRpZW50VG9PcGFjaXR5XCJcclxuICAgICAgfCBcImZpbGxTaGFkb3dHcmFkaWVudFwiXHJcbiAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRPcGFjaXR5XCJcclxuICAgICAgfCBcImZpbGxTaGFkb3dHcmFkaWVudEZyb21cIlxyXG4gICAgICB8IFwiZmlsbFNoYWRvd0dyYWRpZW50RnJvbU9wYWNpdHlcIlxyXG4gICAgICB8IFwiZmlsbFNoYWRvd0dyYWRpZW50RnJvbU9mZnNldFwiXHJcbiAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRUb1wiXHJcbiAgICAgIHwgXCJmaWxsU2hhZG93R3JhZGllbnRUb09wYWNpdHlcIlxyXG4gICAgICB8IFwiZmlsbFNoYWRvd0dyYWRpZW50VG9PZmZzZXRcIlxyXG4gICAgPlxyXG4gICkgPT4ge1xyXG4gICAgY29uc3Qge1xyXG4gICAgICB3aWR0aCxcclxuICAgICAgaGVpZ2h0LFxyXG4gICAgICBiYWNrZ3JvdW5kR3JhZGllbnRGcm9tLFxyXG4gICAgICBiYWNrZ3JvdW5kR3JhZGllbnRUbyxcclxuICAgICAgdXNlU2hhZG93Q29sb3JGcm9tRGF0YXNldCxcclxuICAgICAgZGF0YVxyXG4gICAgfSA9IGNvbmZpZztcclxuXHJcbiAgICBjb25zdCBmcm9tT3BhY2l0eSA9IGNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcImJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5XCIpXHJcbiAgICAgID8gY29uZmlnLmJhY2tncm91bmRHcmFkaWVudEZyb21PcGFjaXR5XHJcbiAgICAgIDogMS4wO1xyXG4gICAgY29uc3QgdG9PcGFjaXR5ID0gY29uZmlnLmhhc093blByb3BlcnR5KFwiYmFja2dyb3VuZEdyYWRpZW50VG9PcGFjaXR5XCIpXHJcbiAgICAgID8gY29uZmlnLmJhY2tncm91bmRHcmFkaWVudFRvT3BhY2l0eVxyXG4gICAgICA6IDEuMDtcclxuXHJcbiAgICBjb25zdCBmaWxsU2hhZG93R3JhZGllbnQgPSBjb25maWcuaGFzT3duUHJvcGVydHkoXCJmaWxsU2hhZG93R3JhZGllbnRcIilcclxuICAgICAgPyBjb25maWcuZmlsbFNoYWRvd0dyYWRpZW50XHJcbiAgICAgIDogdGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcigxLjApO1xyXG5cclxuICAgIGNvbnN0IGZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHkgPSBjb25maWcuaGFzT3duUHJvcGVydHkoXHJcbiAgICAgIFwiZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eVwiXHJcbiAgICApXHJcbiAgICAgID8gY29uZmlnLmZpbGxTaGFkb3dHcmFkaWVudE9wYWNpdHlcclxuICAgICAgOiAwLjE7XHJcblxyXG4gICAgY29uc3QgZmlsbFNoYWRvd0dyYWRpZW50RnJvbSA9IGNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcclxuICAgICAgXCJmaWxsU2hhZG93R3JhZGllbnRGcm9tXCJcclxuICAgIClcclxuICAgICAgPyBjb25maWcuZmlsbFNoYWRvd0dyYWRpZW50RnJvbVxyXG4gICAgICA6IGZpbGxTaGFkb3dHcmFkaWVudDtcclxuXHJcbiAgICBjb25zdCBmaWxsU2hhZG93R3JhZGllbnRGcm9tT3BhY2l0eSA9IGNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcclxuICAgICAgXCJmaWxsU2hhZG93R3JhZGllbnRGcm9tT3BhY2l0eVwiXHJcbiAgICApXHJcbiAgICAgID8gY29uZmlnLmZpbGxTaGFkb3dHcmFkaWVudEZyb21PcGFjaXR5XHJcbiAgICAgIDogZmlsbFNoYWRvd0dyYWRpZW50T3BhY2l0eTtcclxuXHJcbiAgICBjb25zdCBmaWxsU2hhZG93R3JhZGllbnRGcm9tT2Zmc2V0ID0gY29uZmlnLmhhc093blByb3BlcnR5KFxyXG4gICAgICBcImZpbGxTaGFkb3dHcmFkaWVudEZyb21PZmZzZXRcIlxyXG4gICAgKVxyXG4gICAgICA/IGNvbmZpZy5maWxsU2hhZG93R3JhZGllbnRGcm9tT2Zmc2V0XHJcbiAgICAgIDogMDtcclxuXHJcbiAgICBjb25zdCBmaWxsU2hhZG93R3JhZGllbnRUbyA9IGNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcImZpbGxTaGFkb3dHcmFkaWVudFRvXCIpXHJcbiAgICAgID8gY29uZmlnLmZpbGxTaGFkb3dHcmFkaWVudFRvXHJcbiAgICAgIDogdGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcigxLjApO1xyXG5cclxuICAgIGNvbnN0IGZpbGxTaGFkb3dHcmFkaWVudFRvT3BhY2l0eSA9IGNvbmZpZy5oYXNPd25Qcm9wZXJ0eShcclxuICAgICAgXCJmaWxsU2hhZG93R3JhZGllbnRUb09wYWNpdHlcIlxyXG4gICAgKVxyXG4gICAgICA/IGNvbmZpZy5maWxsU2hhZG93R3JhZGllbnRUb09wYWNpdHlcclxuICAgICAgOiAwLjE7XHJcblxyXG4gICAgY29uc3QgZmlsbFNoYWRvd0dyYWRpZW50VG9PZmZzZXQgPSBjb25maWcuaGFzT3duUHJvcGVydHkoXHJcbiAgICAgIFwiZmlsbFNoYWRvd0dyYWRpZW50VG9PZmZzZXRcIlxyXG4gICAgKVxyXG4gICAgICA/IGNvbmZpZy5maWxsU2hhZG93R3JhZGllbnRUb09mZnNldFxyXG4gICAgICA6IDE7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPERlZnM+XHJcbiAgICAgICAgPExpbmVhckdyYWRpZW50XHJcbiAgICAgICAgICBpZD1cImJhY2tncm91bmRHcmFkaWVudFwiXHJcbiAgICAgICAgICB4MT17MH1cclxuICAgICAgICAgIHkxPXtoZWlnaHR9XHJcbiAgICAgICAgICB4Mj17d2lkdGh9XHJcbiAgICAgICAgICB5Mj17MH1cclxuICAgICAgICAgIGdyYWRpZW50VW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPFN0b3BcclxuICAgICAgICAgICAgb2Zmc2V0PVwiMFwiXHJcbiAgICAgICAgICAgIHN0b3BDb2xvcj17YmFja2dyb3VuZEdyYWRpZW50RnJvbX1cclxuICAgICAgICAgICAgc3RvcE9wYWNpdHk9e2Zyb21PcGFjaXR5fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxTdG9wXHJcbiAgICAgICAgICAgIG9mZnNldD1cIjFcIlxyXG4gICAgICAgICAgICBzdG9wQ29sb3I9e2JhY2tncm91bmRHcmFkaWVudFRvfVxyXG4gICAgICAgICAgICBzdG9wT3BhY2l0eT17dG9PcGFjaXR5fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L0xpbmVhckdyYWRpZW50PlxyXG4gICAgICAgIHt1c2VTaGFkb3dDb2xvckZyb21EYXRhc2V0ID8gKFxyXG4gICAgICAgICAgZGF0YS5tYXAoKGRhdGFzZXQsIGluZGV4KSA9PiAoXHJcbiAgICAgICAgICAgIDxMaW5lYXJHcmFkaWVudFxyXG4gICAgICAgICAgICAgIGlkPXtgZmlsbFNoYWRvd0dyYWRpZW50RnJvbV8ke2luZGV4fWB9XHJcbiAgICAgICAgICAgICAga2V5PXtgJHtpbmRleH1gfVxyXG4gICAgICAgICAgICAgIHgxPXswfVxyXG4gICAgICAgICAgICAgIHkxPXswfVxyXG4gICAgICAgICAgICAgIHgyPXswfVxyXG4gICAgICAgICAgICAgIHkyPXtoZWlnaHR9XHJcbiAgICAgICAgICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxTdG9wXHJcbiAgICAgICAgICAgICAgICBvZmZzZXQ9e2ZpbGxTaGFkb3dHcmFkaWVudEZyb21PZmZzZXR9XHJcbiAgICAgICAgICAgICAgICBzdG9wQ29sb3I9e1xyXG4gICAgICAgICAgICAgICAgICBkYXRhc2V0LmNvbG9yID8gZGF0YXNldC5jb2xvcigxLjApIDogZmlsbFNoYWRvd0dyYWRpZW50RnJvbVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3RvcE9wYWNpdHk9e2ZpbGxTaGFkb3dHcmFkaWVudEZyb21PcGFjaXR5fVxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgPFN0b3BcclxuICAgICAgICAgICAgICAgIG9mZnNldD17ZmlsbFNoYWRvd0dyYWRpZW50VG9PZmZzZXR9XHJcbiAgICAgICAgICAgICAgICBzdG9wQ29sb3I9e1xyXG4gICAgICAgICAgICAgICAgICBkYXRhc2V0LmNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgPyBkYXRhc2V0LmNvbG9yKGZpbGxTaGFkb3dHcmFkaWVudEZyb21PcGFjaXR5KVxyXG4gICAgICAgICAgICAgICAgICAgIDogZmlsbFNoYWRvd0dyYWRpZW50RnJvbVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3RvcE9wYWNpdHk9e2ZpbGxTaGFkb3dHcmFkaWVudFRvT3BhY2l0eSB8fCAwfVxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvTGluZWFyR3JhZGllbnQ+XHJcbiAgICAgICAgICApKVxyXG4gICAgICAgICkgOiAoXHJcbiAgICAgICAgICA8TGluZWFyR3JhZGllbnRcclxuICAgICAgICAgICAgaWQ9XCJmaWxsU2hhZG93R3JhZGllbnRGcm9tXCJcclxuICAgICAgICAgICAgeDE9ezB9XHJcbiAgICAgICAgICAgIHkxPXswfVxyXG4gICAgICAgICAgICB4Mj17MH1cclxuICAgICAgICAgICAgeTI9e2hlaWdodH1cclxuICAgICAgICAgICAgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCJcclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPFN0b3BcclxuICAgICAgICAgICAgICBvZmZzZXQ9e2ZpbGxTaGFkb3dHcmFkaWVudEZyb21PZmZzZXR9XHJcbiAgICAgICAgICAgICAgc3RvcENvbG9yPXtmaWxsU2hhZG93R3JhZGllbnRGcm9tfVxyXG4gICAgICAgICAgICAgIHN0b3BPcGFjaXR5PXtmaWxsU2hhZG93R3JhZGllbnRGcm9tT3BhY2l0eX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPFN0b3BcclxuICAgICAgICAgICAgICBvZmZzZXQ9e2ZpbGxTaGFkb3dHcmFkaWVudFRvT2Zmc2V0fVxyXG4gICAgICAgICAgICAgIHN0b3BDb2xvcj17ZmlsbFNoYWRvd0dyYWRpZW50VG8gfHwgZmlsbFNoYWRvd0dyYWRpZW50RnJvbX1cclxuICAgICAgICAgICAgICBzdG9wT3BhY2l0eT17ZmlsbFNoYWRvd0dyYWRpZW50VG9PcGFjaXR5IHx8IDB9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L0xpbmVhckdyYWRpZW50PlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvRGVmcz5cclxuICAgICk7XHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWJzdHJhY3RDaGFydDtcclxuIl19

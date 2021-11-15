import { Component } from "react";
import { ChartConfig, Dataset, PartialBy } from "./HelperTypes";
export interface AbstractChartProps {
  fromZero?: boolean;
  fromNumber?: number;
  chartConfig?: AbstractChartConfig;
  yAxisLabel?: string;
  yAxisSuffix?: string;
  yLabelsOffset?: number;
  yAxisInterval?: number;
  xAxisLabel?: string;
  xLabelsOffset?: number;
  hidePointsAtIndex?: number[];
}
export interface AbstractChartConfig extends ChartConfig {
  count?: number;
  data?: Dataset[];
  width?: number;
  height?: number;
  paddingTop?: number;
  paddingRight?: number;
  horizontalLabelRotation?: number;
  formatYLabel?: (yLabel: string) => string;
  labels?: string[];
  horizontalOffset?: number;
  stackedBar?: boolean;
  verticalLabelRotation?: number;
  formatXLabel?: (xLabel: string) => string;
  verticalLabelsHeightPercentage?: number;
}
export declare type AbstractChartState = {};
export declare const DEFAULT_X_LABELS_HEIGHT_PERCENTAGE = 0.75;
declare class AbstractChart<
  IProps extends AbstractChartProps,
  IState extends AbstractChartState
> extends Component<AbstractChartProps & IProps, AbstractChartState & IState> {
  calcScaler: (data: number[]) => number;
  calcBaseHeight: (data: number[], height: number) => number;
  calcHeight: (val: number, data: number[], height: number) => number;
  getPropsForBackgroundLines(): {
    stroke: string;
    strokeDasharray: string;
    strokeWidth: number;
  };
  getPropsForLabels(): {
    x?: import("react-native-svg").NumberArray;
    y?: import("react-native-svg").NumberArray;
    dx?: import("react-native-svg").NumberArray;
    dy?: import("react-native-svg").NumberArray;
    rotate?: import("react-native-svg").NumberArray;
    opacity?: string | number;
    inlineSize?: string | number;
    alignmentBaseline?: import("react-native-svg").AlignmentBaseline;
    baselineShift?: import("react-native-svg").BaselineShift;
    verticalAlign?: string | number;
    lengthAdjust?: import("react-native-svg").LengthAdjust;
    textLength?: string | number;
    fontData?: {
      [name: string]: unknown;
    };
    fontFeatureSettings?: string;
    fill: import("react-native-svg").Color;
    fillOpacity?: string | number;
    fillRule?: import("react-native-svg").FillRule;
    stroke?: import("react-native-svg").Color;
    strokeWidth?: string | number;
    strokeOpacity?: string | number;
    strokeDasharray?: string | number | readonly (string | number)[];
    strokeDashoffset?: string | number;
    strokeLinecap?: "round" | "butt" | "square";
    strokeLinejoin?: "round" | "bevel" | "miter";
    strokeMiterlimit?: string | number;
    clipRule?: import("react-native-svg").FillRule;
    clipPath?: string;
    transform?:
      | string
      | import("react-native-svg").TransformObject
      | import("react-native-svg").ColumnMajorTransformMatrix;
    translate?: import("react-native-svg").NumberArray;
    translateX?: string | number;
    translateY?: string | number;
    origin?: import("react-native-svg").NumberArray;
    originX?: string | number;
    originY?: string | number;
    scale?: import("react-native-svg").NumberArray;
    scaleX?: string | number;
    scaleY?: string | number;
    skew?: import("react-native-svg").NumberArray;
    skewX?: string | number;
    skewY?: string | number;
    rotation?: string | number;
    vectorEffect?:
      | "default"
      | "inherit"
      | "none"
      | "non-scaling-stroke"
      | "nonScalingStroke"
      | "uri";
    pointerEvents?: "auto" | "none" | "box-none" | "box-only";
    onStartShouldSetResponder?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    onMoveShouldSetResponder?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    onResponderEnd?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderGrant?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderReject?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderMove?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderRelease?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderStart?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderTerminationRequest?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    onResponderTerminate?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onStartShouldSetResponderCapture?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    onMoveShouldSetResponderCapture?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    disabled?: boolean;
    onPress?: (event: import("react-native").GestureResponderEvent) => void;
    onPressIn?: (event: import("react-native").GestureResponderEvent) => void;
    onPressOut?: (event: import("react-native").GestureResponderEvent) => void;
    onLongPress?: (event: import("react-native").GestureResponderEvent) => void;
    delayPressIn?: number;
    delayPressOut?: number;
    delayLongPress?: number;
    id?: string;
    marker?: string;
    markerStart?: string;
    markerMid?: string;
    markerEnd?: string;
    mask?: string;
    font?: import("react-native-svg").FontObject;
    fontStyle?: import("react-native-svg").FontStyle;
    fontVariant?: import("react-native-svg").FontVariant;
    fontWeight?: string | number;
    fontStretch?: import("react-native-svg").FontStretch;
    fontSize: string | number;
    fontFamily?: string;
    textAnchor?: import("react-native-svg").TextAnchor;
    textDecoration?: import("react-native-svg").TextDecoration;
    letterSpacing?: string | number;
    wordSpacing?: string | number;
    kerning?: string | number;
    fontVariantLigatures?: import("react-native-svg").FontVariantLigatures;
    fontVariationSettings?: string;
  };
  getPropsForVerticalLabels(): {
    x?: import("react-native-svg").NumberArray;
    y?: import("react-native-svg").NumberArray;
    dx?: import("react-native-svg").NumberArray;
    dy?: import("react-native-svg").NumberArray;
    rotate?: import("react-native-svg").NumberArray;
    opacity?: string | number;
    inlineSize?: string | number;
    alignmentBaseline?: import("react-native-svg").AlignmentBaseline;
    baselineShift?: import("react-native-svg").BaselineShift;
    verticalAlign?: string | number;
    lengthAdjust?: import("react-native-svg").LengthAdjust;
    textLength?: string | number;
    fontData?: {
      [name: string]: unknown;
    };
    fontFeatureSettings?: string;
    fill: import("react-native-svg").Color;
    fillOpacity?: string | number;
    fillRule?: import("react-native-svg").FillRule;
    stroke?: import("react-native-svg").Color;
    strokeWidth?: string | number;
    strokeOpacity?: string | number;
    strokeDasharray?: string | number | readonly (string | number)[];
    strokeDashoffset?: string | number;
    strokeLinecap?: "round" | "butt" | "square";
    strokeLinejoin?: "round" | "bevel" | "miter";
    strokeMiterlimit?: string | number;
    clipRule?: import("react-native-svg").FillRule;
    clipPath?: string;
    transform?:
      | string
      | import("react-native-svg").TransformObject
      | import("react-native-svg").ColumnMajorTransformMatrix;
    translate?: import("react-native-svg").NumberArray;
    translateX?: string | number;
    translateY?: string | number;
    origin?: import("react-native-svg").NumberArray;
    originX?: string | number;
    originY?: string | number;
    scale?: import("react-native-svg").NumberArray;
    scaleX?: string | number;
    scaleY?: string | number;
    skew?: import("react-native-svg").NumberArray;
    skewX?: string | number;
    skewY?: string | number;
    rotation?: string | number;
    vectorEffect?:
      | "default"
      | "inherit"
      | "none"
      | "non-scaling-stroke"
      | "nonScalingStroke"
      | "uri";
    pointerEvents?: "auto" | "none" | "box-none" | "box-only";
    onStartShouldSetResponder?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    onMoveShouldSetResponder?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    onResponderEnd?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderGrant?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderReject?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderMove?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderRelease?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderStart?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderTerminationRequest?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    onResponderTerminate?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onStartShouldSetResponderCapture?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    onMoveShouldSetResponderCapture?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    disabled?: boolean;
    onPress?: (event: import("react-native").GestureResponderEvent) => void;
    onPressIn?: (event: import("react-native").GestureResponderEvent) => void;
    onPressOut?: (event: import("react-native").GestureResponderEvent) => void;
    onLongPress?: (event: import("react-native").GestureResponderEvent) => void;
    delayPressIn?: number;
    delayPressOut?: number;
    delayLongPress?: number;
    id?: string;
    marker?: string;
    markerStart?: string;
    markerMid?: string;
    markerEnd?: string;
    mask?: string;
    font?: import("react-native-svg").FontObject;
    fontStyle?: import("react-native-svg").FontStyle;
    fontVariant?: import("react-native-svg").FontVariant;
    fontWeight?: string | number;
    fontStretch?: import("react-native-svg").FontStretch;
    fontSize?: string | number;
    fontFamily?: string;
    textAnchor?: import("react-native-svg").TextAnchor;
    textDecoration?: import("react-native-svg").TextDecoration;
    letterSpacing?: string | number;
    wordSpacing?: string | number;
    kerning?: string | number;
    fontVariantLigatures?: import("react-native-svg").FontVariantLigatures;
    fontVariationSettings?: string;
  };
  getPropsForHorizontalLabels(): {
    x?: import("react-native-svg").NumberArray;
    y?: import("react-native-svg").NumberArray;
    dx?: import("react-native-svg").NumberArray;
    dy?: import("react-native-svg").NumberArray;
    rotate?: import("react-native-svg").NumberArray;
    opacity?: string | number;
    inlineSize?: string | number;
    alignmentBaseline?: import("react-native-svg").AlignmentBaseline;
    baselineShift?: import("react-native-svg").BaselineShift;
    verticalAlign?: string | number;
    lengthAdjust?: import("react-native-svg").LengthAdjust;
    textLength?: string | number;
    fontData?: {
      [name: string]: unknown;
    };
    fontFeatureSettings?: string;
    fill: import("react-native-svg").Color;
    fillOpacity?: string | number;
    fillRule?: import("react-native-svg").FillRule;
    stroke?: import("react-native-svg").Color;
    strokeWidth?: string | number;
    strokeOpacity?: string | number;
    strokeDasharray?: string | number | readonly (string | number)[];
    strokeDashoffset?: string | number;
    strokeLinecap?: "round" | "butt" | "square";
    strokeLinejoin?: "round" | "bevel" | "miter";
    strokeMiterlimit?: string | number;
    clipRule?: import("react-native-svg").FillRule;
    clipPath?: string;
    transform?:
      | string
      | import("react-native-svg").TransformObject
      | import("react-native-svg").ColumnMajorTransformMatrix;
    translate?: import("react-native-svg").NumberArray;
    translateX?: string | number;
    translateY?: string | number;
    origin?: import("react-native-svg").NumberArray;
    originX?: string | number;
    originY?: string | number;
    scale?: import("react-native-svg").NumberArray;
    scaleX?: string | number;
    scaleY?: string | number;
    skew?: import("react-native-svg").NumberArray;
    skewX?: string | number;
    skewY?: string | number;
    rotation?: string | number;
    vectorEffect?:
      | "default"
      | "inherit"
      | "none"
      | "non-scaling-stroke"
      | "nonScalingStroke"
      | "uri";
    pointerEvents?: "auto" | "none" | "box-none" | "box-only";
    onStartShouldSetResponder?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    onMoveShouldSetResponder?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    onResponderEnd?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderGrant?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderReject?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderMove?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderRelease?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderStart?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onResponderTerminationRequest?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    onResponderTerminate?: (
      event: import("react-native").GestureResponderEvent
    ) => void;
    onStartShouldSetResponderCapture?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    onMoveShouldSetResponderCapture?: (
      event: import("react-native").GestureResponderEvent
    ) => boolean;
    disabled?: boolean;
    onPress?: (event: import("react-native").GestureResponderEvent) => void;
    onPressIn?: (event: import("react-native").GestureResponderEvent) => void;
    onPressOut?: (event: import("react-native").GestureResponderEvent) => void;
    onLongPress?: (event: import("react-native").GestureResponderEvent) => void;
    delayPressIn?: number;
    delayPressOut?: number;
    delayLongPress?: number;
    id?: string;
    marker?: string;
    markerStart?: string;
    markerMid?: string;
    markerEnd?: string;
    mask?: string;
    font?: import("react-native-svg").FontObject;
    fontStyle?: import("react-native-svg").FontStyle;
    fontVariant?: import("react-native-svg").FontVariant;
    fontWeight?: string | number;
    fontStretch?: import("react-native-svg").FontStretch;
    fontSize?: string | number;
    fontFamily?: string;
    textAnchor?: import("react-native-svg").TextAnchor;
    textDecoration?: import("react-native-svg").TextDecoration;
    letterSpacing?: string | number;
    wordSpacing?: string | number;
    kerning?: string | number;
    fontVariantLigatures?: import("react-native-svg").FontVariantLigatures;
    fontVariationSettings?: string;
  };
  renderHorizontalLines: (config: any) => JSX.Element[];
  renderHorizontalLine: (config: any) => JSX.Element;
  renderHorizontalLabels: (
    config: Pick<
      AbstractChartConfig,
      | "color"
      | "style"
      | "backgroundColor"
      | "height"
      | "paddingRight"
      | "paddingTop"
      | "width"
      | "strokeWidth"
      | "propsForBackgroundLines"
      | "propsForLabels"
      | "labelColor"
      | "propsForVerticalLabels"
      | "propsForHorizontalLabels"
      | "count"
      | "horizontalLabelRotation"
      | "formatYLabel"
      | "labels"
      | "horizontalOffset"
      | "stackedBar"
      | "verticalLabelRotation"
      | "formatXLabel"
      | "verticalLabelsHeightPercentage"
      | "backgroundGradientFrom"
      | "backgroundGradientFromOpacity"
      | "backgroundGradientTo"
      | "backgroundGradientToOpacity"
      | "fillShadowGradient"
      | "fillShadowGradientOpacity"
      | "useShadowColorFromDataset"
      | "barPercentage"
      | "barRadius"
      | "propsForDots"
      | "decimalPlaces"
      | "linejoinType"
      | "scrollableDotFill"
      | "scrollableDotStrokeColor"
      | "scrollableDotStrokeWidth"
      | "scrollableDotRadius"
      | "scrollableInfoViewStyle"
      | "scrollableInfoTextStyle"
      | "scrollableInfoTextDecorator"
      | "scrollableInfoOffset"
      | "scrollableInfoSize"
    > & {
      data: number[];
    }
  ) => JSX.Element[];
  renderVerticalLabels: ({
    labels,
    width,
    height,
    paddingRight,
    paddingTop,
    horizontalOffset,
    stackedBar,
    verticalLabelRotation,
    formatXLabel,
    verticalLabelsHeightPercentage
  }: Pick<
    AbstractChartConfig,
    | "labels"
    | "width"
    | "height"
    | "paddingRight"
    | "paddingTop"
    | "horizontalOffset"
    | "stackedBar"
    | "verticalLabelRotation"
    | "formatXLabel"
    | "verticalLabelsHeightPercentage"
  >) => JSX.Element[];
  renderVerticalLines: ({
    data,
    width,
    height,
    paddingTop,
    paddingRight,
    verticalLabelsHeightPercentage
  }: Pick<
    Pick<
      AbstractChartConfig,
      | "height"
      | "paddingRight"
      | "paddingTop"
      | "width"
      | "data"
      | "verticalLabelsHeightPercentage"
    >,
    | "height"
    | "paddingRight"
    | "paddingTop"
    | "width"
    | "verticalLabelsHeightPercentage"
  > & {
    data: number[];
  }) => JSX.Element[];
  renderVerticalLine: ({
    height,
    paddingTop,
    paddingRight,
    verticalLabelsHeightPercentage
  }: Pick<
    AbstractChartConfig,
    "height" | "paddingRight" | "paddingTop" | "verticalLabelsHeightPercentage"
  >) => JSX.Element;
  renderDefs: (
    config: Pick<
      PartialBy<
        AbstractChartConfig,
        | "backgroundGradientFromOpacity"
        | "backgroundGradientToOpacity"
        | "fillShadowGradient"
        | "fillShadowGradientOpacity"
      >,
      | "width"
      | "height"
      | "backgroundGradientFrom"
      | "backgroundGradientTo"
      | "useShadowColorFromDataset"
      | "data"
      | "backgroundGradientFromOpacity"
      | "backgroundGradientToOpacity"
      | "fillShadowGradient"
      | "fillShadowGradientOpacity"
    >
  ) => JSX.Element;
}
export default AbstractChart;
//# sourceMappingURL=AbstractChart.d.ts.map

import React from "react";
import { Rect, Text } from "react-native-svg";
import PropTypes from "prop-types";

const CIRCLE_WIDTH = 16;
const LEGEND_HEIGHT = 30;
/* half the height of the legend Rect, minus half the height of the circle to align the
    circle from its center, rather than its top. */
const CENTER_ALIGNED_CIRCLE = LEGEND_HEIGHT / 2 - CIRCLE_WIDTH / 2;
// 65% of the legend container height centers the text in relation to the circles
const CENTER_ALIGNED_TEXT = LEGEND_HEIGHT * 0.65;
const PADDING_LEFT = 4;

export const LegendItem = props => {
  const { itemWidthPercentage, index } = props;
  return (
    <>
      <Rect
        width="16px"
        height="16px"
        fill={props.iconColor}
        rx={8}
        ry={8}
        x={itemWidthPercentage * (index + 1) - CIRCLE_WIDTH} // so the circle and text are centered on the itemWidthPercentage
        y={CENTER_ALIGNED_CIRCLE}
      />
      <Text
        x={itemWidthPercentage * (index + 1) + PADDING_LEFT}
        y={CENTER_ALIGNED_TEXT}
        {...props.labelProps}
      >
        {props.legendText}
      </Text>
    </>
  );
};

LegendItem.propTypes = {
  index: Number,
  iconColor: String,
  itemWidthPercentage: Number,
  legendText: String
};

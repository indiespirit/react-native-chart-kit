import React from "react";
import { Rect, Text } from "react-native-svg";
import PropTypes from "prop-types";

const CIRCLE_WIDTH = 16;
const PADDING_LEFT = 4;

export const LegendItem = props => {
  const { itemWidthPercentage, index } = props;
  /* half the height of the legend Rect, minus half the height of the circle to align the
      circle from its center, rather than its top. */
  const centerAlignedCircle = props.legendOffset / 2 - CIRCLE_WIDTH / 2;
  // 65% of the legend container height centers the text in relation to the circles
  const centerAlignedText = props.legendOffset * 0.65;
  return (
    <>
      <Rect
        width="16px"
        height="16px"
        fill={props.iconColor}
        rx={8}
        ry={8}
        x={itemWidthPercentage * (index + 1) - CIRCLE_WIDTH} //the circle and text are centered on the itemWidthPercentage
        y={centerAlignedCircle}
      />
      <Text
        x={itemWidthPercentage * (index + 1) + PADDING_LEFT}
        y={centerAlignedText}
        {...props.labelProps}
      >
        {props.legendText}
      </Text>
    </>
  );
};

LegendItem.propTypes = {
  index: PropTypes.number,
  iconColor: PropTypes.string,
  itemWidthPercentage: PropTypes.number,
  legendText: PropTypes.string,
  legendOffset: PropTypes.number
};

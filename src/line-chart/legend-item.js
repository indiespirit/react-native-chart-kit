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
  // to center the legendItem on the itemWidthPercentage
  const textLengthOffset = (props.legendText.length * 6) / 2;
  const legendItemNumber = index + 1;

  return (
    <>
      <Rect
        width={CIRCLE_WIDTH}
        height={CIRCLE_WIDTH}
        fill={props.iconColor}
        rx={8}
        ry={8}
        x={
          itemWidthPercentage * legendItemNumber -
          (CIRCLE_WIDTH + textLengthOffset)
        }
        y={centerAlignedCircle}
      />
      <Text
        x={
          itemWidthPercentage * legendItemNumber +
          (PADDING_LEFT - textLengthOffset)
        }
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

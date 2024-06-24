import React from "react";
import classNames from "classnames";

const bgColors = [
  "",
  "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)",
  "linear-gradient(120deg, #DECBA4, #3E5151)",
  "linear-gradient(120deg, #8360c3, #2ebf91)",
  "linear-gradient(120deg, #8e2de2, #4a00e0)",
  "linear-gradient(120deg, #fffbd5, #b20a2c)",
  "linear-gradient(to bottom right, red, yellow)",
  "linear-gradient(to right, #00b09b, #96c93d)",
  "radial-gradient(circle farthest-side, #fceabb, #f8b500)",
  "linear-gradient(to right, rgb(242, 112, 156), rgb(255, 148, 114))",
  "linear-gradient( 109.6deg, rgba(156,252,248,1) 11.2%, rgba(110,123,251,1) 91.1% )",
  "linear-gradient(to right, #ff6e7f, #bfe9ff)",
  "linear-gradient(to right, #0099f7, #f11712)",
];

const GradientPicker = ({ onColorSelect, selectedColor }) => {
  return (
    <div className="w-full flex flex-wrap gap-3 ">
      {bgColors.map((color) => (
        <div
          key={color}
          className={classNames(
            `w-10 h-10 rounded-full cursor-pointer bg-${color}`,
            {
              "ring-2 ring-offset-2 ring-gray-500": selectedColor === color,
              "ring-1 ring-gray-300": selectedColor !== color,
              "hover:ring-2 hover:ring-offset-2 hover:ring-gray-500": true,
            }
          )}
          style={{ background: color }}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  );
};

export default GradientPicker;

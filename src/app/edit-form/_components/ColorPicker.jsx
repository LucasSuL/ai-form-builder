import React from "react";
import classNames from "classnames";

const colors = [
  "slate-950",
  "zinc-50",
  "gray-300",
  "gray-500",
  "red-500",
  "orange-600",
  "blue-500",
  "green-500",
  "lime-500",
  "cyan-400",
  "sky-600",
  "indigo-400",
  "yellow-500",
  "purple-500",
  "pink-400",
];

const ColorPicker = ({ onColorSelect, selectedColor }) => {
  return (
    <div className="w-full flex flex-wrap gap-3">
      {colors.map((color) => (
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
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  );
};

export default ColorPicker;

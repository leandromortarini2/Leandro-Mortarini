import React from "react";
import { useState, useEffect } from "react";

export const DrawinGrid = () => {
  const columns = 100;

  const [cellSize, setCellSize] = useState(0);
  const [rows, setRows] = useState(0);
  const [showColorPaint, setShowColorPaint] = useState(false);
  const [pickPosition, setPickPosition] = useState({ x: 0, y: 0 });
  const [selectionCell, setSelectionCell] = useState(null);
  const [cellColor, setCellColor] = useState({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000");
  const colors = ["#000", "#aa0ebe", "#ff0000", "#00ff00", "#0000ff"];

  const calculateGrid = () => {
    const newCellSide = Math.floor(window.innerWidth / columns);
    const newRows = Math.floor(window.innerHeight / newCellSide);
    setCellSize(newCellSide);
    setRows(newRows);
  };

  useEffect(() => {
    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    console.log(cellColor);

    return () => window.removeEventListener("resize", calculateGrid);
  }, []);

  const handleContextMenu = (e, i) => {
    e.preventDefault();

    setSelectionCell(i);

    setPickPosition({ x: e.clientX, y: e.clientY });

    setShowColorPaint(true);
  };

  const handlePickColor = (color) => {
    setCurrentColor(color);
    setCellColor((prev) => ({
      ...prev,
      [selectionCell]: color,
    }));
    setShowColorPaint(false);
  };

  const handleMouseLeavePicker = () => {
    setShowColorPaint(false);
  };

  return (
    <div
      className="grid w-screen h-screen justify-center items-center "
      style={{ gridTemplateColumns: `repeat(${columns}, ${cellSize}px)` }}
    >
      {Array.from({ length: rows * columns }).map((_, index) => (
        <div
          className=" border border-gray-300 box-border"
          key={index}
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            backgroundColor: cellColor[index] || "white",
          }}
          onContextMenu={(e) => handleContextMenu(e, index)}
          onMouseDown={() => {
            setIsDrawing(true);

            setCellColor((prev) => ({
              ...prev,
              [index]: prev[index] ? undefined : currentColor,
            }));
          }}
          onMouseMove={() => {
            if (isDrawing) {
              setCellColor((prev) => ({
                ...prev,
                [index]: currentColor,
              }));
            }
          }}
          onMouseUp={() => setIsDrawing(false)}
        ></div>
      ))}
      {showColorPaint && (
        <div
          className="absolute bg-white shadow-lg p-2 rounded z-50 transition-opacity duration-300"
          style={{
            top: pickPosition.y,
            left: pickPosition.x,
          }}
          onMouseLeave={handleMouseLeavePicker}
        >
          <p className="text-sm font-bold mb-2">Elegir un color:</p>
          <div className="flex gap-2">
            {colors.map((color) => {
              return (
                <div
                  key={color}
                  className="w-6 h-6 cursor-pointer border"
                  style={{ backgroundColor: color }}
                  onClick={() => handlePickColor(color)}
                ></div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

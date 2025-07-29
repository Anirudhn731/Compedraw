import { PencilButton, EraserButton } from "./ToolButtons.tsx";
import { UndoButton, RedoButton, ClearButton } from "./ToolButtons.tsx";
import { StrokeWidthScale, StrokeColorPicker } from "./StrokeAdjustments.tsx";

import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { type ChangeEvent, useRef, useState, type FocusEvent } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

function DrawBoard() {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  // Eraser Toggle
  const [eraserMode, setEraserMode] = useState(false);
  const handleEraserClick = () => {
    setEraserMode(!eraserMode);
    canvasRef.current?.eraseMode(true);
  };

  // Pencil Toggle
  const handlePencilClick = () => {
    setEraserMode(false);
    canvasRef.current?.eraseMode(false);
  };

  // Stroke Width Adjustment
  const [strokeWidth, setStrokeWidth] = useState(4);
  const handleStrokeWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStrokeWidth(+event.target.value);
  };

  // Stroke Color Adjustment
  const [strokeColor, setStrokeColor] = useState("#5D80EA");
  const [strokeColorHistory, setStrokeColorHistory] = useState(
    Array(5).fill(null)
  );
  const handleStrokeColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStrokeColor(event.target.value);
  };

  const handleStrokeColorBlur = (event: FocusEvent<HTMLInputElement>) => {
    let history = strokeColorHistory.slice(0, 5);
    for (let i = 3; i >= 0; i--) {
      history[i + 1] = history[i];
    }
    history[0] = event.target.value;
    setStrokeColorHistory(history);
  };

  // Tools Functionality(Undo/Redo/Clear)
  const handleUndoClick = () => {
    canvasRef.current?.undo();
  };

  const handleRedoClick = () => {
    canvasRef.current?.redo();
  };

  const handleClearClick = () => {
    canvasRef.current?.clearCanvas();
  };

  return (
    <div className="DrawBoard-container">
      <div className="DrawBoard-canvas">
        <ReactSketchCanvas
          width="600px"
          height="400px"
          strokeWidth={strokeWidth}
          eraserWidth={strokeWidth}
          strokeColor={strokeColor}
          ref={canvasRef}
          className="DrawBoard"
        />
      </div>
      <div className="Buttons-container">
        <StrokeColorPicker
          strokeColor={strokeColor}
          onChange={handleStrokeColorChange}
          onBlur={handleStrokeColorBlur}
          history={strokeColorHistory}
          setStrokeColor={setStrokeColor}
        />
        <PencilButton disabled={!eraserMode} onClick={handlePencilClick} />
        <EraserButton disabled={eraserMode} onClick={handleEraserClick} />
        <StrokeWidthScale
          strokeWidth={strokeWidth}
          onChange={handleStrokeWidthChange}
        />
        <UndoButton onClick={handleUndoClick} />
        <RedoButton onClick={handleRedoClick} />
        <ClearButton onClick={handleClearClick} />
      </div>
    </div>
  );
}

export default DrawBoard;

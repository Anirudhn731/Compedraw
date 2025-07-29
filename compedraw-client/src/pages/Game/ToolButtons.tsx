export function PencilButton({ disabled, onClick }) {
  return (
    <button
      className="pencil-button tool-button"
      title="Pencil"
      disabled={disabled}
      onClick={onClick}
    >
      <i className="bi bi-pencil-fill"></i>
    </button>
  );
}

export function EraserButton({ disabled, onClick }) {
  return (
    <button
      className="eraser-button tool-button"
      title="Eraser"
      disabled={disabled}
      onClick={onClick}
    >
      <i className="bi bi-eraser-fill"></i>
    </button>
  );
}

export function UndoButton({ onClick }) {
  return (
    <button className="undo-button tool-button" onClick={onClick}>
      <i className="bi bi-arrow-clockwise"></i>
    </button>
  );
}

export function RedoButton({ onClick }) {
  return (
    <button className="redo-button tool-button" onClick={onClick}>
      <i className="bi bi-arrow-counterclockwise"></i>
    </button>
  );
}

export function ClearButton({ onClick }) {
  return (
    <button className="clear-button tool-button" onClick={onClick}>
      <i className="bi bi-calendar2-x-fill"></i>
    </button>
  );
}

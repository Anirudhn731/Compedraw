export function StrokeWidthScale({ strokeWidth, onChange }) {
  return (
    <button className="bi bi-align-middle tool-button stroke-width-scale">
      <input
        type="range"
        min="1"
        max="20"
        step="2"
        value={strokeWidth}
        onChange={onChange}
      />
    </button>
  );
}

export function StrokeColorPicker({
  strokeColor,
  onChange,
  onBlur,
  history,
  setStrokeColor,
}) {
  function handleStrokeColorChange({ i, history }) {
    let tempcolor = history[0];
    history[0] = history[i];
    history[i] = tempcolor;

    setStrokeColor(history[0]);
  }
  let historyelems = Array(5).fill(null);
  for (let i = 0; i < 5; i++) {
    let angle = i * 40 + "deg";
    if (history[i]) {
      historyelems[i] = (
        <button
          className="colorHistorybtn"
          style={{ backgroundColor: history[i], "--angle": angle }}
          onClick={() => handleStrokeColorChange({ i, history })}
        ></button>
      );
    } else {
      historyelems[i] = (
        <button
          className="colorHistorybtn"
          style={{ "--angle": angle }}
          onClick={() => handleStrokeColorChange({ i, history })}
          disabled
        ></button>
      );
    }
  }
  // <button
  //   className="colorHistorybtn"
  //   style={
  //     btncolor
  //       ? { backgroundColor: btncolor }
  //       : { backgroundColor: "transparent" }
  //   }
  //   onClick={() => handleStrokeColorChange({ btncolor, history })}
  // ></button>
  //   ));

  return (
    <div className="stroke-color-container">
      <div className="color-picker-container">
        <input
          type="color"
          className="color-picker"
          value={strokeColor}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
      <div className="color-history-container">{historyelems}</div>
    </div>
  );
}

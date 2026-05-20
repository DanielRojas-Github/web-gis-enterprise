const OpacitySlider = ({
  opacity,
  onChange,
}) => {
  return (
    <div className="opacity-slider">
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={opacity}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
      />
    </div>
  )
}

export default OpacitySlider
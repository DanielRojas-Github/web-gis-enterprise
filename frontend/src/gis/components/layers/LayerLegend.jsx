const LayerLegend = ({
  legendUrl,
}) => {
  if (!legendUrl) return null

  return (
    <div className="layer-legend">
      <img
        src={legendUrl}
        alt="Layer legend"
      />
    </div>
  )
}

export default LayerLegend

// This component, LayerLegend, is responsible for displaying the legend of a map layer. It takes a prop called legendUrl, which is the URL of the legend image. If the legendUrl is not provided, it returns null and does not render anything. If the legendUrl is provided, it renders a div with a class of "layer-legend" that contains an img element with the source set to the legendUrl and an alt text of "Layer legend".
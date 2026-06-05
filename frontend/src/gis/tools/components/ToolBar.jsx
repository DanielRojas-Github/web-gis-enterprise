import { useGIS }
    from '@/store/gis/hooks/useGIS'

import {
    GIS_ACTIONS,
} from '@/store/gis/gisActions'

import {
    TOOL_TYPES,
} from '@/gis/tools/toolTypes'

import { toolManager }
    from '@/gis/tools/manager/ToolManager'

import { drawState }
    from '@/gis/tools/overlays/draw/drawStore'

import { DRAW_TYPES }
    from '@/gis/tools/tools/draw/drawTypes'

import {
    featuresToGeoJSON,
}
    from
    '@/gis/tools/overlays/draw/drawGeoJSON'






const ToolBar = () => {

    const {
        state,
        dispatch,
    } = useGIS()

    const setTool = (tool) => {
        
        toolManager.activate(tool)

        dispatch({
            type:
                GIS_ACTIONS.SET_ACTIVE_TOOL,

            payload:
                tool,
        })

        dispatch({
            type:
                GIS_ACTIONS.SET_SELECTED_FEATURE,

            payload:
                null,
        })

        dispatch({
            type:
                GIS_ACTIONS.SET_FEATURE_INFO,

            payload:
                null,
        })
    }
    const clearMeasurements = () => { dispatch({ type: GIS_ACTIONS.CLEAR_MEASUREMENTS, }) }
    const exportGeoJSON = () => {

        const geojson =

            featuresToGeoJSON(
                drawState.features
            )

        const blob =

            new Blob(

                [
                    JSON.stringify(
                        geojson,
                        null,
                        2
                    )
                ],

                {
                    type:
                        'application/json',
                }
            )

        const url =
            URL.createObjectURL(
                blob
            )

        const link =
            document.createElement(
                'a'
            )

        link.href = url

        link.download =
            'drawings.geojson'

        link.click()

        URL.revokeObjectURL(
            url
        )
    }

    return (
        <div
            style={{
                position: 'absolute',

                top: 20,
                right: 20,

                zIndex: 9999,

                display: 'flex',

                gap: '10px',

                background: '#FFFFFF',

                padding: '10px',

                borderRadius: '8px',

                boxShadow:
                    '0 2px 10px rgba(0,0,0,0.2)',
            }}
        >

            <button
                onClick={() =>
                    setTool(
                        TOOL_TYPES.IDENTIFY
                    )
                }
            >
                Identify
            </button>

            <button
                onClick={() =>
                    setTool(
                        TOOL_TYPES.MEASURE
                    )
                }
            >
                Measure
            </button>

            <button
                onClick={() =>
                    setTool(
                        TOOL_TYPES.DRAW
                    )
                }
            >
                Draw
            </button>
            <button
                onClick={() =>
                    drawState.setType(
                        DRAW_TYPES.POINT
                    )
                }
            >
                Point
            </button>

            <button
                onClick={() =>
                    drawState.setType(
                        DRAW_TYPES.POLYLINE
                    )
                }
            >
                Polyline
            </button>

            <button
                onClick={() =>
                    drawState.setType(
                        DRAW_TYPES.POLYGON
                    )
                }
            >
                Polygon
            </button>

            <button
                onClick={
                    exportGeoJSON
                }
            >
                Export GeoJSON
            </button>
            <button
                onClick={
                    clearMeasurements
                }
            >
                Clear Measure
            </button>

            <div>

                Active:
                {' '}
                {state?.activeTool || 'NONE'}

            </div>

        </div>

    )
}

export default ToolBar
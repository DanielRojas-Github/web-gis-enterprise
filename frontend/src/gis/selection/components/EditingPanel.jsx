import {
    useGIS,
} from '@/store/gis/hooks/useGIS'

import DynamicAttributeEditor from './DynamicAttributeEditor'

//  import { LAYER_ACTIONS } from '@/store/layers/layerActions'
import {
    useLayers
}
    from '@/store/layers/hooks/useLayers'

export default function EditingPanel() {


    const {
        state,
        // dispatch,
        setEditing,
        setEditingFeature,
      
    } = useGIS()

    const {
        selectedFeature,
        isEditing,
    } = state

    const {
        updateFeatureInLayer,
       
    } = useLayers()

    const handleEdit = () => {

        if (!selectedFeature) {
            return
        }

        setEditingFeature(
            selectedFeature
        )

        setEditing(
            true
        )
    }

    const handleCancel = () => {

        setEditing(
            false
        )

        setEditingFeature(
            null
        )
    }
    const handleSave = () => {
  if (!state.editingFeature) return

  updateFeatureInLayer({
    layerId:
      state.editingFeature.layerId,
    feature:
      state.editingFeature,
  })

  setEditing(false)
  setEditingFeature(null)
}

    return (

        <div
            style={{
                padding: '10px',
                border: '1px solid #ccc',
                margin: '10px',
            }}
        >
            <h3>
                Editing Panel
            </h3>

            {!selectedFeature && (

                <p>
                    No feature selected
                </p>
            )}

            {selectedFeature && (

                <>
                    <p>

                        <strong>
                            Feature ID:
                        </strong>

                        {' '}

                        {selectedFeature.id ||
                            'No ID'}

                    </p>

                    <p>

                        <strong>
                            Geometry:
                        </strong>

                        {' '}

                        {
                            selectedFeature
                                .geometry?.type
                        }

                    </p>

                    <pre>
                        {
                            JSON.stringify(
                                selectedFeature.properties,
                                null,
                                2
                            )
                        }
                    </pre>

                </>
            )}

            {selectedFeature && !isEditing && (

                <button
                    onClick={
                        handleEdit
                    }
                >
                    Edit Feature
                </button>


            )}

            {isEditing && (

                <button
                    onClick={
                        handleCancel
                    }
                >
                    Cancel Edit
                </button>

            )}

            {isEditing && (
                <button
                    onClick={() => {
                        handleSave()
                    }}
                    style={{ marginLeft: '10px' }}
                >
                    Save Changes
                </button>
            )}
            <p>

                <strong>
                    Editing:
                </strong>

                {' '}

                {
                    isEditing
                        ? 'YES'
                        : 'NO'
                }

            </p>
            {state.editingFeature && (

                <p>

                    <strong>
                        Editing Feature:
                    </strong>

                    {' '}

                    {
                        state.editingFeature.id
                    }

                </p>

            )}
            {isEditing && <DynamicAttributeEditor />}

        </div>
    )
}
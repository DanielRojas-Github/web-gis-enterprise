import {
    registerTools,
} from '@/gis/tools/registerTools'

import {
    registerRepositories,
} from '@/gis/services/persistence/repositories/registerRepositories'



export const bootstrapGIS = () => {

    console.log(
        'BOOTSTRAPPING GIS...'
    )

    registerTools()

    registerRepositories()

    console.log(
        'GIS BOOTSTRAP COMPLETED'
    )
}
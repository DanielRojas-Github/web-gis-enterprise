export function parsePropertyNames(
    propertyName
) {

    if (!propertyName) {

        return null;

    }


    return propertyName
        .split(",")
        .map(
            (property) =>
                property.trim()
        );

}


export function buildGeoServerQuery(
    query,
    allowedProperties,
    allowedFilterFields = []
) {

    const geoserverQuery = {
        ...query,
    };


    const requestedProperties =
        parsePropertyNames(
            query.propertyName
        );
    const cqlFilter =
        buildCqlFilter(
            query.filter,
            allowedFilterFields
        );


    if (cqlFilter) {

        geoserverQuery.cqlFilter =
            cqlFilter;

    }


    delete geoserverQuery.filter;

    if (!requestedProperties) {

        return geoserverQuery;

    }


    const properties =
        requestedProperties
            .filter(
                (property) =>
                    allowedProperties
                        .includes(
                            property
                        )
            );


    if (
        !properties.includes(
            "geom"
        )
    ) {

        properties.push(
            "geom"
        );

    }


    geoserverQuery.propertyName =
        properties.join(",");


    return geoserverQuery;

}
export function buildCqlFilter(
    filter,
    allowedFields
) {

    if (!filter) {

        return null;

    }


    const separatorIndex =
        filter.indexOf(":");


    const field =
        filter
            .slice(
                0,
                separatorIndex
            )
            .trim();


    const value =
        filter
            .slice(
                separatorIndex + 1
            )
            .trim();


    if (
        !allowedFields.includes(
            field
        )
    ) {

        return null;

    }


    const escapedValue =
        value.replace(
            /'/g,
            "''"
        );


    return `${field}='${escapedValue}'`;

}
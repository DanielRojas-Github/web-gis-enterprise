const ALLOWED_FILTER_FIELDS = [
  "id",
  "name",
  "description",
];
export function validateWfsQuery(
  request
) {

  const errors = [];

  const {
    bbox,
    count,
    startIndex,
    sortBy,
    propertyName,
    filter,
  } = request.query;


  if (
    bbox !== undefined
  ) {

    if (
      typeof bbox !== "string"
    ) {

      errors.push(
        "bbox must be a string"
      );

    } else {

      const coordinates =
        bbox
          .split(",")
          .map(
            (value) =>
              Number(value)
          );


      const isValidBbox =
        coordinates.length === 4 &&
        coordinates.every(
          (value) =>
            Number.isFinite(
              value
            )
        );


      if (!isValidBbox) {

        errors.push(
          "bbox must contain four numeric coordinates"
        );

      } else {

        const [
          minX,
          minY,
          maxX,
          maxY,
        ] =
          coordinates;


        if (
          minX >= maxX ||
          minY >= maxY
        ) {

          errors.push(
            "bbox minimum coordinates must be smaller than maximum coordinates"
          );

        }

      }

    }

  }


  if (
    count !== undefined
  ) {

    const parsedCount =
      Number(count);


    if (
      !Number.isInteger(
        parsedCount
      ) ||
      parsedCount < 1 ||
      parsedCount > 1000
    ) {

      errors.push(
        "count must be an integer between 1 and 1000"
      );

    }

  }


  if (
    startIndex !== undefined
  ) {

    const parsedStartIndex =
      Number(
        startIndex
      );


    if (
      !Number.isInteger(
        parsedStartIndex
      ) ||
      parsedStartIndex < 0
    ) {

      errors.push(
        "startIndex must be an integer greater than or equal to 0"
      );

    }

  }


  if (
    sortBy !== undefined
  ) {

    if (
      typeof sortBy !== "string" ||
      !/^[a-zA-Z_][a-zA-Z0-9_]*(\s+[AD])?$/
        .test(sortBy)
    ) {

      errors.push(
        "sortBy has an invalid format"
      );

    }

  }


  if (
    propertyName !== undefined
  ) {

    if (
      typeof propertyName !== "string"
    ) {

      errors.push(
        "propertyName must be a string"
      );

    } else {

      const properties =
        propertyName
          .split(",")
          .map(
            (property) =>
              property.trim()
          );


      const hasInvalidProperty =
        properties.some(
          (property) =>
            !/^[a-zA-Z_][a-zA-Z0-9_]*$/
              .test(property)
        );


      if (
        hasInvalidProperty
      ) {

        errors.push(
          "propertyName contains an invalid property"
        );

      }

    }

  }

if (
  filter !== undefined
) {

  if (
    typeof filter !== "string"
  ) {

    errors.push(
      "filter must be a string"
    );

  } else {

    const separatorIndex =
      filter.indexOf(":");


    if (
      separatorIndex <= 0 ||
      separatorIndex ===
        filter.length - 1
    ) {

      errors.push(
        "filter must use field:value format"
      )
      ;

    }else {

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
        !ALLOWED_FILTER_FIELDS
          .includes(
            field
          )
      ) {

        errors.push(
          "Unsupported filter field"
        );

      }


      if (!value) {

        errors.push(
          "filter value cannot be empty"
        );

      }

    }

  }

  }

  return errors;

}
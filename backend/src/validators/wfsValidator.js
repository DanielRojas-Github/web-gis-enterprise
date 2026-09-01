export function validateWfsQuery(
  request
) {

  const errors = [];

  const {
    typeName,
  } = request.query;


  if (
    typeName !== undefined &&
    typeof typeName !== "string"
  ) {

    errors.push(
      "typeName must be a string"
    );

  }


  if (
    typeName !== undefined &&
    typeName !== "roads"
  ) {

    errors.push(
      "Unsupported typeName"
    );

  }


  return errors;

}
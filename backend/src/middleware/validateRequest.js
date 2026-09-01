import {
  AppError,
} from "../errors/AppError.js";


export const validateRequest = (
  validator
) => {

  return (
    request,
    response,
    next
  ) => {

    const errors =
      validator(request);

    if (
      errors &&
      errors.length > 0
    ) {

      throw new AppError(
        errors.join(", "),
        400,
        "VALIDATION_ERROR"
      );

    }

    next();

  };

};
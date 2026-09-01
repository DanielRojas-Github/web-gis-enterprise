export const errorHandler = (
  error,
  request,
  response,
  next
) => {

  const statusCode =
    error.statusCode || 500;

  const code =
    error.code ||
    "INTERNAL_SERVER_ERROR";

  const message =
    error.message ||
    "Internal server error";


  return response
    .status(statusCode)
    .json({

      success: false,

      error: {
        code,
        message,
      },

    });

};
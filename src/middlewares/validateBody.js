import createHttpError from 'http-errors';

export function validateBody(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      const errors = error.details.map((detail) => detail.message);
      console.error('Joi validation error:', error);

      next(createHttpError.BadRequest(errors.join(', ')));
    }
  };
}

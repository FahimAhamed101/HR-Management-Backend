import type { RequestHandler } from 'express';
import type Joi from 'joi';

export const validate =
  (schema: Joi.ObjectSchema): RequestHandler =>
  (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map((detail) => detail.message),
      });
    }

    req.body = value;
    return next();
  };

import Joi from 'joi';

const baseSchema = Joi.object({
  name: Joi.string().min(2).required(),
  age: Joi.number().integer().min(16).required(),
  designation: Joi.string().min(2).required(),
  hiring_date: Joi.date().required(),
  date_of_birth: Joi.date().required(),
  salary: Joi.number().precision(2).required(),
});

export const employeeCreateSchema = baseSchema;

export const employeeUpdateSchema = baseSchema
  .fork(['name', 'age', 'designation', 'hiring_date', 'date_of_birth', 'salary'], (schema) =>
    schema.optional(),
  )
  .min(1);

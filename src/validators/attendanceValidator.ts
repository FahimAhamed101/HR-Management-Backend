import Joi from 'joi';

const timePattern = /^\d{2}:\d{2}(:\d{2})?$/;
const checkInSchema = Joi.alternatives().try(Joi.date(), Joi.string().pattern(timePattern));

export const attendanceCreateSchema = Joi.object({
  employee_id: Joi.number().integer().required(),
  date: Joi.date().required(),
  check_in_time: checkInSchema.required(),
});

export const attendanceUpdateSchema = Joi.object({
  date: Joi.date().optional(),
  check_in_time: checkInSchema.optional(),
}).min(1);

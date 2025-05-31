import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^\+?[0-9]{3,20}$/)
    .required(),
  email: Joi.string().min(3).max(20).email().optional(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .default('personal'),
  isFavourite: Joi.boolean().default(false),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^\+?[0-9]{3,20}$/),
  email: Joi.string().min(3).max(20).email(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
  isFavourite: Joi.boolean(),
}).min(1);

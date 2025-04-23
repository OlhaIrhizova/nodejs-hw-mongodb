import Joi from 'joi';
import { typeList } from '../constants/contacts.js';



export const contactAddShema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        "any.required" : "Name is a required field"
    }),
    phoneNumber: Joi.string().pattern(/^[0-9+\-\s()]{7,20}$/).required().messages({
        "any.required" : "Phone number is a required field"
    }),
    email: Joi.string().email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...typeList),

});

export const contactUpdateShema = Joi.object({
    name: Joi.string().min(3).max(30),
    phoneNumber: Joi.string().min(3).max(30).pattern(/^[0-9+\-\s()]{7,20}$/),
    email: Joi.string().email().min(3).max(30),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...typeList),

});
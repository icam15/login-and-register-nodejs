import Joi from "joi";

const registerValidation = Joi.object({
    email: Joi.string().max(300).required(),
    name: Joi.string().max(100).required(),
    password: Joi.string().max(10).required()
});

const loginValidation = Joi.object({
    email: Joi.string().max(300).required(),
    password: Joi.string().max(100).required()
});

const getUserValidation = Joi.string().max(300).required();

export {
    registerValidation,
    loginValidation,
    getUserValidation
}
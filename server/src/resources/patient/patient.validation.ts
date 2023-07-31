import Joi from 'joi';

const update = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    patronymic: Joi.string(),
    sex: Joi.string(),
    phone: Joi.string(),
    birthDate: Joi.date().iso(),
});

const adminCreate = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    patronymic: Joi.string(),
    sex: Joi.string(),
    phone: Joi.string(),
    birthDate: Joi.date().iso(),
});

const adminUpdate = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    patronymic: Joi.string(),
    sex: Joi.string(),
    phone: Joi.string(),
    birthDate: Joi.date().iso(),
});

const adminDelete= Joi.object({
    _id: Joi.string().hex().length(24).required(),
});

const adminFind= Joi.object({
    _id: Joi.string().hex().length(24),
    firstName: Joi.string(),
    lastName: Joi.string(),
    patronymic: Joi.string(),
    sex: Joi.string(),
    phone: Joi.string(),
    birthDate: Joi.date().iso(),
    page: Joi.number(),
    perPage: Joi.number(),
    userId: Joi.string().hex().length(24),
    email: Joi.string()
});


export default {
    update,
    adminCreate,
    adminUpdate,
    adminDelete,
    adminFind
};

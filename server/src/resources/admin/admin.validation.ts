import Joi from 'joi';

const create = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    password_confirmation: Joi.any().equal(Joi.ref('password')).required(),
});

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
});

const remove = Joi.object({
    _id: Joi.string().hex().length(24).required(),
});

const find = Joi.object({
    _id: Joi.string().hex().length(24),
    email: Joi.string().email(),
});

const restoreData = Joi.object({
    backupDate: Joi.date().iso().required(),
  });

export default {
    create,
    login,
    remove,
    find,
    restoreData
};

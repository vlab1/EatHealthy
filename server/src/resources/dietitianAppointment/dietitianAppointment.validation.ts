import Joi from 'joi';

const create = Joi.object({
    patientId: Joi.string().hex().length(24).required(),
});

const update = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    patientId: Joi.string().hex().length(24),
    dietitianId: Joi.string().hex().length(24),
    measurementId: Joi.string().hex().length(24),
    allowedDishes: Joi.array().items({
        _id: Joi.string().hex().length(24).required(),

    }),
    recommendations: Joi.string().min(0),
});

const remove = Joi.object({
    _id: Joi.string().hex().length(24).required(),
});

const find = Joi.object({
    _id: Joi.string().hex().length(24),
    patientId: Joi.string().hex().length(24),
    dietitianId: Joi.string().hex().length(24),
    measurementId: Joi.string().hex().length(24),
    recommendations: Joi.string(),
    patientEmail: Joi.alternatives().try(Joi.string(), Joi.number()),
});
const measurementStatistics = Joi.object({
    patientId: Joi.string().hex().length(24).required(),
});

const measurementPatientStatistics = Joi.object({

});

const adminCreate = Joi.object({
    patientId: Joi.string().hex().length(24).required(),
    dietitianId: Joi.string().hex().length(24).required(),
    measurementId: Joi.string().hex().length(24),
    allowedDishes: Joi.array().items({
        _id: Joi.string().hex().length(24).required(),

    }),
    recommendations: Joi.string(),
});

const adminUpdate = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    patientId: Joi.string().hex().length(24),
    dietitianId: Joi.string().hex().length(24),
    measurementId: Joi.string().hex().length(24),
    allowedDishes: Joi.array().items({
        _id: Joi.string().hex().length(24).required(),
   
    }),
    recommendations: Joi.string(),
});

const adminDelete = Joi.object({
    _id: Joi.string().hex().length(24).required(),
});

const adminFind = Joi.object({
    _id: Joi.string().hex().length(24),
});

export default {
    create,
    update,
    remove,
    find,
    measurementStatistics,
    adminCreate,
    adminUpdate,
    adminDelete,
    adminFind,
    measurementPatientStatistics
};

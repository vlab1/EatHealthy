import Joi from 'joi';

const buyAttempt = Joi.object({
    product: Joi.string()
        .valid('Patients', 'EatingPlaces', 'Dietitians')
        .required(),
    price: Joi.number().required()
});

const adminDelete= Joi.object({
    _id: Joi.string().hex().length(24).required(),
});

const adminFind= Joi.object({
    _id: Joi.string().hex().length(24),
    userId: Joi.string().hex().length(24),
});


export default {
    buyAttempt,
    adminDelete,
    adminFind
};

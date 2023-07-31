import Joi from 'joi';

const update = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    contactFirstName: Joi.string(),
    contactLastName: Joi.string(),
    contactPatronymic: Joi.string(),
    contactSex: Joi.string(),
    contactPhone: Joi.string(),
    contactBirthDate: Joi.date().iso(),
    country: Joi.object({en: Joi.string(), uk: Joi.string()}),
    region: Joi.object({en: Joi.string(), uk: Joi.string()}),
    city: Joi.object({en: Joi.string(), uk: Joi.string()}),
    address: Joi.object({en: Joi.string(), uk: Joi.string()}),
    postcode: Joi.alternatives().try(Joi.string(), Joi.number()),
    images: Joi.array().items(Joi.string()),
    name: Joi.string(),
    description: Joi.object({en: Joi.string(), uk: Joi.string()}),
    dailyViews: Joi.number(),
    files: Joi.array().items(Joi.object()),
});

const find = Joi.object({
    _id: Joi.string().hex().length(24),
    contactFirstName: Joi.string(),
    contactLastName: Joi.string(),
    contactPatronymic: Joi.string(),
    contactSex: Joi.string(),
    contactPhone: Joi.string(),
    contactBirthDate: Joi.date().iso(),
    country: Joi.string(),
    region: Joi.string(),
    city: Joi.string(),
    address: Joi.string(),
    postcode: Joi.alternatives().try(Joi.string(), Joi.number()),
    images: Joi.array().items(Joi.string()),
    name: Joi.string(),
    description: Joi.string(),
    dailyViews: Joi.array(),
});

const dailyViews = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    from: Joi.date().iso().required(),
    to: Joi.date().iso().required()
});


const adminCreate = Joi.object({
    contactFirstName: Joi.string(),
    contactLastName: Joi.string(),
    contactPatronymic: Joi.string(),
    contactBirthDate: Joi.date().iso(),
    contactSex: Joi.string(),
    contactPhone: Joi.string(),
    country: Joi.object({en: Joi.string(), uk: Joi.string()}),
    region: Joi.object({en: Joi.string(), uk: Joi.string()}),
    city: Joi.object({en: Joi.string(), uk: Joi.string()}),
    address: Joi.object({en: Joi.string(), uk: Joi.string()}),
    postcode: Joi.alternatives().try(Joi.string(), Joi.number()),
    name: Joi.string(),
    description: Joi.object({en: Joi.string(), uk: Joi.string()}),
    viewsNumber: Joi.number(),
});

const adminUpdate = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    contactFirstName: Joi.string(),
    contactLastName: Joi.string(),
    contactPatronymic: Joi.string(),
    contactSex: Joi.string(),
    contactBirthDate: Joi.date().iso(),
    contactPhone: Joi.string(),
    country: Joi.object({en: Joi.string(), uk: Joi.string()}),
    region: Joi.object({en: Joi.string(), uk: Joi.string()}),
    city: Joi.object({en: Joi.string(), uk: Joi.string()}),
    address: Joi.object({en: Joi.string(), uk: Joi.string()}),
    postcode: Joi.alternatives().try(Joi.string(), Joi.number()),
    images: Joi.array().items(Joi.string()),
    name: Joi.string(),
    description: Joi.object({en: Joi.string(), uk: Joi.string()}),
    viewsNumber: Joi.number(),
    files: Joi.array().items(Joi.object()),
});

const adminDelete= Joi.object({
    _id: Joi.string().hex().length(24).required(),
});

const adminFind= Joi.object({
    _id: Joi.string().hex().length(24),
    contactFirstName: Joi.string(),
    contactLastName: Joi.string(),
    contactPatronymic: Joi.string(),
    contactBirthDate: Joi.date().iso(),
    contactSex: Joi.string(),
    contactPhone: Joi.string(),
    country: Joi.string(),
    region: Joi.string(),
    city: Joi.string(),
    address: Joi.string(),
    postcode: Joi.alternatives().try(Joi.string(), Joi.number()),
    images: Joi.array().items(Joi.string()),
    name: Joi.string(),
    description: Joi.string(),
    dailyViews: Joi.array(),
    page: Joi.number(),
    perPage: Joi.number(),
    userId: Joi.string().hex().length(24),
    email: Joi.string()
});

export default {
    update,
    find,
    dailyViews,
    adminCreate,
    adminUpdate,
    adminDelete,
    adminFind
};

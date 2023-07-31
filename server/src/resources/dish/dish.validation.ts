import Joi from 'joi';

const create = Joi.object({
    name: Joi.string().required(),
    price: Joi.alternatives().try(
        Joi.number(),
        Joi.string()
    ).required(),
    files: Joi.array().items(Joi.object()),
    description: Joi.object({ en: Joi.string(), uk: Joi.string() }),
    ingredients: Joi.array().items({
        name: Joi.object({ en: Joi.string(), uk: Joi.string() }),
        weight: Joi.string(),
    }),
});

const update = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    name: Joi.string().required(),
    price: Joi.alternatives().try(
        Joi.number(),
        Joi.string()
    ),
    images: Joi.array().items(Joi.string()),
    description: Joi.object({ en: Joi.string(), uk: Joi.string() }),
    userId: Joi.string().hex().length(24),
    ingredients: Joi.array().items({
        name: Joi.object({ en: Joi.string(), uk: Joi.string() }),
        weight: Joi.string(),
    }),
    files: Joi.array().items(Joi.object()),
});

const find = Joi.object({
    _id: Joi.string().hex().length(24),
    name: Joi.string(),
    price: Joi.alternatives().try(
        Joi.number(),
        Joi.string()
    ),
    images: Joi.array().items(Joi.string()),
    description: Joi.string(),
    userId: Joi.string().hex().length(24),
    ingredients: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ),
    country: Joi.string(),
    region: Joi.string(),
    city: Joi.string(),
    eatingPlaceName: Joi.string(),
    eatingPlaceId: Joi.string().hex().length(24),
    userUserId: Joi.string().hex().length(24),
    minPrice: Joi.number(),
    maxPrice: Joi.number()
});

const remove = Joi.object({
    _id: Joi.string().hex().length(24).required(),
});

const adminCreate = Joi.object({
    name: Joi.string().required(),
    userId: Joi.string().hex().length(24).required(),
    price: Joi.alternatives().try(
        Joi.number(),
        Joi.string()
    ).required(),
    files: Joi.array().items(Joi.object()),
    description: Joi.object({ en: Joi.string(), uk: Joi.string() }),
    ingredients: Joi.array().items({
        name: Joi.object({ en: Joi.string(), uk: Joi.string() }),
        weight: Joi.string(),
    }),
});

const adminUpdate = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    name: Joi.string().required(),
    price: Joi.alternatives().try(
        Joi.number(),
        Joi.string()
    ),
    images: Joi.array().items(Joi.string()),
    description: Joi.object({ en: Joi.string(), uk: Joi.string() }),
    userId: Joi.string().hex().length(24).required(),
    ingredients: Joi.array().items({
        name: Joi.object({ en: Joi.string(), uk: Joi.string() }),
        weight: Joi.string(),
    }),
    files: Joi.array().items(Joi.object()),
});

const adminDelete= Joi.object({
    _id: Joi.string().hex().length(24).required(),
});

const adminFind= Joi.object({
    _id: Joi.string().hex().length(24),
    name: Joi.string(),
    price: Joi.alternatives().try(
        Joi.number(),
        Joi.string()
    ),
    images: Joi.array().items(Joi.string()),
    description: Joi.string(),
    userId: Joi.string().hex().length(24),
    ingredients: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ),
    country: Joi.string(),
    region: Joi.string(),
    city: Joi.string(),
    eatingPlaceName: Joi.string(),
    eatingPlaceId: Joi.string().hex().length(24),
    userUserId: Joi.string().hex().length(24),
    minPrice: Joi.number(),
    maxPrice: Joi.number()
});

export default {
    create,
    update,
    find,
    remove,
    adminCreate,
    adminDelete,
    adminUpdate,
    adminFind
};

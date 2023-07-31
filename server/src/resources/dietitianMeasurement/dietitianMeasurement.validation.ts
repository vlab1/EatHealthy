import Joi from 'joi';

const create = Joi.object({
    totalCholesterol: Joi.number().required(),
    hdlCholesterol: Joi.number().required(),
    vldlCholesterol: Joi.number().required(),
    ldlCholesterol: Joi.number().required(),
    warnings: Joi.array()
        .items({
            description: Joi.object({
                en: Joi.string(),
                uk: Joi.string(),
            }).required(),
        })
        .required(),
    cholesterolNorms: Joi.object({
        totalCholesterolMin: Joi.number(),
        totalCholesterolMax: Joi.number(),
        hdlCholesterolMin: Joi.number(),
        hdlCholesterolMax: Joi.number(),
        vldlCholesterolMin: Joi.number(),
        vldlCholesterolMax: Joi.number(),
        ldlCholesterolMin: Joi.number(),
        ldlCholesterolMax: Joi.number(),
    }).required(),
});

const update = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    totalCholesterol: Joi.number(),
    hdlCholesterol: Joi.number(),
    vldlCholesterol: Joi.number(),
    ldlCholesterol: Joi.number(),
    warnings: Joi.array().items({
        description: Joi.object({ en: Joi.string(), uk: Joi.string() }),
    }),
    cholesterolNorms: Joi.object({
        totalCholesterolMin: Joi.number(),
        totalCholesterolMax: Joi.number(),
        hdlCholesterolMin: Joi.number(),
        hdlCholesterolMax: Joi.number(),
        vldlCholesterolMin: Joi.number(),
        vldlCholesterolMax: Joi.number(),
        ldlCholesterolMin: Joi.number(),
        ldlCholesterolMax: Joi.number(),
    }),
});

const remove = Joi.object({
    _id: Joi.string().hex().length(24).required(),
});

const find = Joi.object({
    _id: Joi.string().hex().length(24),
});

const adminCreate = Joi.object({
    totalCholesterol: Joi.number().required(),
    hdlCholesterol: Joi.number().required(),
    vldlCholesterol: Joi.number().required(),
    ldlCholesterol: Joi.number().required(),
    warnings: Joi.array()
        .items({
            description: Joi.object({
                en: Joi.string(),
                uk: Joi.string(),
            }).required(),
        })
        .required(),
    cholesterolNorms: Joi.object({
        totalCholesterolMin: Joi.number(),
        totalCholesterolMax: Joi.number(),
        hdlCholesterolMin: Joi.number(),
        hdlCholesterolMax: Joi.number(),
        vldlCholesterolMin: Joi.number(),
        vldlCholesterolMax: Joi.number(),
        ldlCholesterolMin: Joi.number(),
        ldlCholesterolMax: Joi.number(),
    }).required(),
});

const adminUpdate = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    totalCholesterol: Joi.number(),
    hdlCholesterol: Joi.number(),
    vldlCholesterol: Joi.number(),
    ldlCholesterol: Joi.number(),
    warnings: Joi.array().items({
        description: Joi.object({ en: Joi.string(), uk: Joi.string() }),
    }),
    cholesterolNorms: Joi.object({
        totalCholesterolMin: Joi.number(),
        totalCholesterolMax: Joi.number(),
        hdlCholesterolMin: Joi.number(),
        hdlCholesterolMax: Joi.number(),
        vldlCholesterolMin: Joi.number(),
        vldlCholesterolMax: Joi.number(),
        ldlCholesterolMin: Joi.number(),
        ldlCholesterolMax: Joi.number(),
    }),
});

const adminDelete = Joi.object({
    _id: Joi.string().hex().length(24).required(),
});

const adminFind = Joi.object({
    _id: Joi.string().hex().length(24),
});

const IoTCreate = Joi.object({
    appointmentId: Joi.string().hex().length(24).required(),
    totalCholesterol: Joi.number().required(),
    hdlCholesterol: Joi.number().required(),
    vldlCholesterol: Joi.number().required(),
    ldlCholesterol: Joi.number().required(),
    warnings: Joi.array()
        .items({
            description: Joi.object({
                en: Joi.string(),
                uk: Joi.string(),
            }).required(),
        })
        .required(),
    cholesterolNorms: Joi.object({
        totalCholesterolMin: Joi.number(),
        totalCholesterolMax: Joi.number(),
        hdlCholesterolMin: Joi.number(),
        hdlCholesterolMax: Joi.number(),
        vldlCholesterolMin: Joi.number(),
        vldlCholesterolMax: Joi.number(),
        ldlCholesterolMin: Joi.number(),
        ldlCholesterolMax: Joi.number(),
    }).required(),
});

export default {
    create,
    update,
    remove,
    find,
    adminCreate,
    adminUpdate,
    adminDelete,
    adminFind,
    IoTCreate,
};

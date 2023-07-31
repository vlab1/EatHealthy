import Joi from 'joi';

const register = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    password_confirmation: Joi.any().equal(Joi.ref('password')).required(),
});

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
});

const googleLogin = Joi.object({
    email: Joi.string().email().required(),
    passwordGoogle: Joi.string().min(6).required(),
});

const update = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(3),
    emailActivationLink: Joi.string(),
    emailIsActivated: Joi.boolean(),
    profileId: Joi.string().hex().length(24),
    profileModel: Joi.string(),
    passwordGoogle: Joi.string().min(3),
});

const updatePassword = Joi.object({
    password: Joi.string().min(6).required(),
    new_password: Joi.string().min(6).required(),
});

const emailActivate = Joi.object({
    emailActivationLink: Joi.string().required(),
});

const updateProfileModel = Joi.object({
    product: Joi.string()
        .valid('EatingPlaces', 'Dietitians')
        .required(),
    key: Joi.string().min(100).max(100).required(),
});


const getUserProfile = Joi.object({
    _id: Joi.string().hex().length(24).required(),
});


const adminCreate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    profileModel: Joi.string().valid('EatingPlaces', 'Dietitians', 'Patients').required(),
});

const adminUpdate = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    emailIsActivated: Joi.boolean(),
    profileId: Joi.string().hex().length(24),
    profileModel: Joi.string().valid('EatingPlaces', 'Dietitians', 'Patients'),
});

const adminDelete= Joi.object({
    _id: Joi.string().hex().length(24).required(),
});

const adminFind= Joi.object({
    _id: Joi.string().hex().length(24),
    email: Joi.string(),
    emailIsActivated: Joi.boolean(),
    profileId: Joi.string().hex().length(24),
    profileModel: Joi.string(),
    page: Joi.number(),
    perPage: Joi.number()
});

const dietitianFind= Joi.object({
    _id: Joi.string().hex().length(24),
    email: Joi.string(),
});



export default {
    updateProfileModel,
    register,
    login,
    googleLogin,
    update,
    updatePassword,
    emailActivate,
    getUserProfile,
    adminCreate,
    adminUpdate,
    adminDelete,
    adminFind,
    dietitianFind
};

import { AnyObject, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import User from '@/resources/user/user.interface';
import RefreshTokenModel from '@/resources/refreshToken/refreshToken.model';
import PaymentModel from '@/resources/payment/payment.model';
import EatingPlaceModel from '@/resources/eatingPlace/eatingPlace.model';
import FileService from '@/resources/file/file.service';
import DietitianModel from '@/resources/dietitian/dietitian.model';
import DishModel from '@/resources/dish/dish.model';
import DietitianAppointmentModel from '@/resources/dietitianAppointment/dietitianAppointment.model';

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            trim: true,
        },
        emailActivationLink: {
            type: String,
            trim: true,
        },
        emailIsActivated: {
            type: Boolean,
            default: false,
        },
        profileModel: {
            type: String,
            trim: true,
            enum: ['Patients', 'EatingPlaces', 'Dietitians'],
        },
        profileId: {
            type: Schema.Types.ObjectId,
            trim: true,
            refPath: 'profileModel',
        },
        passwordGoogle: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

UserSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password') && !this.isModified('passwordGoogle')) {
        return next();
    }
    if (this.password) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
    }
    if (this.passwordGoogle) {
        const hash = await bcrypt.hash(this.passwordGoogle, 10);
        this.passwordGoogle = hash;
    }
    next();
});

UserSchema.pre<User>('findOneAndUpdate', async function (this) {
    const update: any = { ...this.getUpdate() };
    if (update.password) {
        update.password = await bcrypt.hash(update.password, 10);
        this.setUpdate(update);
    }
    if (update.passwordGoogle) {
        update.passwordGoogle = await bcrypt.hash(update.passwordGoogle, 10);
        this.setUpdate(update);
    }
});

UserSchema.methods.isValidPassword = async function (
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.isValidPasswordGoogle = async function (
    passwordGoogle: string
): Promise<Error | boolean> {
    return await bcrypt.compare(
        passwordGoogle,
        this.passwordGoogle ? this.passwordGoogle : ''
    );
};

UserSchema.post('findOneAndDelete', async function (result, next) {
    const fileService = new FileService();
    await RefreshTokenModel.deleteMany({ accountId: result._id });
    await PaymentModel.deleteMany({ userId: result._id });
    await EatingPlaceModel.deleteMany({ _id: result.profileId });
    await DietitianModel.deleteMany({ _id: result.profileId });
    await DishModel.deleteMany({ userId: result._id });
    await DietitianAppointmentModel.deleteMany({patientId: result._id});
    await DietitianAppointmentModel.deleteMany({dietitianId: result._id});
    fileService.deleteDirectory(
        fileService.generateDirectory(result.profileModel, result._id)
    );
    fileService.deleteDirectory(
        fileService.generateDirectory('Dishes', result._id)
    );
    next();
});

export default model<User>('Users', UserSchema);

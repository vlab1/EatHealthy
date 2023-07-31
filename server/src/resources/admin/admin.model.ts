import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import Admin from '@/resources/user/user.interface';
import RefreshTokenModel from '../refreshToken/refreshToken.model';

const AdminSchema = new Schema(
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
    },
    { timestamps: true }
);

AdminSchema.pre<Admin>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    if (this.password) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
    }
    next();
});

AdminSchema.pre<Admin>('findOneAndUpdate', async function (this) {
    const update: any = { ...this.getUpdate() };
    if (update.password) {
        update.password = await bcrypt.hash(update.password, 10);
        this.setUpdate(update);
    }
});

AdminSchema.methods.isValidPassword = async function (
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
};

AdminSchema.post('findOneAndDelete', async function (result, next) {
    await RefreshTokenModel.deleteMany({ accountId: result._id });
    next();
});

export default model<Admin>('Admins', AdminSchema);

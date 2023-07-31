import { Schema, model } from 'mongoose';
import RefreshToken from '@/resources/refreshToken/refreshToken.interface';

const RefreshTokenSchema = new Schema(
    {
        accountModel: {
            type: String,
            required: true,
            enum: ['Users', 'Admins'],
        },
        accountId: {
            type: Schema.Types.ObjectId,
            refPath: 'userModel',
        },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model<RefreshToken>('Tokens', RefreshTokenSchema);

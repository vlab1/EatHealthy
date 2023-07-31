import { Schema } from 'mongoose';

interface RefreshToken extends Object {
    accountId: Schema.Types.ObjectId;
    refreshToken: string;
    accountModel: string;
}

export default RefreshToken;

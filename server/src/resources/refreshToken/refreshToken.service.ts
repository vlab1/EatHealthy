import { Schema } from 'mongoose';
import RefreshTokenModel from '@/resources/refreshToken/refreshToken.model';
import token from '@/utils/token';
import Token from '@/utils/interfaces/token.interface';
import jwt from 'jsonwebtoken';

class RefreshTokenService {
    private refreshToken = RefreshTokenModel;

    public async create(
        accountId: Schema.Types.ObjectId,
        accountModel: string
    ): Promise<string | Error> {
        try {
            const refreshToken = token.createRefreshToken(accountId);

            const tokenData = await this.refreshToken.findOne({
                accountId: accountId,
                accountModel: accountModel,
            });

            if (tokenData) {
                tokenData.refreshToken = refreshToken;
                tokenData.accountId = accountId;
                await tokenData.save();
                return refreshToken;
            }

            const createdRefreshToken = await this.refreshToken.create({
                accountId,
                refreshToken,
                accountModel,
            });

            if (!createdRefreshToken) {
                throw new Error('Unable to create token');
            }

            return refreshToken;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async delete(
        refreshToken: string
    ): Promise<{ deletedCount: number } | Error> {
        try {
            const tokenData = await this.refreshToken.deleteOne({
                refreshToken,
            });

            return tokenData;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async refresh(refreshToken: string): Promise<string | Error> {
        try {
            if (!refreshToken) {
                throw new Error('Unauthorised');
            }

            const tokenData = await this.refreshToken.findOne({ refreshToken });

            if (!tokenData) {
                throw new Error('Unauthorised');
            }

            const payloadVerifyRefreshToken: Token | jwt.JsonWebTokenError =
                await token.verifyRefreshToken(refreshToken);

            if (
                payloadVerifyRefreshToken instanceof jwt.JsonWebTokenError ||
                !payloadVerifyRefreshToken
            ) {
                throw new Error('Unauthorised');
            }

            const accessToken = token.createAccessToken(tokenData.accountId);

            return accessToken;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default RefreshTokenService;

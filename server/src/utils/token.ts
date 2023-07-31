import jwt from 'jsonwebtoken';
import Token from '@/utils/interfaces/token.interface';
import { ObjectId } from 'mongoose';

export const createAccessToken = (accountId: ObjectId): string => {
    return jwt.sign(
        { id: accountId },
        process.env.JWT_ACCESS_SECRET as jwt.Secret,
        {
            expiresIn: process.env.JWT_ACCESS_SECRET_LIFETIME,
        }
    );
};

export const createRefreshToken = (accountId: ObjectId): string => {
    return jwt.sign(
        { id: accountId },
        process.env.JWT_REFRESH_SECRET as jwt.Secret,
        {
            expiresIn: process.env.JWT_REFRESH_SECRET_LIFETIME,
        }
    );
};

export const verifyAccessToken = async (
    accessToken: string
): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_SECRET as jwt.Secret,
            (err, payload) => {
                if (err) {
                    return reject(err);
                }
                resolve(payload as Token);
            }
        );
    });
};

export const verifyRefreshToken = async (
    refreshToken: string
): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET as jwt.Secret,
            (err, payload) => {
                if (err) {
                    return reject(err);
                }
                resolve(payload as Token);
            }
        );
    });
};


export default { createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken };

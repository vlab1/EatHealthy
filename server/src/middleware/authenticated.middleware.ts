import { Request, Response, NextFunction } from 'express';
import token from '@/utils/token';
import UserModel from '@/resources/user/user.model';
import AdminModel from '@/resources/admin/admin.model';
import Token from '@/utils/interfaces/token.interface';
import HttpException from '@/utils/exceptions/http.exception';
import jwt from 'jsonwebtoken';

async function authenticatedUserMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'Unauthorised'));
    }

    const accessToken = bearer.split('Bearer ')[1].trim();

    if (!accessToken || accessToken.length <= 0) {
        return next(new HttpException(401, 'Unauthorised'));
    }

    try {
        const payloadVerifyAccessToken: Token | jwt.JsonWebTokenError =
            await token.verifyAccessToken(accessToken);

        if (payloadVerifyAccessToken instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'Unauthorised'));
        }

        const user = await UserModel.findById(payloadVerifyAccessToken.id)
            .select(['-password', '-passwordGoogle'])
            .populate({
                path: 'profileId',
                populate: { path: '_id' },
            })
            .exec();

        if (!user) {
            return next(new HttpException(401, 'Unauthorised'));
        }

        req.user = user;

        return next();
    } catch (error: any) {
        return next(new HttpException(401, error.message));
    }
}

async function authenticatedAdminMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'Unauthorised'));
    }
    const accessToken = bearer.split('Bearer ')[1].trim();

    if (!accessToken) {
        return next(new HttpException(401, 'Unauthorised'));
    }

    try {
        const payloadVerifyAccessToken: Token | jwt.JsonWebTokenError =
            await token.verifyAccessToken(accessToken);

        if (payloadVerifyAccessToken instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'Unauthorised'));
        }

        const admin = await AdminModel.findById(
            payloadVerifyAccessToken.id
        ).select(['-password', '-passwordGoogle']);

        if (!admin) {
            return next(new HttpException(401, 'Unauthorised'));
        }

        req.admin = admin;

        return next();
    } catch (error: any) {
        return next(new HttpException(401, error.message));
    }
}

async function authenticatedUserOrAdminMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'Unauthorised'));
    }

    const accessToken = bearer.split('Bearer ')[1].trim();

    if (!accessToken || accessToken.length <= 0) {
        return next(new HttpException(401, 'Unauthorised'));
    }

    try {
        const payloadVerifyAccessToken: Token | jwt.JsonWebTokenError =
            await token.verifyAccessToken(accessToken);

        if (payloadVerifyAccessToken instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'Unauthorised'));
        }

        const user = await UserModel.findById(payloadVerifyAccessToken.id)
            .select(['-password', '-passwordGoogle'])
            .populate({
                path: 'profileId',
                populate: { path: '_id' },
            })
            .exec();

        const admin = await AdminModel.findById(
            payloadVerifyAccessToken.id
        ).select(['-password', '-passwordGoogle']);

        if (user) {
            req.user = user;
        } else if (admin) {
            req.admin = admin;
        } else {
            return next(new HttpException(401, 'Unauthorised'));
        }

        return next();
    } catch (error: any) {
        return next(new HttpException(401, error.message));
    }
}

export {
    authenticatedUserMiddleware,
    authenticatedAdminMiddleware,
    authenticatedUserOrAdminMiddleware,
};

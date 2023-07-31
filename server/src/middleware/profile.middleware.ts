import { Request, Response, NextFunction } from 'express';
import token from '@/utils/token';
import UserModel from '@/resources/user/user.model';
import Token from '@/utils/interfaces/token.interface';
import HttpException from '@/utils/exceptions/http.exception';
import jwt from 'jsonwebtoken';
import { Schema } from 'mongoose';

async function profilePatientsMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const user = req.user;
    if (!user) {
        return next(new HttpException(401, 'Unauthorised'));
    }
    try {
        if (req.user.profileModel !== 'Patients') {
            return next(new HttpException(401, 'No users model'));
        }

        if (
            (req.user.profileId instanceof Schema.Types.ObjectId) &&
            req.user.profileId.toString() !== req.properties._id.toString()
        ) {
            return next(new HttpException(401, 'No users model'));
        }

        return next();
    } catch (error: any) {
        return next(new HttpException(401, error.message));
    }
}

async function profileEatingPlacesMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const user = req.user;
    if (!user) {
        return next(new HttpException(401, 'Unauthorised'));
    }
    try {
        if (req.user.profileModel !== 'EatingPlaces') {
            return next(new HttpException(401, 'No eating places model'));
        }

        if (
            (req.user.profileId instanceof Schema.Types.ObjectId) &&
            req.user.profileId.toString() !== req.properties._id.toString()
        ) {
            return next(new HttpException(401, 'No users model'));
        }

        return next();
    } catch (error: any) {
        return next(new HttpException(401, error.message));
    }
}

async function profileDietitiansMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const user = req.user;
    if (!user) {
        return next(new HttpException(401, 'Unauthorised'));
    }
    try {
        if (req.user.profileModel !== 'Dietitians') {
            return next(new HttpException(401, 'No dietitians model'));
        }

     if (
            (req.user.profileId instanceof Schema.Types.ObjectId) &&
            req.user.profileId.toString() !== req.properties._id.toString()
        ) {
            return next(new HttpException(401, 'No users model'));
        }

        return next();
    } catch (error: any) {
        return next(new HttpException(401, error.message));
    }
}

export {
    profilePatientsMiddleware,
    profileEatingPlacesMiddleware,
    profileDietitiansMiddleware,
};

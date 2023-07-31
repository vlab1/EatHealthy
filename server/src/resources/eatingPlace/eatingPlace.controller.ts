import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import EatingPlaceService from '@/resources/eatingPlace/eatingPlace.service';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/eatingPlace/eatingPlace.validation';
import { authenticatedUserMiddleware, authenticatedAdminMiddleware } from '@/middleware/authenticated.middleware';
import { profileEatingPlacesMiddleware } from '@/middleware/profile.middleware';
import { Schema } from 'mongoose';
import upload from '@/utils/multer/multer';
import Patient from '@/resources/patient/patient.interface';
import EatingPlace from '@/resources/eatingPlace/eatingPlace.interface';
import Dietitian from '@/resources/dietitian/dietitian.interface';

class EatingPlaceController implements Controller {
    public path = '/eating-place';
    public router = Router();
    private EatingPlaceService = new EatingPlaceService();


    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            authenticatedUserMiddleware,
            this.create
        );
        this.router.put(
            `${this.path}/update`,
            upload.array('files'),
            validationMiddleware(validate.update),
            authenticatedUserMiddleware,
            profileEatingPlacesMiddleware,
            this.update
        );
        this.router.get(
            `${this.path}/find`,
            validationMiddleware(validate.find),
            this.find
        );
        this.router.get(
            `${this.path}/daily-views`,
            validationMiddleware(validate.dailyViews),
            authenticatedUserMiddleware,
            profileEatingPlacesMiddleware,
            this.dailyViews
        );

        this.router.post(
            `${this.path}/admin/create`,
            upload.array('files'),
            validationMiddleware(validate.adminCreate),
            authenticatedAdminMiddleware,
            this.adminCreate
        );
        this.router.put(
            `${this.path}/admin/update`,
            upload.array('files'),
            validationMiddleware(validate.adminUpdate),
            authenticatedAdminMiddleware,
            this.adminUpdate
        );
        this.router.delete(
            `${this.path}/admin/delete`,
            validationMiddleware(validate.adminDelete),
            authenticatedAdminMiddleware,
            this.adminDelete
        );
        this.router.get(
            `${this.path}/admin/find`,
            validationMiddleware(validate.adminFind),
            authenticatedAdminMiddleware,
            this.adminFind
        );
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }

            const eatingPlace = await this.EatingPlaceService.create();

            res.status(201).json({ data: eatingPlace });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private update = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const userId = req.user._id;
            const userProfile = req.user.profileId as Patient | EatingPlace | Dietitian;
            const userPorfileId = userProfile._id as Schema.Types.ObjectId;

            const {
                _id,
                contactFirstName,
                contactLastName,
                contactPatronymic,
                contactSex,
                contactPhone,
                country,
                region,
                city,
                address,
                postcode,
                images,
                name,
                description,
                dailyViews,
                files,
                contactBirthDate
            } = req.properties;

            const eatingPlace = await this.EatingPlaceService.update(
                userPorfileId,
                userId,
                _id,
                contactFirstName,
                contactLastName,
                contactPatronymic,
                contactSex,
                contactPhone,
                country,
                region,
                city,
                address,
                postcode,
                images,
                name,
                description,
                dailyViews,
                files,
                contactBirthDate
            );

            res.status(201).json({ data: eatingPlace });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private find = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const searchOptions = req.properties as {
                [key: string]: any;
            };

            const eatingPlace = await this.EatingPlaceService.find(
                searchOptions
            );

            res.status(201).json({ data: eatingPlace });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private adminFind = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const searchOptions = req.properties as {
                [key: string]: any;
            };

            const eatingPlace = await this.EatingPlaceService.adminFind(
                searchOptions
            );

            res.status(201).json({ data: eatingPlace });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private dailyViews = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const searchOptions = req.properties as {
                [key: string]: any;
            };

            const eatingPlace = await this.EatingPlaceService.dailyViews(
                searchOptions
            );

            res.status(201).json({ data: eatingPlace });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private adminDelete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { _id } = req.properties;

            const eatingPlaceService =
                await this.EatingPlaceService.adminDelete(_id);

            res.status(201).json({ data: eatingPlaceService });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private adminCreate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {
                contactFirstName,
                contactLastName,
                contactPatronymic,
                contactSex,
                contactPhone,
                country,
                region,
                city,
                address,
                postcode,
                name,
                description,
                viewsNumber,
                contactBirthDate
            } = req.properties;

            const eatingPlace= await this.EatingPlaceService.adminCreate(
                contactFirstName,
                contactLastName,
                contactPatronymic,
                contactSex,
                contactPhone,
                country,
                region,
                city,
                address,
                postcode,
                name,
                description,
                viewsNumber,
                contactBirthDate
            );

            res.status(201).json({ data: eatingPlace });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private adminUpdate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {
                _id,
                contactFirstName,
                contactLastName,
                contactPatronymic,
                contactSex,
                contactPhone,
                country,
                region,
                city,
                address,
                postcode,
                images,
                name,
                description,
                viewsNumber,
                files,
                contactBirthDate
            } = req.properties;

            const eatingPlace = await this.EatingPlaceService.adminUpdate(
                _id,
                contactFirstName,
                contactLastName,
                contactPatronymic,
                contactSex,
                contactPhone,
                country,
                region,
                city,
                address,
                postcode,
                images,
                name,
                description,
                viewsNumber,
                files,
                contactBirthDate
            );

            res.status(201).json({ data: eatingPlace });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default EatingPlaceController;

import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import DietitianService from '@/resources/dietitian/dietitian.service';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/dietitian/dietitian.validation';
import { authenticatedUserMiddleware, authenticatedAdminMiddleware } from '@/middleware/authenticated.middleware';
import { profileDietitiansMiddleware } from '@/middleware/profile.middleware';

class DietitianController implements Controller {
    public path = '/dietitian';
    public router = Router();
    private DietitianService = new DietitianService();

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
            validationMiddleware(validate.update),
            authenticatedUserMiddleware,
            profileDietitiansMiddleware,
            this.update
        );

        this.router.post(
            `${this.path}/admin/create`,
            validationMiddleware(validate.adminCreate),
            authenticatedAdminMiddleware,
            this.adminCreate
        );
        this.router.put(
            `${this.path}/admin/update`,
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

            const dietitian = await this.DietitianService.create();

            res.status(201).json({ data: dietitian });
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
            const {
                _id,
                firstName,
                lastName,
                patronymic,
                sex,
                phone,
                birthDate,
            } = req.properties;

            const dietitian = await this.DietitianService.update(
                _id,
                firstName,
                lastName,
                patronymic,
                sex,
                phone,
                birthDate
            );

            res.status(201).json({ data: dietitian });
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
            const { firstName, lastName, patronymic, sex, phone, birthDate } =
                req.properties;

            const dietitian = await this.DietitianService.adminCreate(
                firstName,
                lastName,
                patronymic,
                sex,
                phone,
                birthDate
            );

            res.status(201).json({ data: dietitian });
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
                firstName,
                lastName,
                patronymic,
                sex,
                phone,
                birthDate,
            } = req.properties;

            const dietitian = await this.DietitianService.adminUpdate(
                _id,
                firstName,
                lastName,
                patronymic,
                sex,
                phone,
                birthDate
            );

            res.status(201).json({ data: dietitian });
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

            const dietitian = await this.DietitianService.adminDelete(_id);

            res.status(201).json({ data: dietitian });
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

            const dietitian = await this.DietitianService.adminFind(
                searchOptions
            );

            res.status(201).json({ data: dietitian });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default DietitianController;

import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import DishService from '@/resources/dish/dish.service';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/dish/dish.validation';
import {
    authenticatedUserMiddleware,
    authenticatedAdminMiddleware,
} from '@/middleware/authenticated.middleware';
import upload from '@/utils/multer/multer';

class DishController implements Controller {
    public path = '/dish';
    public router = Router();
    private DishService = new DishService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            upload.array('files'),
            validationMiddleware(validate.create),
            authenticatedUserMiddleware,
            this.create
        );
        this.router.put(
            `${this.path}/update`,
            upload.array('files'),
            validationMiddleware(validate.update),
            authenticatedUserMiddleware,
            this.update
        );
        this.router.get(
            `${this.path}/find`,
            validationMiddleware(validate.find),
            this.find
        );
        this.router.delete(
            `${this.path}/delete`,
            validationMiddleware(validate.remove),
            authenticatedUserMiddleware,
            this.delete
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
            this.find
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
            const { name, price, files, description, ingredients } =
                req.properties;

            const dish = await this.DishService.create(
                name,
                price,
                files,
                description,
                req.user._id,
                ingredients
            );

            res.status(201).json({ data: dish });
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
                name,
                price,
                images,
                description,
                ingredients,
                files,
                userId,
            } = req.properties;

            const dish = await this.DishService.update(
                _id,
                name,
                price,
                images,
                description,
                userId,
                ingredients,
                files,
                req.user._id
            );

            res.status(201).json({ data: dish });
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

            const dish = await this.DishService.find(searchOptions);

            res.status(201).json({ data: dish });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private delete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const { _id } = req.properties;

            const dish = await this.DishService.delete(
                _id,
                req.user._id
            );

            res.status(201).json({ data: dish });
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
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }

            const { name, price, files, description, userId, ingredients } =
                req.properties;

            const dish = await this.DishService.create(
                name,
                price,
                files,
                description,
                userId,
                ingredients
            );

            res.status(201).json({ data: dish });
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
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const {
                _id,
                name,
                price,
                images,
                description,
                ingredients,
                files,
                userId,
            } = req.properties;

            const dish = await this.DishService.adminUpdate(
                _id,
                name,
                price,
                images,
                description,
                userId,
                ingredients,
                files
            );

            res.status(201).json({ data: dish });
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

            const dish = await this.DishService.adminDelete(_id);

            res.status(201).json({ data: dish });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default DishController;

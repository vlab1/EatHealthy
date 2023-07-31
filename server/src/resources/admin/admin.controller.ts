import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/admin/admin.validation';
import AdminService from '@/resources/admin/admin.service';
import { authenticatedAdminMiddleware } from '@/middleware/authenticated.middleware';

class AdminController implements Controller {
    public path = '/admin';
    public router = Router();
    private AdminService = new AdminService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            validationMiddleware(validate.create),
            authenticatedAdminMiddleware,
            this.create
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );
        this.router.delete(
            `${this.path}/delete`,
            validationMiddleware(validate.remove),
            authenticatedAdminMiddleware,
            this.delete
        );
        this.router.get(
            `${this.path}`,
            authenticatedAdminMiddleware,
            this.getMe
        );
        this.router.get(
            `${this.path}/find`,
            validationMiddleware(validate.find),
            authenticatedAdminMiddleware,
            this.find
        );

        this.router.post(`${this.path}/create-backup`, this.createBackup);

        this.router.post(
            `${this.path}/restore-data`,
            validationMiddleware(validate.restoreData),
            this.restoreData
        );

        this.router.get(`${this.path}/get-backups`, this.getAllBackups);
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.properties;

            const admin = await this.AdminService.create(email, password);

            res.status(201).json({ data: admin });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.properties;

            const accessToken = await this.AdminService.login(email, password);

            res.status(200).json({ data: accessToken });
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
            if (!req.admin) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const { _id } = req.properties;
            const adminId = req.admin._id;
            const admin = await this.AdminService.delete(adminId, _id);

            res.status(200).json({ data: admin });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getMe = (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        if (!req.admin) {
            return next(new HttpException(404, 'No logged in'));
        }

        res.status(200).send({ data: req.admin });
    };

    private find = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const properties = req.properties as {
                [key: string]: any;
            };

            const admins = await this.AdminService.find(properties);

            res.status(200).send({ data: admins });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private createBackup = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.AdminService.createBackup();

            res.status(201).json({ message: 'Backup created' });
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    };

    private restoreData = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { backupDate } = req.body;

            await this.AdminService.restoreData(backupDate);

            res.status(201).json({ message: 'Database restored' });
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    };

    private getAllBackups = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const backups = await this.AdminService.getAllBackups();

            res.status(201).json({ data: backups });
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    };
}

export default AdminController;

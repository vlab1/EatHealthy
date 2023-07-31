import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import PatientService from '@/resources/patient/patient.service';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/patient/patient.validation';
import { authenticatedUserMiddleware, authenticatedAdminMiddleware } from '@/middleware/authenticated.middleware';
import { profilePatientsMiddleware } from '@/middleware/profile.middleware';

class PatientController implements Controller {
    public path = '/patient';
    public router = Router();
    private PatientService = new PatientService();

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
            profilePatientsMiddleware,
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

            const patient = await this.PatientService.create();

            res.status(201).json({ data: patient });
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

            const patient = await this.PatientService.update(
                _id,
                firstName,
                lastName,
                patronymic,
                sex,
                phone,
                birthDate,
            );

            res.status(201).json({ data: patient });
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
                firstName,
                lastName,
                patronymic,
                sex,
                phone,
                birthDate,
            } = req.properties;

            const user = await this.PatientService.adminCreate(
                firstName,
                lastName,
                patronymic,
                sex,
                phone,
                birthDate,
            );

            res.status(201).json({ data: user });
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

            const user = await this.PatientService.adminUpdate(
                _id,
                firstName,
                lastName,
                patronymic,
                sex,
                phone,
                birthDate,
            );

            res.status(201).json({ data: user });
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

            const user = await this.PatientService.adminDelete(_id);

            res.status(201).json({ data: user });
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

            const user = await this.PatientService.adminFind(searchOptions);

            res.status(201).json({ data: user });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default PatientController;

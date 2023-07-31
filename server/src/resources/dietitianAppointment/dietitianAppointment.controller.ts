import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import DietitianAppointmentService from '@/resources/dietitianAppointment/dietitianAppointment.service';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/dietitianAppointment/dietitianAppointment.validation';
import { authenticatedUserMiddleware , authenticatedAdminMiddleware} from '@/middleware/authenticated.middleware';
import { profileDietitiansMiddleware, profilePatientsMiddleware } from '@/middleware/profile.middleware';

class DietitianAppointmentController implements Controller {
    public path = '/dietitian-appointment';
    public router = Router();
    private DietitianAppointmentService = new DietitianAppointmentService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            validationMiddleware(validate.create),
            authenticatedUserMiddleware,
            profileDietitiansMiddleware,
            this.create
        );
        this.router.get(
            `${this.path}/measurement-statistics`,
            validationMiddleware(validate.measurementStatistics),
            authenticatedUserMiddleware,
            profileDietitiansMiddleware,
            this.measurementStatistics
        );
        this.router.get(
            `${this.path}/patient/measurement-statistics`,
            validationMiddleware(validate.measurementPatientStatistics),
            authenticatedUserMiddleware,
            profilePatientsMiddleware,
            this.measurementPatientStatistics
        );
        this.router.put(
            `${this.path}/update`,
            validationMiddleware(validate.update),
            authenticatedUserMiddleware,
            profileDietitiansMiddleware,
            this.update
        );
        this.router.delete(
            `${this.path}/delete`,
            validationMiddleware(validate.remove),
            authenticatedUserMiddleware,
            this.delete
        );
        this.router.get(
            `${this.path}/find`,
            validationMiddleware(validate.find),
            authenticatedUserMiddleware,
            this.find
        );
        this.router.get(
            `${this.path}/patient/get`,
            validationMiddleware(validate.find),
            authenticatedUserMiddleware,
            this.myFind
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
            const { patientId } = req.properties;
            const userDietitianId = req.user._id;

            const dietitianAppointment =
                await this.DietitianAppointmentService.create(
                    patientId,
                    userDietitianId
                );

            res.status(201).json({ data: dietitianAppointment });
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
                patientId,
                dietitianId,
                measurementId,
                allowedDishes,
                recommendations,
            } = req.properties;

            const userDietitianId = req.user._id;

            const dietitianAppointment =
                await this.DietitianAppointmentService.update(
                    _id,
                    patientId,
                    dietitianId,
                    measurementId,
                    allowedDishes,
                    recommendations,
                    userDietitianId
                );

            res.status(201).json({ data: dietitianAppointment });
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

            const userDietitianId = req.user._id;

            const dietitianAppointment =
                await this.DietitianAppointmentService.delete(
                    _id,
                    userDietitianId
                );

            res.status(201).json({ data: dietitianAppointment });
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
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const searchOptions = req.properties as {
                [key: string]: any;
            };

            const dietitianAppointment = await this.DietitianAppointmentService.find(
                searchOptions
            );

            res.status(201).json({ data: dietitianAppointment });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private myFind = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const searchOptions = req.properties as {
                [key: string]: any;
            };
            searchOptions.patientId = req.user._id;
            const dietitianAppointment = await this.DietitianAppointmentService.find(
                searchOptions
            );

            res.status(201).json({ data: dietitianAppointment });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private measurementStatistics = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const searchOptions = req.properties as {
                [key: string]: any;
            };

            const dietitianMeasurement =
                await this.DietitianAppointmentService.measurementStatistics(searchOptions);

            res.status(201).json({ data: dietitianMeasurement });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private measurementPatientStatistics = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const searchOptions = req.properties as {
                [key: string]: any;
            };
            searchOptions.patientId = req.user._id;
            
            const dietitianMeasurement =
                await this.DietitianAppointmentService.measurementStatistics(searchOptions);

            res.status(201).json({ data: dietitianMeasurement });
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
            const {
                patientId,
                dietitianId,
                measurementId,
                allowedDishes,
                recommendations,
            } = req.properties;

            const dietitianAppointment =
                await this.DietitianAppointmentService.adminCreate(
                    patientId,
                    dietitianId,
                    measurementId,
                    allowedDishes,
                    recommendations,
                );

            res.status(201).json({ data: dietitianAppointment });
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
                patientId,
                dietitianId,
                measurementId,
                allowedDishes,
                recommendations,
            } = req.properties;

            const dietitianAppointment =
                await this.DietitianAppointmentService.adminUpdate(
                    _id,
                    patientId,
                    dietitianId,
                    measurementId,
                    allowedDishes,
                    recommendations,
                );

            res.status(201).json({ data: dietitianAppointment });
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
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const { _id } = req.properties;

            const dietitianAppointment =
                await this.DietitianAppointmentService.adminDelete(
                    _id,
                );

            res.status(201).json({ data: dietitianAppointment });
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
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const searchOptions = req.properties as {
                [key: string]: any;
            };

            const dietitianAppointment = await this.DietitianAppointmentService.find(
                searchOptions
            );

            res.status(201).json({ data: dietitianAppointment });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default DietitianAppointmentController;

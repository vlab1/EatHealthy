import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import DietitianMeasurementService from '@/resources/dietitianMeasurement/dietitianMeasurement.service';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/dietitianMeasurement/dietitianMeasurement.validation';
import {
    authenticatedUserMiddleware,
    authenticatedAdminMiddleware,
} from '@/middleware/authenticated.middleware';
import { profileDietitiansMiddleware } from '@/middleware/profile.middleware';

class DietitianMeasurementController implements Controller {
    public path = '/dietitian-measurement';
    public router = Router();
    private DietitianMeasurementService = new DietitianMeasurementService();

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
            profileDietitiansMiddleware,
            this.delete
        );
        this.router.get(
            `${this.path}/find`,
            validationMiddleware(validate.find),
            authenticatedUserMiddleware,
            profileDietitiansMiddleware,
            this.find
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
        this.router.post(
            `${this.path}/iot/create`,
            validationMiddleware(validate.IoTCreate),
            //
            authenticatedUserMiddleware,
            profileDietitiansMiddleware,
            //
            this.IoTCreate
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

            const {
                totalCholesterol,
                hdlCholesterol,
                vldlCholesterol,
                ldlCholesterol,
                warnings,
                cholesterolNorms
            } = req.properties;

            const dietitianMeasurement =
                await this.DietitianMeasurementService.create(
                    totalCholesterol,
                    hdlCholesterol,
                    vldlCholesterol,
                    ldlCholesterol,
                    warnings,
                    cholesterolNorms
                );

            res.status(201).json({ data: dietitianMeasurement });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private IoTCreate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {
                appointmentId,
                totalCholesterol,
                hdlCholesterol,
                vldlCholesterol,
                ldlCholesterol,
                warnings,
                cholesterolNorms
            } = req.properties;

            const dietitianAppointment =
                await this.DietitianMeasurementService.IoTCreate(
                    appointmentId,
                    totalCholesterol,
                    hdlCholesterol,
                    vldlCholesterol,
                    ldlCholesterol,
                    warnings,
                    cholesterolNorms
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
                totalCholesterol,
                hdlCholesterol,
                vldlCholesterol,
                ldlCholesterol,
                warnings,
                cholesterolNorms
            } = req.properties;

            const dietitianMeasurement =
                await this.DietitianMeasurementService.update(
                    _id,
                    totalCholesterol,
                    hdlCholesterol,
                    vldlCholesterol,
                    ldlCholesterol,
                    warnings,
                    cholesterolNorms
                );

            res.status(201).json({ data: dietitianMeasurement });
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

            const dietitianMeasurement =
                await this.DietitianMeasurementService.delete(_id);

            res.status(201).json({ data: dietitianMeasurement });
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

            const dietitianMeasurement =
                await this.DietitianMeasurementService.find(searchOptions);

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
                totalCholesterol,
                hdlCholesterol,
                vldlCholesterol,
                ldlCholesterol,
                warnings,
                cholesterolNorms
            } = req.properties;

            const dietitianMeasurement =
                await this.DietitianMeasurementService.create(
                    totalCholesterol,
                    hdlCholesterol,
                    vldlCholesterol,
                    ldlCholesterol,
                    warnings,
                    cholesterolNorms
                );

            res.status(201).json({ data: dietitianMeasurement });
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
                totalCholesterol,
                hdlCholesterol,
                vldlCholesterol,
                ldlCholesterol,
                warnings,
                cholesterolNorms
            } = req.properties;

            const dietitianMeasurement =
                await this.DietitianMeasurementService.update(
                    _id,
                    totalCholesterol,
                    hdlCholesterol,
                    vldlCholesterol,
                    ldlCholesterol,
                    warnings,
                    cholesterolNorms
                );

            res.status(201).json({ data: dietitianMeasurement });
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

            const dietitianMeasurement =
                await this.DietitianMeasurementService.delete(_id);

            res.status(201).json({ data: dietitianMeasurement });
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

            const dietitianMeasurement =
                await this.DietitianMeasurementService.find(searchOptions);

            res.status(201).json({ data: dietitianMeasurement });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default DietitianMeasurementController;

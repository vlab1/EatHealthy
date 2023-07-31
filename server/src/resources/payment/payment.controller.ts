import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import PaymentService from '@/resources/payment/payment.service';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/payment/payment.validation';
import { authenticatedUserMiddleware, authenticatedAdminMiddleware } from '@/middleware/authenticated.middleware';


class PaymentController implements Controller {
    public path = '/payment';
    public router = Router();
    private PaymentService = new PaymentService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.put(
            `${this.path}/buy-attempt`,
            validationMiddleware(validate.buyAttempt),
            authenticatedUserMiddleware,
            this.buyAttempt
        );
        this.router.get(`${this.path}`, authenticatedUserMiddleware, this.get);
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

    private buyAttempt = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const userId = req.user._id;

            const { price, product } = req.properties;

            const url = await this.PaymentService.buyAttempt(
                userId,
                price,
                product
            );
            res.status(200).json({ data: url });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private get = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const userId = req.user._id;

            const payment = await this.PaymentService.get(userId);

            res.status(200).json({ data: payment });
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

            const payment = await this.PaymentService.adminDelete(_id);

            res.status(201).json({ data: payment });
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

            const payment = await this.PaymentService.adminFind(searchOptions);

            res.status(201).json({ data: payment });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default PaymentController;

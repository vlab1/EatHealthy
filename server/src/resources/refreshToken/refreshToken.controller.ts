import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import RefreshTokenService from '@/resources/refreshToken/refreshToken.service';
import {  authenticatedUserOrAdminMiddleware } from '@/middleware/authenticated.middleware';

class RefreshTokenController implements Controller {
    public path = '/refresh-token';
    public router = Router();
    private RefreshTokenService = new RefreshTokenService();

    constructor() {
        this.initialiseRoutes();
    }


    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            authenticatedUserOrAdminMiddleware,
            this.create
        );
        this.router.delete(`${this.path}/delete`, this.delete);
        this.router.get(`${this.path}/refresh`, this.refresh);
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user && !req.admin) {
                return next(new HttpException(401, 'Unauthorised'));
            }

            const accountModel = req.user
                ? req.user.constructor.modelName
                : req.admin.constructor.modelName;
            const accountId = req.user ? req.user._id : req.admin._id;

            const refreshToken = await this.RefreshTokenService.create(
                accountId,
                accountModel
            );

            res.cookie('refreshToken', refreshToken, {
                maxAge: eval(
                    `${process.env.JWT_REFRESH_SECRET_LIFETIME_COOKIE}`
                ),
                httpOnly: true,
            });

            res.status(201).json({ data: !!refreshToken });
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
            const { refreshToken } = req.cookies;

            const deletedResult = await this.RefreshTokenService.delete(
                refreshToken
            );

            res.clearCookie('refreshToken');

            res.status(201).json({ data: deletedResult });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private refresh = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { refreshToken } = req.cookies;

            const accessToken = await this.RefreshTokenService.refresh(
                refreshToken
            );

            res.status(201).json({ data: accessToken });
        } catch (error: any) {
            next(new HttpException(401, error.message));
        }
    };
}

export default RefreshTokenController;

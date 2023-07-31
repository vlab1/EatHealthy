import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import MailerService from '@/resources/mailer/mailer.service';
import { authenticatedUserMiddleware } from '@/middleware/authenticated.middleware';

class MailerController implements Controller {
    public path = '/mailer';
    public router = Router();
    private MailerService = new MailerService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/send-activation-mail`,
            authenticatedUserMiddleware,
            this.sendActivationMail
        );
    }

    private sendActivationMail = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const { email, emailActivationLink } = req.user;

            const sendMail = await this.MailerService.sendActivationMail(
                email,
                emailActivationLink
            );

            res.status(201).json({ data: !!sendMail });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default MailerController;

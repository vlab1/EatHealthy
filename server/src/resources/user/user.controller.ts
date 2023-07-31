import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import { profileDietitiansMiddleware } from '@/middleware/profile.middleware';
import { authenticatedUserMiddleware, authenticatedAdminMiddleware } from '@/middleware/authenticated.middleware';
import { FindUsers } from './user.interface';
import MailerService from '@/resources/mailer/mailer.service';

class UserController implements Controller {
    public path = '/user';
    public router = Router();
    private UserService = new UserService();
    private MailerService = new MailerService();


    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );
        this.router.post(
            `${this.path}/patient/register`,
            validationMiddleware(validate.register),
            this.patientRegister
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );
        this.router.post(
            `${this.path}/google/login`,
            validationMiddleware(validate.googleLogin),
            this.googleLogin
        );
        this.router.put(
            `${this.path}/update`,
            validationMiddleware(validate.update),
            authenticatedUserMiddleware,
            this.update
        );
        this.router.put(
            `${this.path}/update/password`,
            validationMiddleware(validate.updatePassword),
            authenticatedUserMiddleware,
            this.updatePassword
        );
        this.router.put(
            `${this.path}/update/profile-model`,
            validationMiddleware(validate.updateProfileModel),
            authenticatedUserMiddleware,
            this.updateProfileModel
        );
        this.router.put(
            `${this.path}/update/patient/profile-model`,
            authenticatedUserMiddleware,
            this.updatePatientProfileModel
        );
        this.router.delete(
            `${this.path}/delete`,
            authenticatedUserMiddleware,
            this.delete
        );
        this.router.get(
            `${this.path}`,
            authenticatedUserMiddleware,
            this.getMe
        );
        this.router.get(
            `${this.path}/user-profile`,
            validationMiddleware(validate.getUserProfile),
            authenticatedUserMiddleware,
            this.getUserProfile
        );
        this.router.get(
            `${this.path}/email/activate`,
            validationMiddleware(validate.emailActivate),
            this.emailActivate
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
        this.router.get(
            `${this.path}/dietitian/find`,
            validationMiddleware(validate.dietitianFind),
            authenticatedUserMiddleware,
            profileDietitiansMiddleware,
            this.dietitianFind
        );
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.properties;

            const accessToken = await this.UserService.register(
                email,
                password
            );

            res.status(201).json({ data: accessToken });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private patientRegister = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.properties;

            const accessToken = await this.UserService.register(
                email,
                password
            );

            const find = await this.UserService.adminFind({email}) as FindUsers;
            const userId = find.data[0]._id;

            await this.UserService.updatePatientProfileModel(
                userId
            );
            //
             await this.MailerService.sendActivationMail(
                email,
                find.data[0].emailActivationLink
            );
            //      
            res.status(201).json({ data: accessToken });
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

            const accessToken = await this.UserService.login(email, password);

            res.status(200).json({ data: accessToken });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private googleLogin = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, passwordGoogle } = req.properties;

            const accessToken = await this.UserService.googleLogin(
                email,
                passwordGoogle
            );

            res.status(200).json({ data: accessToken });
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
                email,
                password,
                emailActivationLink,
                emailIsActivated,
                profileModel,
                profileId,
                passwordGoogle,
            } = req.properties;

            const userId = req.user._id;

            const user = await this.UserService.update(
                userId,
                email,
                password,
                emailActivationLink,
                emailIsActivated,
                profileModel,
                profileId,
                passwordGoogle
            );

            res.status(200).json({ data: user });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private updatePatientProfileModel = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }

            const userId = req.user._id;

            const user = await this.UserService.updatePatientProfileModel(
                userId
            );

            res.status(200).json({ data: user });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private updatePassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const { new_password, password } = req.properties;
            const userId = req.user._id;
            const user = await this.UserService.updatePassword(
                userId,
                new_password,
                password
            );

            res.status(200).json({ data: user });
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
            const userId = req.user._id;
            const user = await this.UserService.delete(userId);

            res.status(200).json({ data: user });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getMe = (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        if (!req.user) {
            return next(new HttpException(401, 'Unauthorised'));
        }
        res.status(200).send({ data: req.user });
    };

    private getUserProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }

            const userProfile = await this.UserService.getUserProfile(
                req.user._id
            );

            res.status(200).json({ data: userProfile });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private emailActivate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { emailActivationLink } = req.properties;

            await this.UserService.emailActivate(emailActivationLink);

            res.status(201).redirect(process.env.CLIENT_URL as string);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private updateProfileModel = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const userId = req.user._id;
            const { product, key } = req.properties;

            const user = await this.UserService.updateProfileModel(
                userId,
                product,
                key
            );

            res.status(200).json({ data: user });
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
            const { email, password, profileModel } = req.properties;

            const user = await this.UserService.adminCreate(
                email,
                password,
                profileModel
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
            const { _id, emailIsActivated, profileId, profileModel } =
                req.properties;

            const user = await this.UserService.adminUpdate(
                _id,
                emailIsActivated,
                profileId,
                profileModel
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

            const user = await this.UserService.adminDelete(_id);

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

            const user = await this.UserService.adminFind(searchOptions);

            res.status(201).json({ data: user });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private dietitianFind = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const searchOptions = req.properties as {
                [key: string]: any;
            };

            const user = await this.UserService.dietitianFind(searchOptions);

            res.status(201).json({ data: user });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default UserController;

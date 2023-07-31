import { ObjectId, Schema } from 'mongoose';
import UserModel from '@/resources/user/user.model';
import token from '@/utils/token';
import User from '@/resources/user/user.interface';
import Payment from '@/resources/payment/payment.interface';
import EatingPlace from '@/resources/eatingPlace/eatingPlace.interface';
import Dietitian from '@/resources/dietitian/dietitian.interface';
import Patient from '@/resources/patient/patient.interface';
import PaymentService from '@/resources/payment/payment.service';
import PatientService from '@/resources/patient/patient.service';
import DietitianService from '@/resources/dietitian/dietitian.service';
import EatingPlaceService from '@/resources/eatingPlace/eatingPlace.service';
import { generateRandomString } from '@/utils/functions/functions';
import { FindUsers } from '@/resources/user/user.interface';

class UserService {
    private user = UserModel;
    private PaymentService = new PaymentService();
    private PatientService = new PatientService();
    private DietitianService = new DietitianService();
    private EatingPlaceService = new EatingPlaceService();

    public async register(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const userExists = await this.user.findOne({ email });

            if (userExists) {
                throw new Error('User already exists');
            }

            const emailActivationLink: string = generateRandomString(50);

            const user = await this.user.create({
                email,
                password,
                emailActivationLink,
            });

            const accessToken = token.createAccessToken(user._id);

            return accessToken;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async login(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email });

            if (!user) {
                throw new Error('Unable to find user with that data');
            }

            if (await user.isValidPassword(password)) {
                const accessToken = token.createAccessToken(user._id);

                return accessToken;
            } else {
                throw new Error('Wrong credentials given');
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async googleLogin(
        email: string,
        passwordGoogle: string
    ): Promise<string | Error> {
        try {
            let user = await this.user.findOne({ email });

            if (!user) {
                user = await this.user.create({
                    email,
                    passwordGoogle,
                    emailIsActivated: true,
                });
            }

            if (await user.isValidPasswordGoogle(passwordGoogle)) {
                const accessToken = token.createAccessToken(user._id);

                return accessToken;
            } else {
                await this.user.findOneAndUpdate(
                    { _id: user._id },
                    { passwordGoogle }
                );

                const accessToken = token.createAccessToken(user._id);

                return accessToken;
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async update(
        _id: Schema.Types.ObjectId,
        email: string,
        password: string,
        emailActivationLink: string,
        emailIsActivated: boolean,
        profileModel: string,
        profileId: ObjectId,
        passwordGoogle: string
    ): Promise<User | Error> {
        try {
            const user = await this.user
                .findByIdAndUpdate(
                    _id,
                    {
                        email,
                        password,
                        emailActivationLink,
                        emailIsActivated,
                        profileModel,
                        profileId,
                        passwordGoogle,
                    },
                    { new: true }
                )
                .select(['-password', '-passwordGoogle'])
                .exec();

            if (!user) {
                throw new Error('Unable to update user with that data');
            }

            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async updatePatientProfileModel(
        _id: Schema.Types.ObjectId
    ): Promise<User | Error> {
        try {
            const dietitian = (await this.PatientService.create()) as Patient;
            const profileId = dietitian._id;
            const profileModel = 'Patients';

            const user = await this.user.findByIdAndUpdate(
                _id,
                {
                    profileModel: profileModel,
                    profileId: profileId,
                },
                { new: true }
            );

            if (!user) {
                throw new Error('Unable to set profile');
            }
            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getUserProfile(
        _id: Schema.Types.ObjectId
    ): Promise<Dietitian | EatingPlace | Patient | Error> {
        try {
            const user = await this.user
                .findById(_id)
                .populate({
                    path: 'profileId',
                    populate: { path: '_id' },
                })
                .exec();

            if (!user) {
                throw new Error('Unable to find user with that data');
            }

            if (user.profileId instanceof Schema.Types.ObjectId) {
                throw new Error('No profile');
            }

            return user.profileId;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async updatePassword(
        _id: Schema.Types.ObjectId,
        new_password: string,
        password: string
    ): Promise<User | Error> {
        try {
            const tempUser = await this.user.findOne({ _id });

            if (!tempUser) {
                throw new Error('Unable to find user with that data');
            }

            if (await tempUser.isValidPassword(password)) {
                const user = await this.user
                    .findOneAndUpdate(
                        { _id },
                        { password: new_password },
                        { new: true }
                    )
                    .select(['-password', '-passwordGoogle'])
                    .exec();

                if (!user) {
                    throw new Error('Unable to update user with that data');
                }

                return user;
            } else {
                throw new Error('Wrong credentials given');
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async delete(_id: Schema.Types.ObjectId): Promise<User | Error> {
        try {
            const user = await this.user
                .findByIdAndDelete(_id)
                .select(['-password', '-passwordGoogle'])
                .exec();

            if (!user) {
                throw new Error('Unable to delete user with that data');
            }

            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async emailActivate(
        emailActivationLink: string
    ): Promise<void | Error> {
        try {
            const user = await this.user.findOne({ emailActivationLink });

            if (!user) {
                throw new Error('Incorrect link');
            }

            user.emailIsActivated = true;

            await user.save();
        } catch (error: any) {
            throw new Error('Unable to activate user account');
        }
    }

    public async deleteInactiveUsers(): Promise<void | Error> {
        try {
            const thirtyMinutesAgo = new Date(
                Date.now() - eval(`${process.env.NOT_ACTIVATED_USER_LIFETIME}`)
            );
            const inactiveUsers = await this.user.find({
                emailIsActivated: false,
                createdAt: { $lt: thirtyMinutesAgo },
                profileModel: undefined,
            });
            Promise.all(
                inactiveUsers.map(async (inactiveUser) => {
                    await this.user.findByIdAndDelete(inactiveUser._id);
                })
            );
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async updateProfileModel(
        userId: ObjectId,
        product: string,
        key: string
    ): Promise<User | Error> {
        try {
            const userPayment = (await this.PaymentService.get(
                userId
            )) as Payment;

            if (!userPayment) {
                throw new Error('Unable to find this user payment');
            }

            const payments = userPayment.payments;
            const paymentsAttempts = userPayment.paymentsAttempts;

            if (
                payments.filter((item) => item.key === key).length > 0 ||
                !(
                    paymentsAttempts.filter((item) => item.key === key).length >
                    0
                )
            ) {
                throw new Error('Unable to buy profile');
            } else {
                await this.PaymentService.pushPayment(userId, key, product);
            }

            const userExistsProfile = await this.user.findById(userId);
            if (
                !userExistsProfile ||
                userExistsProfile.profileId ||
                userExistsProfile.profileModel
            ) {
                throw new Error('Profile exists');
            }

            let profileId = undefined;
            let profileModel = undefined;
            if (product === 'EatingPlaces') {
                const eatingPlace =
                    (await this.EatingPlaceService.create()) as EatingPlace;
                profileId = eatingPlace._id;
                profileModel = 'EatingPlaces';
            }

            if (product === 'Dietitians') {
                const dietitian =
                    (await this.DietitianService.create()) as Dietitian;
                profileId = dietitian._id;
                profileModel = 'Dietitians';
            }

            const user = await this.user.findByIdAndUpdate(
                userId,
                {
                    profileModel: profileModel,
                    profileId: profileId,
                    emailIsActivated: true,
                },
                { new: true }
            );

            if (!user) {
                throw new Error('Unable to buy profile');
            }
            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminCreate(
        email: string,
        password: string,
        profileModel: string
    ): Promise<User | Error> {
        try {
        
            const userExists = await this.user.findOne({ email });

            if (userExists) {
                throw new Error('User already exists');
            }

            let newProfileId = undefined;
            let newProfileModel = undefined;
            if (profileModel === 'EatingPlaces') {
                const eatingPlace =
                    (await this.EatingPlaceService.create()) as EatingPlace;
                newProfileId = eatingPlace._id;
                newProfileModel = 'EatingPlaces';
            }

            if (profileModel === 'Dietitians') {
                const dietitian =
                    (await this.DietitianService.create()) as Dietitian;
                newProfileId = dietitian._id;
                newProfileModel = 'Dietitians';
            }

            if (profileModel === 'Patients') {
                const patient = (await this.PatientService.create()) as Patient;
                newProfileId = patient._id;
                newProfileModel = 'Patients';
            }

            const emailActivationLink: string = generateRandomString(50);

            const user = await this.user.create({
                email,
                password,
                emailActivationLink,
                profileId: newProfileId,
                profileModel: newProfileModel,
                emailIsActivated: true,
            });

            if (!user) {
                throw new Error('Failed to create user');
            }

            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async dietitianFind(searchOptions: {
        [key: string]: any;
    }): Promise<Array<User> | Error> {
        try {
            if (searchOptions.email) {
                searchOptions.email = {
                    $regex: new RegExp(searchOptions.email),
                    $options: 'i',
                };
            }
            searchOptions.profileModel = 'Patients';
            //
            searchOptions.emailIsActivated = true;
            //
            const user = await this.user
                .find(searchOptions, null, {
                    sort: { createdAt: -1 },
                })
                .populate({
                    path: 'profileId',
                    populate: { path: '_id' },
                });

            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminUpdate(
        _id: Schema.Types.ObjectId,
        emailIsActivated: boolean,
        profileId: Schema.Types.ObjectId,
        profileModel: string
    ): Promise<User | Error> { 
        try {
            // if ((profileId && !profileModel) || (!profileId && profileModel)) {
            //     throw new Error('Failed to update user');
            // }

            // let profileIsExists = !profileId && !profileModel ? true : false;

            // if (!profileIsExists) {
            //     if (profileModel === 'EatingPlaces') {
            //         profileIsExists =
            //             (await this.EatingPlaceService.adminProfileIsExists(
            //                 _id
            //             )) as boolean;
            //     }

            //     if (profileModel === 'Dietitians') {
            //         profileIsExists =
            //             (await this.DietitianService.adminProfileIsExists(
            //                 _id
            //             )) as boolean;
            //     }

            //     if (profileModel === 'Patients') {
            //         profileIsExists =
            //             (await this.PatientService.adminProfileIsExists(
            //                 _id
            //             )) as boolean;
            //     }
            // }
            // if (!profileIsExists) {
            //     throw new Error('Failed to update user');
            // }

            const user = await this.user.findByIdAndUpdate(_id, {
                emailIsActivated,
                profileId,
                profileModel,
            });

            if (!user) {
                throw new Error('Failed to update user');
            }

            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminDelete(
        _id: Schema.Types.ObjectId
    ): Promise<User | Error> {
        try {
            const user = await this.user.findByIdAndDelete(_id);

            if (!user) {
                throw new Error('Failed to delete user');
            }

            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminFind(searchOptions: {
        [key: string]: any;
    }): Promise<FindUsers | Error> {
        try {
            if (searchOptions.email) {
                searchOptions.email = {
                    $regex: new RegExp(searchOptions.email),
                    $options: 'i',
                };
            }
            const total = await this.user.countDocuments(searchOptions);

            const user = await this.user
                .find(searchOptions, null)
                .sort({ createdAt: -1 })
                .skip((searchOptions.page - 1) * searchOptions.perPage)
                .limit(searchOptions.perPage);

            return { data: user, total };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

 
}

export default UserService;

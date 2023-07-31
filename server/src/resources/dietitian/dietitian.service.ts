import Dietitian from '@/resources/dietitian/dietitian.interface';
import DietitianModel from '@/resources/dietitian/dietitian.model';
import { Schema } from 'mongoose';
import UserModel from '@/resources/user/user.model';
import { FindDietitians } from '@/resources/dietitian/dietitian.interface';

class DietitianService {
    private dietitian = DietitianModel;
    private user = UserModel;

    public async create(): Promise<Dietitian | Error> {
        try {
            const dietitian = await this.dietitian.create({});
            if (!dietitian) {
                throw new Error('Unable to create dietitian profile');
            }
            return dietitian;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async update(
        _id: Schema.Types.ObjectId,
        firstName: string,
        lastName: string,
        patronymic: string,
        sex: string,
        phone: string,
        birthDate: Date
    ): Promise<Dietitian | Error> {
        try {
            const dietitian = await this.dietitian.findByIdAndUpdate(
                _id,
                {
                    firstName,
                    lastName,
                    patronymic,
                    sex,
                    phone,
                    birthDate,
                },
                { new: true }
            );

            if (!dietitian) {
                throw new Error('Unable to update dietitian with that data');
            }

            return dietitian;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminDelete(
        _id: Schema.Types.ObjectId
    ): Promise<Dietitian | Error> {
        try {
            const user = await this.user.findOneAndDelete({profileId: _id});
            if (!user) {
                throw new Error('Unable to delete patient profile');
            }
            const dietitian = user?.profileId as Dietitian;
            return dietitian;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminProfileIsExists(
        _id: Schema.Types.ObjectId
    ): Promise<boolean | Error> {
        try {
            const dietitian = await this.dietitian.findById(_id);
            if (!dietitian) {
                return false;
            }
            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminCreate(
        firstName: string,
        lastName: string,
        patronymic: string,
        sex: string,
        phone: string,
        birthDate: Date
    ): Promise<Dietitian | Error> {
        try {
            const dietitian = await this.dietitian.create({
                firstName,
                lastName,
                patronymic,
                sex,
                phone,
                birthDate,
            });

            if (!dietitian) {
                throw new Error('Failed to create dietitian');
            }

            return dietitian;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminUpdate(
        _id: Schema.Types.ObjectId,
        firstName: string,
        lastName: string,
        patronymic: string,
        sex: string,
        phone: string,
        birthDate: Date
    ): Promise<Dietitian | Error> {
        try {
            const dietitian = await this.dietitian.findByIdAndUpdate(_id, {
                firstName,
                lastName,
                patronymic,
                sex,
                phone,
                birthDate,
            });

            if (!dietitian) {
                throw new Error('Failed to update dietitian');
            }

            return dietitian;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminFind(searchOptions: {
        [key: string]: any;
    }): Promise<FindDietitians | Error> {
        try {
            const userSearchOptions = { profileModel: 'Dietitians' } as {
                [key: string]: any;
            };

            if (searchOptions.email) {
                userSearchOptions.email = {
                    $regex: new RegExp(searchOptions.email),
                    $options: 'i',
                };
            }

            if (searchOptions.userId) {
                userSearchOptions._id = searchOptions.userId;
            }

            const users = await this.user
                .find(userSearchOptions, null)
                .populate({
                    path: 'profileId',
                    match: searchOptions,
                })
                .exec();

            const dietitians = users
                .map((item) => item.profileId)
                .filter((item) => item) as Array<Dietitian>;

            const total = await this.dietitian.countDocuments(searchOptions);

            return { data: dietitians, total };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default DietitianService;

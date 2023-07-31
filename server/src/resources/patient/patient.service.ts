import Patient from '@/resources/patient/patient.interface';
import PatientModel from '@/resources/patient/patient.model';
import { Schema } from 'mongoose';
import { FindPatients } from '@/resources/patient/patient.interface';
import UserModel from '@/resources/user/user.model';

class PatientService {
    private patient = PatientModel;
    private user = UserModel;

    public async create(): Promise<Patient | Error> {
        try {
            const patient = await this.patient.create({});
            if (!patient) {
                throw new Error('Unable to create patient profile');
            }
            return patient;
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
    ): Promise<Patient | Error> {
        try {
            const patient = await this.patient.findByIdAndUpdate(
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

            if (!patient) {
                throw new Error('Unable to update patient with that data');
            }

            return patient;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminDelete(
        _id: Schema.Types.ObjectId
    ): Promise<Patient | Error> {
        try {
            const user = await this.user.findOneAndDelete({profileId: _id});
            if (!user) {
                throw new Error('Unable to delete patient profile');
            }
            const patient = user?.profileId as Patient;
            return patient;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminProfileIsExists(
        _id: Schema.Types.ObjectId
    ): Promise<boolean | Error> {
        try {
            const patient = await this.patient.findById(_id);
            if (!patient) {
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
    ): Promise<Patient | Error> {
        try {
            const patient = await this.patient.create({
                firstName,
                lastName,
                patronymic,
                sex,
                phone,
                birthDate,
            });

            if (!patient) {
                throw new Error('Failed to create patient');
            }

            return patient;
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
    ): Promise<Patient | Error> {
        try {
            const patient = await this.patient.findByIdAndUpdate(_id, {
                firstName,
                lastName,
                patronymic,
                sex,
                phone,
                birthDate,
            });

            if (!patient) {
                throw new Error('Failed to update patient');
            }

            return patient;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminFind(searchOptions: {
        [key: string]: any;
    }): Promise<FindPatients | Error> {
        try {
            const userSearchOptions = { profileModel: 'Patients' } as {
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

            const patients = users
                .map((item) => item.profileId)
                .filter((item) => item) as Array<Patient>;

            const total = await this.patient.countDocuments(searchOptions);

            return { data: patients, total };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default PatientService;

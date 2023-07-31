import DietitianAppointment from '@/resources/dietitianAppointment/dietitianAppointment.interface';
import DietitianAppointmentModel from '@/resources/dietitianAppointment/dietitianAppointment.model';
import { Schema } from 'mongoose';
import {
    AllowedDish,
    StatisticsDietitianAppointment,
} from '@/resources/dietitianAppointment/dietitianAppointment.interface';
class DietitianAppointmentService {
    private dietitianAppointment = DietitianAppointmentModel;

    public async create(
        patientId: Schema.Types.ObjectId,
        dietitianId: Schema.Types.ObjectId
    ): Promise<DietitianAppointment | Error> {
        try {
            const dietitianAppointment = await this.dietitianAppointment.create(
                {
                    patientId,
                    dietitianId,
                }
            );

            if (!dietitianAppointment) {
                throw new Error(
                    'Unable to create dietitian appointment profile'
                );
            }

            return dietitianAppointment;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async update(
        _id: Schema.Types.ObjectId,
        patientId: Schema.Types.ObjectId,
        dietitianId: Schema.Types.ObjectId,
        measurementId: Schema.Types.ObjectId,
        allowedDishes: Array<AllowedDish>,
        recommendations: string,
        userDietitianId: Schema.Types.ObjectId
    ): Promise<DietitianAppointment | Error> {
        try {
            const dietitianAppointmentExists =
                await this.dietitianAppointment.findById(_id);

            if (!dietitianAppointmentExists) {
                throw new Error('Unable to find dietitian appointment');
            }

            if (
                dietitianAppointmentExists.dietitianId.toString() !==
                userDietitianId.toString()
            ) {
                throw new Error('No access');
            }

            const dietitianAppointment = await this.dietitianAppointment
                .findByIdAndUpdate(
                    _id,
                    {
                        patientId,
                        dietitianId,
                        measurementId,
                        allowedDishes,
                        recommendations,
                    },
                    { new: true }
                )
                .populate({
                    path: 'patientId',
                    populate: {
                        path: 'profileId',
                        select: 'firstName lastName phone patronymic birthDate sex',
                    },

                    select: 'profileId profileModel email',
                })
                .populate({
                    path: 'dietitianId',
                    populate: {
                        path: 'profileId',
                        select: 'firstName lastName',
                    },
                    select: 'profileId profileModel ',
                })
                .populate({
                    path: 'measurementId',
                })
                .populate({
                    path: 'allowedDishes._id',
                    populate: {
                        path: 'userId',
                        populate: {
                            path: 'profileId',
                            select: 'name country region city adress postcode images description',
                        },
                        select: 'profileId profileModel ',
                    },
                    select: 'images userId name ingredients description price',
                })
                .exec();

            if (!dietitianAppointment) {
                throw new Error(
                    'Unable to update dietitian appointment with that data'
                );
            }

            return dietitianAppointment;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async find(searchOptions: {
        [key: string]: any;
    }): Promise<Array<DietitianAppointment> | Error> {
        try {
            const userSearchOptions = {} as {
                [key: string]: any;
            };
            if (searchOptions.patientEmail) {
                userSearchOptions.email = {
                    $regex: new RegExp(searchOptions.patientEmail),
                    $options: 'i',
                };
            }

            const dietitianAppointment = await this.dietitianAppointment
                .find(searchOptions, null, {
                    sort: { createdAt: -1 },
                })
                .populate({
                    path: 'patientId',
                    populate: {
                        path: 'profileId',
                        select: 'firstName lastName phone patronymic birthDate sex',
                    },
                    match: userSearchOptions,
                    select: 'profileId profileModel email',
                })
                .populate({
                    path: 'dietitianId',
                    populate: {
                        path: 'profileId',
                    },
                    select: 'profileId profileModel email',
                })
                .populate({
                    path: 'measurementId',
                    //options: { sort: { createdAt: -1 } },
                })
                .populate({
                    path: 'allowedDishes._id',
                    populate: {
                        path: 'userId',
                        populate: {
                            path: 'profileId',
                            select: 'name country region city address postcode images description',
                        },
                        select: 'profileId profileModel ',
                    },
                    select: 'images userId name ingredients description price',
                })
                .exec();

            const result = dietitianAppointment.filter(
                (appointment) =>
                    appointment.patientId &&
                    !(appointment.patientId instanceof Schema.Types.ObjectId) &&
                    appointment.patientId.email
            );

            return result;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async delete(
        _id: Schema.Types.ObjectId,
        userDietitianId: Schema.Types.ObjectId
    ): Promise<DietitianAppointment | Error> {
        try {
            const dietitianAppointmentExists =
                await this.dietitianAppointment.findById(_id);

            if (!dietitianAppointmentExists) {
                throw new Error('Unable to find dietitian appointment');
            }

            if (
                dietitianAppointmentExists.dietitianId.toString() !==
                userDietitianId.toString()
            ) {
                throw new Error('No access');
            }

            const dietitianAppointment =
                await this.dietitianAppointment.findByIdAndDelete(_id);

            if (!dietitianAppointment) {
                throw new Error(
                    'Unable to update dietitian appointment with that data'
                );
            }

            return dietitianAppointment;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async measurementStatistics(searchOptions: {
        [key: string]: any;
    }): Promise<StatisticsDietitianAppointment | Error> {
        try {
            const dietitianAppointments = await this.dietitianAppointment
                .find(searchOptions, 'measurementId', {
                    sort: { createdAt: -1 },
                })
                .populate({
                    path: 'measurementId',
                    select: '-updatedAt -__v -warnings',
                })
                .exec();

            const validAppointments = dietitianAppointments.filter(
                (appointment) => appointment.measurementId
            );

            if (validAppointments.length === 0) {
                return new Error('No valid dietitian appointments found.');
            }

            const totalTotalCholesterol = validAppointments.reduce(
                (sum, item: any) => sum + item.measurementId.totalCholesterol,
                0
            );
            const totalHDLCholesterol = validAppointments.reduce(
                (sum, item: any) => sum + item.measurementId.hdlCholesterol,
                0
            );
            const totalVLDLCholesterol = validAppointments.reduce(
                (sum, item: any) => sum + item.measurementId.vldlCholesterol,
                0
            );
            const totalLDLCholesterol = validAppointments.reduce(
                (sum, item: any) => sum + item.measurementId.ldlCholesterol,
                0
            );

            const averageTotalCholesterol = Number(
                (totalTotalCholesterol / validAppointments.length).toFixed(2)
            );
            const averageHDLCholesterol = Number(
                (totalHDLCholesterol / validAppointments.length).toFixed(2)
            );
            const averageVLDLCholesterol = Number(
                (totalVLDLCholesterol / validAppointments.length).toFixed(2)
            );
            const averageLDLCholesterol = Number(
                (totalLDLCholesterol / validAppointments.length).toFixed(2)
            );

            const statisticsDietitianAppointment: StatisticsDietitianAppointment =
                {
                    dietitianAppointment: validAppointments,
                    averageTotalCholesterol,
                    averageHDLCholesterol,
                    averageVLDLCholesterol,
                    averageLDLCholesterol,
                };

            return statisticsDietitianAppointment;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminCreate(
        patientId: Schema.Types.ObjectId,
        dietitianId: Schema.Types.ObjectId,
        measurementId: Schema.Types.ObjectId,
        allowedDishes: Array<AllowedDish>,
        recommendations: string
    ): Promise<DietitianAppointment | Error> {
        try {
            const dietitianAppointment = await this.dietitianAppointment.create(
                {
                    patientId,
                    dietitianId,
                    measurementId,
                    allowedDishes,
                    recommendations,
                }
            );

            if (!dietitianAppointment) {
                throw new Error(
                    'Unable to create dietitian appointment profile'
                );
            }

            return dietitianAppointment;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminUpdate(
        _id: Schema.Types.ObjectId,
        patientId: Schema.Types.ObjectId,
        dietitianId: Schema.Types.ObjectId,
        measurementId: Schema.Types.ObjectId,
        allowedDishes: Array<AllowedDish>,
        recommendations: string
    ): Promise<DietitianAppointment | Error> {
        try {
            const dietitianAppointmentExists =
                await this.dietitianAppointment.findById(_id);

            if (!dietitianAppointmentExists) {
                throw new Error('Unable to find dietitian appointment');
            }

            const dietitianAppointment =
                await this.dietitianAppointment.findByIdAndUpdate(
                    _id,
                    {
                        patientId,
                        dietitianId,
                        measurementId,
                        allowedDishes,
                        recommendations,
                    },
                    { new: true }
                );

            if (!dietitianAppointment) {
                throw new Error(
                    'Unable to update dietitian appointment with that data'
                );
            }

            return dietitianAppointment;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async adminDelete(
        _id: Schema.Types.ObjectId
    ): Promise<DietitianAppointment | Error> {
        try {
            const dietitianAppointment =
                await this.dietitianAppointment.findByIdAndDelete(_id);

            if (!dietitianAppointment) {
                throw new Error(
                    'Unable to delete dietitian appointment with that data'
                );
            }

            return dietitianAppointment;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default DietitianAppointmentService;

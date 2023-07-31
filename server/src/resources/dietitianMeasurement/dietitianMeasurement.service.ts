import DietitianMeasurement from '@/resources/dietitianMeasurement/dietitianMeasurement.interface';
import DietitianMeasurementModel from '@/resources/dietitianMeasurement/dietitianMeasurement.model';
import { Schema } from 'mongoose';
import { Warning, CholesterolNorms } from '@/resources/dietitianMeasurement/dietitianMeasurement.interface';
import DietitianAppointmentModel from '@/resources/dietitianAppointment/dietitianAppointment.model';
import DietitianAppointment from '@/resources/dietitianAppointment/dietitianAppointment.interface';
class DietitianMeasurementService {
    private dietitianMeasurement = DietitianMeasurementModel;
    private dietitianAppointmentModel = DietitianAppointmentModel;

    public async create(
        totalCholesterol: number,
        hdlCholesterol: number,
        vldlCholesterol: number,
        ldlCholesterol: number,
        warnings: Array<Warning>,
        cholesterolNorms: CholesterolNorms
    ): Promise<DietitianMeasurement | Error> {
        try {
            const dietitianMeasurement = await this.dietitianMeasurement.create(
                {
                    totalCholesterol,
                    hdlCholesterol,
                    vldlCholesterol,
                    ldlCholesterol,
                    warnings,
                    cholesterolNorms
                }
            );

            if (!dietitianMeasurement) {
                throw new Error(
                    'Unable to create dietitian measurement profile'
                );
            }

            return dietitianMeasurement;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async IoTCreate(
        appointmentId: Schema.Types.ObjectId,
        totalCholesterol: number,
        hdlCholesterol: number,
        vldlCholesterol: number,
        ldlCholesterol: number,
        warnings: Array<Warning>,
        cholesterolNorms: CholesterolNorms
    ): Promise<DietitianAppointment | Error> {
        try {
            const dietitianAppointmentExists =
                await this.dietitianAppointmentModel.findById(appointmentId);

            if (!dietitianAppointmentExists) {
                throw new Error(
                    'Unable to create dietitian measurement '
                );
            }

            if (dietitianAppointmentExists.measurementId) {
                await this.dietitianMeasurement.deleteOne({
                    _id: dietitianAppointmentExists.measurementId,
                });
            }

            const dietitianMeasurement = await this.dietitianMeasurement.create(
                {
                    totalCholesterol,
                    hdlCholesterol,
                    vldlCholesterol,
                    ldlCholesterol,
                    warnings,
                    cholesterolNorms
                }
            );

            if (!dietitianMeasurement) {
                throw new Error(
                    'Unable to create dietitian measurement '
                );
            }

            const dietitianAppointment = await this.dietitianAppointmentModel
                .findByIdAndUpdate(
                    appointmentId,
                    { measurementId: dietitianMeasurement._id },
                    { new: true }
                )
                .populate({
                    path: 'measurementId',
                })
                .exec();

            if (!dietitianAppointment) {
                throw new Error(
                    'Unable to create dietitian measurement '
                );
            }

            return dietitianAppointment;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async update(
        _id: Schema.Types.ObjectId,
        totalCholesterol: number,
        hdlCholesterol: number,
        vldlCholesterol: number,
        ldlCholesterol: number,
        warnings: Array<Warning>,
        cholesterolNorms: CholesterolNorms
    ): Promise<DietitianMeasurement | Error> {
        try {
            const dietitianMeasurement =
                await this.dietitianMeasurement.findByIdAndUpdate(
                    _id,
                    {
                        totalCholesterol,
                        hdlCholesterol,
                        vldlCholesterol,
                        ldlCholesterol,
                        warnings,
                        cholesterolNorms
                    },
                    { new: true }
                );

            if (!dietitianMeasurement) {
                throw new Error(
                    'Unable to update dietitian measurement with that data'
                );
            }

            return dietitianMeasurement;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async find(searchOptions: {
        [key: string]: any;
    }): Promise<Array<DietitianMeasurement> | Error> {
        try {
            const dietitianMeasurement = await this.dietitianMeasurement.find(
                searchOptions,
                null,
                {
                    sort: { createdAt: -1 },
                }
            );

            return dietitianMeasurement;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async delete(
        _id: Schema.Types.ObjectId
    ): Promise<DietitianMeasurement | Error> {
        try {
            const dietitianMeasurement =
                await this.dietitianMeasurement.findByIdAndDelete(_id);

            if (!dietitianMeasurement) {
                throw new Error(
                    'Unable to update dietitian measurement with that data'
                );
            }

            return dietitianMeasurement;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default DietitianMeasurementService;

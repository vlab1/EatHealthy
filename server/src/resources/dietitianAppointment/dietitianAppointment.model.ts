import { Schema, model } from 'mongoose';
import DietitianAppointment from '@/resources/dietitianAppointment/dietitianAppointment.interface';
import DietitianMeasurementModel from '@/resources/dietitianMeasurement/dietitianMeasurement.model';

const DietitianAppointmentSchema = new Schema(
    {
        recommendations: {
            type: String,
            trim: true,
        },
        patientId: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        dietitianId: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        measurementId: {
            type: Schema.Types.ObjectId,
            ref: 'DietitiansMeasurements',
        },
        allowedDishes: {
            type: [
                {
                    _id: {
                        type: Schema.Types.ObjectId,
                        ref: 'Dishes',
                    },

                },
            ],
            default: []
        },
    },
    {
        timestamps: true,
    }
);

DietitianAppointmentSchema.post('findOneAndDelete', async function (result, next) {
    await DietitianMeasurementModel.deleteMany({ _id: result.measurementId });
    next();
});
export default model<DietitianAppointment>(
    'DietitiansAppointments',
    DietitianAppointmentSchema
);

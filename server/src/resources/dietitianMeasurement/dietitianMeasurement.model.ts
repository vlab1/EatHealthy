import { Schema, model } from 'mongoose';
import DietitianMeasurement from '@/resources/dietitianMeasurement/dietitianMeasurement.interface';

const DietitianMeasurementSchema = new Schema(
    {
        totalCholesterol: {
            type: Number,
        },
        hdlCholesterol: {
            type: Number,
        },
        vldlCholesterol: {
            type: Number,
        },
        ldlCholesterol: {
            type: Number,
        },
        warnings: {
            type: [
                {
                    description: {
                        en: { type: String, trim: true },
                        uk: { type: String, trim: true },
                    },
                },
            ],
            default: [],
        },
        cholesterolNorms: {
            type: {
                totalCholesterolMin: { type: Number },
                totalCholesterolMax: { type: Number },
                hdlCholesterolMin: { type: Number },
                hdlCholesterolMax: { type: Number },
                vldlCholesterolMin: { type: Number },
                vldlCholesterolMax: { type: Number },
                ldlCholesterolMin: { type: Number },
                ldlCholesterolMax: { type: Number },
            },
        },
    },
    {
        timestamps: true,
    }
);

export default model<DietitianMeasurement>(
    'DietitiansMeasurements',
    DietitianMeasurementSchema
);

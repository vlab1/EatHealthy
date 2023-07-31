import { Schema, model } from 'mongoose';
import Dietitian from '@/resources/dietitian/dietitian.interface';

const DietitianSchema = new Schema(
    {
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        patronymic: {
            type: String,
            trim: true,
        },
        sex: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        birthDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default model<Dietitian>('Dietitians', DietitianSchema);

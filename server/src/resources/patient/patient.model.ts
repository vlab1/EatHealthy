import { Schema, model } from 'mongoose';
import Patient from '@/resources/patient/patient.interface';

const PatientSchema = new Schema(
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

export default model<Patient>('Patients', PatientSchema);
